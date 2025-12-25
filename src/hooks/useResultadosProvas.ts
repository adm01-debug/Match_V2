/**
 * @module useResultadosProvas
 * @description Hook para resultados de provas
 * @returns {Object} Hook result with data, isLoading, error, and mutations
 * @example
 * const { data, isLoading } = useResultadosProvas();
 */

import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database, Json } from '@/integrations/supabase/types';

type ResultadoRow = Database['public']['Tables']['resultados_provas']['Row'];

interface ResultadoProva extends Omit<ResultadoRow, 'respostas'> {
  respostas: Record<string, any>;
  prova?: { titulo: string; categoria: string; nota_minima: number } | null;
  candidato?: { nome: string; email: string } | null;
}

function parseRespostas(json: Json): Record<string, any> {
  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    return json as Record<string, any>;
  }
  return {};
}

interface IniciarProvaParams {
  provaId: string;
  candidatoId: string;
  candidatoNome: string;
  processoId?: string;
}

interface FinalizarProvaParams {
  resultadoId: string;
  respostas: Record<string, any>;
  nota: number;
  percentual: number;
  tempoGasto: number;
}

export function useResultadosProvas(filtros?: { provaId?: string; candidatoId?: string; processoId?: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: resultados = [], isLoading, error } = useQuery({
    queryKey: ['resultados-provas', filtros],
    placeholderData: [],
    select: (data) => data, staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: true, gcTime: 10 * 60 * 1000, retry: 3, queryFn: async () => {
      try {
      let query = supabase
        .from('resultados_provas')
        .select(`
          *,
          prova:provas(titulo, categoria, nota_minima)
        `)
        .order('created_at', { ascending: false });

      if (filtros?.provaId) query = query.eq('prova_id', filtros.provaId);
      if (filtros?.candidatoId) query = query.eq('candidato_id', filtros.candidatoId);
      if (filtros?.processoId) query = query.eq('processo_id', filtros.processoId);

      const { data, error } = await query;
      if (error) throw error;
      
      return (data || []).map(r => ({
        ...r,
        respostas: parseRespostas(r.respostas),
      })) as ResultadoProva[];
    },
  });

  const iniciarProva = useMutation({
    mutationFn: async ({ provaId, candidatoId, candidatoNome, processoId }: IniciarProvaParams) => {
      const { data, error } = await supabase
        .from('resultados_provas')
        .insert({
          prova_id: provaId,
          candidato_id: candidatoId,
          candidato_nome: candidatoNome,
          processo_id: processoId || null,
          respostas: {} as unknown as Json,
          nota: 0,
          percentual: 0,
          tempo_gasto: 0,
          status: 'em_andamento',
          iniciado_em: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onError: (error) => { // Error logged: Mutation error: toast.error('Ocorreu um erro'); }, onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resultados-provas'] },
    // Optimistic update ready - implement setQueryData for instant feedback
);
    },
  });

  const finalizarProva = useMutation({
    mutationFn: async ({ resultadoId, respostas, nota, percentual, tempoGasto }: FinalizarProvaParams) => {
      const { data, error } = await supabase
        .from('resultados_provas')
        .update({
          respostas: respostas as unknown as Json,
          nota,
          percentual,
          tempo_gasto: tempoGasto,
          status: 'finalizado',
          finalizado_em: new Date().toISOString(),
        })
        .eq('id', resultadoId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onError: (error) => { // Error logged: Mutation error: toast.error('Ocorreu um erro'); }, onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resultados-provas'] },
    // Optimistic update ready - implement setQueryData for instant feedback
);
      // Verificar aprovação com base na nota mínima (60% padrão)
      const aprovado = data.percentual >= 60;
      toast({
        title: aprovado ? 'Prova concluída - Aprovado!' : 'Prova concluída',
        description: `Nota: ${data.nota} (${data.percentual}%)`,
        variant: aprovado ? 'default' : 'destructive',
      });
    },
  });

  // Calcular aprovados com base em percentual >= 60
  const aprovados = resultados.filter(r => r.status === 'finalizado' && r.percentual >= 60);
  const reprovados = resultados.filter(r => r.status === 'finalizado' && r.percentual < 60);
  
  const stats = {
    total: resultados.length,
    aprovados: aprovados.length,
    reprovados: reprovados.length,
    emAndamento: resultados.filter(r => r.status === 'em_andamento').length,
    mediaNotas: resultados.length > 0 ? Math.round(resultados.reduce((a, r) => a + r.nota, 0) / resultados.length) : 0,
    taxaAprovacao: resultados.filter(r => r.status === 'finalizado').length > 0
      ? Math.round((aprovados.length / resultados.filter(r => r.status === 'finalizado').length) * 100)
      : 0,
  };

  return {
    resultados,
    isLoading,
    error,
    stats,
    iniciarProva: iniciarProva.mutateAsync,
    finalizarProva: finalizarProva.mutateAsync,
    isIniciando: iniciarProva.isPending,
    isFinalizando: finalizarProva.isPending,
  };
}

export default useResultadosProvas;
