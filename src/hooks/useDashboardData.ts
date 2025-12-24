/**
 * @module useDashboardData
 * @description Hook para métricas e dados do dashboard
 * @returns {Object} Hook result with data, isLoading, error, and mutations
 * @example
 * const { data, isLoading } = useDashboardData();
 */

import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, differenceInDays } from 'date-fns';
import type { KPIData, FunilEtapa, VagaUrgente, AcaoPendente, AgendaDia, ProcessoSeletivo, Prioridade, FonteCandidato } from '@/types/recruitment';

// Mapeamento de etapas do BD para o funil
const etapasFunil = [
  { key: 'novo', label: 'Novos', cor: 'hsl(217, 91%, 60%)' },
  { key: 'em_triagem', label: 'Triagem', cor: 'hsl(263, 70%, 50%)' },
  { key: 'pre_selecao', label: 'Pré-seleção', cor: 'hsl(280, 70%, 50%)' },
  { key: 'entrevista_rh', label: 'Entrevista RH', cor: 'hsl(38, 92%, 50%)' },
  { key: 'teste_tecnico', label: 'Testes', cor: 'hsl(330, 81%, 60%)' },
  { key: 'entrevista_gestor', label: 'Ent. Gestor', cor: 'hsl(200, 70%, 50%)' },
  { key: 'entrevista_final', label: 'Ent. Final', cor: 'hsl(160, 84%, 39%)' },
  { key: 'aprovado', label: 'Aprovados', cor: 'hsl(158, 64%, 32%)' },
  { key: 'contratado', label: 'Contratados', cor: 'hsl(160, 84%, 25%)' },
];

