/**
 * @fileoverview Generic Secure Webhook Handler
 * @description Recebe webhooks externos (Evolution, Resend, etc.) com verificação obrigatória de HMAC-SHA256.
 *
 * Headers aceitos para assinatura (em ordem de precedência):
 *   - x-webhook-signature       (custom Match ATS)
 *   - x-hub-signature-256       (GitHub / genérico "sha256=<hex>")
 *   - resend-signature          (Resend)
 *
 * Formato esperado do valor: hex puro ou prefixo "sha256=" seguido de hex.
 * O corpo é considerado o payload cru (raw body) usado no HMAC.
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { enforceRateLimit } from "../_shared/rateLimit.ts";

const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SIGNING_SECRET') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-webhook-signature, x-hub-signature-256, resend-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim().replace(/^sha256=/i, '');
  if (!/^[0-9a-f]+$/i.test(clean) || clean.length % 2 !== 0) {
    return new Uint8Array();
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return out;
}

async function verifySignature(rawBody: string, signature: string | null): Promise<boolean> {
  if (!WEBHOOK_SECRET) {
    console.error('[webhook-handler] WEBHOOK_SIGNING_SECRET não configurado');
    return false;
  }
  if (!signature) return false;

  const sigBytes = hexToBytes(signature);
  if (sigBytes.byteLength === 0) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  try {
    return await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(rawBody));
  } catch {
    return false;
  }
}

function extractSignature(req: Request): string | null {
  return (
    req.headers.get('x-webhook-signature') ??
    req.headers.get('x-hub-signature-256') ??
    req.headers.get('resend-signature') ??
    null
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const limited = await enforceRateLimit(req, { route: "webhook-handler", max: 30 });
  if (limited) return limited;


  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const bodyText = await req.text();
    const signature = extractSignature(req);

    // HMAC obrigatório — sem exceção por ambiente
    const valid = await verifySignature(bodyText, signature);
    if (!valid) {
      console.error('[webhook-handler] Assinatura inválida ou ausente');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let payload: { type?: string; data?: unknown; idempotency_key?: string };
    try {
      payload = JSON.parse(bodyText);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { type, data, idempotency_key } = payload;
    if (!type || typeof type !== 'string' || data === undefined) {
      return new Response(JSON.stringify({ error: 'Missing type or data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Idempotência opcional
    if (idempotency_key) {
      const { data: existing } = await supabase
        .from('notificacoes_candidato')
        .select('id')
        .eq('idempotency_key', idempotency_key)
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({ success: true, message: 'Duplicate skipped' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
    }

    // Log de auditoria (fire-and-forget)
    await supabase.from('ip_access_logs').insert({
      event_type: `webhook_${type}`,
      metadata: data as Record<string, unknown>,
    });

    return new Response(JSON.stringify({ success: true, type }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[webhook-handler] erro:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
