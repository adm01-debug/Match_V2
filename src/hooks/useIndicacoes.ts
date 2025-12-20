import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Indicacao {
  id: string;
  indicador_nome: string;
  indicador_email: string;
  indicador_telefone: string | null;
  candidato_nome: string;
  candidato_email: string;
  candidato_telefone: string | null;
  vaga_id: string | null;
  relacionamento: string | null;
  motivo_indicacao: string | null;
  status: 'pendente' | 'aprovada' | 'rejeitada' | 'contratado';
  created_at: string;
  vaga?: { titulo: string; departamento: string } | null;
}

interface IndicacaoInsert {
  indicador_nome: string;
  indicador_email: string;
  indicador_telefone?: string | null;
  candidato_nome: string;
  candidato_email: string;
  candidato_telefone?: string | null;
  vaga_id?: string | null;
  relacionamento?: string | null;
  motivo_indicacao?: string | null;
}

export function useIndicacoes(filtros?: { status?: string; vagaId?: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: indicacoes = [], isLoading, error } = useQuery({
    queryKey: ['indicacoes', filtros],
    queryFn: async () => {
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
      return data as Indicacao[];
    },
  });

  const createIndicacao = useMutation({
    mutationFn: async (dados: IndicacaoInsert) => {
      const { data, error } = await supabase
        .from('indicacoes')
        .insert({ ...dados, status: 'pendente' })
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
    mutationFn: async ({ id, status }: { id: string; status: Indicacao['status'] }) => {
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
