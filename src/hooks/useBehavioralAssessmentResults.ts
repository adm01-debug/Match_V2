/**
 * @fileoverview Hook para gerenciar resultados de avaliações comportamentais imersivas
 * @module useBehavioralAssessmentResults
 * 
 * Este hook gerencia a tabela avaliacoes_comportamentais_resultados para
 * os 10 Pilares Comportamentais (avaliação imersiva com cenários).
 * 
 * DIFERENÇA IMPORTANTE:
 * - useBehavioralAssessments.ts → tabela behavioral_assessment_results (10 ferramentas DISC, VAK, etc)
 * - useBehavioralAssessmentResults.ts → tabela avaliacoes_comportamentais_resultados (pilares imersivos)
 */

import { logger } from '@/services/logger';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { PredictiveFitAnalysis, AuthenticityMetrics } from '@/config/behavioralPillars';
import type { ScenarioResponse } from '@/components/assessments/ImmersiveScenarioPlayer';
import type { Json } from '@/integrations/supabase/types';

export interface BehavioralAssessmentResult {
  id?: string;
  candidato_id?: string;
  processo_id?: string;
  vaga_id?: string;
  
  // Scores por pilar
  score_resiliencia: number;
  score_integridade: number;
  score_colaboracao: number;
  score_lideranca: number;
  score_adaptabilidade: number;
  score_proatividade: number;
  score_comunicacao: number;
  score_pensamento_critico: number;
  score_inteligencia_emocional: number;
  score_orientacao_resultados: number;
  score_geral: number;
  
  // Métricas de autenticidade
  tempo_medio_resposta?: number;
  variacao_tempo?: number;
  respostas_socialmente_desejaveis?: number;
  consistencia_interna?: number;
  total_hesitacoes?: number;
  
  // Fit preditivo
  fit_geral?: number;
  fit_por_pilar?: Record<string, { empresa: number; candidato: number; gap: number }>;
  riscos?: PredictiveFitAnalysis['riscos'];
  potencializadores?: PredictiveFitAnalysis['potencializadores'];
  recomendacao?: string;
  justificativa_fit?: string;
  
  // Respostas
  respostas: ScenarioResponse[];
  
  // Metadados
  cenarios_respondidos?: number;
  cenarios_pulados?: number;
  duracao_total?: number;
  status: 'em_andamento' | 'completo' | 'abandonado';
  iniciado_em?: string;
  finalizado_em?: string;
}

export interface CompanyBehavioralProfile {
  id?: string;
  vaga_id?: string;
  nome: string;
  descricao?: string;
  peso_resiliencia: number;
  peso_integridade: number;
  peso_colaboracao: number;
  peso_lideranca: number;
  peso_adaptabilidade: number;
  peso_proatividade: number;
  peso_comunicacao: number;
  peso_pensamento_critico: number;
  peso_inteligencia_emocional: number;
  peso_orientacao_resultados: number;
  dealbreakers?: Array<{ pilarId: string; minimo: number }>;
  dimensoes_culturais?: Record<string, number>;
  ativo?: boolean;
}

