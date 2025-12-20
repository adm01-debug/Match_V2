import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ComunicacaoInput {
  candidato_id: string;
  assunto: string;
  conteudo: string;
  template_nome?: string;
  template_etapa?: string;
}

export function useComunicacoes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
          enviado_por: user?.id,
          enviado_em: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunicacoes'] });
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
    registrarComunicacao: registrarMutation.mutateAsync,
    isRegistrando: registrarMutation.isPending,
  };
}

export default useComunicacoes;
