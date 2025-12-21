import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Tipos
export interface DashboardStats {
  totalVagas: number;
  vagasAbertas: number;
  vagasFechadas: number;
  totalCandidatos: number;
  entrevistasHoje: number;
  entrevistasSemana: number;
  taxaConversao: number;
  tempoMedioContratacao: number;
}

export interface VagaUrgente {
  id: string;
  titulo: string;
  departamento: string;
  prioridade: string;
  diasAberta: number;
  candidatos: number;
}

export interface EntrevistaHoje {
  id: string;
  candidato: string;
  vaga: string;
  horario: string;
  tipo: string;
  entrevistador: string;
}

export interface TopCandidato {
  id: string;
  nome: string;
  vaga: string;
  matchScore: number;
  status: string;
}

// Query Keys
const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  vagasUrgentes: () => [...dashboardKeys.all, 'vagasUrgentes'] as const,
  entrevistasHoje: () => [...dashboardKeys.all, 'entrevistasHoje'] as const,
  topCandidatos: () => [...dashboardKeys.all, 'topCandidatos'] as const,
  funil: () => [...dashboardKeys.all, 'funil'] as const,
};

// Fetch Stats
async function fetchDashboardStats(): Promise<DashboardStats> {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [vagasResult, candidatosResult, entrevistasHojeResult, entrevistasSemanaResult] = await Promise.all([
    supabase.from('vagas').select('status', { count: 'exact' }),
    supabase.from('candidatos').select('id', { count: 'exact' }),
    supabase.from('entrevistas').select('id', { count: 'exact' }).eq('data', today),
    supabase.from('entrevistas').select('id', { count: 'exact' }).gte('data', weekAgo),
  ]);

  const vagas = vagasResult.data || [];
  const vagasAbertas = vagas.filter(v => v.status === 'aberta').length;
  const vagasFechadas = vagas.filter(v => v.status === 'fechada').length;

  return {
    totalVagas: vagasResult.count || 0,
    vagasAbertas,
    vagasFechadas,
    totalCandidatos: candidatosResult.count || 0,
    entrevistasHoje: entrevistasHojeResult.count || 0,
    entrevistasSemana: entrevistasSemanaResult.count || 0,
    taxaConversao: 0,
    tempoMedioContratacao: 0,
  };
}

// Fetch Vagas Urgentes
async function fetchVagasUrgentes(): Promise<VagaUrgente[]> {
  const { data, error } = await supabase
    .from('vagas')
    .select('id, titulo, departamento, prioridade, created_at')
    .eq('status', 'aberta')
    .in('prioridade', ['alta', 'urgente'])
    .order('prioridade', { ascending: false })
    .limit(5);

  if (error) throw error;

  return (data || []).map(v => ({
    id: v.id,
    titulo: v.titulo,
    departamento: v.departamento || 'N/A',
    prioridade: v.prioridade || 'normal',
    diasAberta: Math.floor((Date.now() - new Date(v.created_at).getTime()) / (1000 * 60 * 60 * 24)),
    candidatos: 0,
  }));
}

// Fetch Entrevistas Hoje
async function fetchEntrevistasHoje(): Promise<EntrevistaHoje[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('entrevistas')
    .select(`
      id,
      data,
      horario,
      tipo,
      candidatos!inner(nome),
      vagas!inner(titulo),
      profiles!inner(full_name)
    `)
    .eq('data', today)
    .order('horario', { ascending: true })
    .limit(5);

  if (error) throw error;

  return (data || []).map(e => ({
    id: e.id,
    candidato: (e.candidatos as any)?.nome || 'N/A',
    vaga: (e.vagas as any)?.titulo || 'N/A',
    horario: e.horario || 'N/A',
    tipo: e.tipo || 'presencial',
    entrevistador: (e.profiles as any)?.full_name || 'N/A',
  }));
}

// Fetch Top Candidatos
async function fetchTopCandidatos(): Promise<TopCandidato[]> {
  const { data, error } = await supabase
    .from('processos_seletivos')
    .select(`
      id,
      candidatos!inner(id, nome),
      vagas!inner(titulo),
      match_score,
      etapa_atual
    `)
    .order('match_score', { ascending: false })
    .limit(5);

  if (error) throw error;

  return (data || []).map(p => ({
    id: (p.candidatos as any)?.id || p.id,
    nome: (p.candidatos as any)?.nome || 'N/A',
    vaga: (p.vagas as any)?.titulo || 'N/A',
    matchScore: p.match_score || 0,
    status: p.etapa_atual || 'triagem',
  }));
}

// Fetch Funil
async function fetchFunil() {
  const { data, error } = await supabase
    .from('processos_seletivos')
    .select('etapa_atual');

  if (error) throw error;

  const etapas = ['triagem', 'entrevista_rh', 'teste_tecnico', 'entrevista_gestor', 'proposta', 'contratado'];
  const counts: Record<string, number> = {};
  
  etapas.forEach(e => counts[e] = 0);
  (data || []).forEach(p => {
    if (p.etapa_atual && counts[p.etapa_atual] !== undefined) {
      counts[p.etapa_atual]++;
    }
  });

  return etapas.map(etapa => ({
    etapa,
    count: counts[etapa],
  }));
}

// Hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useVagasUrgentes() {
  return useQuery({
    queryKey: dashboardKeys.vagasUrgentes(),
    queryFn: fetchVagasUrgentes,
    staleTime: 1000 * 60 * 5,
  });
}

export function useEntrevistasHoje() {
  return useQuery({
    queryKey: dashboardKeys.entrevistasHoje(),
    queryFn: fetchEntrevistasHoje,
    staleTime: 1000 * 60 * 2,
  });
}

export function useTopCandidatos() {
  return useQuery({
    queryKey: dashboardKeys.topCandidatos(),
    queryFn: fetchTopCandidatos,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFunilRecrutamento() {
  return useQuery({
    queryKey: dashboardKeys.funil(),
    queryFn: fetchFunil,
    staleTime: 1000 * 60 * 5,
  });
}

// Hook combinado (mantém compatibilidade)
export function useDashboard() {
  const stats = useDashboardStats();
  const vagasUrgentes = useVagasUrgentes();
  const entrevistasHoje = useEntrevistasHoje();
  const topCandidatos = useTopCandidatos();
  const funil = useFunilRecrutamento();

  return {
    stats: stats.data,
    vagasUrgentes: vagasUrgentes.data || [],
    entrevistasHoje: entrevistasHoje.data || [],
    topCandidatos: topCandidatos.data || [],
    funil: funil.data || [],
    isLoading: stats.isLoading || vagasUrgentes.isLoading || entrevistasHoje.isLoading,
    isError: stats.isError || vagasUrgentes.isError,
    error: stats.error || vagasUrgentes.error,
  };
}
