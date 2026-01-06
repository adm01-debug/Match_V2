/**
 * @module useProcessos
 * @description Hook para gerenciar processos seletivos
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

// Use o tipo real do banco
type ProcessoDB = Tables<'processos_seletivos'>;

export interface ProcessoFilters {
  vagaId?: string;
  candidatoId?: string;
  etapa?: string;
  status?: string;
}

const processosKeys = {
  all: ['processos'] as const,
  lists: () => [...processosKeys.all, 'list'] as const,
  list: (filters: ProcessoFilters) => [...processosKeys.lists(), filters] as const,
  details: () => [...processosKeys.all, 'detail'] as const,
  detail: (id: string) => [...processosKeys.details(), id] as const,
  byCandidato: (candidatoId: string) => [...processosKeys.all, 'candidato', candidatoId] as const,
  byVaga: (vagaId: string) => [...processosKeys.all, 'vaga', vagaId] as const,
};

async function fetchProcessos(filters: ProcessoFilters = {}): Promise<ProcessoDB[]> {
  let query = supabase
    .from('processos_seletivos')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.vagaId) {
    query = query.eq('vaga_id', filters.vagaId);
  }
  if (filters.candidatoId) {
    query = query.eq('candidato_id', filters.candidatoId);
  }
  if (filters.etapa) {
    query = query.eq('etapa_atual', filters.etapa);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function fetchProcesso(id: string): Promise<ProcessoDB | null> {
  const { data, error } = await supabase
    .from('processos_seletivos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

async function fetchProcessosByCandidato(candidatoId: string): Promise<ProcessoDB[]> {
  const { data, error } = await supabase
    .from('processos_seletivos')
    .select('*')
    .eq('candidato_id', candidatoId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export function useProcessos(filters: ProcessoFilters = {}) {
  return useQuery({
    queryKey: processosKeys.list(filters),
    queryFn: () => fetchProcessos(filters),
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useProcesso(id: string) {
  return useQuery({
    queryKey: processosKeys.detail(id),
    queryFn: () => fetchProcesso(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    enabled: !!id,
  });
}

export function useProcessosCandidato(candidatoId: string) {
  return useQuery({
    queryKey: processosKeys.byCandidato(candidatoId),
    queryFn: () => fetchProcessosByCandidato(candidatoId),
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    enabled: !!candidatoId,
  });
}

export function useCreateProcesso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (processo: {
      vaga_id?: string;
      vaga_titulo: string;
      candidato_id?: string;
      candidato_nome: string;
      match_score?: number;
      origem?: string;
    }) => {
      const { data, error } = await supabase
        .from('processos_seletivos')
        .insert({
          vaga_id: processo.vaga_id,
          vaga_titulo: processo.vaga_titulo,
          candidato_id: processo.candidato_id,
          candidato_nome: processo.candidato_nome,
          match_score: processo.match_score || 0,
          origem: processo.origem || 'portal',
          etapa_atual: 'novo',
          status: 'em_andamento',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: processosKeys.all });
      toast.success('Processo seletivo iniciado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar processo: ${error.message}`);
    },
  });
}

export function useUpdateProcesso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProcessoDB> & { id: string }) => {
      const { data, error } = await supabase
        .from('processos_seletivos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: processosKeys.all });
      if (data) {
        queryClient.setQueryData(processosKeys.detail(data.id), data);
      }
      toast.success('Processo atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar processo: ${error.message}`);
    },
  });
}

export function useUpdateEtapa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, etapa }: { id: string; etapa: string }) => {
      const { data, error } = await supabase
        .from('processos_seletivos')
        .update({
          etapa_atual: etapa,
          dias_na_etapa: 0,
          data_ultima_movimentacao: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: processosKeys.all });
      toast.success('Etapa atualizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar etapa: ${error.message}`);
    },
  });
}

// Re-export for backward compatibility
export type ProcessoSeletivo = ProcessoDB;
