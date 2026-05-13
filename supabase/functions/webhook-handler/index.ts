/**
 * @fileoverview Generic Secure Webhook Handler
 * @description Recebe webhooks externos (Evolution, Resend) com verificação de assinatura (HMAC)
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";

const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SIGNING_SECRET') || '';

async function verifySignature(body: string, signature: string | null): Promise<boolean> {
  if (!WEBHOOK_SECRET || !signature) return false;
  
  const encoder = new TextEncoder();
  const keyData = encoder.encode(WEBHOOK_SECRET);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const signatureBytes = new Uint8Array(
    signature.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  return await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    encoder.encode(body)
  );
}

serve(async (req) => {
  const { method } = req;

  if (method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const signature = req.headers.get('x-webhook-signature');
    const bodyText = await req.text();

    // Verificação de segurança obrigatória em produção
    if (Deno.env.get('DENO_REGION') && !await verifySignature(bodyText, signature)) {
      console.error('Assinatura de webhook inválida');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const payload = JSON.parse(bodyText);
    const { type, data, idempotency_key } = payload;

    if (!type || !data) {
      return new Response(JSON.stringify({ error: 'Missing type or data' }), { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verificar idempotência se fornecida
    if (idempotency_key) {
      const { data: existing } = await supabase
        .from('notificacoes_candidato') // Exemplo de tabela que usa idempotência
        .select('id')
        .eq('idempotency_key', idempotency_key)
        .maybeSingle();

      if (existing) {
        return new Response(JSON.stringify({ success: true, message: 'Duplicate skipped' }), { status: 200 });
      }
    }

    // Processar baseado no tipo
    console.log(`Webhook recebido: ${type}`);

    // Exemplo: Salvar no log de auditoria ou disparar ação
    await supabase.from('ip_access_logs').insert({
      event_type: `webhook_${type}`,
      metadata: data
    });

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
});
