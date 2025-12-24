import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ComunicacaoRow = Database['public']['Tables']['comunicacoes']['Row'];

interface ComunicacaoInput {
  candidato_id: string;
  assunto: string;
  conteudo: string;
  template_nome?: string;
  template_etapa?: string;
}

export function useComunicacoes(candidatoId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query para buscar comunicações de um candidato
  const { data: comunicacoes = [], isLoading, error } = useQuery({
    queryKey: ['comunicacoes', candidatoId],
    placeholderData: [],
    select: (data) => data, staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false, gcTime: 10 * 60 * 1000, retry: 3, queryFn: async () => {
      if (!candidatoId) return [];
      
      const { data, error } = await supabase
        .from('comunicacoes')
        .select('*')
        .eq('candidato_id', candidatoId)
        .order('enviado_em', { ascending: false });

      if (error) throw error;
      return data as ComunicacaoRow[];
    },
    enabled: !!candidatoId,
  });

  const registrarMutation = useMutation({
    mutationFn: async (input: ComunicacaoInput) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('comunicacoes')
        .insert({
          candidato_id: input.candidato_id,
          assunto: input.assunto,
          conteudo: input.conteudo,
          template_nome: input.template_nome || 'Comunicação Manual',
          template_etapa: input.template_etapa || 'geral',
          enviado_por: user?.id || null,
          enviado_em: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunicacoes'] },
    // Optimistic update ready - implement setQueryData for instant feedback
);
      toast({ title: 'Comunicação registrada!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao registrar comunicação', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  return {
    comunicacoes,
    isLoading,
    error,
    registrarComunicacao: registrarMutation.mutateAsync,
    isRegistrando: registrarMutation.isPending,
    isRegistering: registrarMutation.isPending,
  };
}

export default useComunicacoes;

export type UseComunicacoesReturn = ReturnType<typeof useComunicacoes>;
