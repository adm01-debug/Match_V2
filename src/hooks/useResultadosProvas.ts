import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ResultadoProva {
  id: string;
  prova_id: string;
  candidato_id: string;
  processo_id: string | null;
  respostas: Record<string, any>;
  nota: number;
  percentual: number;
  aprovado: boolean;
  tempo_gasto_minutos: number | null;
  iniciado_em: string;
  finalizado_em: string | null;
  created_at: string;
  prova?: { titulo: string; categoria: string; nota_minima: number } | null;
  candidato?: { nome: string; email: string } | null;
}

interface IniciarProvaParams {
  provaId: string;
  candidatoId: string;
  processoId?: string;
}

interface FinalizarProvaParams {
  resultadoId: string;
  respostas: Record<string, any>;
  nota: number;
  percentual: number;
  aprovado: boolean;
  tempoGasto: number;
}

export function useResultadosProvas(filtros?: { provaId?: string; candidatoId?: string; processoId?: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: resultados = [], isLoading, error } = useQuery({
    queryKey: ['resultados-provas', filtros],
    queryFn: async () => {
      let query = supabase
        .from('resultados_provas')
        .select(`
          *,
          prova:provas(titulo, categoria, nota_minima),
          candidato:candidatos(nome, email)
        `)
        .order('created_at', { ascending: false });

      if (filtros?.provaId) query = query.eq('prova_id', filtros.provaId);
      if (filtros?.candidatoId) query = query.eq('candidato_id', filtros.candidatoId);
      if (filtros?.processoId) query = query.eq('processo_id', filtros.processoId);

      const { data, error } = await query;
      if (error) throw error;
      return data as ResultadoProva[];
    },
  });

  const iniciarProva = useMutation({
    mutationFn: async ({ provaId, candidatoId, processoId }: IniciarProvaParams) => {
      const { data, error } = await supabase
        .from('resultados_provas')
        .insert({
          prova_id: provaId,
          candidato_id: candidatoId,
          processo_id: processoId,
          respostas: {},
          nota: 0,
          percentual: 0,
          aprovado: false,
          iniciado_em: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resultados-provas'] });
    },
  });

  const finalizarProva = useMutation({
    mutationFn: async ({ resultadoId, respostas, nota, percentual, aprovado, tempoGasto }: FinalizarProvaParams) => {
      const { data, error } = await supabase
        .from('resultados_provas')
        .update({
          respostas,
          nota,
          percentual,
          aprovado,
          tempo_gasto_minutos: tempoGasto,
          finalizado_em: new Date().toISOString(),
        })
        .eq('id', resultadoId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resultados-provas'] });
      toast({
        title: data.aprovado ? 'Prova concluída - Aprovado!' : 'Prova concluída',
        description: `Nota: ${data.nota} (${data.percentual}%)`,
        variant: data.aprovado ? 'default' : 'destructive',
      });
    },
  });

  const stats = {
    total: resultados.length,
    aprovados: resultados.filter(r => r.aprovado).length,
    reprovados: resultados.filter(r => !r.aprovado && r.finalizado_em).length,
    emAndamento: resultados.filter(r => !r.finalizado_em).length,
    mediaNotas: resultados.length > 0 ? Math.round(resultados.reduce((a, r) => a + r.nota, 0) / resultados.length) : 0,
    taxaAprovacao: resultados.filter(r => r.finalizado_em).length > 0
      ? Math.round((resultados.filter(r => r.aprovado).length / resultados.filter(r => r.finalizado_em).length) * 100)
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
