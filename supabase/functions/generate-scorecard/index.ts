/**
 * @module generate-scorecard
 * @description Edge function para geração de scorecard com IA
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScorecardInput {
  processoId: string;
  candidatoId: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // JWT auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token inválido' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { processoId, candidatoId }: ScorecardInput = await req.json();

    if (!processoId || !candidatoId) {
      return new Response(
        JSON.stringify({ error: "processoId e candidatoId são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Buscar dados do candidato
    const { data: candidato } = await supabase
      .from("candidatos")
      .select("*")
      .eq("id", candidatoId)
      .single();

    // 2. Buscar processo seletivo
    const { data: processo } = await supabase
      .from("processos_seletivos")
      .select("*, vagas (*)")
      .eq("id", processoId)
      .single();

    // 3. Buscar assessments do candidato
    const { data: assessments } = await supabase
      .from("assessment_respostas")
      .select("*, assessments (titulo, tipo)")
      .eq("candidato_id", candidatoId);

    // 4. Buscar resultados de behavioral assessments (substitui resultados_provas)
    const { data: behavioralResults } = await supabase
      .from("behavioral_assessment_results")
      .select("*")
      .eq("candidato_id", candidatoId);

    // 5. Buscar perfil do cargo (se existir)
    const { data: perfilCargo } = await supabase
      .from("perfis_cargo")
      .select("*")
      .eq("vaga_id", processo?.vaga_id)
      .maybeSingle();

    // 6. Calcular scores
    let scoreTecnico = 0;
    let scoreComportamental = 0;
    let scoreCultural = 0;
    let scoreExperiencia = 0;
    let discDominancia = 0;
    let discInfluencia = 0;
    let discEstabilidade = 0;
    let discConformidade = 0;

    // Score técnico baseado em provas
    if (provas && provas.length > 0) {
      const mediaProvas = provas.reduce((acc, p) => acc + (p.percentual || 0), 0) / provas.length;
      scoreTecnico = Math.round(mediaProvas);
    }

    // Scores de assessments
    if (assessments && assessments.length > 0) {
      for (const assessment of assessments) {
        const resultados = assessment.resultados as Record<string, unknown>;
        
        if (assessment.assessments?.tipo === "disc" && resultados) {
          discDominancia = (resultados.dominancia as number) || 0;
          discInfluencia = (resultados.influencia as number) || 0;
          discEstabilidade = (resultados.estabilidade as number) || 0;
          discConformidade = (resultados.conformidade as number) || 0;
          scoreComportamental = 75; // Base para quem completou DISC
        }
        
        if (assessment.assessments?.tipo === "cultural" && resultados) {
          scoreCultural = (resultados.fitGeral as number) || 70;
        }
      }
    }

    // Score de experiência baseado no currículo
    if (candidato) {
      const experiencias = candidato.experiencias as unknown[];
      const habilidades = candidato.habilidades as string[];
      
      // Pontuação por experiência
      const expScore = experiencias ? Math.min(experiencias.length * 15, 60) : 0;
      
      // Pontuação por habilidades
      const skillScore = habilidades ? Math.min(habilidades.length * 5, 40) : 0;
      
      scoreExperiencia = expScore + skillScore;
    }

    // Calcular fit com perfil (se existir)
    let fitPerfil = null;
    if (perfilCargo && discDominancia) {
      const diferencas = [
        Math.abs(discDominancia - (perfilCargo.perfil_dominancia || 25)),
        Math.abs(discInfluencia - (perfilCargo.perfil_influencia || 25)),
        Math.abs(discEstabilidade - (perfilCargo.perfil_estabilidade || 25)),
        Math.abs(discConformidade - (perfilCargo.perfil_conformidade || 25)),
      ];
      const mediaDesvio = diferencas.reduce((a, b) => a + b, 0) / 4;
      fitPerfil = Math.max(0, 100 - mediaDesvio * 2);
    }

    // Calcular score final ponderado
    const pesos = perfilCargo 
      ? { tec: perfilCargo.peso_tecnico || 40, comp: perfilCargo.peso_comportamental || 30, cult: perfilCargo.peso_cultural || 30 }
      : { tec: 40, comp: 30, cult: 30 };

    const scoreFinal = Math.round(
      (scoreTecnico * pesos.tec + scoreComportamental * pesos.comp + scoreCultural * pesos.cult) / 100
    );

    // Gerar análise
    const pontosFortes: string[] = [];
    const pontosDesenvolvimento: string[] = [];
    const riscos: string[] = [];

    if (scoreTecnico >= 80) pontosFortes.push("Excelente desempenho técnico");
    else if (scoreTecnico < 50) pontosDesenvolvimento.push("Necessita desenvolvimento técnico");

    if (scoreComportamental >= 80) pontosFortes.push("Perfil comportamental alinhado");
    else if (scoreComportamental < 50) pontosDesenvolvimento.push("Perfil comportamental a desenvolver");

    if (scoreCultural >= 80) pontosFortes.push("Alto fit cultural");
    else if (scoreCultural < 50) riscos.push("Baixo alinhamento cultural");

    if (fitPerfil && fitPerfil >= 80) pontosFortes.push("Perfil DISC adequado para a função");
    else if (fitPerfil && fitPerfil < 50) riscos.push("Perfil DISC distante do ideal");

    // Determinar recomendação
    let recomendacao: "aprovar" | "reprovar" | "avaliar_mais" = "avaliar_mais";
    const notaMinima = perfilCargo?.nota_minima_aprovacao || 70;

    if (scoreFinal >= notaMinima && riscos.length === 0) {
      recomendacao = "aprovar";
    } else if (scoreFinal < 50 || riscos.length >= 2) {
      recomendacao = "reprovar";
    }

    const justificativa = 
      recomendacao === "aprovar" 
        ? `Candidato atende aos critérios mínimos (${scoreFinal}% >= ${notaMinima}%) sem riscos identificados.`
        : recomendacao === "reprovar"
        ? `Candidato não atende aos critérios mínimos ou apresenta riscos significativos.`
        : `Candidato próximo dos critérios, recomenda-se avaliação adicional.`;

    // 7. Salvar/Atualizar scorecard
    const { data: existingScorecard } = await supabase
      .from("scorecards")
      .select("id")
      .eq("processo_id", processoId)
      .maybeSingle();

    const scorecardData = {
      processo_id: processoId,
      candidato_id: candidatoId,
      perfil_cargo_id: perfilCargo?.id || null,
      score_tecnico: scoreTecnico,
      score_comportamental: scoreComportamental,
      score_cultural: scoreCultural,
      score_experiencia: scoreExperiencia,
      score_final: scoreFinal,
      disc_dominancia: discDominancia,
      disc_influencia: discInfluencia,
      disc_estabilidade: discEstabilidade,
      disc_conformidade: discConformidade,
      fit_perfil: fitPerfil,
      pontos_fortes: pontosFortes,
      pontos_desenvolvimento: pontosDesenvolvimento,
      riscos,
      recomendacao,
      justificativa,
      gerado_por: "ai",
      atualizado_em: new Date().toISOString(),
    };

    let scorecard;
    if (existingScorecard) {
      const { data, error } = await supabase
        .from("scorecards")
        .update(scorecardData)
        .eq("id", existingScorecard.id)
        .select()
        .single();
      
      if (error) throw error;
      scorecard = data;
    } else {
      const { data, error } = await supabase
        .from("scorecards")
        .insert(scorecardData)
        .select()
        .single();
      
      if (error) throw error;
      scorecard = data;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        scorecard,
        summary: {
          scoreFinal,
          recomendacao,
          pontosFortes: pontosFortes.length,
          riscos: riscos.length,
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Erro ao gerar scorecard:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
