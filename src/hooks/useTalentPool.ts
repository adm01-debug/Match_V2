import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useTalentPool() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ['talent-pool'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candidatos')
        .select('*')
        .eq('status', 'banco_talentos')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const addToPool = useMutation({
    mutationFn: async (candidatoId: string) => {
      const { error } = await supabase
        .from('candidatos')
        .update({ status: 'banco_talentos' })
        .eq('id', candidatoId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talent-pool'] });
      toast({ title: 'Candidato adicionado ao banco de talentos' });
    },
  });

  const removeFromPool = useMutation({
    mutationFn: async (candidatoId: string) => {
      const { error } = await supabase
        .from('candidatos')
        .update({ status: 'ativo' })
        .eq('id', candidatoId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talent-pool'] });
      toast({ title: 'Candidato removido do banco de talentos' });
    },
  });

  return { candidates, isLoading, addToPool, removeFromPool };
}
