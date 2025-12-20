import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HistoricoEtapa {
  id: string;
  processo_seletivo_id: string;
  etapa_anterior: string | null;
  etapa_nova: string;
  motivo: string | null;
  responsavel_id: string | null;
  created_at: string;
}

interface HistoricoEtapaInsert {
  processo_seletivo_id: string;
  etapa_anterior?: string | null;
  etapa_nova: string;
  motivo?: string | null;
  responsavel_id?: string | null;
}

export function useHistoricoEtapas(processoSeletivoId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: historico = [], isLoading, error } = useQuery({
    queryKey: ['historico-etapas', processoSeletivoId],
    queryFn: async () => {
      let query = supabase
        .from('historico_etapas')
        .select('*')
        .order('created_at', { ascending: false });

      if (processoSeletivoId) {
        query = query.eq('processo_seletivo_id', processoSeletivoId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as HistoricoEtapa[];
    },
    enabled: true,
  });

  const registrarMudancaEtapa = useMutation({
    mutationFn: async (dados: HistoricoEtapaInsert) => {
      const { data, error } = await supabase
        .from('historico_etapas')
        .insert(dados)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico-etapas'] });
      queryClient.invalidateQueries({ queryKey: ['processos-seletivos'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao registrar mudança',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    historico,
    isLoading,
    error,
    registrarMudancaEtapa: registrarMudancaEtapa.mutateAsync,
    isRegistrando: registrarMudancaEtapa.isPending,
  };
}

export default useHistoricoEtapas;
