/**
 * @fileoverview GitHub API Edge Function
 * @description Proxy para chamadas à API do GitHub
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GITHUB_PAT = Deno.env.get('GITHUB_PAT');
    
    if (!GITHUB_PAT) {
      throw new Error('GITHUB_PAT is not configured');
    }
    
    const cleanToken = GITHUB_PAT.trim();

    const { endpoint, method = 'GET', body } = await req.json();

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
