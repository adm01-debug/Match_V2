/**
 * @module useCandidaturas
 * @description Hook para gerenciar candidaturas
 * @returns {Object} Hook result with data, isLoading, error, and mutations
 * @example
 * const { data, isLoading } = useCandidaturas();
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type CandidaturaDB = Tables<'candidaturas'>;

interface Candidatura extends CandidaturaDB {
  candidato?: { nome: string; email: string } | null;
  vaga?: { titulo: string; departamento: string } | null;
}

interface CandidaturaInsert {
  candidato_auth_id: string;
  vaga_id: string;
  carta_apresentacao?: string;
  curriculo_url?: string;
}

export function useCandidaturas(filtros?: { vagaId?: string; candidatoAuthId?: string; status?: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: candidaturas = [], isLoading, error } = useQuery({
    queryKey: ['candidaturas', filtros],
    queryFn: async () => {
      let query = supabase
        .from('candidaturas')
        .select(`
          *,
          candidato:candidatos_auth(nome, email),
          vaga:vagas(titulo, departamento)
        `)
        .order('created_at', { ascending: false });
      
      if (filtros?.vagaId) query = query.eq('vaga_id', filtros.vagaId);
      if (filtros?.candidatoAuthId) query = query.eq('candidato_auth_id', filtros.candidatoAuthId);
      if (filtros?.status) query = query.eq('status', filtros.status);
      
      const { data, error } = await query;
      if (error) throw error;
      
      return (data || []) as Candidatura[];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    placeholderData: [],
  });

  const createCandidatura = useMutation({
    mutationFn: async (dados: CandidaturaInsert) => {
      const { data, error } = await supabase
        .from('candidaturas')
        .insert({
          candidato_auth_id: dados.candidato_auth_id,
          vaga_id: dados.vaga_id,
          carta_apresentacao: dados.carta_apresentacao,
          curriculo_url: dados.curriculo_url,
          status: 'pendente',
          etapa_atual: 'inscricao',
          data_candidatura: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidaturas'] });
      toast({ title: 'Candidatura registrada!' });
    },
    onError: (error: Error) => {
      console.error('Erro ao criar candidatura:', error);
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('candidaturas')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidaturas'] });
      toast({ title: 'Status atualizado!' });
    },
    onError: (error: Error) => {
      console.error('Erro ao atualizar status:', error);
    },
  });

  const stats = {
    total: candidaturas.length,
    pendentes: candidaturas.filter(c => c.status === 'pendente').length,
    emAnalise: candidaturas.filter(c => c.status === 'em_analise').length,
    aprovadas: candidaturas.filter(c => c.status === 'aprovada').length,
    rejeitadas: candidaturas.filter(c => c.status === 'rejeitada').length,
  };

  return {
    candidaturas,
    isLoading,
    error,
    stats,
    createCandidatura: createCandidatura.mutateAsync,
    updateStatus: updateStatus.mutateAsync,
  };
}

export default useCandidaturas;
