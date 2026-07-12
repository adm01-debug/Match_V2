import { logger } from '@/services/logger';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import type { BehavioralAssessmentResult } from './types';

export function useSaveBehavioralResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (result: BehavioralAssessmentResult) => {
      const payload = {
        candidato_id: result.candidato_id,
        processo_id: result.processo_id,
        vaga_id: result.vaga_id,
        score_resiliencia: result.score_resiliencia,
        score_integridade: result.score_integridade,
        score_colaboracao: result.score_colaboracao,
        score_lideranca: result.score_lideranca,
        score_adaptabilidade: result.score_adaptabilidade,
        score_proatividade: result.score_proatividade,
        score_comunicacao: result.score_comunicacao,
        score_pensamento_critico: result.score_pensamento_critico,
        score_inteligencia_emocional: result.score_inteligencia_emocional,
        score_orientacao_resultados: result.score_orientacao_resultados,
        score_geral: result.score_geral,
        tempo_medio_resposta: result.tempo_medio_resposta,
        variacao_tempo: result.variacao_tempo,
        respostas_socialmente_desejaveis: result.respostas_socialmente_desejaveis,
        consistencia_interna: result.consistencia_interna,
        total_hesitacoes: result.total_hesitacoes,
        fit_geral: result.fit_geral,
        fit_por_pilar: result.fit_por_pilar as unknown as Json,
        riscos: result.riscos as unknown as Json,
        potencializadores: result.potencializadores as unknown as Json,
        recomendacao: result.recomendacao,
        justificativa_fit: result.justificativa_fit,
        respostas: result.respostas as unknown as Json,
        cenarios_respondidos: result.cenarios_respondidos,
        cenarios_pulados: result.cenarios_pulados,
        duracao_total: result.duracao_total,
        status: result.status,
        iniciado_em: result.iniciado_em,
        finalizado_em: result.finalizado_em,
      };

      const query = result.id
        ? supabase.from('avaliacoes_comportamentais_resultados').update(payload).eq('id', result.id)
        : supabase.from('avaliacoes_comportamentais_resultados').insert(payload);

      const { data, error } = await query.select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['behavioral-results'] });
      queryClient.invalidateQueries({ queryKey: ['behavioral-results-all'] });
      toast.success('Resultado da avaliação salvo com sucesso!');
      return data;
    },
    onError: (error) => {
      logger.error('Erro ao salvar resultado:', error);
      toast.error('Erro ao salvar resultado da avaliação');
    },
  });
}
