import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ComunicacaoInput {
  candidato_id: string;
  tipo: string;
  assunto: string;
  conteudo: string;
  processo_id?: string;
  vaga_id?: string;
}

export function useComunicacoes() {
  const queryClient = useQueryClient();

  const registrarMutation = useMutation({
    mutationFn: async (input: ComunicacaoInput) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('comunicacoes')
        .insert({
          candidato_id: input.candidato_id,
          tipo: input.tipo,
          assunto: input.assunto,
          conteudo: input.conteudo,
          processo_id: input.processo_id,
          vaga_id: input.vaga_id,
          remetente_id: user?.id,
          status: 'enviado',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunicacoes'] });
    },
  });

  return {
    registrarComunicacao: registrarMutation.mutateAsync,
    isRegistrando: registrarMutation.isPending,
  };
}

export default useComunicacoes;
