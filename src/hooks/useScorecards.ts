/**
 * @module useScorecards
 * @description Hooks para gerenciar scorecards unificados de candidatos
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Scorecard, ScorecardCompetencia } from '@/types/selection';

// ============================================
// FETCH SCORECARDS
// ============================================

export function useScorecards(vagaId?: string) {
  return useQuery({
    queryKey: ['scorecards', vagaId],
    queryFn: async (): Promise<Scorecard[]> => {
      let query = supabase
        .from('scorecards')
        .select(`
          *,
          processos_seletivos!inner (candidato_nome, vaga_titulo, vaga_id)
        `)
        .order('score_final', { ascending: false });

      if (vagaId) {
        query = query.eq('processos_seletivos.vaga_id', vagaId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(row => ({
        id: row.id,
        processoId: row.processo_id,
        candidatoId: row.candidato_id,
        perfilCargoId: row.perfil_cargo_id,
        scoreTecnico: row.score_tecnico ? Number(row.score_tecnico) : undefined,
        scoreComportamental: row.score_comportamental ? Number(row.score_comportamental) : undefined,
        scoreCultural: row.score_cultural ? Number(row.score_cultural) : undefined,
        scoreExperiencia: row.score_experiencia ? Number(row.score_experiencia) : undefined,
        scoreFinal: row.score_final ? Number(row.score_final) : undefined,
        discDominancia: row.disc_dominancia,
        discInfluencia: row.disc_influencia,
        discEstabilidade: row.disc_estabilidade,
        discConformidade: row.disc_conformidade,
        fitPerfil: row.fit_perfil ? Number(row.fit_perfil) : undefined,
        pontosFortes: row.pontos_fortes,
        pontosDesenvolvimento: row.pontos_desenvolvimento,
        riscos: row.riscos,
        recomendacao: row.recomendacao as Scorecard['recomendacao'],
        justificativa: row.justificativa,
        geradoPor: row.gerado_por as Scorecard['geradoPor'],
        atualizadoEm: row.atualizado_em,
        candidatoNome: (row.processos_seletivos as { candidato_nome: string })?.candidato_nome,
        vagaTitulo: (row.processos_seletivos as { vaga_titulo: string })?.vaga_titulo,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useScorecard(processoId: string) {
  return useQuery({
    queryKey: ['scorecards', 'processo', processoId],
    queryFn: async (): Promise<Scorecard | null> => {
      const { data, error } = await supabase
        .from('scorecards')
        .select(`
          *,
          processos_seletivos (candidato_nome, vaga_titulo)
        `)
        .eq('processo_id', processoId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Buscar competências
      const { data: competencias } = await supabase
        .from('scorecard_competencias')
        .select('*')
        .eq('scorecard_id', data.id);

      return {
        id: data.id,
        processoId: data.processo_id,
        candidatoId: data.candidato_id,
        perfilCargoId: data.perfil_cargo_id,
        scoreTecnico: data.score_tecnico ? Number(data.score_tecnico) : undefined,
        scoreComportamental: data.score_comportamental ? Number(data.score_comportamental) : undefined,
        scoreCultural: data.score_cultural ? Number(data.score_cultural) : undefined,
        scoreExperiencia: data.score_experiencia ? Number(data.score_experiencia) : undefined,
        scoreFinal: data.score_final ? Number(data.score_final) : undefined,
        discDominancia: data.disc_dominancia,
        discInfluencia: data.disc_influencia,
        discEstabilidade: data.disc_estabilidade,
        discConformidade: data.disc_conformidade,
        fitPerfil: data.fit_perfil ? Number(data.fit_perfil) : undefined,
        pontosFortes: data.pontos_fortes,
        pontosDesenvolvimento: data.pontos_desenvolvimento,
        riscos: data.riscos,
        recomendacao: data.recomendacao as Scorecard['recomendacao'],
        justificativa: data.justificativa,
        geradoPor: data.gerado_por as Scorecard['geradoPor'],
        atualizadoEm: data.atualizado_em,
        candidatoNome: (data.processos_seletivos as { candidato_nome: string })?.candidato_nome,
        vagaTitulo: (data.processos_seletivos as { vaga_titulo: string })?.vaga_titulo,
        competencias: (competencias || []).map(c => ({
          id: c.id,
          scorecardId: c.scorecard_id,
          competenciaId: c.competencia_id,
          criterioId: c.criterio_id,
          nome: c.nome,
          tipo: c.tipo,
          nota: c.nota ? Number(c.nota) : undefined,
          peso: Number(c.peso),
          evidencias: c.evidencias,
          fonte: c.fonte as ScorecardCompetencia['fonte'],
        })),
      };
    },
    enabled: !!processoId,
    staleTime: 1000 * 60 * 5,
  });
}

// ============================================
// CREATE/UPDATE SCORECARD
// ============================================

export function useCreateScorecard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scorecard: Partial<Scorecard>) => {
      const { data, error } = await supabase
        .from('scorecards')
        .insert({
          processo_id: scorecard.processoId,
          candidato_id: scorecard.candidatoId,
          perfil_cargo_id: scorecard.perfilCargoId,
          score_tecnico: scorecard.scoreTecnico,
          score_comportamental: scorecard.scoreComportamental,
          score_cultural: scorecard.scoreCultural,
          score_experiencia: scorecard.scoreExperiencia,
          score_final: scorecard.scoreFinal,
          disc_dominancia: scorecard.discDominancia,
          disc_influencia: scorecard.discInfluencia,
          disc_estabilidade: scorecard.discEstabilidade,
          disc_conformidade: scorecard.discConformidade,
          fit_perfil: scorecard.fitPerfil,
          pontos_fortes: scorecard.pontosFortes,
          pontos_desenvolvimento: scorecard.pontosDesenvolvimento,
          riscos: scorecard.riscos,
          recomendacao: scorecard.recomendacao,
          justificativa: scorecard.justificativa,
          gerado_por: scorecard.geradoPor || 'sistema',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorecards'] });
    },
  });
}

export function useUpdateScorecard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Scorecard> & { id: string }) => {
      const { error } = await supabase
        .from('scorecards')
        .update({
          score_tecnico: updates.scoreTecnico,
          score_comportamental: updates.scoreComportamental,
          score_cultural: updates.scoreCultural,
          score_experiencia: updates.scoreExperiencia,
          score_final: updates.scoreFinal,
          disc_dominancia: updates.discDominancia,
          disc_influencia: updates.discInfluencia,
          disc_estabilidade: updates.discEstabilidade,
          disc_conformidade: updates.discConformidade,
          fit_perfil: updates.fitPerfil,
          pontos_fortes: updates.pontosFortes,
          pontos_desenvolvimento: updates.pontosDesenvolvimento,
          riscos: updates.riscos,
          recomendacao: updates.recomendacao,
          justificativa: updates.justificativa,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorecards'] });
    },
  });
}

// ============================================
// GENERATE SCORECARD WITH AI
// ============================================

export function useGenerateScorecardAI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ processoId, candidatoId }: { processoId: string; candidatoId: string }) => {
      const { data, error } = await supabase.functions.invoke('generate-scorecard', {
        body: { processoId, candidatoId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorecards'] });
    },
  });
}

// ============================================
// COMPARE CANDIDATES
// ============================================

export function useCompareCandidates() {
  return useMutation({
    mutationFn: async ({ 
      vagaId, 
      candidatosIds 
    }: { 
      vagaId: string; 
      candidatosIds: string[] 
    }) => {
      // Buscar scorecards dos candidatos
      const { data: scorecards, error } = await supabase
        .from('scorecards')
        .select(`
          *,
          processos_seletivos (candidato_nome, vaga_titulo)
        `)
        .in('candidato_id', candidatosIds);

      if (error) throw error;

      // Ordenar por score final
      const ranking = (scorecards || [])
        .sort((a, b) => (Number(b.score_final) || 0) - (Number(a.score_final) || 0))
        .map((s, idx) => ({
          posicao: idx + 1,
          candidatoId: s.candidato_id,
          candidatoNome: (s.processos_seletivos as { candidato_nome: string })?.candidato_nome || '',
          scoreFinal: Number(s.score_final) || 0,
          scores: {
            tecnico: Number(s.score_tecnico) || 0,
            comportamental: Number(s.score_comportamental) || 0,
            cultural: Number(s.score_cultural) || 0,
            experiencia: Number(s.score_experiencia) || 0,
          },
        }));

      // Salvar comparativo
      await supabase.from('comparativos_candidatos').insert({
        vaga_id: vagaId,
        candidatos_ids: candidatosIds,
        resultado: { ranking },
      });

      return { ranking };
    },
  });
}

export default {
  useScorecards,
  useScorecard,
  useCreateScorecard,
  useUpdateScorecard,
  useGenerateScorecardAI,
  useCompareCandidates,
};
