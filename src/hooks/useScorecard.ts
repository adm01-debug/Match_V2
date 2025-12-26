import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ScorecardScore { competency_id: string; score: number; }
interface Scorecard { id: string; candidato_id: string; entrevista_id: string; avaliador_id: string; scores: ScorecardScore[]; notes: string; recommendation: string; created_at: string; }

export function useScorecard(entrevistaId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: scorecards = [], isLoading } = useQuery({
    queryKey: ['scorecards', entrevistaId],
    queryFn: async () => {
      const query = supabase.from('scorecards').select('*, profiles(nome)');
      if (entrevistaId) query.eq('entrevista_id', entrevistaId);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as Scorecard[];
    },
    enabled: !!entrevistaId,
  });

  const createScorecard = useMutation({
    mutationFn: async (scorecard: Omit<Scorecard, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('scorecards').insert(scorecard).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorecards'] });
      toast({ title: 'Avaliação salva', description: 'Scorecard registrado com sucesso.' });
    },
  });

  const updateScorecard = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Scorecard> & { id: string }) => {
      const { error } = await supabase.from('scorecards').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorecards'] });
      toast({ title: 'Atualizado', description: 'Scorecard atualizado.' });
    },
  });

  const averageScore = scorecards.length > 0
    ? scorecards.reduce((acc, sc) => acc + sc.scores.reduce((a, s) => a + s.score, 0) / sc.scores.length, 0) / scorecards.length
    : 0;

  const consolidatedScores = scorecards.length > 0 ? scorecards[0].scores.map((_, i) => ({
    competency_id: scorecards[0].scores[i].competency_id,
    avgScore: scorecards.reduce((acc, sc) => acc + (sc.scores[i]?.score || 0), 0) / scorecards.length,
    scores: scorecards.map(sc => sc.scores[i]?.score || 0),
  })) : [];

  return { scorecards, isLoading, createScorecard: createScorecard.mutate, updateScorecard: updateScorecard.mutate, averageScore, consolidatedScores };
}

export default useScorecard;
