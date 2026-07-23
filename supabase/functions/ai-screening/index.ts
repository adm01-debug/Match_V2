/**
 * @fileoverview AI Screening — triagem automatizada de candidaturas.
 * Gera resumo, pontos fortes, red flags, score 0-100 e recomendação.
 * Persiste em public.triagem_ia; usa cache compartilhado ai_cache.
 */

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { enforceRateLimit } from "../_shared/rateLimit.ts";
import { withCache } from "../_shared/aiCache.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CACHE_VERSION = "gemini-2.5-flash:ai-screening:v1";
const MODEL = "gemini-2.5-flash";

interface ScreeningResult {
  score: number;
  resumo: string;
  pontos_fortes: string[];
  red_flags: string[];
  recomendacao: "aprovar" | "revisar" | "reprovar";
  match_habilidades: {
    presentes: string[];
    ausentes: string[];
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function stripFence(s: string): string {
  let t = s.trim();
  if (t.startsWith("```json")) t = t.slice(7);
  else if (t.startsWith("```")) t = t.slice(3);
  if (t.endsWith("```")) t = t.slice(0, -3);
  return t.trim();
}

function normalizeResult(raw: unknown, habilidadesCand: string[]): ScreeningResult {
  const r = (raw ?? {}) as Record<string, unknown>;
  const score = Math.max(0, Math.min(100, Number(r.score ?? 0) || 0));
  const rec = String(r.recomendacao ?? "revisar").toLowerCase();
  const recomendacao: ScreeningResult["recomendacao"] =
    rec === "aprovar" ? "aprovar" : rec === "reprovar" ? "reprovar" : "revisar";
  const match = (r.match_habilidades ?? {}) as Record<string, unknown>;
  return {
    score,
    resumo: String(r.resumo ?? "").slice(0, 4000),
    pontos_fortes: Array.isArray(r.pontos_fortes)
      ? (r.pontos_fortes as unknown[]).map(String).slice(0, 8)
      : [],
    red_flags: Array.isArray(r.red_flags)
      ? (r.red_flags as unknown[]).map(String).slice(0, 8)
      : [],
    recomendacao,
    match_habilidades: {
      presentes: Array.isArray(match.presentes)
        ? (match.presentes as unknown[]).map(String)
        : habilidadesCand,
      ausentes: Array.isArray(match.ausentes)
        ? (match.ausentes as unknown[]).map(String)
        : [],
    },
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const limited = await enforceRateLimit(req, { route: "ai-screening", max: 30 });
  if (limited) return limited;

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) return json({ error: "LOVABLE_API_KEY missing" }, 500);

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const token = authHeader.replace("Bearer ", "");
  const { data: claims, error: cErr } = await supabase.auth.getClaims(token);
  if (cErr || !claims?.claims?.sub) return json({ error: "Unauthorized" }, 401);
  const userId = claims.claims.sub as string;

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // Autorização: apenas equipe de RH
  const { data: isHr, error: roleErr } = await admin.rpc("is_hr_staff", {
    _user_id: userId,
  });
  if (roleErr || !isHr) return json({ error: "Forbidden" }, 403);

  let body: { candidaturaId?: string; force?: boolean };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const candidaturaId = body.candidaturaId;
  if (!candidaturaId) return json({ error: "candidaturaId required" }, 400);

  // Busca candidatura + vaga + candidato (via candidatos_auth → candidatos por email)
  const { data: cand, error: candErr } = await admin
    .from("candidaturas")
    .select(
      "id, vaga_id, candidato_auth_id, carta_apresentacao, candidatos_auth!inner(nome, email, telefone)",
    )
    .eq("id", candidaturaId)
    .maybeSingle();
  if (candErr || !cand) return json({ error: "Candidatura não encontrada" }, 404);

  const { data: vaga, error: vErr } = await admin
    .from("vagas")
    .select("id, titulo, departamento, descricao, requisitos_obrigatorios, requisitos_desejaveis, nivel")
    .eq("id", cand.vaga_id)
    .maybeSingle();
  if (vErr || !vaga) return json({ error: "Vaga não encontrada" }, 404);

  const email = (cand.candidatos_auth as { email?: string })?.email;
  const { data: candidato } = await admin
    .from("candidatos")
    .select("nome, resumo, habilidades, experiencias, formacao")
    .eq("email", email ?? "")
    .maybeSingle();

  const habilidadesCand = (candidato?.habilidades ?? []) as string[];

  const cacheKeyPayload = {
    vaga: {
      id: vaga.id,
      titulo: vaga.titulo,
      req: vaga.requisitos_obrigatorios ?? "",
      des: vaga.requisitos_desejaveis ?? "",
      nivel: vaga.nivel ?? "",
    },
    candidato: {
      email,
      habilidades: habilidadesCand.slice().sort(),
      experiencias: candidato?.experiencias ?? [],
      formacao: candidato?.formacao ?? [],
      resumo: (candidato?.resumo ?? "").slice(0, 2000),
      carta: (cand.carta_apresentacao ?? "").slice(0, 1000),
    },
  };

  const prompt = `Você é um recrutador sênior. Faça a triagem de um candidato para uma vaga e retorne APENAS JSON válido, sem markdown.

VAGA:
- Título: ${vaga.titulo}
- Nível: ${vaga.nivel ?? "N/A"}
- Departamento: ${vaga.departamento ?? "N/A"}
- Descrição: ${(vaga.descricao ?? "").slice(0, 1500)}
- Requisitos obrigatórios: ${vaga.requisitos_obrigatorios ?? "N/A"}
- Requisitos desejáveis: ${vaga.requisitos_desejaveis ?? "N/A"}

CANDIDATO:
- Nome: ${candidato?.nome ?? "N/A"}
- Habilidades: ${habilidadesCand.join(", ") || "N/A"}
- Experiências: ${JSON.stringify(candidato?.experiencias ?? []).slice(0, 1500)}
- Formação: ${JSON.stringify(candidato?.formacao ?? []).slice(0, 800)}
- Resumo: ${(candidato?.resumo ?? "").slice(0, 1000)}
- Carta de apresentação: ${(cand.carta_apresentacao ?? "").slice(0, 800)}

Retorne JSON com esta estrutura EXATA:
{
  "score": 0-100 (fit geral),
  "resumo": "2-3 frases sobre o encaixe",
  "pontos_fortes": ["até 5 pontos objetivos"],
  "red_flags": ["até 5 alertas, ex: gaps de experiência, mudanças frequentes, requisitos ausentes"],
  "recomendacao": "aprovar" | "revisar" | "reprovar",
  "match_habilidades": {
    "presentes": ["habilidades da vaga que o candidato demonstra"],
    "ausentes": ["habilidades exigidas que o candidato não tem"]
  }
}`;

  let cacheHit = false;
  const { value: result, cached } = await withCache<ScreeningResult>(
    "ai-screening",
    CACHE_VERSION,
    cacheKeyPayload,
    async () => {
      const resp = await fetch("https://ai-gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content:
                "Você é um especialista em recrutamento. Faça triagens objetivas, calibradas e sem viés. Sempre retorne JSON válido sem markdown.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 1200,
          temperature: 0.2,
        }),
      });

      if (resp.status === 429) throw new Error("AI rate limit");
      if (resp.status === 402) throw new Error("AI payment required");
      if (!resp.ok) throw new Error(`AI gateway ${resp.status}`);

      const j = await resp.json();
      const content = j.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty AI response");

      let parsed: unknown;
      try {
        parsed = JSON.parse(stripFence(content));
      } catch {
        parsed = {
          score: 50,
          resumo: "Análise automática — não foi possível processar detalhes.",
          pontos_fortes: [],
          red_flags: [],
          recomendacao: "revisar",
          match_habilidades: { presentes: habilidadesCand, ausentes: [] },
        };
      }
      return normalizeResult(parsed, habilidadesCand);
    },
  );
  cacheHit = cached;

  const { data: upserted, error: upErr } = await admin
    .from("triagem_ia")
    .upsert(
      {
        candidatura_id: cand.id,
        vaga_id: cand.vaga_id,
        candidato_auth_id: cand.candidato_auth_id,
        score: result.score,
        resumo: result.resumo,
        pontos_fortes: result.pontos_fortes,
        red_flags: result.red_flags,
        recomendacao: result.recomendacao,
        match_habilidades: result.match_habilidades,
        modelo: MODEL,
        cache_hit: cacheHit,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "candidatura_id" },
    )
    .select()
    .single();

  if (upErr) {
    console.error("[ai-screening] persist error", upErr);
    return json({ error: "Falha ao salvar triagem", details: upErr.message }, 500);
  }

  return json({ triagem: upserted, cache_hit: cacheHit });
});
