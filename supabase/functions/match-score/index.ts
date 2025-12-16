import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VagaRequisitos {
  titulo: string;
  departamento: string;
  nivel: string;
  habilidadesObrigatorias: string[];
  habilidadesDesejaveis: string[];
  experienciaMinima: number;
  formacaoMinima: string;
  descricao: string;
}

interface CandidatoPerfil {
  nome: string;
  habilidades: string[];
  experiencias: {
    empresa: string;
    cargo: string;
    periodo: string;
    descricao: string;
  }[];
  formacao: {
    instituicao: string;
    curso: string;
    periodo: string;
  }[];
  resumo: string;
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
  recomendacao: 'forte' | 'moderado' | 'fraco' | 'nao_recomendado';
  pontosFortes: string[];
  pontosAtencao: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vaga, candidato }: { vaga: VagaRequisitos; candidato: CandidatoPerfil } = await req.json();

    if (!vaga || !candidato) {
      return new Response(
        JSON.stringify({ success: false, error: "Dados da vaga e candidato são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "API key não configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Calculating match score for: ${candidato.nome} -> ${vaga.titulo}`);

    const systemPrompt = `Você é um especialista em recrutamento e seleção com vasta experiência em análise de compatibilidade entre candidatos e vagas.

Sua tarefa é analisar o perfil de um candidato comparando com os requisitos de uma vaga e gerar um Match Score de 0 a 100.

CRITÉRIOS DE AVALIAÇÃO:
1. HABILIDADES (40% do score):
   - Habilidades obrigatórias: cada uma presente vale pontos proporcionais
   - Habilidades desejáveis: bônus adicional
   - Habilidades extras relevantes: pequeno bônus

2. EXPERIÊNCIA (35% do score):
   - Anos de experiência vs requisito mínimo
   - Relevância dos cargos anteriores
   - Progressão de carreira

3. FORMAÇÃO (25% do score):
   - Compatibilidade do curso com a vaga
   - Nível de formação vs requisito

CLASSIFICAÇÃO:
- 80-100: FORTE (Altamente recomendado)
- 60-79: MODERADO (Recomendado com ressalvas)
- 40-59: FRACO (Considerar apenas se não houver melhores)
- 0-39: NÃO RECOMENDADO

Seja preciso e justo na avaliação. Retorne APENAS JSON válido.`;

    const userPrompt = `Analise a compatibilidade entre o candidato e a vaga:

VAGA:
- Título: ${vaga.titulo}
- Departamento: ${vaga.departamento}
- Nível: ${vaga.nivel}
- Habilidades Obrigatórias: ${vaga.habilidadesObrigatorias.join(', ')}
- Habilidades Desejáveis: ${vaga.habilidadesDesejaveis.join(', ')}
- Experiência Mínima: ${vaga.experienciaMinima} anos
- Formação Mínima: ${vaga.formacaoMinima}
- Descrição: ${vaga.descricao}

CANDIDATO:
- Nome: ${candidato.nome}
- Habilidades: ${candidato.habilidades.join(', ')}
- Experiências: ${JSON.stringify(candidato.experiencias)}
- Formação: ${JSON.stringify(candidato.formacao)}
- Resumo: ${candidato.resumo}

FORMATO DE SAÍDA (JSON):
{
  "scoreTotal": 75,
  "scoreHabilidades": 80,
  "scoreExperiencia": 70,
  "scoreFormacao": 75,
  "habilidadesMatch": ["Habilidade1", "Habilidade2"],
  "habilidadesFaltantes": ["HabilidadeFaltante1"],
  "habilidadesExtras": ["HabilidadeExtra1"],
  "analise": "Análise detalhada em 2-3 frases",
  "recomendacao": "forte | moderado | fraco | nao_recomendado",
  "pontosFortes": ["Ponto forte 1", "Ponto forte 2"],
  "pontosAtencao": ["Ponto de atenção 1"]
}

Retorne APENAS o JSON, sem explicações.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Limite de requisições excedido." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: "Erro ao calcular match score" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ success: false, error: "Resposta vazia da IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clean and parse JSON
    let jsonContent = content.trim();
    if (jsonContent.startsWith("```json")) jsonContent = jsonContent.slice(7);
    else if (jsonContent.startsWith("```")) jsonContent = jsonContent.slice(3);
    if (jsonContent.endsWith("```")) jsonContent = jsonContent.slice(0, -3);
    jsonContent = jsonContent.trim();

    let matchResult: MatchResult;
    try {
      matchResult = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return new Response(
        JSON.stringify({ success: false, error: "Erro ao processar resultado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Match score calculated: ${matchResult.scoreTotal}% - ${matchResult.recomendacao}`);

    return new Response(
      JSON.stringify({ success: true, data: matchResult }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in match-score function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
