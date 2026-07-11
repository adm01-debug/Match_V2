/**
 * @fileoverview Hook para gerenciar avaliações comportamentais das 10 ferramentas
 * @module useBehavioralAssessments
 * 
 * Integra com a tabela behavioral_assessment_results no Supabase
 */

import { logger } from '@/services/logger';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BehavioralResult } from '@/types/behavioral';
import type { Json } from '@/integrations/supabase/types';

export interface BehavioralAssessmentRecord {
  id: string;
  candidato_id: string | null;
  processo_id: string | null;
  tool_id: string;
  tool_name: string;
  answers: Json;
  results: Json;
  primary_result: string | null;
  secondary_result: string | null;
  score: number | null;
  time_spent: number;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Hook para buscar resultados de avaliações comportamentais de um candidato
 * @param candidatoId - ID do candidato (opcional)
 */
export function useCandidateBehavioralResults(candidatoId: string | undefined) {
  return useQuery({
    queryKey: ['behavioral-results', candidatoId],
    queryFn: async () => {
      if (!candidatoId) return [];
      
      const { data, error } = await supabase
        .from('behavioral_assessment_results')
        .select('*')
        .eq('candidato_id', candidatoId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching behavioral results:', error);
        throw error;
      }
      return data as BehavioralAssessmentRecord[];
    },
    enabled: !!candidatoId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook para buscar resultados por processo seletivo
 */
export function useProcessoBehavioralResults(processoId: string | undefined) {
  return useQuery({
    queryKey: ['behavioral-results-processo', processoId],
    queryFn: async () => {
      if (!processoId) return [];
      
      const { data, error } = await supabase
        .from('behavioral_assessment_results')
        .select('*')
        .eq('processo_id', processoId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BehavioralAssessmentRecord[];
    },
    enabled: !!processoId,
  });
}

/**
 * Hook para salvar resultado de avaliação comportamental
 * Salva na tabela behavioral_assessment_results no Supabase
 */
export function useSaveBehavioralResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      candidatoId?: string;
      processoId?: string;
      toolId: string;
      toolName: string;
      answers: Record<string, string | number>;
      results: BehavioralResult;
      timeSpent: number;
    }) => {
      // Calculate average score from all dimension scores
      const scoreValues = data.results.scores ? Object.values(data.results.scores) : [];
      const avgScore = scoreValues.length > 0 
        ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
        : null;

      const { data: result, error } = await supabase
        .from('behavioral_assessment_results')
        .insert({
          candidato_id: data.candidatoId || null,
          processo_id: data.processoId || null,
          tool_id: data.toolId,
          tool_name: data.toolName,
          answers: data.answers as unknown as Json,
          results: data.results as unknown as Json,
          primary_result: data.results.primaryProfile || null,
          secondary_result: data.results.secondaryProfile || null,
          score: avgScore,
          time_spent: data.timeSpent,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        logger.error('Error saving behavioral result:', error);
        throw error;
      }
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidate all related queries to ensure fresh data
      queryClient.invalidateQueries({ 
        queryKey: ['behavioral-results', variables.candidatoId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['behavioral-results-processo', variables.processoId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['completed-tools', variables.candidatoId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['behavioral-stats'] 
      });
    },
    onError: (error) => {
      logger.error('Failed to save behavioral result:', error);
    },
  });
}

/**
 * Hook para buscar todas as avaliações completadas (para estatísticas)
 */
export function useBehavioralStats() {
  return useQuery({
    queryKey: ['behavioral-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('behavioral_assessment_results')
        .select('tool_id, tool_name, score, time_spent')
        .not('completed_at', 'is', null);

      if (error) throw error;

      // Agrupar por ferramenta
      const statsByTool = (data || []).reduce((acc, result) => {
        if (!acc[result.tool_id]) {
          acc[result.tool_id] = {
            toolId: result.tool_id,
            toolName: result.tool_name,
            count: 0,
            avgScore: 0,
            avgTime: 0,
            totalScore: 0,
            totalTime: 0,
          };
        }
        const stat = acc[result.tool_id];
        if (stat) {
          stat.count++;
          stat.totalScore += result.score || 0;
          stat.totalTime += result.time_spent || 0;
        }
        return acc;
      }, {} as Record<string, {
        toolId: string;
        toolName: string;
        count: number;
        avgScore: number;
        avgTime: number;
        totalScore: number;
        totalTime: number;
      }>);

      // Calcular médias
      Object.values(statsByTool).forEach(stat => {
        stat.avgScore = stat.count > 0 ? stat.totalScore / stat.count : 0;
        stat.avgTime = stat.count > 0 ? stat.totalTime / stat.count : 0;
      });

      return {
        totalAssessments: data?.length || 0,
        byTool: Object.values(statsByTool),
      };
    },
  });
}

/**
 * Hook para verificar quais ferramentas um candidato já completou
 */
export function useCompletedTools(candidatoId: string | undefined) {
  return useQuery({
    queryKey: ['completed-tools', candidatoId],
    queryFn: async () => {
      if (!candidatoId) return [];
      
      const { data, error } = await supabase
        .from('behavioral_assessment_results')
        .select('tool_id')
        .eq('candidato_id', candidatoId)
        .not('completed_at', 'is', null);

      if (error) throw error;
      return data?.map(r => r.tool_id) || [];
    },
    enabled: !!candidatoId,
  });
}
