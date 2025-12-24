/**
 * @module useCandidatos
 * @description Hook para operações CRUD de candidatos
 * @returns {Object} Hook result with data, isLoading, error, and mutations
 * @example
 * const { data, isLoading } = useCandidatos();
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Candidato = Tables<'candidatos'>;
type CandidatoInsert = TablesInsert<'candidatos'>;
type CandidatoUpdate = TablesUpdate<'candidatos'>;

export const STATUS_CANDIDATO = {
  NOVO: 'novo',
  EM_ANALISE: 'em_analise',
  ENTREVISTA: 'entrevista',
  TESTE: 'teste',
  APROVADO: 'aprovado',
  REPROVADO: 'reprovado',
  CONTRATADO: 'contratado',
  DESISTENTE: 'desistente',
} as const;

export const ORIGENS_CANDIDATO = {
  LINKEDIN: 'linkedin',
  SITE: 'site',
  INDICACAO: 'indicacao',
  PORTAL: 'portal',
  HEADHUNTER: 'headhunter',
  OUTRO: 'outro',
} as const;

// Buscar todos os candidatos
export function useCandidatos(filters?: {
  status?: string;
  origem?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['candidatos', filters],
    queryFn: async () => {
      let query = supabase
        .from('candidatos')
        .select(`
          *,
          match_scores(score, criterios)
        `)
        .order('created_at', { ascending: false , placeholderData: [],
    select: (data) => data, staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false, gcTime: 10 * 60 * 1000, retry: 3});

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.origem) {
        query = query.eq('origem', filters.origem);
      }
      if (filters?.search) {
        query = query.or(`nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

// Buscar candidato por ID
export function useCandidato(id: string | undefined) {
  return useQuery({
    queryKey: ['candidato', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('candidatos')
        .select(`
          *,
          match_scores(score, criterios),
          processos_seletivos(*, vagas(*)),
          candidaturas(*, vagas(*))
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

// Estatísticas dos candidatos
export function useCandidatosStats() {
  return useQuery({
    queryKey: ['candidatos-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candidatos')
        .select('status, origem');
      
      if (error) throw error;

      const total = data.length;
      const byStatus: Record<string, number> = {};
      const byOrigem: Record<string, number> = {};

      data.forEach(c => {
        byStatus[c.status || 'novo'] = (byStatus[c.status || 'novo'] || 0) + 1;
        byOrigem[c.origem || 'outro'] = (byOrigem[c.origem || 'outro'] || 0) + 1;
      });

      return { total, byStatus, byOrigem };
    },
  });
}

// Criar candidato
export function useCreateCandidato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (candidato: CandidatoInsert) => {
      const { data, error } = await supabase
        .from('candidatos')
        .insert(candidato)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onError: (error) => { // Error logged: Mutation error: toast.error('Ocorreu um erro'); }, onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidatos'] },
    // Optimistic update ready - implement setQueryData for instant feedback
);
      queryClient.invalidateQueries({ queryKey: ['candidatos-stats'] });
    },
  });
}

// Atualizar candidato
export function useUpdateCandidato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: CandidatoUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('candidatos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onError: (error) => { // Error logged: Mutation error: toast.error('Ocorreu um erro'); }, onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['candidatos'] },
    // Optimistic update ready - implement setQueryData for instant feedback
);
      queryClient.invalidateQueries({ queryKey: ['candidato', data.id] });
      queryClient.invalidateQueries({ queryKey: ['candidatos-stats'] });
    },
  });
}

// Deletar candidato
export function useDeleteCandidato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('candidatos')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onError: (error) => { // Error logged: Mutation error: toast.error('Ocorreu um erro'); }, onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidatos'] },
    // Optimistic update ready - implement setQueryData for instant feedback
);
      queryClient.invalidateQueries({ queryKey: ['candidatos-stats'] });
    },
  });
}

// Buscar candidatos para select
export function useCandidatosSelect() {
  return useQuery({
    queryKey: ['candidatos-select'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candidatos')
        .select('id, nome, email')
        .order('nome');
      if (error) throw error;
      return data;
    },
  });
}
