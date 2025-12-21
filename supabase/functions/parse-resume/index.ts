import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

interface ParsedResume {
  nome: string;
  email: string;
  telefone: string | null;
  linkedin: string | null;
  cidade: string | null;
  estado: string | null;
  cargo_atual: string | null;
  empresa_atual: string | null;
  experiencia_anos: number;
  habilidades: string[];
  experiencias: Array<{
    empresa: string;
    cargo: string;
    periodo: string;
    descricao: string;
  }>;
  formacao: Array<{
    instituicao: string;
    curso: string;
    periodo: string;
    nivel: string;
  }>;
  resumo: string | null;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'Configuração incompleta',
          details: 'LOVABLE_API_KEY não configurada' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { fileContent, fileName } = await req.json();

    if (!fileContent) {
      return new Response(
        JSON.stringify({ error: 'Conteúdo do arquivo é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `Analise o seguinte currículo e extraia as informações em formato JSON.
    
O JSON deve ter exatamente esta estrutura:
{
  "nome": "Nome completo do candidato",
  "email": "email@exemplo.com",
  "telefone": "(11) 99999-9999 ou null",
  "linkedin": "URL do LinkedIn ou null",
  "cidade": "Cidade ou null",
  "estado": "UF ou null",
  "cargo_atual": "Cargo atual ou último cargo",
  "empresa_atual": "Empresa atual ou última empresa",
  "experiencia_anos": número de anos de experiência (inteiro),
  "habilidades": ["habilidade1", "habilidade2", ...],
  "experiencias": [
    {
      "empresa": "Nome da empresa",
      "cargo": "Cargo ocupado",
      "periodo": "Jan/2020 - Dez/2023",
      "descricao": "Principais responsabilidades e conquistas"
    }
  ],
  "formacao": [
    {
      "instituicao": "Nome da instituição",
      "curso": "Nome do curso",
      "periodo": "2015 - 2019",
      "nivel": "Graduação/Pós-graduação/Mestrado/etc"
    }
  ],
  "resumo": "Breve resumo profissional do candidato (2-3 frases)"
}

Retorne APENAS o JSON, sem markdown, sem explicações.

Currículo:
${fileContent}`;

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
            content: 'Você é um especialista em análise de currículos. Extraia informações de forma precisa e estruturada. Sempre retorne JSON válido sem markdown.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4096,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ 
          error: 'Erro no serviço de IA',
          details: `Status: ${response.status}` 
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ 
          error: 'Resposta vazia da IA',
          details: 'Nenhum conteúdo retornado' 
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limpar e parsear JSON
    let jsonContent = content.trim();
    
    // Remover markdown se presente
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.slice(7);
    }
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.slice(3);
    }
    if (jsonContent.endsWith('```')) {
      jsonContent = jsonContent.slice(0, -3);
    }
    jsonContent = jsonContent.trim();

    let parsedData: ParsedResume;
    
    try {
      parsedData = JSON.parse(jsonContent);
    } catch (parseError) {
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao processar resposta',
          details: 'Resposta da IA não é JSON válido' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validar campos obrigatórios
    if (!parsedData.nome || !parsedData.email) {
      return new Response(
        JSON.stringify({ 
          error: 'Dados incompletos',
          details: 'Nome e email são obrigatórios' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalizar dados
    const normalizedData: ParsedResume = {
      nome: parsedData.nome,
      email: parsedData.email.toLowerCase(),
      telefone: parsedData.telefone || null,
      linkedin: parsedData.linkedin || null,
      cidade: parsedData.cidade || null,
      estado: parsedData.estado || null,
      cargo_atual: parsedData.cargo_atual || null,
      empresa_atual: parsedData.empresa_atual || null,
      experiencia_anos: parseInt(String(parsedData.experiencia_anos)) || 0,
      habilidades: Array.isArray(parsedData.habilidades) ? parsedData.habilidades : [],
      experiencias: Array.isArray(parsedData.experiencias) ? parsedData.experiencias : [],
      formacao: Array.isArray(parsedData.formacao) ? parsedData.formacao : [],
      resumo: parsedData.resumo || null,
    };

    return new Response(
      JSON.stringify({ 
        success: true,
        data: normalizedData,
        fileName,
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
