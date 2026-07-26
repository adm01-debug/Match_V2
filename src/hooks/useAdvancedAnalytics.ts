/**
 * @module useAdvancedAnalytics
 * @description Métricas estratégicas de recrutamento calculadas a partir de dados reais
 * (vagas, processos seletivos, entrevistas e propostas). Substitui os mocks da página
 * de Analytics Avançado (Etapa 44 do plano de melhorias).
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { METAS_PADRAO } from '@/lib/constants';

export type AnalyticsPeriodo = '30d' | '3m' | '6m' | '1y';

const PERIODO_DIAS: Record<AnalyticsPeriodo, number> = {
  '30d': 30,
  '3m': 90,
  '6m': 180,
  '1y': 365,
};

export interface AdvancedAnalyticsData {
  timeToHireData: Array<{ mes: string; tempo: number; meta: number }>;
  costPerHireData: Array<{ mes: string; custo: number; vagas: number }>;
  sourceEffectivenessData: Array<{
    source: string;
    candidatos: number;
    contratados: number;
    custo: number;
    taxaConversao: number;
  }>;
  conversionFunnelData: Array<{ etapa: string; quantidade: number; conversao: number }>;
  departmentPerformanceData: Array<{
    departamento: string;
    vagas: number;
    preenchidas: number;
    tempoMedio: number;
    custoMedio: number;
  }>;
  qualityOfHireData: Array<{ metrica: string; valor: number; benchmark: number }>;
  kpis: {
    timeToHire: number | null;
    offerAcceptance: number | null;
    qualityOfHire: number | null;
    matchMedio: number | null;
    taxaContratacao: number | null;
    entrevistasRealizadas: number;
  };
}

/** Etapas do funil na ordem canônica, com os status equivalentes em processos_seletivos. */
const FUNIL_ETAPAS: Array<{ label: string; etapas: string[] }> = [
  { label: 'Candidaturas', etapas: [] }, // total
  { label: 'Triagem', etapas: ['em_triagem', 'pre_selecao', 'entrevista_rh', 'teste_tecnico', 'entrevista_gestor', 'entrevista_final', 'aprovado', 'proposta_enviada', 'contratado'] },
  { label: 'Entrevista RH', etapas: ['entrevista_rh', 'teste_tecnico', 'entrevista_gestor', 'entrevista_final', 'aprovado', 'proposta_enviada', 'contratado'] },
  { label: 'Teste Técnico', etapas: ['teste_tecnico', 'entrevista_gestor', 'entrevista_final', 'aprovado', 'proposta_enviada', 'contratado'] },
  { label: 'Entrevista Gestor', etapas: ['entrevista_gestor', 'entrevista_final', 'aprovado', 'proposta_enviada', 'contratado'] },
  { label: 'Proposta', etapas: ['proposta_enviada', 'contratado'] },
  { label: 'Contratado', etapas: ['contratado'] },
];

const mesLabel = (iso: string): string =>
  new Date(iso).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');

const media = (valores: number[]): number | null =>
  valores.length ? Math.round(valores.reduce((a, b) => a + b, 0) / valores.length) : null;

