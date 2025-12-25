/**
 * @module useBateriasProvas
 * @description Hook para gerenciar baterias de provas
 * @returns {Object} Hook result with data, isLoading, error, and mutations
 * @example
 * const { data, isLoading } = useBateriasProvas();
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type BateriaProvaDB = Tables<'baterias_provas'>;

interface BateriaProvaInsert {
  nome: string;
  descricao?: string;
  departamento?: string;
  nivel?: string;
  duracao_total?: number;
  ativo?: boolean;
}

export function useBateriasProvas() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: baterias = [], isLoading, error } = useQuery({
    queryKey: ['baterias-provas'],
    placeholderData: [],
    select: (data) => data, staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: true, gcTime: 10 * 60 * 1000, retry: 3, queryFn: async () => {
      try {
      const { data, error } = await supabase
        .from('baterias_provas')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as BateriaProvaDB[];
    },
  });

  const createBateria = useMutation({
    mutationFn: async (dados: BateriaProvaInsert) => {
      const { data, error } = await supabase
        .from('baterias_provas')
        .insert({
          nome: dados.nome,
          descricao: dados.descricao,
          departamento: dados.departamento || 'geral',
          nivel: dados.nivel || 'junior',
          duracao_total: dados.duracao_total || 0,
          ativo: dados.ativo ?? true,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onError: (error) => { // Error logged: Mutation error: toast.error('Ocorreu um erro'); }, onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baterias-provas'] },
    // Optimistic update ready - implement setQueryData for instant feedback
);
      toast({ title: 'Bateria criada!' });
    },
  });

  const updateBateria = useMutation({
    mutationFn: async ({ id, ...dados }: Partial<BateriaProvaInsert> & { id: string }) => {
      const { data, error } = await supabase
        .from('baterias_provas')
        .update({
          ...dados,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onError: (error) => { // Error logged: Mutation error: toast.error('Ocorreu um erro'); }, onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baterias-provas'] },
    // Optimistic update ready - implement setQueryData for instant feedback
);
      toast({ title: 'Bateria atualizada!' });
    },
  });

  const deleteBateria = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('baterias_provas').delete().eq('id', id);
      if (error) throw error;
    },
    onError: (error) => { // Error logged: Mutation error: toast.error('Ocorreu um erro'); }, onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baterias-provas'] },
    // Optimistic update ready - implement setQueryData for instant feedback
);
      toast({ title: 'Bateria removida!' });
    },
  });

  return {
    baterias,
    isLoading,
    error,
    createBateria: createBateria.mutateAsync,
    updateBateria: updateBateria.mutateAsync,
    deleteBateria: deleteBateria.mutateAsync,
  };
}

export default useBateriasProvas;
