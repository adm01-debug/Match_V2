/**
 * @module useNotasCandidato
 * @description Hook para gerenciar notas/observações internas sobre candidatos
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NotaCandidato {
  id: string;
  candidato_id: string;
  processo_id: string | null;
  autor_id: string | null;
  autor_nome: string | null;
  conteudo: string;
  tipo: string;
  privada: boolean;
  created_at: string;
  updated_at: string;
}


const db = supabase;

export function useNotasCandidato(candidatoId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: notas = [], isLoading, error } = useQuery({
    queryKey: ['notas_candidatos', candidatoId],
    queryFn: async () => {
      if (!candidatoId) return [];
      const { data, error: queryError } = await db
        .from('notas_candidatos')
        .select('*')
        .eq('candidato_id', candidatoId)
        .order('created_at', { ascending: false });
      if (queryError) throw queryError;
      return (data || []) as NotaCandidato[];
    },
    enabled: !!candidatoId,
  });

  const createMutation = useMutation({
    mutationFn: async (input: { candidatoId: string; conteudo: string; tipo?: string; processoId?: string; privada?: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('nome').eq('user_id', user?.id || '').single();

      const { data, error } = await db.from('notas_candidatos').insert({
        candidato_id: input.candidatoId,
        processo_id: input.processoId || null,
        autor_id: user?.id,
        autor_nome: profile?.nome || user?.email || 'Anônimo',
        conteudo: input.conteudo,
        tipo: input.tipo || 'observacao',
        privada: input.privada || false,
      }).select().single();
      if (error) throw error;
      return data as NotaCandidato;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas_candidatos'] });
      toast({ title: 'Nota adicionada!' });
    },
    onError: (err: Error) => toast({ title: 'Erro ao adicionar nota', description: err.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from('notas_candidatos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas_candidatos'] });
      toast({ title: 'Nota removida!' });
    },
  });

  return {
    notas,
    isLoading,
    error,
    addNota: createMutation.mutateAsync,
    deleteNota: deleteMutation.mutateAsync,
    isAdding: createMutation.isPending,
  };
}
