/**
 * @module useBateriasProvas
 * @description Hook para gerenciar baterias de provas
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
    queryFn: async () => {
      const { data, error: queryError } = await supabase
        .from('baterias_provas')
        .select('*')
        .order('created_at', { ascending: false });
      if (queryError) throw queryError;
      return data as BateriaProvaDB[];
    },
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });

  const createBateria = useMutation({
    mutationFn: async (dados: BateriaProvaInsert) => {
      const { data, error: insertError } = await supabase
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
      if (insertError) throw insertError;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baterias-provas'] });
      toast({ title: 'Bateria criada!' });
    },
  });

  const updateBateria = useMutation({
    mutationFn: async ({ id, ...dados }: Partial<BateriaProvaInsert> & { id: string }) => {
      const { data, error: updateError } = await supabase
        .from('baterias_provas')
        .update({
          ...dados,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (updateError) throw updateError;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baterias-provas'] });
      toast({ title: 'Bateria atualizada!' });
    },
  });

  const deleteBateria = useMutation({
    mutationFn: async (id: string) => {
      const { error: deleteError } = await supabase.from('baterias_provas').delete().eq('id', id);
      if (deleteError) throw deleteError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baterias-provas'] });
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
