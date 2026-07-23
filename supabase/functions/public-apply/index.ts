/**
 * public-apply — Candidatura one-click sem cadastro prévio.
 *
 * Fluxo:
 *  1. Rate limit por IP.
 *  2. Valida payload e existência da vaga publicada.
 *  3. Garante usuário em auth.users (invite by email) → dispara magic link.
 *  4. Trigger `handle_new_candidate_user` cria candidatos_auth automaticamente.
 *  5. Upload opcional de currículo (base64) para bucket `curriculos` via service role.
 *  6. Cria/reusa `candidatos` público e insere `candidaturas` (dedup).
 */
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { enforceRateLimit } from '../_shared/rateLimit.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ApplyPayload {
  vaga_id: string;
  nome: string;
  email: string;
  telefone?: string;
  linkedin_url?: string;
  carta_apresentacao?: string;
  curriculo_base64?: string; // data URL ou base64 puro
  curriculo_nome?: string;
  redirect_to?: string; // URL para retorno após magic link
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

function decodeBase64(input: string): Uint8Array {
  const clean = input.includes(',') ? input.split(',')[1] : input;
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  const limited = await enforceRateLimit(req, { route: 'public-apply', max: 10, windowSeconds: 60 });
  if (limited) return limited;

  let payload: ApplyPayload;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  const { vaga_id, nome, email, telefone, linkedin_url, carta_apresentacao,
    curriculo_base64, curriculo_nome, redirect_to } = payload;

  if (!vaga_id || !isUuid(vaga_id)) return json(400, { error: 'invalid_vaga_id' });
  if (!nome || nome.trim().length < 2) return json(400, { error: 'invalid_nome' });
  if (!email || !isEmail(email)) return json(400, { error: 'invalid_email' });
  if (curriculo_base64 && curriculo_base64.length > 6_000_000) {
    return json(400, { error: 'curriculo_too_large', message: 'Máximo ~4MB' });
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  try {
    // 1. Verificar vaga publicada
    const { data: vaga, error: vagaErr } = await admin
      .from('vagas')
      .select('id, titulo, status, deleted_at')
      .eq('id', vaga_id)
      .maybeSingle();
    if (vagaErr) throw vagaErr;
    if (!vaga || vaga.deleted_at || vaga.status !== 'publicada') {
      return json(404, { error: 'vaga_indisponivel' });
    }

    const emailLower = email.trim().toLowerCase();

    // 2. Garantir usuário auth + candidatos_auth
    let candidatoAuthId: string | null = null;
    let userId: string | null = null;

    const { data: existingAuth } = await admin
      .from('candidatos_auth')
      .select('id, user_id, candidato_id, curriculo_url')
      .eq('email', emailLower)
      .maybeSingle();

    if (existingAuth) {
      candidatoAuthId = existingAuth.id;
      userId = existingAuth.user_id;
    } else {
      // Invite by email — dispara magic link + cria auth.users
      const redirect = redirect_to ?? `${new URL(req.url).origin}/portal`;
      const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(
        emailLower,
        {
          data: { user_type: 'candidato', nome: nome.trim(), telefone: telefone ?? null },
          redirectTo: redirect,
        },
      );
      if (inviteErr) {
        // Se já existir, buscar user existente
        if (!/already.*registered|exists/i.test(inviteErr.message)) throw inviteErr;
        const { data: list } = await admin.auth.admin.listUsers();
        const found = list.users.find((u) => u.email?.toLowerCase() === emailLower);
        if (!found) throw inviteErr;
        userId = found.id;
      } else {
        userId = invited.user?.id ?? null;
      }

      // Aguardar trigger criar candidatos_auth (ou criar manualmente)
      for (let i = 0; i < 3 && !candidatoAuthId; i++) {
        await new Promise((r) => setTimeout(r, 250));
        const { data: row } = await admin
          .from('candidatos_auth')
          .select('id, candidato_id')
          .eq('email', emailLower)
          .maybeSingle();
        if (row) {
          candidatoAuthId = row.id;
        }
      }

      if (!candidatoAuthId && userId) {
        const { data: created, error: caErr } = await admin
          .from('candidatos_auth')
          .insert({ user_id: userId, nome: nome.trim(), email: emailLower, telefone: telefone ?? null })
          .select('id')
          .single();
        if (caErr) throw caErr;
        candidatoAuthId = created.id;
      }
    }

    if (!candidatoAuthId) return json(500, { error: 'candidato_auth_failed' });

    // 3. Garantir candidato público
    let candidatoId: string | null = null;
    const { data: existingCand } = await admin
      .from('candidatos')
      .select('id')
      .eq('email', emailLower)
      .is('deleted_at', null)
      .maybeSingle();

    if (existingCand) {
      candidatoId = existingCand.id;
    } else {
      const { data: created, error: cErr } = await admin
        .from('candidatos')
        .insert({
          nome: nome.trim(),
          email: emailLower,
          telefone: telefone ?? null,
          fonte: 'carreiras_public',
          status: 'novo',
        })
        .select('id')
        .single();
      if (cErr) throw cErr;
      candidatoId = created.id;
    }

    // Vincular candidatos_auth ↔ candidatos
    await admin.from('candidatos_auth').update({ candidato_id: candidatoId }).eq('id', candidatoAuthId);

    // 4. Upload de currículo (opcional)
    let curriculoUrl: string | null = null;
    if (curriculo_base64) {
      const bytes = decodeBase64(curriculo_base64);
      const safeName = (curriculo_nome ?? 'curriculo.pdf').replace(/[^\w.\-]/g, '_');
      const path = `public-apply/${candidatoAuthId}/${Date.now()}-${safeName}`;
      const { error: upErr } = await admin.storage
        .from('curriculos')
        .upload(path, bytes, {
          contentType: safeName.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream',
          upsert: true,
        });
      if (upErr) throw upErr;
      curriculoUrl = path;
      await admin.from('candidatos_auth').update({
        curriculo_url: path,
        curriculo_nome: safeName,
      }).eq('id', candidatoAuthId);
      await admin.from('candidatos').update({ arquivo_curriculo: path }).eq('id', candidatoId);
    }

    if (linkedin_url) {
      await admin.from('candidatos').update({
        experiencias: { linkedin_url },
      }).eq('id', candidatoId);
    }

    // 5. Candidatura (dedup)
    const { data: existingApp } = await admin
      .from('candidaturas')
      .select('id, etapa_atual')
      .eq('candidato_auth_id', candidatoAuthId)
      .eq('vaga_id', vaga_id)
      .is('deleted_at', null)
      .maybeSingle();

    if (existingApp) {
      return json(200, {
        ok: true,
        duplicate: true,
        candidatura_id: existingApp.id,
        message: 'Você já se candidatou a esta vaga.',
      });
    }

    const { data: candidatura, error: appErr } = await admin
      .from('candidaturas')
      .insert({
        candidato_auth_id: candidatoAuthId,
        vaga_id,
        status: 'novo',
        etapa_atual: 'triagem',
        data_candidatura: new Date().toISOString(),
        carta_apresentacao: carta_apresentacao ?? null,
        curriculo_url: curriculoUrl,
      })
      .select('id')
      .single();
    if (appErr) throw appErr;

    return json(200, {
      ok: true,
      candidatura_id: candidatura.id,
      vaga_titulo: vaga.titulo,
      magic_link_sent: !existingAuth,
      message: existingAuth
        ? 'Candidatura registrada. Acesse o portal para acompanhar.'
        : 'Candidatura registrada! Enviamos um link mágico ao seu email para acompanhar.',
    });
  } catch (err) {
    console.error('[public-apply] error', err);
    return json(500, {
      error: 'internal_error',
      message: err instanceof Error ? err.message : String(err),
    });
  }
});
