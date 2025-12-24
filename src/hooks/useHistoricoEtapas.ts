import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Tipos
export interface HistoricoEtapa {
  id: string;
  processo_id: string;
  etapa_anterior: string | null;
  etapa_nova: string;
  data_mudanca: string;
  responsavel_id: string | null;
  observacao: string | null;
  created_at: string;
  responsavel?: {
    id: string;
    full_name: string;
  };
}

export interface CreateHistoricoInput {
  processo_id: string;
  etapa_anterior: string | null;
  etapa_nova: string;
  responsavel_id?: string;
  observacao?: string;
}

// Query Keys
const historicoKeys = {
  all: ['historico-etapas'] as const,
  byProcesso: (processoId: string) => [...historicoKeys.all, 'processo', processoId] as const,
};

// Fetch Historico by Processo
async function fetchHistoricoByProcesso(processoId: string): Promise<HistoricoEtapa[]> {
  const { data, error } = await supabase
    .from('historico_etapas')
    .select(`
      *,
      responsavel:profiles(id, full_name)
    `)
    .eq('processo_id', processoId)
    .order('data_mudanca', { ascending: false });

  if (error) {
    // Se a tabela não existir, retornar array vazio
    if (error.code === '42P01') {
      return [];
    }
    throw error;
  }
  
  return data || [];
}

// Create Historico
async function createHistorico(input: CreateHistoricoInput): Promise<HistoricoEtapa> {
  const { data, error } = await supabase
    .from('historico_etapas')
    .insert({
      ...input,
      data_mudanca: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Hooks
export function useHistoricoEtapas(processoId: string) {
  return useQuery({
    queryKey: historicoKeys.byProcesso(processoId),
    placeholderData: [], staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false, gcTime: 10 * 60 * 1000, retry: 3, queryFn: () => fetchHistoricoByProcesso(processoId),
    enabled: !!processoId,
  });
}

export function useCreateHistoricoEtapa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHistorico,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: historicoKeys.byProcesso(data.processo_id) 
      });
      toast.success('Histórico registrado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao registrar histórico: ${error.message}`);
    },
  });
}

// Constantes de etapas
export const ETAPAS_PROCESSO = [
  { value: 'triagem', label: 'Triagem', ordem: 1 },
  { value: 'entrevista_rh', label: 'Entrevista RH', ordem: 2 },
  { value: 'teste_tecnico', label: 'Teste Técnico', ordem: 3 },
  { value: 'entrevista_gestor', label: 'Entrevista Gestor', ordem: 4 },
  { value: 'proposta', label: 'Proposta', ordem: 5 },
  { value: 'contratado', label: 'Contratado', ordem: 6 },
  { value: 'reprovado', label: 'Reprovado', ordem: -1 },
  { value: 'desistencia', label: 'Desistência', ordem: -2 },
] as const;

export function getEtapaLabel(value: string): string {
  const etapa = ETAPAS_PROCESSO.find(e => e.value === value);
  return etapa?.label || value;
}

export function getEtapaOrdem(value: string): number {
  const etapa = ETAPAS_PROCESSO.find(e => e.value === value);
  return etapa?.ordem || 0;
}
