import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type IndicacaoRow = Database['public']['Tables']['indicacoes']['Row'];
type IndicacaoInsert = Database['public']['Tables']['indicacoes']['Insert'];

interface Indicacao extends IndicacaoRow {
  vaga?: { titulo: string; departamento: string } | null;
}

export function useIndicacoes(filtros?: { status?: string; vagaId?: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: indicacoes = [], isLoading, error } = useQuery({
    queryKey: ['indicacoes', filtros],
    placeholderData: [], staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: true, gcTime: 10 * 60 * 1000, retry: 3, queryFn: async () => {
      let query = supabase
        .from('indicacoes')
        .select(`
          *,
          vaga:vagas(titulo, departamento)
        `)
        .order('created_at', { ascending: false });

      if (filtros?.status) {
        query = query.eq('status', filtros.status);
      }
      if (filtros?.vagaId) {
        query = query.eq('vaga_id', filtros.vagaId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Indicacao[];
    },
  });

  const createIndicacao = useMutation({
    mutationFn: async (dados: IndicacaoInsert) => {
      const { data, error } = await supabase
        .from('indicacoes')
        .insert(dados)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicacoes'] });
      toast({ title: 'Indicação registrada!', description: 'A indicação foi enviada com sucesso.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao registrar indicação', description: error.message, variant: 'destructive' });
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('indicacoes')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicacoes'] });
      toast({ title: 'Status atualizado!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar status', description: error.message, variant: 'destructive' });
    },
  });

  // Estatísticas
  const stats = {
    total: indicacoes.length,
    pendentes: indicacoes.filter(i => i.status === 'pendente').length,
    aprovadas: indicacoes.filter(i => i.status === 'aprovada').length,
    contratados: indicacoes.filter(i => i.status === 'contratado').length,
  };

  return {
    indicacoes,
    isLoading,
    error,
    stats,
    createIndicacao: createIndicacao.mutateAsync,
    updateStatus: updateStatus.mutateAsync,
    isCreating: createIndicacao.isPending,
    isUpdating: updateStatus.isPending,
  };
}

export default useIndicacoes;
