/**
 * @fileoverview Worker que drena a communication_retry_queue.
 * Invocado periodicamente via pg_cron (a cada 5 minutos).
 * Endpoint público autenticado por Bearer com WORKER_SECRET.
 */
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getBreaker, retryWithBackoff } from "../_shared/resilience.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WORKER_SECRET = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "noreply@match-ats.com";
const EVOLUTION_API_URL = (Deno.env.get("EVOLUTION_API_URL") || "").replace(/\/+$/, "");
const EVOLUTION_API_KEY = Deno.env.get("EVOLUTION_API_KEY");

interface QueueRow {
  id: string;
  channel: "email" | "whatsapp";
  recipient: string;
  payload: Record<string, unknown>;
  attempts: number;
}

async function sendEmail(row: QueueRow): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) return { ok: false, error: "RESEND_API_KEY missing" };
  const p = row.payload as { subject: string; html: string; replyTo?: string };
  try {
    const breaker = getBreaker("resend-api");
    const res = await breaker.execute(() =>
      retryWithBackoff(
        () =>
          fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: FROM_EMAIL,
              to: [row.recipient],
              subject: p.subject,
              html: p.html,
              reply_to: p.replyTo,
            }),
          }),
        { retries: 2 },
      ),
    );
    if (!res.ok) return { ok: false, error: `resend ${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

async function sendWhatsApp(row: QueueRow): Promise<{ ok: boolean; error?: string }> {
  if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) return { ok: false, error: "evolution not configured" };
  const p = row.payload as { text: string; instance?: string };
  try {
    const breaker = getBreaker("evolution-api");
    const instance = p.instance || Deno.env.get("EVOLUTION_INSTANCE_NAME") || "default";
    const res = await breaker.execute(() =>
      retryWithBackoff(
        () =>
          fetch(`${EVOLUTION_API_URL}/message/sendText/${instance}`, {
            method: "POST",
            headers: { apikey: EVOLUTION_API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({ number: row.recipient, text: p.text }),
          }),
        { retries: 2 },
      ),
    );
    if (!res.ok) return { ok: false, error: `evolution ${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Autenticação simples via bearer secret compartilhado (chamado por pg_cron/net)
  const auth = req.headers.get("Authorization") ?? "";
  if (!WORKER_SECRET || auth !== `Bearer ${WORKER_SECRET}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const { data: batch, error } = await sb.rpc("claim_communication_retry_batch", { p_limit: 20 });
  if (error) {
    console.error("[process-retry-queue] claim error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const rows: QueueRow[] = (batch ?? []) as QueueRow[];
  let ok = 0;
  let failed = 0;

  for (const row of rows) {
    const result =
      row.channel === "email" ? await sendEmail(row) : await sendWhatsApp(row);
    await sb.rpc("mark_retry_result", {
      p_id: row.id,
      p_success: result.ok,
      p_error: result.error ?? null,
    });
    if (result.ok) ok++;
    else failed++;
  }

  return new Response(
    JSON.stringify({ processed: rows.length, ok, failed }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
