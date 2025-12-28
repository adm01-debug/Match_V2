/**
 * @module useViews
 * @description Hook para gerenciar views e visualizações
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PipelineView {
  id: string;
  etapa_atual: string;
  status: string;
  match_score: number | null;
  data_inscricao: string;
  data_ultima_movimentacao: string;
  dias_na_etapa: number;
  candidato_id: string | null;
  candidato_nome: string;
  candidato_email: string;
  candidato_foto: string | null;
  cargo_atual: string | null;
  vaga_id: string | null;
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

export function usePipelineView(vagaId?: string) {
  return useQuery({
    queryKey: ['v_pipeline', vagaId],
    queryFn: async () => {
      let query = supabase
        .from('processos_seletivos')
        .select(`
          *,
          candidatos(nome, email),
          vagas(titulo, departamento, prioridade)
        `)
        .eq('status', 'em_andamento')
        .order('match_score', { ascending: false, nullsFirst: false });

      if (vagaId) {
        query = query.eq('vaga_id', vagaId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      const transformed: PipelineView[] = (data || []).map((p: any) => ({
        id: p.id,
        etapa_atual: p.etapa_atual,
        status: p.status,
        match_score: p.match_score,
        data_inscricao: p.data_inscricao,
        data_ultima_movimentacao: p.data_ultima_movimentacao,
        dias_na_etapa: p.dias_na_etapa || 0,
        candidato_id: p.candidato_id,
        candidato_nome: p.candidatos?.nome || p.candidato_nome || '',
        candidato_email: p.candidatos?.email || '',
        candidato_foto: p.candidato_foto,
        cargo_atual: null,
        vaga_id: p.vaga_id,
        vaga_titulo: p.vagas?.titulo || p.vaga_titulo || '',
        vaga_departamento: p.vagas?.departamento || '',
        vaga_prioridade: p.vagas?.prioridade || 'media',
      }));
      
      return transformed;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    gcTime: 1000 * 60 * 30,
    retry: 3,
  });
}

export function useAgendaEntrevistasView(filtros?: {
  dataInicio?: string;
  dataFim?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['v_agenda_entrevistas', filtros],
    queryFn: async () => {
      let query = supabase
        .from('entrevistas')
        .select('*')
        .order('data', { ascending: true });

      if (filtros?.dataInicio) {
        query = query.gte('data', filtros.dataInicio);
      }
      if (filtros?.dataFim) {
        query = query.lte('data', filtros.dataFim);
      }
      if (filtros?.status) {
        query = query.eq('status', filtros.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      const transformed: AgendaEntrevistasView[] = (data || []).map((e: any) => ({
        id: e.id,
        tipo: e.tipo,
        etapa: e.etapa,
        data_hora: `${e.data}T${e.hora_inicio}`,
        duracao_minutos: 60,
        local: e.local,
        link_video: e.link_online,
        status: e.status,
        entrevistadores_nomes: e.entrevistadores || [],
        candidato_nome: e.candidato_nome,
        candidato_email: '',
        candidato_foto: null,
        vaga_titulo: e.vaga_titulo,
        vaga_departamento: '',
      }));
      
      return transformed;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    gcTime: 1000 * 60 * 30,
    retry: 3,
  });
}

export function useVagasKpisView(status?: string) {
  return useQuery({
    queryKey: ['v_vagas_kpis', status],
    queryFn: async () => {
      let query = supabase
        .from('vagas')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      const transformed: VagasKpisView[] = (data || []).map((v: any) => ({
        id: v.id,
        titulo: v.titulo,
        departamento: v.departamento,
        status: v.status,
        prioridade: v.prioridade,
        quantidade: v.quantidade,
        created_at: v.created_at,
        dias_aberta: Math.floor((Date.now() - new Date(v.created_at).getTime()) / (1000 * 60 * 60 * 24)),
        total_candidatos: v.total_candidatos || 0,
        em_processo: v.em_processo || 0,
        contratados: v.contratados || 0,
      }));
      
      return transformed;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    gcTime: 1000 * 60 * 30,
    retry: 3,
  });
}

export function useDashboardKPIs() {
  const { data: vagasKpis, isLoading: loadingVagas } = useVagasKpisView();
  const { data: pipeline, isLoading: loadingPipeline } = usePipelineView();

  const kpis = {
    vagasAbertas: vagasKpis?.filter(v => v.status === 'publicada').length || 0,
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
