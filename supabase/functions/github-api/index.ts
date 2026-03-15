/**
 * @fileoverview GitHub API Edge Function
 * @description Proxy para chamadas à API do GitHub com autenticação JWT
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validação JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('Unauthorized: Missing or invalid Authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: 'Token de autenticação ausente' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Unauthorized: Invalid token', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: 'Token inválido ou expirado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;
    console.log(`Authenticated user for github-api: ${userId}`);

    const GITHUB_PAT = Deno.env.get('GITHUB_PAT');
    
    if (!GITHUB_PAT) {
      console.error('GITHUB_PAT is not configured');
      return new Response(
        JSON.stringify({ error: 'GitHub API not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const cleanToken = GITHUB_PAT.trim();

    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid request body', details: 'JSON body required with endpoint field' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { endpoint, method = 'GET', body } = requestBody;

    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: endpoint' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`GitHub API request by user ${userId}: ${method} ${endpoint}`);

    const response = await fetch(`https://api.github.com${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Lovable-GitHub-Integration',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('GitHub API Error:', data);
      return new Response(JSON.stringify({ 
        error: data.message || 'GitHub API error',
        status: response.status 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in github-api function:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});