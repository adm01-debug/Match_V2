import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface KPIData {
  vagasAbertas: number;
  vagasNovas: number;
  candidatosTotal: number;
  candidatosNovos: number;
  emProcesso: number;
  vagasEmProcesso: number;
  contratadosMes: number;
  metaContratacao: number;
  tempoMedio: number;
  metaTempo: number;
}

interface FunilEtapa {
  etapa: string;
  etapaLabel: string;
  quantidade: number;
  percentual: number;
  cor: string;
}

interface VagaUrgente {
  id: string;
  titulo: string;
  departamento: string;
  candidatos: number;
  emProcesso: number;
  diasAberta: number;
  quantidade: number;
  prioridade: string;
}

interface AcaoPendente {
  tipo: string;
  quantidade: number;
  descricao: string;
  alerta: boolean;
}

interface AgendaDia {
  id: string;
  hora: string;
  tipo: string;
  titulo: string;
  candidato: string;
  local: string;
}

interface TopCandidato {
  id: string;
  nome: string;
  foto: string | null;
  vaga: string;
  etapa: string;
  matchScore: number;
  diasNoProcesso: number;
}

interface UseDashboardReturn {
  kpiData: KPIData;
  funilData: FunilEtapa[];
  vagasUrgentes: VagaUrgente[];
  acoesPendentes: AcaoPendente[];
  agendaHoje: AgendaDia[];
  topCandidatos: TopCandidato[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CORES_FUNIL = [
  'hsl(217, 91%, 60%)',
  'hsl(263, 70%, 50%)',
  'hsl(280, 70%, 50%)',
  'hsl(38, 92%, 50%)',
  'hsl(330, 81%, 60%)',
  'hsl(160, 84%, 39%)',
  'hsl(158, 64%, 32%)',
  'hsl(160, 84%, 25%)',
];

const ETAPAS_LABELS: Record<string, string> = {
  novo: 'Novos',
  em_triagem: 'Triagem',
  pre_selecao: 'Pré-seleção',
  entrevista_rh: 'Entrevista RH',
  teste_tecnico: 'Testes',
  entrevista_gestor: 'Ent. Gestor',
  entrevista_final: 'Ent. Final',
  aprovado: 'Aprovados',
  proposta_enviada: 'Proposta',
  contratado: 'Contratados',
};

export function useDashboard(): UseDashboardReturn {
  const [kpiData, setKpiData] = useState<KPIData>({
    vagasAbertas: 0,
    vagasNovas: 0,
    candidatosTotal: 0,
    candidatosNovos: 0,
    emProcesso: 0,
    vagasEmProcesso: 0,
    contratadosMes: 0,
    metaContratacao: 5,
    tempoMedio: 0,
    metaTempo: 25,
  });
  const [funilData, setFunilData] = useState<FunilEtapa[]>([]);
  const [vagasUrgentes, setVagasUrgentes] = useState<VagaUrgente[]>([]);
  const [acoesPendentes, setAcoesPendentes] = useState<AcaoPendente[]>([]);
  const [agendaHoje, setAgendaHoje] = useState<AgendaDia[]>([]);
  const [topCandidatos, setTopCandidatos] = useState<TopCandidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchKPIs = useCallback(async () => {
    try {
      const agora = new Date();
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
      const inicioSemana = new Date(agora);
      inicioSemana.setDate(agora.getDate() - 7);

      // Vagas abertas
      const { count: vagasAbertas } = await supabase
        .from('vagas')
        .select('*', { count: 'exact', head: true })
        .in('status', ['publicada', 'em_selecao']);

      // Vagas novas (última semana)
      const { count: vagasNovas } = await supabase
        .from('vagas')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', inicioSemana.toISOString());

      // Total de candidatos
      const { count: candidatosTotal } = await supabase
        .from('candidatos')
        .select('*', { count: 'exact', head: true });

      // Candidatos novos (este mês)
      const { count: candidatosNovos } = await supabase
        .from('candidatos')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', inicioMes.toISOString());

      // Em processo
      const { count: emProcesso } = await supabase
        .from('processos_seletivos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'em_andamento');

      // Vagas com candidatos em processo
      const { data: vagasEmProcessoData } = await supabase
        .from('processos_seletivos')
        .select('vaga_id')
        .eq('status', 'em_andamento');
      
      const vagasUnicas = new Set(vagasEmProcessoData?.map(p => p.vaga_id));
      const vagasEmProcesso = vagasUnicas.size;

      // Contratados este mês
      const { count: contratadosMes } = await supabase
        .from('processos_seletivos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'contratado')
        .gte('updated_at', inicioMes.toISOString());

      // Tempo médio (processos concluídos)
      const { data: processosConcluidos } = await supabase
        .from('processos_seletivos')
        .select('data_inscricao, data_ultima_movimentacao')
        .eq('status', 'contratado')
        .gte('updated_at', inicioMes.toISOString());

      let tempoMedio = 0;
      if (processosConcluidos && processosConcluidos.length > 0) {
        const tempos = processosConcluidos.map(p => {
          const inicio = new Date(p.data_inscricao);
          const fim = new Date(p.data_ultima_movimentacao);
          return Math.floor((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
        });
        tempoMedio = Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length);
      }

      setKpiData({
        vagasAbertas: vagasAbertas || 0,
        vagasNovas: vagasNovas || 0,
        candidatosTotal: candidatosTotal || 0,
        candidatosNovos: candidatosNovos || 0,
        emProcesso: emProcesso || 0,
        vagasEmProcesso,
        contratadosMes: contratadosMes || 0,
        metaContratacao: 5,
        tempoMedio,
        metaTempo: 25,
      });
    } catch (err) {
      console.error('Erro ao buscar KPIs:', err);
    }
  }, []);

  const fetchFunil = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('processos_seletivos')
        .select('etapa_atual')
        .eq('status', 'em_andamento');

      if (!data) return;

      // Contar por etapa
      const contagem: Record<string, number> = {};
      data.forEach(p => {
        contagem[p.etapa_atual] = (contagem[p.etapa_atual] || 0) + 1;
      });

      // Ordenar etapas
      const etapasOrdem = [
        'novo', 'em_triagem', 'pre_selecao', 'entrevista_rh',
        'teste_tecnico', 'entrevista_gestor', 'entrevista_final',
        'aprovado', 'proposta_enviada', 'contratado'
      ];

      const total = data.length;
      const funil: FunilEtapa[] = etapasOrdem
        .filter(etapa => contagem[etapa] > 0)
        .map((etapa, index) => ({
          etapa,
          etapaLabel: ETAPAS_LABELS[etapa] || etapa,
          quantidade: contagem[etapa],
          percentual: total > 0 ? Math.round((contagem[etapa] / total) * 100) : 0,
          cor: CORES_FUNIL[index % CORES_FUNIL.length],
        }));

      setFunilData(funil);
    } catch (err) {
      console.error('Erro ao buscar funil:', err);
    }
  }, []);

  const fetchVagasUrgentes = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('vagas')
        .select('*')
        .in('status', ['publicada', 'em_selecao'])
        .in('prioridade', ['urgente', 'alta'])
        .order('prioridade', { ascending: true })
        .limit(5);

      if (!data) return;

      const urgentes: VagaUrgente[] = data.map(v => ({
        id: v.id,
        titulo: v.titulo,
        departamento: v.departamento,
        candidatos: v.total_candidatos,
        emProcesso: v.em_processo,
        diasAberta: Math.floor((Date.now() - new Date(v.created_at).getTime()) / (1000 * 60 * 60 * 24)),
        quantidade: v.quantidade,
        prioridade: v.prioridade,
      }));

      setVagasUrgentes(urgentes);
    } catch (err) {
      console.error('Erro ao buscar vagas urgentes:', err);
    }
  }, []);

  const fetchAcoesPendentes = useCallback(async () => {
    try {
      const acoes: AcaoPendente[] = [];
      const tresDiasAtras = new Date();
      tresDiasAtras.setDate(tresDiasAtras.getDate() - 3);

      // Candidatos aguardando feedback há +3 dias
      const { count: semFeedback } = await supabase
        .from('processos_seletivos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'em_andamento')
        .lt('data_ultima_movimentacao', tresDiasAtras.toISOString());

      if (semFeedback && semFeedback > 0) {
        acoes.push({
          tipo: 'feedback',
          quantidade: semFeedback,
          descricao: 'candidatos aguardam feedback há +3 dias',
          alerta: true,
        });
      }

      // Entrevistas para agendar (candidatos em etapa de entrevista)
      const { count: emEntrevista } = await supabase
        .from('processos_seletivos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'em_andamento')
        .in('etapa_atual', ['entrevista_rh', 'entrevista_gestor', 'entrevista_final']);

      if (emEntrevista && emEntrevista > 0) {
        acoes.push({
          tipo: 'agendar',
          quantidade: emEntrevista,
          descricao: 'candidatos em etapa de entrevista',
          alerta: false,
        });
      }

      // Propostas aguardando resposta
      const { count: propostasPendentes } = await supabase
        .from('processos_seletivos')
        .select('*', { count: 'exact', head: true })
        .eq('etapa_atual', 'proposta_enviada')
        .eq('status', 'em_andamento');

      if (propostasPendentes && propostasPendentes > 0) {
        acoes.push({
          tipo: 'proposta',
          quantidade: propostasPendentes,
          descricao: 'propostas aguardam resposta',
          alerta: true,
        });
      }

      setAcoesPendentes(acoes);
    } catch (err) {
      console.error('Erro ao buscar ações pendentes:', err);
    }
  }, []);

  const fetchAgendaHoje = useCallback(async () => {
    try {
      const hoje = new Date();
      const hojeStr = hoje.toISOString().split('T')[0];

      const { data } = await supabase
        .from('entrevistas')
        .select('*')
        .eq('data', hojeStr)
        .in('status', ['agendada', 'confirmada'])
        .order('hora_inicio', { ascending: true });

      if (!data) return;

      const agenda: AgendaDia[] = data.map(e => ({
        id: e.id,
        hora: e.hora_inicio,
        tipo: e.tipo,
        titulo: `Entrevista ${e.etapa.replace(/_/g, ' ')}`,
        candidato: e.candidato_nome,
        local: e.link_online || e.local || 'A definir',
      }));

      setAgendaHoje(agenda);
    } catch (err) {
      console.error('Erro ao buscar agenda:', err);
    }
  }, []);

  const fetchTopCandidatos = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('processos_seletivos')
        .select('*')
        .eq('status', 'em_andamento')
        .gte('match_score', 80)
        .order('match_score', { ascending: false })
        .limit(5);

      if (!data) return;

      const top: TopCandidato[] = data.map(p => ({
        id: p.id,
        nome: p.candidato_nome,
        foto: p.candidato_foto,
        vaga: p.vaga_titulo,
        etapa: ETAPAS_LABELS[p.etapa_atual] || p.etapa_atual,
        matchScore: p.match_score || 0,
        diasNoProcesso: Math.floor((Date.now() - new Date(p.data_inscricao).getTime()) / (1000 * 60 * 60 * 24)),
      }));

      setTopCandidatos(top);
    } catch (err) {
      console.error('Erro ao buscar top candidatos:', err);
    }
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchKPIs(),
        fetchFunil(),
        fetchVagasUrgentes(),
        fetchAcoesPendentes(),
        fetchAgendaHoje(),
        fetchTopCandidatos(),
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar dashboard';
      setError(message);
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [fetchKPIs, fetchFunil, fetchVagasUrgentes, fetchAcoesPendentes, fetchAgendaHoje, fetchTopCandidatos, toast]);

  // Subscriptions para atualização em tempo real
  useEffect(() => {
    const channels = [
      supabase.channel('dashboard-vagas')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'vagas' }, refetch),
      supabase.channel('dashboard-processos')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'processos_seletivos' }, refetch),
      supabase.channel('dashboard-entrevistas')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'entrevistas' }, refetch),
    ];

    channels.forEach(ch => ch.subscribe());

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, [refetch]);

  // Fetch inicial
  useEffect(() => {
    refetch();
  }, []);

  return {
    kpiData,
    funilData,
    vagasUrgentes,
    acoesPendentes,
    agendaHoje,
    topCandidatos,
    loading,
    error,
    refetch,
  };
}
