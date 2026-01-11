/**
 * @module useAssessments
 * @description Hooks para gerenciar assessments comportamentais e culturais
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { 
  Assessment, 
  AssessmentQuestao, 
  AssessmentResposta,
  DISCResultado,
  CulturalResultado,
  AssessmentOpcao
} from '@/types/selection';

export function useAssessments() {
  return useQuery({
    queryKey: ['assessments'],
    queryFn: async (): Promise<Assessment[]> => {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('ativo', true)
        .order('titulo');

      if (error) throw error;

      return (data || []).map(row => ({
        id: row.id,
        titulo: row.titulo,
        descricao: row.descricao || undefined,
        tipo: row.tipo as Assessment['tipo'],
        instrucoes: row.instrucoes || undefined,
        duracaoEstimada: row.duracao_estimada || 15,
        totalQuestoes: row.total_questoes || 0,
        ativo: row.ativo ?? true,
        versao: row.versao || 1,
      }));
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useAssessment(id: string) {
  return useQuery({
    queryKey: ['assessments', id],
    queryFn: async (): Promise<Assessment | null> => {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const { data: questoes } = await supabase
        .from('assessment_questoes')
        .select('*')
        .eq('assessment_id', id)
        .order('ordem');

      return {
        id: data.id,
        titulo: data.titulo,
        descricao: data.descricao || undefined,
        tipo: data.tipo as Assessment['tipo'],
        instrucoes: data.instrucoes || undefined,
        duracaoEstimada: data.duracao_estimada || 15,
        totalQuestoes: data.total_questoes || 0,
        ativo: data.ativo ?? true,
        versao: data.versao || 1,
        questoes: (questoes || []).map(q => ({
          id: q.id,
          assessmentId: q.assessment_id || '',
          texto: q.texto,
          tipo: q.tipo as AssessmentQuestao['tipo'],
          opcoes: (q.opcoes as unknown as AssessmentOpcao[]) || undefined,
          dimensao: q.dimensao || undefined,
          peso: Number(q.peso) || 1,
          ordem: q.ordem || 0,
          obrigatoria: q.obrigatoria ?? true,
        })),
      };
    },
    enabled: !!id,
  });
}

export function useSubmitAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assessmentId,
      candidatoId,
      processoId,
      respostas,
      tempoGasto,
    }: {
      assessmentId: string;
      candidatoId: string;
      processoId?: string;
      respostas: Record<string, number | string>;
      tempoGasto: number;
    }) => {
      const { data: assessment } = await supabase
        .from('assessments')
        .select('tipo')
        .eq('id', assessmentId)
        .single();

      const { data: questoes } = await supabase
        .from('assessment_questoes')
        .select('*')
        .eq('assessment_id', assessmentId);

      let resultados: DISCResultado | CulturalResultado | null = null;

      if (assessment?.tipo === 'disc') {
        resultados = calcularDISC(respostas, questoes || []);
      } else if (assessment?.tipo === 'cultural') {
        resultados = calcularCultural(respostas, questoes || []);
      }

      const { data, error } = await supabase
        .from('assessment_respostas')
        .insert({
          assessment_id: assessmentId,
          candidato_id: candidatoId,
          processo_id: processoId || null,
          respostas: respostas as unknown as { [key: string]: string },
          resultados: resultados as unknown as { [key: string]: string } | null,
          tempo_gasto: tempoGasto,
          finalizado_em: new Date().toISOString(),
          status: 'finalizado',
        })
        .select()
        .single();

      if (error) throw error;
      return { id: data.id, resultados };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment-respostas'] });
    },
  });
}

export function useCandidateAssessments(candidatoId: string) {
  return useQuery({
    queryKey: ['assessment-respostas', candidatoId],
    queryFn: async (): Promise<(AssessmentResposta & { assessmentTitulo: string; assessmentTipo: string })[]> => {
      const { data, error } = await supabase
        .from('assessment_respostas')
        .select(`*, assessments:assessment_id (titulo, tipo)`)
        .eq('candidato_id', candidatoId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(row => ({
        id: row.id,
        assessmentId: row.assessment_id || '',
        candidatoId: row.candidato_id || '',
        processoId: row.processo_id || undefined,
        respostas: (row.respostas as Record<string, number | string>) || {},
        resultados: row.resultados as unknown as DISCResultado | CulturalResultado | undefined,
        tempoGasto: row.tempo_gasto || undefined,
        iniciadoEm: row.iniciado_em || '',
        finalizadoEm: row.finalizado_em || undefined,
        status: (row.status as AssessmentResposta['status']) || 'em_andamento',
        assessmentTitulo: (row.assessments as { titulo?: string })?.titulo || '',
        assessmentTipo: (row.assessments as { tipo?: string })?.tipo || '',
      }));
    },
    enabled: !!candidatoId,
  });
}

function calcularDISC(
  respostas: Record<string, number | string>,
  questoes: { id: string; opcoes: unknown }[]
): DISCResultado {
  const scores = { D: 0, I: 0, S: 0, C: 0 };
  
  Object.entries(respostas).forEach(([questaoId, respostaIdx]) => {
    const questao = questoes.find(q => q.id === questaoId);
    if (questao?.opcoes && Array.isArray(questao.opcoes)) {
      const opcao = (questao.opcoes as { dimensao?: string; valor?: number }[])[Number(respostaIdx)];
      if (opcao?.dimensao && opcao.dimensao in scores) {
        scores[opcao.dimensao as keyof typeof scores] += opcao.valor || 1;
      }
    }
  });

  const total = scores.D + scores.I + scores.S + scores.C;
  const normalized = {
    D: total > 0 ? Math.round((scores.D / total) * 100) : 25,
    I: total > 0 ? Math.round((scores.I / total) * 100) : 25,
    S: total > 0 ? Math.round((scores.S / total) * 100) : 25,
    C: total > 0 ? Math.round((scores.C / total) * 100) : 25,
  };

  const sorted = Object.entries(normalized).sort((a, b) => b[1] - a[1]);
  const perfilPrimario = (sorted[0]?.[0] || 'D') as 'D' | 'I' | 'S' | 'C';
  const perfilSecundario = (sorted[1]?.[0] || 'I') as 'D' | 'I' | 'S' | 'C';

  return {
    dominancia: normalized.D,
    influencia: normalized.I,
    estabilidade: normalized.S,
    conformidade: normalized.C,
    perfilPrimario,
    perfilSecundario,
    descricao: 'Perfil comportamental calculado',
    pontosFortes: ['Adaptabilidade', 'Comunicação'],
    areasDesenvolvimento: ['Gestão de tempo'],
  };
}

function calcularCultural(
  respostas: Record<string, number | string>,
  questoes: { id: string; dimensao?: string | null }[]
): CulturalResultado {
  const scores: Record<string, number[]> = {};

  Object.entries(respostas).forEach(([questaoId, valor]) => {
    const questao = questoes.find(q => q.id === questaoId);
    const dimensao = questao?.dimensao;
    if (dimensao) {
      if (!scores[dimensao]) scores[dimensao] = [];
      scores[dimensao].push(Number(valor));
    }
  });

  const averages: Record<string, number> = {};
  Object.entries(scores).forEach(([dim, vals]) => {
    averages[dim] = vals.length > 0 ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20) : 0;
  });

  const alinhamentos = Object.entries(averages).map(([valor, score]) => ({
    valor,
    score,
    status: score >= 80 ? 'alto' : score >= 60 ? 'medio' : 'baixo' as 'alto' | 'medio' | 'baixo',
  }));

  const fitGeral = Object.values(averages).length > 0
    ? Math.round(Object.values(averages).reduce((a, b) => a + b, 0) / Object.values(averages).length)
    : 0;

  return { scores: averages, fitGeral, alinhamentos, observacoes: 'Análise cultural concluída' };
}
