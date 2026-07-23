/**
 * @fileoverview Hunter Sync — recebe leads capturados pela extensão do navegador.
 *
 * Fluxo:
 *  1. Valida JWT do recrutador (usuário autenticado).
 *  2. Rate-limita por usuário (200 leads/min) via RPC check_rate_limit.
 *  3. Valida cada lead (URL do perfil obrigatória → gera hash canônico).
 *  4. Upsert em public.hunter_leads deduplicando por (recrutador_id, profile_hash).
 *  5. Retorna resumo com contadores criados / atualizados / rejeitados.
 */

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { enforceRateLimit } from "../_shared/rateLimit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface IncomingLead {
  profile_url: string;
  full_name: string;
  source?: string;
  headline?: string;
  current_company?: string;
  current_title?: string;
  location?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  raw_data?: Record<string, unknown>;
  vaga_id?: string | null;
  notes?: string;
}

interface SyncPayload {
  leads: IncomingLead[];
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Normaliza URL de perfil (remove querystring, trailing slash, minúsculo). */
function canonicalizeProfileUrl(url: string): string | null {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    const path = u.pathname.replace(/\/+$/, "").toLowerCase();
    return `${host}${path}`;
  } catch {
    return null;
  }
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function isUuid(v: unknown): v is string {
  return typeof v === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // --- AUTH ---------------------------------------------------------------
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const token = authHeader.replace("Bearer ", "");
  const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
  if (claimsErr || !claimsData?.claims?.sub) {
    return json({ error: "Unauthorized" }, 401);
  }
  const userId = claimsData.claims.sub as string;

  // --- RATE LIMIT ---------------------------------------------------------
  const rlByUser = await enforceRateLimit(req, {
    route: "hunter-sync",
    max: 200,
    windowSeconds: 60,
    keyOverride: `user:${userId}`,
  });
  if (rlByUser) return rlByUser;

  // IP-level defense em profundidade (protege contra tokens vazados)
  const ipLimit = await enforceRateLimit(req, { route: "hunter-sync-ip", max: 600 });
  if (ipLimit) return ipLimit;

  // --- PARSE --------------------------------------------------------------
  let payload: SyncPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const leads = Array.isArray(payload?.leads) ? payload.leads : [];
  if (leads.length === 0) return json({ error: "No leads provided" }, 400);
  if (leads.length > 100) return json({ error: "Batch limit is 100 leads" }, 400);

  // --- ADMIN CLIENT p/ upsert respeitando RLS via user_id explícito ------
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const rejected: Array<{ index: number; reason: string }> = [];
  const rows: Array<Record<string, unknown>> = [];
  const seenHashes = new Set<string>();

  for (let i = 0; i < leads.length; i++) {
    const l = leads[i];
    if (!l || typeof l !== "object") {
      rejected.push({ index: i, reason: "invalid_shape" });
      continue;
    }
    const canon = canonicalizeProfileUrl(l.profile_url ?? "");
    if (!canon) {
      rejected.push({ index: i, reason: "invalid_profile_url" });
      continue;
    }
    if (!l.full_name || typeof l.full_name !== "string" || l.full_name.trim().length === 0) {
      rejected.push({ index: i, reason: "missing_full_name" });
      continue;
    }
    const hash = await sha256Hex(canon);
    if (seenHashes.has(hash)) {
      rejected.push({ index: i, reason: "duplicate_in_batch" });
      continue;
    }
    seenHashes.add(hash);

    rows.push({
      recrutador_id: userId,
      source: (l.source ?? "linkedin").toString().slice(0, 40),
      profile_url: l.profile_url.trim().slice(0, 2000),
      profile_hash: hash,
      full_name: l.full_name.trim().slice(0, 200),
      headline: l.headline?.toString().slice(0, 300) ?? null,
      current_company: l.current_company?.toString().slice(0, 200) ?? null,
      current_title: l.current_title?.toString().slice(0, 200) ?? null,
      location: l.location?.toString().slice(0, 200) ?? null,
      email: l.email?.toString().toLowerCase().slice(0, 200) ?? null,
      phone: l.phone?.toString().slice(0, 40) ?? null,
      avatar_url: l.avatar_url?.toString().slice(0, 2000) ?? null,
      raw_data: (l.raw_data && typeof l.raw_data === "object") ? l.raw_data : {},
      vaga_id: isUuid(l.vaga_id) ? l.vaga_id : null,
      notes: l.notes?.toString().slice(0, 2000) ?? null,
      captured_at: new Date().toISOString(),
    });
  }

  if (rows.length === 0) {
    return json({ created: 0, updated: 0, rejected }, 200);
  }

  // Detecta quais já existem para reportar created vs updated
  const hashes = rows.map((r) => r.profile_hash as string);
  const { data: existing, error: existErr } = await admin
    .from("hunter_leads")
    .select("profile_hash")
    .eq("recrutador_id", userId)
    .in("profile_hash", hashes);

  if (existErr) {
    console.error("[hunter-sync] lookup error", existErr);
    return json({ error: "Lookup failed" }, 500);
  }
  const existingSet = new Set((existing ?? []).map((r) => r.profile_hash as string));

  const { data: upserted, error: upsertErr } = await admin
    .from("hunter_leads")
    .upsert(rows, { onConflict: "recrutador_id,profile_hash" })
    .select("id, profile_hash");

  if (upsertErr) {
    console.error("[hunter-sync] upsert error", upsertErr);
    return json({ error: "Upsert failed", details: upsertErr.message }, 500);
  }

  let created = 0;
  let updated = 0;
  for (const row of upserted ?? []) {
    if (existingSet.has(row.profile_hash as string)) updated++;
    else created++;
  }

  return json({
    created,
    updated,
    rejected,
    total_received: leads.length,
  }, 200);
});
