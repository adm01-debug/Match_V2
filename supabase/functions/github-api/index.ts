import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    // Debug: verificar se token existe e seu formato
    console.log(`Token exists: ${!!GITHUB_PAT}`);
    console.log(`Token length: ${GITHUB_PAT?.length || 0}`);
    console.log(`Token starts with: ${GITHUB_PAT?.substring(0, 4) || 'N/A'}`);
    console.log(`Token trimmed length: ${GITHUB_PAT?.trim().length || 0}`);
    
    if (!GITHUB_PAT) {
      throw new Error('GITHUB_PAT is not configured');
    }
    
    // Usar token limpo (sem espaços)
    const cleanToken = GITHUB_PAT.trim();

    const { endpoint, method = 'GET', body } = await req.json();
    
    console.log(`GitHub API Request: ${method} ${endpoint}`);

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
    
    console.log(`GitHub API Response: ${response.status}`);

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
