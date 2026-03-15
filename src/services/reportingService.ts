/**
 * @fileoverview Serviço de geração e gerenciamento de relatórios
 */

import { supabase } from '@/integrations/supabase/client';

export type ReportType = 'vagas' | 'candidatos' | 'funil' | 'entrevistas' | 'sla' | 'diversidade' | 'custom';
export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'radar' | 'table';
export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json' | 'png';

export interface ReportConfig {
  id?: string;
  name: string;
  type: ReportType;
  description?: string;
  filters: ReportFilter[];
  metrics: string[];
  groupBy?: string;
  chartType: ChartType;
  dateRange: { start: string; end: string };
  createdAt?: string;
  schedule?: ReportScheduleConfig;
}

export interface ReportFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'like';
  value: string | number | string[];
  label: string;
}

export interface ReportScheduleConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  nextRun?: string;
}

export interface ReportData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
  summary: Record<string, number | string>;
  rawData: Record<string, unknown>[];
}

// Templates de relatórios pré-definidos
export const REPORT_TEMPLATES: ReportConfig[] = [
  {
    name: 'Relatório de Vagas',
    type: 'vagas',
    description: 'Vagas abertas, por departamento, tempo médio de fechamento',
    filters: [],
    metrics: ['total_vagas', 'vagas_abertas', 'vagas_fechadas', 'tempo_medio_fechamento'],
    groupBy: 'departamento',
    chartType: 'bar',
    dateRange: { start: '', end: '' },
  },
  {
    name: 'Relatório de Candidatos',
    type: 'candidatos',
    description: 'Candidatos por período, origem, status e localização',
    filters: [],
    metrics: ['total_candidatos', 'por_origem', 'por_status', 'qualidade_por_fonte'],
    groupBy: 'fonte',
    chartType: 'bar',
    dateRange: { start: '', end: '' },
  },
  {
    name: 'Relatório de Funil',
    type: 'funil',
    description: 'Conversão por etapa, gargalos, tempo em cada etapa',
    filters: [],
    metrics: ['conversao_etapa', 'tempo_por_etapa', 'drop_off', 'gargalos'],
    groupBy: 'etapa_atual',
    chartType: 'bar',
    dateRange: { start: '', end: '' },
  },
  {
    name: 'Relatório de Entrevistas',
    type: 'entrevistas',
    description: 'Entrevistas por período, taxa de comparecimento, por tipo',
    filters: [],
    metrics: ['total_entrevistas', 'taxa_comparecimento', 'por_tipo', 'por_entrevistador'],
    groupBy: 'tipo',
    chartType: 'bar',
    dateRange: { start: '', end: '' },
  },
  {
    name: 'Relatório de SLA',
    type: 'sla',
    description: 'Cumprimento de prazos, tempo de resposta, candidatos em risco',
    filters: [],
    metrics: ['sla_cumprido', 'tempo_resposta', 'candidatos_risco', 'atrasos'],
    groupBy: 'etapa_atual',
    chartType: 'line',
    dateRange: { start: '', end: '' },
  },
  {
    name: 'Relatório de Diversidade',
    type: 'diversidade',
    description: 'Métricas de inclusão, por região, PCD',
    filters: [],
    metrics: ['por_regiao', 'por_genero', 'pcd', 'inclusao'],
    groupBy: 'status',
    chartType: 'pie',
    dateRange: { start: '', end: '' },
  },
];

export async function fetchReportData(config: ReportConfig): Promise<ReportData> {
  switch (config.type) {
    case 'vagas':
      return fetchVagasReport(config);
    case 'candidatos':
      return fetchCandidatosReport(config);
    case 'funil':
      return fetchFunilReport(config);
    case 'entrevistas':
      return fetchEntrevistasReport(config);
    case 'sla':
      return fetchSLAReport(config);
    default:
      return fetchVagasReport(config);
  }
}

async function fetchVagasReport(_config: ReportConfig): Promise<ReportData> {
  const { data: vagas, error } = await supabase
    .from('vagas')
    .select('id, titulo, departamento, status, prioridade, created_at, total_candidatos, contratados');
  if (error) throw error;

  const byDept: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  (vagas || []).forEach(v => {
    byDept[v.departamento] = (byDept[v.departamento] || 0) + 1;
    byStatus[v.status] = (byStatus[v.status] || 0) + 1;
  });

  return {
    labels: Object.keys(byDept),
    datasets: [{ label: 'Vagas por Departamento', data: Object.values(byDept), color: '#6366F1' }],
    summary: {
      total: vagas?.length || 0,
      abertas: vagas?.filter(v => v.status === 'publicada').length || 0,
      fechadas: vagas?.filter(v => v.status === 'encerrada').length || 0,
      contratados: vagas?.reduce((sum, v) => sum + (v.contratados || 0), 0) || 0,
    },
    rawData: vagas || [],
  };
}

