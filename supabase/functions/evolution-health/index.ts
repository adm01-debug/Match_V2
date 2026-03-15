/**
 * @fileoverview Evolution API Health Check
 * @description Testa a conexão com a Evolution API — sem necessidade de JWT
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const EVOLUTION_API_URL = Deno.env.get('EVOLUTION_API_URL');
  const EVOLUTION_API_KEY = Deno.env.get('EVOLUTION_API_KEY');
  const EVOLUTION_INSTANCE = Deno.env.get('EVOLUTION_INSTANCE_NAME');

  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    config: {
      url_set: !!EVOLUTION_API_URL,
      key_set: !!EVOLUTION_API_KEY,
      instance_set: !!EVOLUTION_INSTANCE,
      instance_name: EVOLUTION_INSTANCE || 'NOT SET',
    },
  };

  if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
    results.status = 'ERROR';
    results.error = 'EVOLUTION_API_URL ou EVOLUTION_API_KEY não configurados';
    return new Response(JSON.stringify(results, null, 2), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Test 1: Fetch instances
    const instancesRes = await fetch(`${EVOLUTION_API_URL}/instance/fetchInstances`, {
      method: 'GET',
      headers: { 'apikey': EVOLUTION_API_KEY },
    });
    const instancesData = await instancesRes.json();
    results.fetch_instances = {
      status: instancesRes.status,
      ok: instancesRes.ok,
      data: instancesData,
    };

    // Test 2: Connection state (if instance is set)
    if (EVOLUTION_INSTANCE) {
      const stateRes = await fetch(`${EVOLUTION_API_URL}/instance/connectionState/${EVOLUTION_INSTANCE}`, {
        method: 'GET',
        headers: { 'apikey': EVOLUTION_API_KEY },
      });
      const stateData = await stateRes.json();
      results.connection_state = {
        status: stateRes.status,
        ok: stateRes.ok,
        data: stateData,
      };
    }

    results.status = instancesRes.ok ? 'CONNECTED' : 'AUTH_ERROR';
  } catch (error) {
    results.status = 'NETWORK_ERROR';
    results.error = error instanceof Error ? error.message : String(error);
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: results.status === 'CONNECTED' ? 200 : 500,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
