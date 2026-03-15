/**
 * @fileoverview Evolution API Proxy Edge Function
 * @description Proxy seguro para a Evolution API v2 — gerencia instâncias, mensagens e status
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const EVOLUTION_API_URL = Deno.env.get('EVOLUTION_API_URL');
const EVOLUTION_API_KEY = Deno.env.get('EVOLUTION_API_KEY');
const EVOLUTION_INSTANCE = Deno.env.get('EVOLUTION_INSTANCE_NAME');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // JWT auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return jsonResponse({ error: 'Unauthorized', details: 'Token ausente' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return jsonResponse({ error: 'Unauthorized', details: 'Token inválido' }, 401);
    }

    // Validate config
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
      console.error('Evolution API not configured');
      return jsonResponse({ error: 'Evolution API não configurada' }, 500);
    }

    const { endpoint, method, body, instance } = await req.json();

    if (!endpoint || typeof endpoint !== 'string') {
      return jsonResponse({ error: 'Campo "endpoint" obrigatório' }, 400);
    }

    // Prevent path traversal
    if (endpoint.includes('..') || !endpoint.startsWith('/')) {
      return jsonResponse({ error: 'Endpoint inválido' }, 400);
    }

    // Use provided instance or default
    const instanceName = instance || EVOLUTION_INSTANCE;

    // Build the full URL — replace {instance} placeholder if present
    let fullUrl = `${EVOLUTION_API_URL}${endpoint}`;
    if (instanceName && fullUrl.includes('{instance}')) {
      fullUrl = fullUrl.replace('{instance}', instanceName);
    } else if (instanceName && endpoint.match(/\/(sendText|sendMedia|sendButtons|sendList|sendPoll|sendLocation|sendContact|sendReaction|sendSticker|sendWhatsAppAudio|sendStatus|markMessageAsRead|delete|update|connect|connectionState|restart|logout|setPresence|info)\/?$/)) {
      // Auto-append instance for known instance-scoped endpoints
      fullUrl = `${fullUrl}/${instanceName}`;
    }

    const fetchMethod = (method || 'GET').toUpperCase();

    console.log(`Evolution API proxy: ${fetchMethod} ${fullUrl} by user ${user.id}`);

    const fetchOptions: RequestInit = {
      method: fetchMethod,
      headers: {
        'apikey': EVOLUTION_API_KEY,
        'Content-Type': 'application/json',
      },
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(fetchMethod)) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(fullUrl, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      console.error('Evolution API error:', response.status, data);
      return jsonResponse({ error: 'Erro na Evolution API', details: data }, response.status);
    }

    return jsonResponse({ success: true, data });
  } catch (error) {
    console.error('Evolution API proxy error:', error);
    return jsonResponse({ error: 'Erro interno do servidor' }, 500);
  }
});
