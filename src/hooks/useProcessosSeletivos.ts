/**
 * @module useProcessosSeletivos
 * @description Hook para processos seletivos
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProcessoSeletivo, EtapaProcesso, StatusProcesso, FonteCandidato } from '@/types/recruitment';
import type { Tables } from '@/integrations/supabase/types';

type ProcessoDB = Tables<'processos_seletivos'>;

function dbToProcesso(row: ProcessoDB): ProcessoSeletivo {
  return {
    id: row.id,
    vagaId: row.vaga_id || '',
    vagaTitulo: row.vaga_titulo,
    candidatoId: row.candidato_id || '',
    candidatoNome: row.candidato_nome,
    candidatoFoto: row.candidato_foto || undefined,
    etapaAtual: row.etapa_atual as EtapaProcesso,
    status: row.status as StatusProcesso,
    matchScore: row.match_score || 0,
    origem: (row.origem || 'portal') as FonteCandidato,
    dataInscricao: new Date(row.data_inscricao),
    dataUltimaMovimentacao: new Date(row.data_ultima_movimentacao),
    diasNaEtapa: row.dias_na_etapa || 0,
  };
}

export function useProcessosSeletivos() {
  return useQuery({
    queryKey: ['processos-seletivos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('processos_seletivos')
        .select('*')
        .order('data_inscricao', { ascending: false });

      if (error) throw error;
      return (data || []).map(dbToProcesso);
    },
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useProcessosByVaga(vagaId: string) {
  return useQuery({
    queryKey: ['processos-seletivos', 'vaga', vagaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('processos_seletivos')
        .select('*')
        .eq('vaga_id', vagaId)
        .order('match_score', { ascending: false });

      if (error) throw error;
      return (data || []).map(dbToProcesso);
    },
    enabled: !!vagaId && vagaId !== 'todas',
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useUpdateProcessoEtapa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, etapaAtual }: { id: string; etapaAtual: EtapaProcesso }) => {
      const { data, error } = await supabase
        .from('processos_seletivos')
        .update({
          etapa_atual: etapaAtual,
          dias_na_etapa: 0,
          data_ultima_movimentacao: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return dbToProcesso(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos-seletivos'] });
    },
  });
}

export function useUpdateProcessoStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, etapaAtual }: { id: string; status: StatusProcesso; etapaAtual?: EtapaProcesso }) => {
      const updateData: Record<string, unknown> = {
        status,
        data_ultima_movimentacao: new Date().toISOString(),
      };
      if (etapaAtual) {
        updateData['etapa_atual'] = etapaAtual;
        updateData['dias_na_etapa'] = 0;
      }

      const { data, error } = await supabase
        .from('processos_seletivos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return dbToProcesso(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos-seletivos'] });
    },
  });
}

export function useCreateProcesso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (processo: {
      vagaId?: string;
      vagaTitulo: string;
      candidatoId?: string;
      candidatoNome: string;
      matchScore?: number;
      origem?: FonteCandidato;
    }) => {
      const { data, error } = await supabase
        .from('processos_seletivos')
        .insert({
          vaga_id: processo.vagaId,
          vaga_titulo: processo.vagaTitulo,
          candidato_id: processo.candidatoId,
          candidato_nome: processo.candidatoNome,
          match_score: processo.matchScore || 0,
          origem: processo.origem || 'portal',
          etapa_atual: 'novo',
          status: 'em_andamento',
        })
        .select()
        .single();

      if (error) throw error;
      return dbToProcesso(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos-seletivos'] });
    },
  });
}

export function useDeleteProcesso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('processos_seletivos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos-seletivos'] });
    },
  });
}
