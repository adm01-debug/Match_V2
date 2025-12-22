import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type MatchScoreRow = Database['public']['Tables']['match_scores']['Row'];

interface MatchScore extends MatchScoreRow {
  candidato?: { nome: string; email: string } | null;
}

interface CalcularMatchParams {
  candidatoId: string;
  vagaId: string;
}

export function useMatchScores(filtros?: { candidatoId?: string; vagaId?: string; minScore?: number }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: matchScores = [], isLoading, error } = useQuery({
    queryKey: ['match-scores', filtros],
    queryFn: async () => {
      let query = supabase
        .from('match_scores')
        .select(`
          *,
          candidato:candidatos(nome, email)
        `)
        .order('score_total', { ascending: false });

      if (filtros?.candidatoId) {
        query = query.eq('candidato_id', filtros.candidatoId);
      }
      if (filtros?.vagaId) {
        query = query.eq('vaga_id', filtros.vagaId);
      }
      if (filtros?.minScore) {
        query = query.gte('score_total', filtros.minScore);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as MatchScore[];
    },
  });

  // Buscar score específico
  const useMatchScore = (candidatoId?: string, vagaId?: string) => {
    return useQuery({
      queryKey: ['match-score', candidatoId, vagaId],
      queryFn: async () => {
        if (!candidatoId || !vagaId) return null;
        
        const { data, error } = await supabase
          .from('match_scores')
          .select('*')
          .eq('candidato_id', candidatoId)
          .eq('vaga_id', vagaId)
          .maybeSingle();

        if (error) throw error;
        return data as MatchScore | null;
      },
      enabled: !!candidatoId && !!vagaId,
    });
  };

  // Calcular match via Edge Function
  const calcularMatch = useMutation({
    mutationFn: async ({ candidatoId, vagaId }: CalcularMatchParams) => {
      const { data, error } = await supabase.functions.invoke('match-score', {
        body: { candidato_id: candidatoId, vaga_id: vagaId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match-scores'] });
      toast({ title: 'Match calculado!', description: 'Score atualizado com sucesso.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao calcular match', description: error.message, variant: 'destructive' });
    },
  });

  // Top candidatos para uma vaga
  const topCandidatos = (vagaId: string, limit = 10) => {
    return matchScores
      .filter(m => m.vaga_id === vagaId)
      .slice(0, limit);
  };

  // Estatísticas
  const stats = {
    total: matchScores.length,
    mediaScore: matchScores.length > 0 
      ? Math.round(matchScores.reduce((acc, m) => acc + m.score_total, 0) / matchScores.length) 
      : 0,
    altaRecomendacao: matchScores.filter(m => m.recomendacao === 'alta').length,
    mediaRecomendacao: matchScores.filter(m => m.recomendacao === 'media').length,
    baixaRecomendacao: matchScores.filter(m => m.recomendacao === 'baixa').length,
  };

  return {
    matchScores,
    isLoading,
    error,
    stats,
    topCandidatos,
    useMatchScore,
    calcularMatch: calcularMatch.mutateAsync,
    isCalculando: calcularMatch.isPending,
  };
}

export default useMatchScores;

export type UseMatchScoresReturn = ReturnType<typeof useMatchScores>;