// Hook para buscar resultados de um candidato
export function useCandidateBehavioralResults(candidatoId?: string) {
  return useQuery({
    queryKey: ['behavioral-results', candidatoId],
    queryFn: async () => {
      if (!candidatoId) return null;
      
      const { data, error } = await supabase
        .from('avaliacoes_comportamentais_resultados')
        .select('*')
        .eq('candidato_id', candidatoId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!candidatoId,
  });
}

// Hook para buscar todos os resultados
export function useAllBehavioralResults(filters?: {
  status?: string;
  vagaId?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['behavioral-results-all', filters],
    queryFn: async () => {
      let query = supabase
        .from('avaliacoes_comportamentais_resultados')
        .select(`
          *,
          candidatos:candidato_id(id, nome, email),
          vagas:vaga_id(id, titulo),
          processos_seletivos:processo_id(id, etapa_atual)
        `)
        .order('created_at', { ascending: false });
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.vagaId) {
        query = query.eq('vaga_id', filters.vagaId);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

// Hook para salvar resultados
export function useSaveBehavioralResult() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (result: BehavioralAssessmentResult) => {
      // Convert respostas to Json type
      const respostasJson = result.respostas as unknown as Json;
      const fitPorPilarJson = result.fit_por_pilar as unknown as Json;
      const riscosJson = result.riscos as unknown as Json;
      const potencializadoresJson = result.potencializadores as unknown as Json;
      
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
        fit_por_pilar: fitPorPilarJson,
        riscos: riscosJson,
        potencializadores: potencializadoresJson,
        recomendacao: result.recomendacao,
        justificativa_fit: result.justificativa_fit,
        respostas: respostasJson,
        cenarios_respondidos: result.cenarios_respondidos,
        cenarios_pulados: result.cenarios_pulados,
        duracao_total: result.duracao_total,
        status: result.status,
        iniciado_em: result.iniciado_em,
        finalizado_em: result.finalizado_em,
      };

      if (result.id) {
        // Update existing
        const { data, error } = await supabase
          .from('avaliacoes_comportamentais_resultados')
          .update(payload)
          .eq('id', result.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('avaliacoes_comportamentais_resultados')
          .insert(payload)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
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

// Hook para gerenciar perfis de empresa
export function useCompanyBehavioralProfiles(vagaId?: string) {
  return useQuery({
    queryKey: ['company-behavioral-profiles', vagaId],
    queryFn: async () => {
      let query = supabase
        .from('perfis_comportamentais_empresa')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });
      
      if (vagaId) {
        query = query.eq('vaga_id', vagaId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveCompanyProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profile: CompanyBehavioralProfile) => {
      const dealbreakersJson = profile.dealbreakers as unknown as Json;
      const dimensoesJson = profile.dimensoes_culturais as unknown as Json;
      
      const payload = {
        vaga_id: profile.vaga_id,
        nome: profile.nome,
        descricao: profile.descricao,
        peso_resiliencia: profile.peso_resiliencia,
        peso_integridade: profile.peso_integridade,
        peso_colaboracao: profile.peso_colaboracao,
        peso_lideranca: profile.peso_lideranca,
        peso_adaptabilidade: profile.peso_adaptabilidade,
        peso_proatividade: profile.peso_proatividade,
        peso_comunicacao: profile.peso_comunicacao,
        peso_pensamento_critico: profile.peso_pensamento_critico,
        peso_inteligencia_emocional: profile.peso_inteligencia_emocional,
        peso_orientacao_resultados: profile.peso_orientacao_resultados,
        dealbreakers: dealbreakersJson,
        dimensoes_culturais: dimensoesJson,
        ativo: profile.ativo ?? true,
      };

      if (profile.id) {
        const { data, error } = await supabase
          .from('perfis_comportamentais_empresa')
          .update(payload)
          .eq('id', profile.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('perfis_comportamentais_empresa')
          .insert(payload)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-behavioral-profiles'] });
      toast.success('Perfil da empresa salvo com sucesso!');
    },
    onError: (error) => {
      logger.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil da empresa');
    },
  });
}

// Hook principal para gerenciar uma avaliação em andamento
export function useBehavioralAssessment() {
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const saveMutation = useSaveBehavioralResult();
  
  const startAssessment = async (candidatoId?: string, processoId?: string, vagaId?: string) => {
    setStartTime(new Date());
    
    // Criar registro inicial
    const result = await saveMutation.mutateAsync({
      candidato_id: candidatoId,
      processo_id: processoId,
      vaga_id: vagaId,
      score_resiliencia: 0,
      score_integridade: 0,
      score_colaboracao: 0,
      score_lideranca: 0,
      score_adaptabilidade: 0,
      score_proatividade: 0,
      score_comunicacao: 0,
      score_pensamento_critico: 0,
      score_inteligencia_emocional: 0,
      score_orientacao_resultados: 0,
      score_geral: 0,
      respostas: [],
      status: 'em_andamento',
      iniciado_em: new Date().toISOString(),
    });
    
    if (result?.id) {
      setCurrentAssessmentId(result.id);
    }
    
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
    
    const scoreGeral = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
    
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
      score_resiliencia: 0,
      score_integridade: 0,
      score_colaboracao: 0,
      score_lideranca: 0,
      score_adaptabilidade: 0,
      score_proatividade: 0,
      score_comunicacao: 0,
      score_pensamento_critico: 0,
      score_inteligencia_emocional: 0,
      score_orientacao_resultados: 0,
      score_geral: 0,
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