export function useDashboardData() {
  // KPIs
  const kpisQuery = useQuery({
    queryKey: ['dashboard-kpis'],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: true,
    placeholderData: (previousData) => previousData,
    select: (data) => data,
    onError: () => toast.error('Erro ao carregar dados'),
    gcTime: 1000 * 60 * 30,
    retry: 3,
    queryFn: async (): Promise<KPIData> => {
      const inicioMes = startOfMonth(new Date()).toISOString();
      
      // Vagas abertas (publicadas)
      const { count: vagasAbertas } = await supabase
        .from('vagas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'publicada');

      // Vagas criadas este mês
      const { count: vagasNovas } = await supabase
        .from('vagas')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', inicioMes);

      // Total de candidatos
      const { count: candidatosTotal } = await supabase
        .from('candidatos')
        .select('*', { count: 'exact', head: true });

      // Candidatos novos este mês
      const { count: candidatosNovos } = await supabase
        .from('candidatos')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', inicioMes);

      // Processos em andamento
      const { count: emProcesso } = await supabase
        .from('processos_seletivos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'em_andamento');

      // Vagas com processos em andamento
      const { data: vagasEmProcessoData } = await supabase
        .from('processos_seletivos')
        .select('vaga_id')
        .eq('status', 'em_andamento');
      
      const vagasUnicas = new Set(vagasEmProcessoData?.map(p => p.vaga_id).filter(Boolean));

      // Contratados este mês
      const { count: contratadosMes } = await supabase
        .from('processos_seletivos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'contratado')
        .gte('updated_at', inicioMes);

      // Tempo médio de contratação (dias desde inscrição até contratação)
      const { data: contratados } = await supabase
        .from('processos_seletivos')
        .select('data_inscricao, updated_at')
        .eq('status', 'contratado')
        .limit(50);

      let tempoMedio = 0;
      if (contratados && contratados.length > 0) {
        const totalDias = contratados.reduce((acc, c) => {
          const dias = differenceInDays(new Date(c.updated_at), new Date(c.data_inscricao));
          return acc + dias;
        }, 0);
        tempoMedio = Math.round(totalDias / contratados.length);
      }

      return {
        vagasAbertas: vagasAbertas || 0,
        vagasNovas: vagasNovas || 0,
        candidatosTotal: candidatosTotal || 0,
        candidatosNovos: candidatosNovos || 0,
        emProcesso: emProcesso || 0,
        vagasEmProcesso: vagasUnicas.size,
        contratadosMes: contratadosMes || 0,
        metaContratacao: 5, // Meta fixa por enquanto
        tempoMedio: tempoMedio || 0,
        metaTempo: 25, // Meta fixa por enquanto
      };
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled: true,
    placeholderData: (previousData) => previousData,
    select: (data) => data,
    onError: () => toast.error('Erro ao carregar dados'), // 30 segundos
  });

  // Funil de recrutamento
  const funilQuery = useQuery({
    queryKey: ['dashboard-funil'],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: true,
    placeholderData: (previousData) => previousData,
    select: (data) => data,
    onError: () => toast.error('Erro ao carregar dados'),
    gcTime: 1000 * 60 * 30,
    retry: 3,
    queryFn: async (): Promise<FunilEtapa[]> => {
      const { data: processos } = await supabase
        .from('processos_seletivos')
        .select('etapa_atual')
        .eq('status', 'em_andamento');

      if (!processos || processos.length === 0) {
        return etapasFunil.map(e => ({ etapa: e.label, quantidade: 0, percentual: 0, cor: e.cor }));
      }

      // Contar por etapa
      const contagem: Record<string, number> = {};
      processos.forEach(p => {
        contagem[p.etapa_atual] = (contagem[p.etapa_atual] || 0) + 1;
      });

      // Total para calcular percentual
      const total = processos.length;

      return etapasFunil.map(e => ({
        etapa: e.label,
        quantidade: contagem[e.key] || 0,
        percentual: total > 0 ? Math.round(((contagem[e.key] || 0) / total) * 100) : 0,
        cor: e.cor,
      }));
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled: true,
    placeholderData: (previousData) => previousData,
    select: (data) => data,
    onError: () => toast.error('Erro ao carregar dados'),
  });

  // Vagas urgentes
  const vagasUrgentesQuery = useQuery({
    queryKey: ['dashboard-vagas-urgentes'],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: true,
    placeholderData: (previousData) => previousData,
    select: (data) => data,
    onError: () => toast.error('Erro ao carregar dados'),
    gcTime: 1000 * 60 * 30,
    retry: 3,
    queryFn: async (): Promise<VagaUrgente[]> => {
      const { data: vagas } = await supabase
        .from('vagas')
        .select('id, titulo, total_candidatos, em_processo, quantidade, prioridade, data_publicacao')
        .eq('status', 'publicada')
        .in('prioridade', ['urgente', 'alta'])
        .order('prioridade', { ascending: true })
        .limit(5);

      if (!vagas) return [];

      return vagas.map(v => ({
        id: v.id,
        titulo: v.titulo,
        candidatos: v.total_candidatos || 0,
        emProcesso: v.em_processo || 0,
        diasAberta: v.data_publicacao 
          ? differenceInDays(new Date(), new Date(v.data_publicacao))
          : 0,
        quantidade: v.quantidade || 1,
        prioridade: v.prioridade as Prioridade,
      }));
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled: true,
    placeholderData: (previousData) => previousData,
    select: (data) => data,
    onError: () => toast.error('Erro ao carregar dados'),
  });

  // Ações pendentes
  const acoesPendentesQuery = useQuery({
    queryKey: ['dashboard-acoes-pendentes'],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: true,
    placeholderData: (previousData) => previousData,
    select: (data) => data,
    onError: () => toast.error('Erro ao carregar dados'),
    gcTime: 1000 * 60 * 30,
    retry: 3,
    queryFn: async (): Promise<AcaoPendente[]> => {
      const acoes: AcaoPendente[] = [];

      // Feedback pendente (entrevistas realizadas sem feedback)
      const { count: feedbackPendente } = await supabase
        .from('entrevistas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'realizada')
        .is('feedback_resultado', null);

      if (feedbackPendente && feedbackPendente > 0) {
        acoes.push({
          tipo: 'feedback',
          quantidade: feedbackPendente,
          descricao: 'entrevistas aguardam feedback',
          alerta: feedbackPendente > 5,
        });
      }

      // Entrevistas para agendar (processos em etapa de entrevista sem entrevista agendada)
      const { count: agendarPendente } = await supabase
        .from('processos_seletivos')
        .select('*', { count: 'exact', head: true })
        .in('etapa_atual', ['entrevista_rh', 'entrevista_gestor', 'entrevista_final'])
        .eq('status', 'em_andamento');

      if (agendarPendente && agendarPendente > 0) {
        acoes.push({
          tipo: 'agendar',
          quantidade: agendarPendente,
          descricao: 'candidatos em etapa de entrevista',
          alerta: false,
        });
      }

      // Processos em triagem (avaliar)
      const { count: avaliarPendente } = await supabase
        .from('processos_seletivos')
        .select('*', { count: 'exact', head: true })
        .eq('etapa_atual', 'em_triagem')
        .eq('status', 'em_andamento');

      if (avaliarPendente && avaliarPendente > 0) {
        acoes.push({
          tipo: 'avaliar',
          quantidade: avaliarPendente,
          descricao: 'currículos para triagem',
          alerta: avaliarPendente > 10,
        });
      }

      // Propostas pendentes (aprovados sem proposta)
      const { count: propostaPendente } = await supabase
        .from('processos_seletivos')
        .select('*', { count: 'exact', head: true })
        .eq('etapa_atual', 'aprovado')
        .eq('status', 'em_andamento');

      if (propostaPendente && propostaPendente > 0) {
        acoes.push({
          tipo: 'proposta',
          quantidade: propostaPendente,
          descricao: 'candidatos aprovados aguardam proposta',
          alerta: true,
        });
      }

      return acoes;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled: true,
    placeholderData: (previousData) => previousData,
    select: (data) => data,
    onError: () => toast.error('Erro ao carregar dados'),
  });

  // Agenda do dia
  const agendaHojeQuery = useQuery({
    queryKey: ['dashboard-agenda-hoje'],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: true,
    placeholderData: (previousData) => previousData,
    select: (data) => data,
    onError: () => toast.error('Erro ao carregar dados'),
    gcTime: 1000 * 60 * 30,
    retry: 3,
    queryFn: async (): Promise<AgendaDia[]> => {
      const hoje = format(new Date(), 'yyyy-MM-dd');
      
      const { data: entrevistas } = await supabase
        .from('entrevistas')
        .select('id, hora_inicio, tipo, etapa, candidato_nome, local, link_online')
        .eq('data', hoje)
        .in('status', ['agendada', 'confirmada'])
        .order('hora_inicio', { ascending: true });

      if (!entrevistas) return [];

      const etapaLabels: Record<string, string> = {
        entrevista_rh: 'Entrevista RH',
        entrevista_gestor: 'Entrevista Gestor',
        entrevista_final: 'Entrevista Final',
        teste_tecnico: 'Teste Técnico',
      };

      return entrevistas.map(e => ({
        id: e.id,
        hora: e.hora_inicio?.slice(0, 5) || '00:00',
        tipo: e.etapa?.includes('teste') ? 'teste' : 'entrevista',
        titulo: etapaLabels[e.etapa] || e.etapa,
        candidato: e.candidato_nome,
        local: e.tipo === 'video' ? 'Online' : (e.local || 'A definir'),
      }));
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
    enabled: true,
    placeholderData: (previousData) => previousData,
    select: (data) => data,
    onError: () => toast.error('Erro ao carregar dados'), // 1 minuto
  });

  // Top candidatos (processos)
  const processosQuery = useQuery({
    queryKey: ['dashboard-processos'],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: true,
    placeholderData: (previousData) => previousData,
    select: (data) => data,
    onError: () => toast.error('Erro ao carregar dados'),
    gcTime: 1000 * 60 * 30,
    retry: 3,
    queryFn: async (): Promise<ProcessoSeletivo[]> => {
      const { data } = await supabase
        .from('processos_seletivos')
        .select('*')
        .eq('status', 'em_andamento')
        .order('match_score', { ascending: false })
        .limit(10);

      if (!data) return [];

      return data.map(p => ({
        id: p.id,
        vagaId: p.vaga_id || '',
        vagaTitulo: p.vaga_titulo,
        candidatoId: p.candidato_id || '',
        candidatoNome: p.candidato_nome,
        candidatoFoto: p.candidato_foto || undefined,
        etapaAtual: p.etapa_atual as ProcessoSeletivo['etapaAtual'],
        status: p.status as ProcessoSeletivo['status'],
        matchScore: p.match_score || 0,
        origem: (p.origem || 'portal') as FonteCandidato,
        dataInscricao: new Date(p.data_inscricao),
        dataUltimaMovimentacao: new Date(p.data_ultima_movimentacao),
        diasNaEtapa: p.dias_na_etapa || 0,
      }));
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled: true,
    placeholderData: (previousData) => previousData,
    select: (data) => data,
    onError: () => toast.error('Erro ao carregar dados'),
  });

  return {
    kpiData: kpisQuery.data,
    funilData: funilQuery.data || [],
    vagasUrgentes: vagasUrgentesQuery.data || [],
    acoesPendentes: acoesPendentesQuery.data || [],
    agendaDia: agendaHojeQuery.data || [],
    processos: processosQuery.data || [],
    isLoading: kpisQuery.isLoading || funilQuery.isLoading || vagasUrgentesQuery.isLoading,
    isError: kpisQuery.isError || funilQuery.isError,
  };
}

export type UseDashboardDataReturn = ReturnType<typeof useDashboardData>;
