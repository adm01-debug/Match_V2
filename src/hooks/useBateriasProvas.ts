import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BateriaProva {
  id: string;
  nome: string;
  descricao: string | null;
  provas_ids: string[];
  ativo: boolean;
  created_at: string;
}

interface BateriaProvaInsert {
  nome: string;
  descricao?: string;
  provas_ids: string[];
  ativo?: boolean;
}

export function useBateriasProvas() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: baterias = [], isLoading, error } = useQuery({
    queryKey: ['baterias-provas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('baterias_provas')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as BateriaProva[];
    },
  });

  const createBateria = useMutation({
    mutationFn: async (dados: BateriaProvaInsert) => {
      const { data, error } = await supabase.from('baterias_provas').insert(dados).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baterias-provas'] });
      toast({ title: 'Bateria criada!' });
    },
  });

  const updateBateria = useMutation({
    mutationFn: async ({ id, ...dados }: Partial<BateriaProvaInsert> & { id: string }) => {
      const { data, error } = await supabase.from('baterias_provas').update(dados).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baterias-provas'] });
      toast({ title: 'Bateria atualizada!' });
    },
  });

  const deleteBateria = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('baterias_provas').delete().eq('id', id);
      if (error) throw error;
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
