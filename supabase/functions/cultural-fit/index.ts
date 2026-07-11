/**
 * @fileoverview Cultural Fit Edge Function
 * @description Avalia fit cultural entre candidato e empresa usando IA
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { enforceRateLimit } from "../_shared/rateLimit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const limited = await enforceRateLimit(req, { route: "cultural-fit", max: 30 });
  if (limited) return limited;


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

    const { candidatoId, vagaId, respostas } = await req.json();

    if (!candidatoId || !vagaId) {
      return new Response(
        JSON.stringify({ error: 'candidatoId e vagaId são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar valores culturais da empresa
    const { data: valores } = await supabase
      .from('valores_culturais')
      .select('*')
      .eq('ativo', true);

    // Buscar perfil comportamental da empresa para a vaga
    const { data: perfilEmpresa } = await supabase
      .from('perfis_comportamentais_empresa')
      .select('*')
      .eq('vaga_id', vagaId)
      .eq('ativo', true)
      .maybeSingle();

    // Buscar candidato
    const { data: candidato } = await supabase
      .from('candidatos')
      .select('nome, habilidades, resumo')
      .eq('id', candidatoId)
      .single();

    const prompt = `Avalie o fit cultural do candidato com base nos dados abaixo e retorne um JSON.

CANDIDATO: ${candidato?.nome || 'Desconhecido'}
Resumo: ${candidato?.resumo || 'N/A'}
Respostas culturais: ${JSON.stringify(respostas || {})}

VALORES DA EMPRESA: ${JSON.stringify(valores?.map(v => v.nome) || [])}
PERFIL ESPERADO: ${JSON.stringify(perfilEmpresa || {})}

Retorne APENAS um JSON válido:
{
  "fitGeral": número de 0 a 100,
  "fitPorValor": { "valor": número },
  "alinhamentos": ["até 3 valores mais alinhados"],
  "gaps": ["até 3 gaps identificados"],
  "analise": "análise de 2-3 frases",
  "recomendacao": "Altamente Alinhado" ou "Alinhado" ou "Parcialmente Alinhado" ou "Desalinhado"
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
          { role: 'system', content: 'Você é um especialista em cultura organizacional. Retorne JSON válido.' },
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
        fitGeral: 50,
        fitPorValor: {},
        alinhamentos: [],
        gaps: [],
        analise: 'Não foi possível gerar análise automática.',
        recomendacao: 'Parcialmente Alinhado',
      };
    }

    return new Response(
      JSON.stringify({ success: true, candidatoId, vagaId, ...result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Cultural fit error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
