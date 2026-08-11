import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';

const BodySchema = z.object({
  token: z.string().min(16).max(128),
  aceitar: z.boolean(),
  motivo_recusa: z.string().max(1000).optional(),
  assinatura_nome: z.string().min(2).max(200).optional(),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const raw = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { token, aceitar, motivo_recusa, assinatura_nome } = parsed.data;
    if (aceitar && !assinatura_nome) {
      return new Response(JSON.stringify({ error: 'assinatura_nome_obrigatorio' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ip =
      req.headers.get('cf-connecting-ip') ??
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      null;
    const userAgent = req.headers.get('user-agent') ?? null;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabase.rpc('assinar_proposta', {
      p_token: token,
      p_aceitar: aceitar,
      p_ip: ip,
      p_user_agent: userAgent,
      p_motivo_recusa: motivo_recusa ?? null,
      p_assinatura_nome: assinatura_nome ?? null,
    });

    if (error) {
      console.error('[sign-proposal] rpc error', error);
      return new Response(JSON.stringify({ error: 'rpc_failed', detail: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = data as { success: boolean; error?: string };
    const status = result?.success ? 200 : 409;
    return new Response(JSON.stringify(result), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[sign-proposal] unexpected', err);
    return new Response(JSON.stringify({ error: 'internal_error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
