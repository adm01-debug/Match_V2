/**
 * @fileoverview match-score Edge Function
 * @description Handles match-score operations for the Match ATS system
 * @version 1.0.0
 * @author Match ATS Team
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Input validation schema
const RequestSchema = z.object({
  // Add your schema here
}).passthrough();


// Rate limiting helper
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100;
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const client = rateLimitMap.get(clientId);
  if (!client || now > client.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  if (client.count >= RATE_LIMIT) return false;
  client.count++;
  return true;
}


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Candidato {
  id: string;
  nome: string;
  email: string;
  habilidades: string[];
  experiencia_anos: number;
  formacao: any[];
  cargo_atual: string | null;
}

interface Vaga {
  id: string;
  titulo: string;
  departamento: string;
  habilidades_obrigatorias: string[];
  habilidades_desejaveis: string[];
  nivel: string;
  requisitos_obrigatorios: string;
}

interface MatchResult {
  scoreTotal: number;
  scoreHabilidades: number;
  scoreExperiencia: number;
  scoreFormacao: number;
  habilidadesMatch: string[];
  habilidadesFaltantes: string[];
  habilidadesExtras: string[];
  analise: string;
  recomendacao: string;
  pontosFortes: string[];
  pontosAtencao: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY não configurada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { candidatoId, vagaId } = await req.json();

    if (!candidatoId || !vagaId) {
      return new Response(
        JSON.stringify({ error: 'candidatoId e vagaId são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar cliente Supabase
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

    // Buscar candidato do banco
    const { data: candidato, error: candidatoError } = await supabase
      .from('candidatos')
      .select('*')
      .eq('id', candidatoId)
      .single();

    if (candidatoError || !candidato) {
      return new Response(
        JSON.stringify({ error: 'Candidato não encontrado', details: candidatoError?.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar vaga do banco
    const { data: vaga, error: vagaError } = await supabase
      .from('vagas')
      .select('*')
      .eq('id', vagaId)
      .single();

    if (vagaError || !vaga) {
      return new Response(
        JSON.stringify({ error: 'Vaga não encontrada', details: vagaError?.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construir prompt para IA
    const prompt = `Analise a compatibilidade entre este candidato e esta vaga e retorne um JSON com a análise.

CANDIDATO:
- Nome: ${candidato.nome}
- Cargo Atual: ${candidato.cargo_atual || 'Não informado'}
- Anos de Experiência: ${candidato.experiencia_anos}
- Habilidades: ${(candidato.habilidades || []).join(', ') || 'Não informadas'}
- Formação: ${JSON.stringify(candidato.formacao || [])}

VAGA:
- Título: ${vaga.titulo}
- Departamento: ${vaga.departamento}
- Nível: ${vaga.nivel || 'Não especificado'}
- Habilidades Obrigatórias: ${(vaga.habilidades_obrigatorias || []).join(', ') || 'Não especificadas'}
- Habilidades Desejáveis: ${(vaga.habilidades_desejaveis || []).join(', ') || 'Não especificadas'}
- Requisitos: ${vaga.requisitos_obrigatorios || 'Não especificados'}

Retorne APENAS um JSON válido (sem markdown) com esta estrutura:
{
  "scoreTotal": número de 0 a 100,
  "scoreHabilidades": número de 0 a 100,
  "scoreExperiencia": número de 0 a 100,
  "scoreFormacao": número de 0 a 100,
  "habilidadesMatch": ["habilidades que o candidato tem e a vaga exige"],
  "habilidadesFaltantes": ["habilidades exigidas que o candidato não tem"],
  "habilidadesExtras": ["habilidades do candidato não exigidas mas relevantes"],
  "analise": "Análise detalhada da compatibilidade em 2-3 frases",
  "recomendacao": "Altamente Recomendado" ou "Recomendado" ou "Considerar" ou "Não Recomendado",
  "pontosFortes": ["até 3 pontos fortes principais"],
  "pontosAtencao": ["até 3 pontos de atenção"]
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
          {
            role: 'system',
            content: 'Você é um especialista em recrutamento e seleção. Analise a compatibilidade entre candidatos e vagas de forma objetiva e precisa. Sempre retorne JSON válido sem markdown.'
          },
          {
            role: 'user',
            content: prompt
          }
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
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Resposta vazia da IA' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limpar e parsear JSON
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) jsonContent = jsonContent.slice(7);
    if (jsonContent.startsWith('```')) jsonContent = jsonContent.slice(3);
    if (jsonContent.endsWith('```')) jsonContent = jsonContent.slice(0, -3);
    jsonContent = jsonContent.trim();

    let matchResult: MatchResult;
    
    try {
      matchResult = JSON.parse(jsonContent);
    } catch {
      // Fallback: calcular score básico
      const habilidadesCandidato = (candidato.habilidades || []).map((h: string) => h.toLowerCase());
      const habilidadesVaga = (vaga.habilidades_obrigatorias || []).map((h: string) => h.toLowerCase());
      
      const match = habilidadesCandidato.filter((h: string) => 
        habilidadesVaga.some((v: string) => h.includes(v) || v.includes(h))
      );
      
      const scoreBasico = habilidadesVaga.length > 0 
        ? Math.round((match.length / habilidadesVaga.length) * 100)
        : 50;

      matchResult = {
        scoreTotal: scoreBasico,
        scoreHabilidades: scoreBasico,
        scoreExperiencia: Math.min(candidato.experiencia_anos * 10, 100),
        scoreFormacao: 50,
        habilidadesMatch: match,
        habilidadesFaltantes: habilidadesVaga.filter((h: string) => !match.includes(h)),
        habilidadesExtras: habilidadesCandidato.filter((h: string) => !habilidadesVaga.includes(h)),
        analise: 'Análise calculada automaticamente com base nas habilidades.',
        recomendacao: scoreBasico >= 70 ? 'Recomendado' : scoreBasico >= 50 ? 'Considerar' : 'Não Recomendado',
        pontosFortes: match.slice(0, 3),
        pontosAtencao: [],
      };
    }

    // Garantir que scores estão no range correto
    matchResult.scoreTotal = Math.max(0, Math.min(100, matchResult.scoreTotal));
    matchResult.scoreHabilidades = Math.max(0, Math.min(100, matchResult.scoreHabilidades));
    matchResult.scoreExperiencia = Math.max(0, Math.min(100, matchResult.scoreExperiencia));
    matchResult.scoreFormacao = Math.max(0, Math.min(100, matchResult.scoreFormacao));

    return new Response(
      JSON.stringify({
        success: true,
        candidatoId,
        vagaId,
        vagaTitulo: vaga.titulo,
        ...matchResult,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
