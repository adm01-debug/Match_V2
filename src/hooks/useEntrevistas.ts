/**
 * @module useEntrevistas
 * @description Hook para gerenciar entrevistas
 * @returns {Object} Hook result with data, isLoading, error, and mutations
 * @example
 * const { data, isLoading } = useEntrevistas();
 */

import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EntrevistaDB {
  id: string;
  candidato_id: string | null;
  candidato_nome: string;
  vaga_id: string;
  vaga_titulo: string;
  tipo: 'presencial' | 'online' | 'telefone';
  data: string;
  hora_inicio: string;
  hora_fim: string;
  local: string | null;
  link_online: string | null;
  entrevistadores: string[];
  etapa: string;
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'reagendada';
  observacoes: string | null;
  feedback_resultado: 'aprovado' | 'reprovado' | 'pendente' | null;
  feedback_nota: number | null;
  feedback_pontos_fortes: string[] | null;
  feedback_pontos_melhorar: string[] | null;
  feedback_comentarios: string | null;
  feedback_recomendacao: string | null;
  feedback_avaliado_por: string | null;
  feedback_avaliado_em: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface EntrevistasStats {
  total: number;
  realizadas: number;
  aprovados: number;
  reprovados: number;
  pendentes: number;
  taxaAprovacao: number;
  taxaReprovacao: number;
  notaMedia: number;
  agendadas: number;
  confirmadas: number;
}

export interface EvolucaoMensal {
  mes: string;
  aprovados: number;
  reprovados: number;
  total: number;
}

// Converter de DB para formato usado na UI
export function dbToEntrevista(db: EntrevistaDB) {
  return {
    id: db.id,
    candidatoId: db.candidato_id || '',
    candidatoNome: db.candidato_nome,
    vagaId: db.vaga_id,
    vagaTitulo: db.vaga_titulo,
    tipo: db.tipo,
    data: new Date(db.data),
    horaInicio: db.hora_inicio,
    horaFim: db.hora_fim,
    local: db.local || undefined,
    linkOnline: db.link_online || undefined,
    entrevistadores: db.entrevistadores || [],
    etapa: db.etapa,
    status: db.status,
    observacoes: db.observacoes || undefined,
    feedback: db.feedback_resultado ? {
      resultado: db.feedback_resultado,
      notaGeral: db.feedback_nota || 0,
      pontosFortes: db.feedback_pontos_fortes || [],
      pontosAMelhorar: db.feedback_pontos_melhorar || [],
      comentarios: db.feedback_comentarios || '',
      recomendacao: db.feedback_recomendacao || '',
      avaliadoPor: db.feedback_avaliado_por || '',
      avaliadoEm: db.feedback_avaliado_em || ''
    } : undefined
  };
}

export function useEntrevistas() {
  return useQuery({
    queryKey: ['entrevistas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entrevistas')
        .select('*')
        .order('data', { ascending: false });
      
      if (error) throw error;
      return (data as EntrevistaDB[]).map(dbToEntrevista);
    },
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useEntrevistasStats() {
  return useQuery({
    queryKey: ['entrevistas-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entrevistas')
        .select('*');
      
      if (error) throw error;
      
      const entrevistas = data as EntrevistaDB[];
      const realizadas = entrevistas.filter(e => e.status === 'realizada');
      const comFeedback = realizadas.filter(e => e.feedback_resultado);
      const aprovados = comFeedback.filter(e => e.feedback_resultado === 'aprovado').length;
      const reprovados = comFeedback.filter(e => e.feedback_resultado === 'reprovado').length;
      const pendentes = comFeedback.filter(e => e.feedback_resultado === 'pendente').length;
      
      const total = comFeedback.length;
      const taxaAprovacao = total > 0 ? Math.round((aprovados / total) * 100) : 0;
      const taxaReprovacao = total > 0 ? Math.round((reprovados / total) * 100) : 0;
      
      const notaMedia = comFeedback.length > 0
        ? comFeedback.reduce((acc, e) => acc + (e.feedback_nota || 0), 0) / comFeedback.length
        : 0;

      const agendadas = entrevistas.filter(e => e.status === 'agendada').length;
      const confirmadas = entrevistas.filter(e => e.status === 'confirmada').length;

      return {
        total: entrevistas.length,
        realizadas: realizadas.length,
        aprovados,
        reprovados,
        pendentes,
        taxaAprovacao,
        taxaReprovacao,
        notaMedia: parseFloat(notaMedia.toFixed(1)),
        agendadas,
        confirmadas
      } as EntrevistasStats;
    },
    placeholderData: undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useEntrevistasEvolucao() {
  return useQuery({
    queryKey: ['entrevistas-evolucao'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entrevistas')
        .select('*')
        .eq('status', 'realizada')
        .not('feedback_resultado', 'is', null);
      
      if (error) throw error;
      
      const entrevistas = data as EntrevistaDB[];
      
      // Agrupar por mês
      const mesesMap = new Map<string, { aprovados: number; reprovados: number; total: number }>();
      const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      entrevistas.forEach(e => {
        const date = new Date(e.data);
        const mesKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!mesesMap.has(mesKey)) {
          mesesMap.set(mesKey, { aprovados: 0, reprovados: 0, total: 0 });
        }
        
        const stats = mesesMap.get(mesKey)!;
        stats.total++;
        if (e.feedback_resultado === 'aprovado') stats.aprovados++;
        if (e.feedback_resultado === 'reprovado') stats.reprovados++;
      });
      
      // Converter para array ordenado
      const resultado: EvolucaoMensal[] = Array.from(mesesMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-6) // Últimos 6 meses
        .map(([key, stats]) => {
          const [year, month] = key.split('-');
          return {
            mes: mesesNomes[parseInt(month) - 1],
            ...stats
          };
        });
      
      return resultado;
    },
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useEntrevistasPizza() {
  return useQuery({
    queryKey: ['entrevistas-pizza'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entrevistas')
        .select('feedback_resultado')
        .eq('status', 'realizada')
        .not('feedback_resultado', 'is', null);
      
      if (error) throw error;
      
      const entrevistas = data as { feedback_resultado: string }[];
      
      const aprovados = entrevistas.filter(e => e.feedback_resultado === 'aprovado').length;
      const reprovados = entrevistas.filter(e => e.feedback_resultado === 'reprovado').length;
      const pendentes = entrevistas.filter(e => e.feedback_resultado === 'pendente').length;
      
      return [
        { name: 'Aprovados', value: aprovados, color: '#22c55e' },
        { name: 'Reprovados', value: reprovados, color: '#ef4444' },
        { name: 'Pendentes', value: pendentes, color: '#eab308' },
      ];
    },
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useCreateEntrevista() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entrevista: {
      candidato_id?: string;
      candidato_nome: string;
      vaga_id: string;
      vaga_titulo: string;
      tipo: string;
      data: string;
      hora_inicio: string;
      hora_fim: string;
      local?: string;
      link_online?: string;
      entrevistadores: string[];
      etapa: string;
      status: string;
      observacoes?: string;
    }) => {
      const { data, error } = await supabase
        .from('entrevistas')
        .insert(entrevista)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entrevistas'] });
      queryClient.invalidateQueries({ queryKey: ['entrevistas-stats'] });
      queryClient.invalidateQueries({ queryKey: ['entrevistas-evolucao'] });
      queryClient.invalidateQueries({ queryKey: ['entrevistas-pizza'] });
    },
    onError: (error: Error) => {
      // Erro em entrevistas - handled silently
      toast.error('Erro ao processar entrevista');
    },
  });
}

export function useUpdateEntrevista() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<{
      status: string;
      data: string;
      hora_inicio: string;
      hora_fim: string;
      local: string;
      link_online: string;
      entrevistadores: string[];
      etapa: string;
      observacoes: string;
      feedback_resultado: string;
      feedback_nota: number;
      feedback_pontos_fortes: string[];
      feedback_pontos_melhorar: string[];
      feedback_comentarios: string;
      feedback_recomendacao: string;
      feedback_avaliado_por: string;
      feedback_avaliado_em: string;
    }>) => {
      const { data, error } = await supabase
        .from('entrevistas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entrevistas'] });
      queryClient.invalidateQueries({ queryKey: ['entrevistas-stats'] });
      queryClient.invalidateQueries({ queryKey: ['entrevistas-evolucao'] });
      queryClient.invalidateQueries({ queryKey: ['entrevistas-pizza'] });
    },
    onError: (error: Error) => {
      // Erro ao atualizar entrevista - handled silently
    },
  });
}

export function useCandidatosDisponiveis() {
  return useQuery({
    queryKey: ['candidatos-disponiveis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candidatos')
        .select('id, nome')
        .order('nome');
      
      if (error) throw error;
      return data || [];
    },
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