export function useAdvancedAnalytics(periodo: AnalyticsPeriodo = '6m') {
  return useQuery({
    queryKey: ['advanced-analytics', periodo],
    queryFn: async (): Promise<AdvancedAnalyticsData> => {
      const desde = new Date(Date.now() - PERIODO_DIAS[periodo] * 86400000).toISOString();

      const [vagasRes, processosRes, entrevistasRes, propostasRes] = await Promise.all([
        supabase
          .from('vagas')
          .select('id, departamento, status, data_publicacao, data_encerramento, contratados, quantidade')
          .is('deleted_at', null),
        supabase
          .from('processos_seletivos')
          .select('id, etapa_atual, origem, match_score, data_inscricao')
          .is('deleted_at', null)
          .gte('data_inscricao', desde),
        supabase
          .from('entrevistas')
          .select('id, status, feedback_nota, feedback_resultado')
          .is('deleted_at', null)
          .gte('created_at', desde),
        supabase.from('propostas').select('id, status').gte('created_at', desde),
      ]);

      if (vagasRes.error) throw vagasRes.error;
      if (processosRes.error) throw processosRes.error;
      if (entrevistasRes.error) throw entrevistasRes.error;

      const vagas = vagasRes.data ?? [];
      const processos = processosRes.data ?? [];
      const entrevistas = entrevistasRes.data ?? [];
      const propostas = propostasRes.data ?? [];

      // ---- Time to hire por mês (vagas encerradas no período) --------------
      const encerradas = vagas.filter(
        (v) => v.data_encerramento && v.data_publicacao && v.data_encerramento >= desde,
      );
      const porMes = new Map<string, { dias: number[]; vagas: number }>();
      for (const v of encerradas) {
        const key = mesLabel(v.data_encerramento as string);
        const dias = Math.max(
          0,
          Math.round(
            (new Date(v.data_encerramento as string).getTime() -
              new Date(v.data_publicacao as string).getTime()) /
              86400000,
          ),
        );
        const atual = porMes.get(key) ?? { dias: [], vagas: 0 };
        atual.dias.push(dias);
        atual.vagas += 1;
        porMes.set(key, atual);
      }

      const timeToHireData = Array.from(porMes.entries()).map(([mes, v]) => ({
        mes,
        tempo: media(v.dias) ?? 0,
        meta: METAS_PADRAO.tempoMedioContratacao,
      }));

      // Sem fonte de custo cadastrada: expõe o volume real e custo 0 (N/D na UI).
      const costPerHireData = Array.from(porMes.entries()).map(([mes, v]) => ({
        mes,
        custo: 0,
        vagas: v.vagas,
      }));

      // ---- Efetividade por fonte -------------------------------------------
      const fontes = new Map<string, { candidatos: number; contratados: number }>();
      for (const p of processos) {
        const key = p.origem || 'Direto';
        const atual = fontes.get(key) ?? { candidatos: 0, contratados: 0 };
        atual.candidatos += 1;
        if (p.etapa_atual === 'contratado') atual.contratados += 1;
        fontes.set(key, atual);
      }
      const sourceEffectivenessData = Array.from(fontes.entries())
        .map(([source, v]) => ({
          source,
          candidatos: v.candidatos,
          contratados: v.contratados,
          custo: 0,
          taxaConversao: v.candidatos
            ? Math.round((v.contratados / v.candidatos) * 1000) / 10
            : 0,
        }))
        .sort((a, b) => b.candidatos - a.candidatos);

      // ---- Funil de conversão ----------------------------------------------
      const total = processos.length;
      let anterior = total;
      const conversionFunnelData = FUNIL_ETAPAS.map(({ label, etapas }) => {
        const quantidade = etapas.length
          ? processos.filter((p) => etapas.includes(p.etapa_atual ?? '')).length
          : total;
        const conversao = anterior ? Math.round((quantidade / anterior) * 100) : 0;
        anterior = quantidade || anterior;
        return { etapa: label, quantidade, conversao };
      });

      // ---- Performance por departamento ------------------------------------
      const deptos = new Map<string, { vagas: number; preenchidas: number; dias: number[] }>();
      for (const v of vagas) {
        const key = v.departamento || 'Não informado';
        const atual = deptos.get(key) ?? { vagas: 0, preenchidas: 0, dias: [] };
        atual.vagas += 1;
        if ((v.contratados ?? 0) > 0) atual.preenchidas += 1;
        if (v.data_encerramento && v.data_publicacao) {
          atual.dias.push(
            Math.max(
              0,
              Math.round(
                (new Date(v.data_encerramento).getTime() - new Date(v.data_publicacao).getTime()) /
                  86400000,
              ),
            ),
          );
        }
        deptos.set(key, atual);
      }
      const departmentPerformanceData = Array.from(deptos.entries())
        .map(([departamento, v]) => ({
          departamento,
          vagas: v.vagas,
          preenchidas: v.preenchidas,
          tempoMedio: media(v.dias) ?? 0,
          custoMedio: 0,
        }))
        .sort((a, b) => b.vagas - a.vagas);

      // ---- Qualidade --------------------------------------------------------
      const notas = entrevistas
        .map((e) => e.feedback_nota)
        .filter((n): n is number => typeof n === 'number');
      const notaMedia = notas.length ? Math.round((media(notas) ?? 0) * 20) : 0;

      const avaliadas = entrevistas.filter((e) => e.feedback_resultado);
      const aprovacao = avaliadas.length
        ? Math.round(
            (avaliadas.filter((e) => e.feedback_resultado === 'aprovado').length /
              avaliadas.length) *
              100,
          )
        : 0;

      const propostasFinalizadas = propostas.filter((p) =>
        ['aceita', 'recusada'].includes(p.status ?? ''),
      );
      const offerAcceptance = propostasFinalizadas.length
        ? Math.round(
            (propostasFinalizadas.filter((p) => p.status === 'aceita').length /
              propostasFinalizadas.length) *
              100,
          )
        : null;

      const matchScores = processos
        .map((p) => p.match_score)
        .filter((s): s is number => typeof s === 'number');
      const matchMedio = media(matchScores);

      const qualityOfHireData = [
        { metrica: 'Nota de Entrevistas', valor: notaMedia, benchmark: 80 },
        { metrica: 'Aprovação em Entrevistas', valor: aprovacao, benchmark: 60 },
        { metrica: 'Aceite de Propostas', valor: offerAcceptance ?? 0, benchmark: 85 },
        { metrica: 'Match Médio', valor: matchMedio ?? 0, benchmark: 75 },
        {
          metrica: 'Conversão do Funil',
          valor: total
            ? Math.round(
                (processos.filter((p) => p.etapa_atual === 'contratado').length / total) * 100,
              )
            : 0,
          benchmark: METAS_PADRAO.taxaConversao,
        },
      ];

      const contratados = processos.filter((p) => p.etapa_atual === 'contratado').length;

      return {
        timeToHireData,
        costPerHireData,
        sourceEffectivenessData,
        conversionFunnelData,
        departmentPerformanceData,
        qualityOfHireData,
        kpis: {
          timeToHire: media(encerradas.map((v) =>
            Math.max(
              0,
              Math.round(
                (new Date(v.data_encerramento as string).getTime() -
                  new Date(v.data_publicacao as string).getTime()) /
                  86400000,
              ),
            ),
          )),
          offerAcceptance,
          qualityOfHire: media([notaMedia, aprovacao, matchMedio ?? 0].filter((n) => n > 0)),
          matchMedio,
          taxaContratacao: total ? Math.round((contratados / total) * 100) : null,
          entrevistasRealizadas: entrevistas.filter((e) => e.status === 'realizada').length,
        },
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}
