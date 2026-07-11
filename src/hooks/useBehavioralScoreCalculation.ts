import { useMemo } from 'react';
import type { ScenarioResponse } from '@/components/assessments/ImmersiveScenarioPlayer';
import {
  BEHAVIORAL_PILLARS,
  IMMERSIVE_SCENARIOS,
  type CompanyProfile,
  type PredictiveFitAnalysis,
  type AuthenticityMetrics,
} from '@/config/behavioralPillars';

const DEMO_SCORES: Record<string, number> = {
  resiliencia: 78, integridade: 92, colaboracao: 85, lideranca: 72,
  adaptabilidade: 88, proatividade: 76, comunicacao: 81,
  pensamento_critico: 89, inteligencia_emocional: 74, orientacao_resultados: 83,
};

function generateJustificativa(fit: number, riscos: number, pontos: number): string {
  if (fit >= 80) return `Excelente alinhamento comportamental com a cultura da empresa. ${pontos} áreas onde o candidato supera expectativas.`;
  if (fit >= 65) return `Bom alinhamento geral com alguns pontos de atenção. ${riscos} área(s) podem requerer desenvolvimento.`;
  if (fit >= 50) return `Alinhamento moderado. Recomenda-se análise detalhada das ${riscos} áreas de gap identificadas.`;
  return `Alinhamento abaixo do esperado. ${riscos} áreas críticas de divergência com a cultura organizacional.`;
}

export function useBehavioralScoreCalculation(
  responses: ScenarioResponse[],
  companyProfile: CompanyProfile | null,
) {
  const calculatedScores = useMemo(() => {
    if (responses.length === 0) return DEMO_SCORES;

    const scores: Record<string, number[]> = {};
    BEHAVIORAL_PILLARS.forEach(p => { scores[p.id] = []; });

    responses.forEach(response => {
      const scenario = IMMERSIVE_SCENARIOS.find(s => s.id === response.scenarioId);
      if (!scenario) return;
      const option = scenario.opcoes.find(o => o.id === response.selectedOption);
      if (!option) return;
      Object.entries(option.impacto).forEach(([pilarId, impact]) => {
        const normalized = ((impact + 3) / 6) * 100;
        if (scores[pilarId]) scores[pilarId].push(normalized);
      });
    });

    const finalScores: Record<string, number> = {};
    Object.entries(scores).forEach(([pilarId, values]) => {
      finalScores[pilarId] = values.length > 0
        ? values.reduce((a, b) => a + b, 0) / values.length
        : 50;
    });
    return finalScores;
  }, [responses]);

  const authenticityMetrics = useMemo((): AuthenticityMetrics | undefined => {
    if (responses.length === 0) return undefined;
    const times = responses.map(r => r.timeToRespond);
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const variance = times.reduce((acc, t) => acc + Math.pow(t - avgTime, 2), 0) / times.length;

    let sociallyDesirable = 0;
    responses.forEach(response => {
      const scenario = IMMERSIVE_SCENARIOS.find(s => s.id === response.scenarioId);
      const option = scenario?.opcoes.find(o => o.id === response.selectedOption);
      if (option?.socialmenteDesejavel) sociallyDesirable++;
    });

    return {
      tempoMedioResposta: avgTime,
      variacaoTempo: Math.sqrt(variance),
      respostasSocialmenteDesejaveis: sociallyDesirable,
      consistenciaInterna: 0.85,
      complexidadeResposta: 0.7,
      contradicoes: [],
    };
  }, [responses]);

  const predictiveFit = useMemo((): PredictiveFitAnalysis | undefined => {
    if (!companyProfile) return undefined;

    const fitPorPilar: Record<string, { empresa: number; candidato: number; gap: number }> = {};
    let totalGap = 0;

    BEHAVIORAL_PILLARS.forEach(pilar => {
      const empresaPeso = (companyProfile.pilaresValorizados[pilar.id] || 5) * 10;
      const candidatoScore = calculatedScores[pilar.id] || 50;
      const gap = Math.abs(candidatoScore - empresaPeso);
      fitPorPilar[pilar.id] = { empresa: empresaPeso, candidato: candidatoScore, gap };
      totalGap += gap * (companyProfile.pilaresValorizados[pilar.id] || 5) / 10;
    });

    const fitGeral = Math.max(0, 100 - (totalGap / 10));
    const riscos: PredictiveFitAnalysis['riscos'] = [];
    const potencializadores: PredictiveFitAnalysis['potencializadores'] = [];

    Object.entries(fitPorPilar).forEach(([pilarId, data]) => {
      const pilar = BEHAVIORAL_PILLARS.find(p => p.id === pilarId);
      if (!pilar) return;
      if (data.candidato > data.empresa + 20) {
        potencializadores.push({
          pilar: pilar.nome,
          descricao: `Excede expectativa em ${(data.candidato - data.empresa).toFixed(0)} pontos`,
        });
      } else if (data.candidato < data.empresa - 20) {
        const severidade = data.gap > 40 ? 'alto' : data.gap > 25 ? 'medio' : 'baixo';
        riscos.push({
          pilar: pilar.nome,
          severidade,
          descricao: `Gap de ${data.gap.toFixed(0)} pontos em relação à expectativa`,
        });
      }
    });

    const recomendacao: PredictiveFitAnalysis['recomendacao'] =
      fitGeral >= 80 ? 'fortemente_recomendado' :
      fitGeral >= 65 ? 'recomendado' :
      fitGeral >= 50 ? 'neutro' :
      fitGeral >= 35 ? 'cautela' : 'nao_recomendado';

    return {
      fitGeral,
      fitPorPilar,
      riscos,
      potencializadores,
      recomendacao,
      justificativa: generateJustificativa(fitGeral, riscos.length, potencializadores.length),
    };
  }, [companyProfile, calculatedScores]);

  return { calculatedScores, authenticityMetrics, predictiveFit };
}
