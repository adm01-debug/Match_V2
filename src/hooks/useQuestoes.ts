import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database, Json } from '@/integrations/supabase/types';

type QuestaoRow = Database['public']['Tables']['questoes']['Row'];
type QuestaoInsert = Database['public']['Tables']['questoes']['Insert'];
type QuestaoUpdate = Database['public']['Tables']['questoes']['Update'];

// Interface local para trabalhar com questões
interface Questao extends Omit<QuestaoRow, 'alternativas'> {
  alternativas: Array<{ id: string; texto: string; correta?: boolean }>;
}

function parseAlternativas(json: Json): Array<{ id: string; texto: string; correta?: boolean }> {
  if (Array.isArray(json)) {
    return json as Array<{ id: string; texto: string; correta?: boolean }>;
  }
  return [];
}

export function useQuestoes(provaId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: questoes = [], isLoading, error } = useQuery({
    queryKey: ['questoes', provaId],
    placeholderData: [],
    select: (data) => data, staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false, gcTime: 10 * 60 * 1000, retry: 3, queryFn: async () => {
      if (!provaId) return [];
      
      const { data, error } = await supabase
        .from('questoes')
        .select('*')
        .eq('prova_id', provaId)
        .order('ordem', { ascending: true });

      if (error) throw error;
      
      return (data || []).map(q => ({
        ...q,
        alternativas: parseAlternativas(q.alternativas),
      })) as Questao[];
    },
    enabled: !!provaId,
  });

  const createQuestao = useMutation({
    mutationFn: async (dados: Omit<QuestaoInsert, 'prova_id'>) => {
      if (!provaId) throw new Error('Prova ID é obrigatório');
      
      // Calcular próxima ordem
      const maxOrdem = questoes.length > 0 
        ? Math.max(...questoes.map(q => q.ordem)) 
        : 0;

      const { data, error } = await supabase
        .from('questoes')
        .insert({ 
          ...dados, 
          prova_id: provaId,
          ordem: dados.ordem ?? maxOrdem + 1 
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questoes', provaId] });
      toast({ title: 'Questão adicionada!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao adicionar questão', description: error.message, variant: 'destructive' });
    },
  });

  const updateQuestao = useMutation({
    mutationFn: async ({ id, ...dados }: QuestaoUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('questoes')
        .update(dados)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questoes', provaId] });
      toast({ title: 'Questão atualizada!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar questão', description: error.message, variant: 'destructive' });
    },
  });

  const deleteQuestao = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('questoes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questoes', provaId] });
      toast({ title: 'Questão removida!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao remover questão', description: error.message, variant: 'destructive' });
    },
  });

  const reordenarQuestoes = useMutation({
    mutationFn: async (novaOrdem: { id: string; ordem: number }[]) => {
      const updates = novaOrdem.map(({ id, ordem }) =>
        supabase.from('questoes').update({ ordem }).eq('id', id)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questoes', provaId] });
    },
  });

  const pontuacaoTotal = questoes.reduce((acc, q) => acc + q.pontuacao, 0);

  return {
    questoes,
    isLoading,
    error,
    pontuacaoTotal,
    totalQuestoes: questoes.length,
    createQuestao: createQuestao.mutateAsync,
    updateQuestao: updateQuestao.mutateAsync,
    deleteQuestao: deleteQuestao.mutateAsync,
    reordenarQuestoes: reordenarQuestoes.mutateAsync,
    isCreating: createQuestao.isPending,
    isUpdating: updateQuestao.isPending,
    isDeleting: deleteQuestao.isPending,
  };
}

export default useQuestoes;