async function fetchCandidatosReport(_config: ReportConfig): Promise<ReportData> {
  const { data: candidatos, error } = await supabase
    .from('candidatos')
    .select('id, nome, email, fonte, status, created_at, habilidades');
  if (error) throw error;

  const byFonte: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  (candidatos || []).forEach(c => {
    const fonte = c.fonte || 'Desconhecida';
    byFonte[fonte] = (byFonte[fonte] || 0) + 1;
    const status = c.status || 'novo';
    byStatus[status] = (byStatus[status] || 0) + 1;
  });

  return {
    labels: Object.keys(byFonte),
    datasets: [{ label: 'Candidatos por Fonte', data: Object.values(byFonte), color: '#8B5CF6' }],
    summary: {
      total: candidatos?.length || 0,
      novos: candidatos?.filter(c => c.status === 'novo').length || 0,
      ativos: candidatos?.filter(c => c.status === 'ativo').length || 0,
    },
    rawData: candidatos || [],
  };
}

async function fetchFunilReport(_config: ReportConfig): Promise<ReportData> {
  const { data: processos, error } = await supabase
    .from('processos_seletivos')
    .select('id, etapa_atual, status, created_at, data_ultima_movimentacao, dias_na_etapa');
  if (error) throw error;

  const etapas = ['novo', 'em_triagem', 'entrevista_rh', 'teste_tecnico', 'entrevista_gestor', 'entrevista_final', 'aprovado', 'contratado'];
  const byEtapa: Record<string, number> = {};
  etapas.forEach(e => { byEtapa[e] = 0; });
  const allProcessos = processos || [];
  allProcessos.forEach(p => {
    const etapa = p.etapa_atual;
    if (etapa && etapa in byEtapa) {
      byEtapa[etapa] = (byEtapa[etapa] || 0) + 1;
    }
  });

  return {
    labels: etapas,
    datasets: [{ label: 'Candidatos por Etapa', data: etapas.map(e => byEtapa[e] ?? 0), color: '#22C55E' }],
    summary: {
      total_processos: processos?.length || 0,
      ativos: processos?.filter(p => p.status === 'ativo').length || 0,
      finalizados: processos?.filter(p => ['contratado', 'reprovado', 'desistencia'].includes(p.status)).length || 0,
    },
    rawData: processos || [],
  };
}

async function fetchEntrevistasReport(_config: ReportConfig): Promise<ReportData> {
  const { data: entrevistas, error } = await supabase
    .from('entrevistas')
    .select('id, tipo, status, data, etapa, feedback_resultado');
  if (error) throw error;

  const byTipo: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  (entrevistas || []).forEach(e => {
    byTipo[e.tipo] = (byTipo[e.tipo] || 0) + 1;
    byStatus[e.status] = (byStatus[e.status] || 0) + 1;
  });

  return {
    labels: Object.keys(byTipo),
    datasets: [{ label: 'Entrevistas por Tipo', data: Object.values(byTipo), color: '#F59E0B' }],
    summary: {
      total: entrevistas?.length || 0,
      realizadas: entrevistas?.filter(e => e.status === 'realizada').length || 0,
      agendadas: entrevistas?.filter(e => e.status === 'agendada').length || 0,
      no_show: entrevistas?.filter(e => e.status === 'nao_compareceu').length || 0,
    },
    rawData: entrevistas || [],
  };
}

async function fetchSLAReport(_config: ReportConfig): Promise<ReportData> {
  const { data: processos, error } = await supabase
    .from('processos_seletivos')
    .select('id, etapa_atual, dias_na_etapa, status, data_ultima_movimentacao');
  if (error) throw error;

  const SLA_LIMITS: Record<string, number> = {
    novo: 2, em_triagem: 3, entrevista_rh: 5, teste_tecnico: 7,
    entrevista_gestor: 5, entrevista_final: 3, aprovado: 2,
  };

  const emRisco = (processos || []).filter(p => {
    const limit = SLA_LIMITS[p.etapa_atual] || 5;
    return (p.dias_na_etapa || 0) > limit;
  });

  const etapas = Object.keys(SLA_LIMITS);
  const tempoMedio = etapas.map(etapa => {
    const procs = (processos ?? []).filter(p => p.etapa_atual === etapa);
    if (procs.length === 0) return 0;
    return Math.round(procs.reduce((sum, p) => sum + (p.dias_na_etapa ?? 0), 0) / procs.length);
  });

  return {
    labels: etapas,
    datasets: [
      { label: 'Tempo Médio (dias)', data: tempoMedio, color: '#EF4444' },
      { label: 'SLA Limite (dias)', data: etapas.map(e => SLA_LIMITS[e] ?? 0), color: '#22C55E' },
    ],
    summary: {
      em_risco: emRisco.length,
      dentro_sla: (processos?.length || 0) - emRisco.length,
      taxa_cumprimento: processos?.length ? Math.round(((processos.length - emRisco.length) / processos.length) * 100) : 0,
    },
    rawData: processos || [],
  };
}

export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const firstRow = data[0];
  if (!firstRow) return;
  const headers = Object.keys(firstRow);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      const str = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
      return str.includes(',') ? `"${str}"` : str;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(data: Record<string, unknown>[], filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
