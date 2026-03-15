/**
 * @fileoverview Behavioral Analysis Edge Function
 * @description Análise comportamental de candidatos usando IA
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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token inválido' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY não configurada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { candidatoId, respostas, tipo } = await req.json();

    if (!candidatoId || !respostas || !tipo) {
      return new Response(
        JSON.stringify({ error: 'candidatoId, respostas e tipo são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `Analise as respostas comportamentais do tipo "${tipo}" e retorne um JSON com a análise.

RESPOSTAS:
${JSON.stringify(respostas)}

Retorne APENAS um JSON válido (sem markdown) com:
{
  "scoreGeral": número de 0 a 100,
  "dimensoes": { "chave": número },
  "perfil_primario": "tipo principal identificado",
  "perfil_secundario": "tipo secundário",
  "analise": "análise em 2-3 frases",
  "pontos_fortes": ["até 3 itens"],
  "areas_desenvolvimento": ["até 3 itens"],
  "recomendacoes": ["até 3 itens"]
}`;

    const response = await fetch('https://ai-gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Você é um psicólogo organizacional especialista em avaliações comportamentais. Retorne JSON válido.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2048,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Erro no serviço de IA', status: response.status }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    let content = aiResponse.choices?.[0]?.message?.content?.trim() || '';

    if (content.startsWith('```json')) content = content.slice(7);
    if (content.startsWith('```')) content = content.slice(3);
    if (content.endsWith('```')) content = content.slice(0, -3);
    content = content.trim();

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = {
        scoreGeral: 50,
        dimensoes: {},
        perfil_primario: 'Indeterminado',
        perfil_secundario: 'Indeterminado',
        analise: 'Não foi possível gerar análise automática.',
        pontos_fortes: [],
        areas_desenvolvimento: [],
        recomendacoes: [],
      };
    }

    return new Response(
      JSON.stringify({ success: true, candidatoId, tipo, ...result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Behavioral analysis error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
