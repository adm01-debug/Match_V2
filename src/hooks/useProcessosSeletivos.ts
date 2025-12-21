import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProcessoSeletivo, EtapaProcesso, StatusProcesso, FonteCandidato } from '@/types/recruitment';

// Database type mapping
interface ProcessoDB {
  id: string;
  vaga_id: string | null;
  vaga_titulo: string;
  candidato_id: string | null;
  candidato_nome: string;
  candidato_foto: string | null;
  etapa_atual: string;
  status: string;
  match_score: number | null;
  origem: string | null;
  data_inscricao: string;
  data_ultima_movimentacao: string;
  dias_na_etapa: number | null;
  created_at: string;
  updated_at: string;
}

// Convert database row to ProcessoSeletivo type
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

// Fetch all processos seletivos
export function useProcessosSeletivos() {
  return useQuery({
    queryKey: ['processos-seletivos'],
    staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000, retry: 3, queryFn: async () => {
      const { data, error } = await supabase
        .from('processos_seletivos')
        .select('*')
        .order('data_inscricao', { ascending: false });

      if (error) throw error;
      return (data as unknown as ProcessoDB[]).map(dbToProcesso);
    },
  });
}

// Fetch processos by vaga
export function useProcessosByVaga(vagaId: string) {
  return useQuery({
    queryKey: ['processos-seletivos', 'vaga', vagaId],
    staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000, retry: 3, queryFn: async () => {
      const { data, error } = await supabase
        .from('processos_seletivos')
        .select('*')
        .eq('vaga_id', vagaId)
        .order('match_score', { ascending: false });

      if (error) throw error;
      return (data as unknown as ProcessoDB[]).map(dbToProcesso);
    },
    enabled: !!vagaId && vagaId !== 'todas',
  });
}

// Update processo etapa (for drag and drop)
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
      return dbToProcesso(data as unknown as ProcessoDB);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos-seletivos'] });
    },
  });
}

// Update processo status
export function useUpdateProcessoStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, etapaAtual }: { id: string; status: StatusProcesso; etapaAtual?: EtapaProcesso }) => {
      const updateData: Record<string, unknown> = {
        status,
        data_ultima_movimentacao: new Date().toISOString(),
      };
      if (etapaAtual) {
        updateData.etapa_atual = etapaAtual;
        updateData.dias_na_etapa = 0;
      }

      const { data, error } = await supabase
        .from('processos_seletivos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return dbToProcesso(data as unknown as ProcessoDB);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos-seletivos'] });
    },
  });
}

// Create processo
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
      return dbToProcesso(data as unknown as ProcessoDB);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos-seletivos'] });
    },
  });
}

// Delete processo
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
