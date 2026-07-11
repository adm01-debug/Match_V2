import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useVagas } from '@/hooks/useVagas';
import type { Indicacao, IndicacaoStatus, NovaIndicacaoInput } from '@/components/indicacoes/types';

export function useIndicacoes() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: vagas = [] } = useVagas();

  const query = useQuery({
    queryKey: ['indicacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('indicacoes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Indicacao[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (indicacao: NovaIndicacaoInput) => {
      const vaga = vagas.find(v => v.id === indicacao.vagaId);
      const meta = (user?.user_metadata as Record<string, unknown>) ?? {};
      const { error } = await supabase.from('indicacoes').insert({
        indicador_user_id: user?.id || null,
        indicador_nome: (meta['nome'] as string) || user?.email || 'Usuário',
        indicador_email: user?.email || '',
        candidato_nome: indicacao.candidatoNome,
        candidato_email: indicacao.candidatoEmail,
        candidato_telefone: indicacao.candidatoTelefone || null,
        vaga_id: indicacao.vagaId || null,
        vaga_titulo: vaga?.titulo || 'Vaga não especificada',
        observacao: indicacao.observacao || null,
        status: 'pendente',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicacoes'] });
      toast.success('Indicação registrada com sucesso!');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Erro ao registrar indicação', { description: message });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: IndicacaoStatus }) => {
      const bonus = status === 'contratado' ? 500 : 0;
      const { error } = await supabase
        .from('indicacoes')
        .update({ status, bonus })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicacoes'] });
      toast.success('Status atualizado');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Erro ao atualizar status', { description: message });
    },
  });

  const vagasPublicadas = vagas
    .filter(v => v.status === 'publicada')
    .map(v => ({ id: v.id, titulo: v.titulo }));

  return {
    indicacoes: query.data ?? [],
    isLoading: query.isLoading,
    vagasPublicadas,
    createIndicacao: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateStatus: (id: string, status: IndicacaoStatus) =>
      updateStatusMutation.mutate({ id, status }),
  };
}
