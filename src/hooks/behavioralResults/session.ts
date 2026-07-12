import { useState } from 'react';
import type { PredictiveFitAnalysis, AuthenticityMetrics } from '@/config/behavioralPillars';
import type { ScenarioResponse } from '@/components/assessments/ImmersiveScenarioPlayer';
import { EMPTY_PILLAR_SCORES } from './types';
import { useSaveBehavioralResult } from './mutations';

export function useBehavioralAssessment() {
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const saveMutation = useSaveBehavioralResult();

  const startAssessment = async (candidatoId?: string, processoId?: string, vagaId?: string) => {
    setStartTime(new Date());

    const result = await saveMutation.mutateAsync({
      candidato_id: candidatoId,
      processo_id: processoId,
      vaga_id: vagaId,
      ...EMPTY_PILLAR_SCORES,
      respostas: [],
      status: 'em_andamento',
      iniciado_em: new Date().toISOString(),
    });

    if (result?.id) setCurrentAssessmentId(result.id);
    return result;
  };

  const completeAssessment = async (
    scores: Record<string, number>,
    responses: ScenarioResponse[],
    authenticity?: AuthenticityMetrics,
    predictiveFit?: PredictiveFitAnalysis,
    cenariosRespondidos?: number,
    cenariosPulados?: number
  ) => {
    const duration = startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : undefined;
    const values = Object.values(scores);
    const scoreGeral = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    const totalHesitacoes = responses.reduce((acc, r) => acc + r.hesitations, 0);

    return saveMutation.mutateAsync({
      id: currentAssessmentId || undefined,
      score_resiliencia: scores['resiliencia'] || 0,
      score_integridade: scores['integridade'] || 0,
      score_colaboracao: scores['colaboracao'] || 0,
      score_lideranca: scores['lideranca'] || 0,
      score_adaptabilidade: scores['adaptabilidade'] || 0,
      score_proatividade: scores['proatividade'] || 0,
      score_comunicacao: scores['comunicacao'] || 0,
      score_pensamento_critico: scores['pensamento_critico'] || 0,
      score_inteligencia_emocional: scores['inteligencia_emocional'] || 0,
      score_orientacao_resultados: scores['orientacao_resultados'] || 0,
      score_geral: scoreGeral,
      tempo_medio_resposta: authenticity?.tempoMedioResposta,
      variacao_tempo: authenticity?.variacaoTempo,
      respostas_socialmente_desejaveis: authenticity?.respostasSocialmenteDesejaveis,
      consistencia_interna: authenticity?.consistenciaInterna,
      total_hesitacoes: totalHesitacoes,
      fit_geral: predictiveFit?.fitGeral,
      fit_por_pilar: predictiveFit?.fitPorPilar,
      riscos: predictiveFit?.riscos,
      potencializadores: predictiveFit?.potencializadores,
      recomendacao: predictiveFit?.recomendacao,
      justificativa_fit: predictiveFit?.justificativa,
      respostas: responses,
      cenarios_respondidos: cenariosRespondidos,
      cenarios_pulados: cenariosPulados,
      duracao_total: duration,
      status: 'completo',
      finalizado_em: new Date().toISOString(),
    });
  };

  const abandonAssessment = async () => {
    if (!currentAssessmentId) return;
    return saveMutation.mutateAsync({
      id: currentAssessmentId,
      ...EMPTY_PILLAR_SCORES,
      respostas: [],
      status: 'abandonado',
    });
  };

  return {
    currentAssessmentId,
    isLoading: saveMutation.isPending,
    startAssessment,
    completeAssessment,
    abandonAssessment,
  };
}
