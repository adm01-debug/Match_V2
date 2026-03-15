import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useScorecard(processoId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: scorecard, isLoading } = useQuery({
    queryKey: ['scorecard', processoId],
    queryFn: async () => {
      if (!processoId) return null;
      const { data, error } = await supabase
        .from('scorecards')
        .select('*, scorecard_competencias(*)')
        .eq('processo_id', processoId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!processoId,
  });

  const createScorecard = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { data, error } = await supabase.from('scorecards').insert(values).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorecard'] });
      toast({ title: 'Scorecard criado com sucesso' });
    },
  });

  const updateScorecard = useMutation({
    mutationFn: async ({ id, ...values }: Record<string, unknown> & { id: string }) => {
      const { error } = await supabase.from('scorecards').update(values).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorecard'] });
      toast({ title: 'Scorecard atualizado' });
    },
  });

  return { scorecard, isLoading, createScorecard, updateScorecard };
}
