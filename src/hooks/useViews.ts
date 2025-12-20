import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Tipos das Views
export interface PipelineView {
  id: string;
  etapa_atual: string;
  status: string;
  match_score: number | null;
  data_inscricao: string;
  data_ultima_movimentacao: string;
  dias_na_etapa: number;
  candidato_id: string;
  candidato_nome: string;
  candidato_email: string;
  candidato_foto: string | null;
  cargo_atual: string | null;
  vaga_id: string;
  vaga_titulo: string;
  vaga_departamento: string;
  vaga_prioridade: string;
}

export interface AgendaEntrevistasView {
  id: string;
  tipo: string;
  etapa: string;
  data_hora: string;
  duracao_minutos: number;
  local: string | null;
  link_video: string | null;
  status: string;
  entrevistadores_nomes: string[];
  candidato_nome: string;
  candidato_email: string;
  candidato_foto: string | null;
  vaga_titulo: string;
  vaga_departamento: string;
}

export interface VagasKpisView {
  id: string;
  titulo: string;
  departamento: string;
  status: string;
  prioridade: string;
  quantidade: number;
  created_at: string;
  dias_aberta: number;
  total_candidatos: number;
  em_processo: number;
  contratados: number;
}

// Hook para v_pipeline
export function usePipelineView(vagaId?: string) {
  return useQuery({
    queryKey: ['v_pipeline', vagaId],
    queryFn: async () => {
      let query = supabase
        .from('v_pipeline')
        .select('*')
        .order('match_score', { ascending: false, nullsFirst: false });

      if (vagaId) {
        query = query.eq('vaga_id', vagaId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PipelineView[];
    },
  });
}

// Hook para v_agenda_entrevistas
export function useAgendaEntrevistasView(filtros?: {
  dataInicio?: string;
  dataFim?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['v_agenda_entrevistas', filtros],
    queryFn: async () => {
      let query = supabase
        .from('v_agenda_entrevistas')
        .select('*')
        .order('data_hora', { ascending: true });

      if (filtros?.dataInicio) {
        query = query.gte('data_hora', filtros.dataInicio);
      }
      if (filtros?.dataFim) {
        query = query.lte('data_hora', filtros.dataFim);
      }
      if (filtros?.status) {
        query = query.eq('status', filtros.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AgendaEntrevistasView[];
    },
  });
}

// Hook para v_vagas_kpis
export function useVagasKpisView(status?: string) {
  return useQuery({
    queryKey: ['v_vagas_kpis', status],
    queryFn: async () => {
      let query = supabase
        .from('v_vagas_kpis')
        .select('*')
        .order('dias_aberta', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as VagasKpisView[];
    },
  });
}

// Hook combinado com KPIs calculados
export function useDashboardKPIs() {
  const { data: vagasKpis, isLoading: loadingVagas } = useVagasKpisView();
  const { data: pipeline, isLoading: loadingPipeline } = usePipelineView();

  const kpis = {
    vagasAbertas: vagasKpis?.filter(v => v.status === 'aberta').length || 0,
    totalCandidatos: vagasKpis?.reduce((acc, v) => acc + v.total_candidatos, 0) || 0,
    emProcesso: vagasKpis?.reduce((acc, v) => acc + v.em_processo, 0) || 0,
    contratados: vagasKpis?.reduce((acc, v) => acc + v.contratados, 0) || 0,
    tempoMedioAberta: vagasKpis?.length 
      ? Math.round(vagasKpis.reduce((acc, v) => acc + v.dias_aberta, 0) / vagasKpis.length)
      : 0,
    candidatosPorEtapa: pipeline?.reduce((acc, p) => {
      acc[p.etapa_atual] = (acc[p.etapa_atual] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},
  };

  return {
    kpis,
    vagasKpis,
    pipeline,
    isLoading: loadingVagas || loadingPipeline,
  };
}
