import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Tipos
export interface ProcessoSeletivo {
  id: string;
  candidato_id: string;
  vaga_id: string;
  etapa_atual: string;
  status: string;
  match_score: number | null;
  data_inicio: string;
  data_fim: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
  candidato?: {
    id: string;
    nome: string;
    email: string;
  };
  vaga?: {
    id: string;
    titulo: string;
    departamento: string;
  };
}

export interface ProcessoFilters {
  vagaId?: string;
  candidatoId?: string;
  etapa?: string;
  status?: string;
}

// Query Keys
const processosKeys = {
  all: ['processos'] as const,
  lists: () => [...processosKeys.all, 'list'] as const,
  list: (filters: ProcessoFilters) => [...processosKeys.lists(), filters] as const,
  details: () => [...processosKeys.all, 'detail'] as const,
  detail: (id: string) => [...processosKeys.details(), id] as const,
  byCandidato: (candidatoId: string) => [...processosKeys.all, 'candidato', candidatoId] as const,
  byVaga: (vagaId: string) => [...processosKeys.all, 'vaga', vagaId] as const,
};

// Fetch Processos
async function fetchProcessos(filters: ProcessoFilters = {}): Promise<ProcessoSeletivo[]> {
  let query = supabase
    .from('processos_seletivos')
    .select(`
      *,
      candidato:candidatos(id, nome, email),
      vaga:vagas(id, titulo, departamento)
    `)
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

// Fetch Processo by ID
async function fetchProcesso(id: string): Promise<ProcessoSeletivo | null> {
  const { data, error } = await supabase
    .from('processos_seletivos')
    .select(`
      *,
      candidato:candidatos(id, nome, email),
      vaga:vagas(id, titulo, departamento)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Fetch Processos by Candidato
async function fetchProcessosByCandidato(candidatoId: string): Promise<ProcessoSeletivo[]> {
  const { data, error } = await supabase
    .from('processos_seletivos')
    .select(`
      *,
      vaga:vagas(id, titulo, departamento, status)
    `)
    .eq('candidato_id', candidatoId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Create Processo
async function createProcesso(processo: Omit<ProcessoSeletivo, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('processos_seletivos')
    .insert(processo)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update Processo
async function updateProcesso({ id, ...updates }: Partial<ProcessoSeletivo> & { id: string }) {
  const { data, error } = await supabase
    .from('processos_seletivos')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update Etapa
async function updateEtapa(id: string, etapa: string) {
  const { data, error } = await supabase
    .from('processos_seletivos')
    .update({ etapa_atual: etapa, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Hooks
export function useProcessos(filters: ProcessoFilters = {}) {
  return useQuery({
    queryKey: processosKeys.list(filters),
    placeholderData: [], staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false, gcTime: 10 * 60 * 1000, retry: 3, queryFn: () => fetchProcessos(filters),
  });
}

export function useProcesso(id: string) {
  return useQuery({
    queryKey: processosKeys.detail(id),
    placeholderData: [], staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false, gcTime: 10 * 60 * 1000, retry: 3, queryFn: () => fetchProcesso(id),
    enabled: !!id,
  });
}

export function useProcessosCandidato(candidatoId: string) {
  return useQuery({
    queryKey: processosKeys.byCandidato(candidatoId),
    placeholderData: [], staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false, gcTime: 10 * 60 * 1000, retry: 3, queryFn: () => fetchProcessosByCandidato(candidatoId),
    enabled: !!candidatoId,
  });
}

export function useCreateProcesso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProcesso,
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
    mutationFn: updateProcesso,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: processosKeys.all });
      queryClient.setQueryData(processosKeys.detail(data.id), data);
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
    mutationFn: ({ id, etapa }: { id: string; etapa: string }) => updateEtapa(id, etapa),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: processosKeys.all });
      toast.success('Etapa atualizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar etapa: ${error.message}`);
    },
  });
}
