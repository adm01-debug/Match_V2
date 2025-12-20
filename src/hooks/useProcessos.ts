import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  ProcessoSeletivo, 
  ProcessoSeletivoInsert, 
  ProcessoSeletivoUpdate,
  PipelineView,
  HistoricoEtapaInsert
} from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

interface UseProcessosOptions {
  vagaId?: string;
  candidatoId?: string;
  etapa?: string | string[];
  status?: string | string[];
  limit?: number;
}

interface ProcessoComDetalhes extends ProcessoSeletivo {
  candidato?: {
    nome: string;
    email: string;
    foto_url: string | null;
    cargo_atual: string | null;
  };
  vaga?: {
    titulo: string;
    departamento: string;
    prioridade: string;
  };
}

interface UseProcessosReturn {
  processos: ProcessoComDetalhes[];
  pipeline: PipelineView[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  // CRUD
  fetchProcessos: (options?: UseProcessosOptions) => Promise<void>;
  fetchPipeline: (vagaId?: string) => Promise<void>;
  createProcesso: (processo: ProcessoSeletivoInsert) => Promise<ProcessoSeletivo | null>;
  updateProcesso: (id: string, updates: ProcessoSeletivoUpdate) => Promise<ProcessoSeletivo | null>;
  deleteProcesso: (id: string) => Promise<boolean>;
  // Movimentação de Etapa
  moverEtapa: (id: string, novaEtapa: string, observacao?: string) => Promise<boolean>;
  // Status
  aprovarCandidato: (id: string) => Promise<boolean>;
  reprovarCandidato: (id: string, motivo?: string) => Promise<boolean>;
  marcarDesistente: (id: string, motivo?: string) => Promise<boolean>;
  marcarContratado: (id: string) => Promise<boolean>;
  // Histórico
  fetchHistorico: (processoId: string) => Promise<any[]>;
  refetch: () => Promise<void>;
}

export function useProcessos(initialOptions?: UseProcessosOptions): UseProcessosReturn {
  const [processos, setProcessos] = useState<ProcessoComDetalhes[]>([]);
  const [pipeline, setPipeline] = useState<PipelineView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchProcessos = useCallback(async (options?: UseProcessosOptions) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('processos_seletivos')
        .select(`
          *,
          candidato:candidatos(nome, email, foto_url, cargo_atual),
          vaga:vagas(titulo, departamento, prioridade)
        `, { count: 'exact' });

      if (options?.vagaId) {
        query = query.eq('vaga_id', options.vagaId);
      }

      if (options?.candidatoId) {
        query = query.eq('candidato_id', options.candidatoId);
      }

      if (options?.etapa) {
        if (Array.isArray(options.etapa)) {
          query = query.in('etapa_atual', options.etapa);
        } else {
          query = query.eq('etapa_atual', options.etapa);
        }
      }

      if (options?.status) {
        if (Array.isArray(options.status)) {
          query = query.in('status', options.status);
        } else {
          query = query.eq('status', options.status);
        }
      }

      query = query.order('data_ultima_movimentacao', { ascending: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setProcessos(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar processos';
      setError(message);
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchPipeline = useCallback(async (vagaId?: string) => {
    try {
      let query = supabase
        .from('v_pipeline')
        .select('*')
        .order('data_ultima_movimentacao', { ascending: false });

      if (vagaId) {
        query = query.eq('vaga_id', vagaId);
      }

      const { data, error: pipelineError } = await query;

      if (pipelineError) throw pipelineError;
      setPipeline(data || []);
    } catch (err) {
      // View pode não existir, tentar query direta
      try {
        let query = supabase
          .from('processos_seletivos')
          .select(`
            *,
            candidatos(nome, email, foto_url, cargo_atual),
            vagas(titulo, departamento, prioridade)
          `)
          .eq('status', 'em_andamento')
          .order('data_ultima_movimentacao', { ascending: false });

        if (vagaId) {
          query = query.eq('vaga_id', vagaId);
        }

        const { data } = await query;
        
        // Transformar para formato da view
        const transformed = (data || []).map((p: any) => ({
          id: p.id,
          etapa_atual: p.etapa_atual,
          status: p.status,
          match_score: p.match_score,
          data_inscricao: p.data_inscricao,
          data_ultima_movimentacao: p.data_ultima_movimentacao,
          dias_na_etapa: Math.floor((Date.now() - new Date(p.data_ultima_movimentacao).getTime()) / (1000 * 60 * 60 * 24)),
          candidato_id: p.candidato_id,
          candidato_nome: p.candidatos?.nome || '',
          candidato_email: p.candidatos?.email || '',
          candidato_foto: p.candidatos?.foto_url,
          cargo_atual: p.candidatos?.cargo_atual,
          vaga_id: p.vaga_id,
          vaga_titulo: p.vagas?.titulo || '',
          vaga_departamento: p.vagas?.departamento || '',
          vaga_prioridade: p.vagas?.prioridade || 'media',
        }));

        setPipeline(transformed);
      } catch {
        // Silenciar erro se nenhuma opção funcionar
      }
    }
  }, []);

  const createProcesso = useCallback(async (processo: ProcessoSeletivoInsert): Promise<ProcessoSeletivo | null> => {
    try {
      const { data, error: createError } = await supabase
        .from('processos_seletivos')
        .insert(processo)
        .select()
        .single();

      if (createError) throw createError;

      toast({
        title: 'Sucesso',
        description: 'Candidato adicionado ao processo seletivo!',
      });

      await fetchProcessos(initialOptions);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar processo';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return null;
    }
  }, [toast, fetchProcessos, initialOptions]);

  const updateProcesso = useCallback(async (id: string, updates: ProcessoSeletivoUpdate): Promise<ProcessoSeletivo | null> => {
    try {
      const { data, error: updateError } = await supabase
        .from('processos_seletivos')
        .update({
          ...updates,
          data_ultima_movimentacao: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setProcessos(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar processo';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  const deleteProcesso = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('processos_seletivos')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setProcessos(prev => prev.filter(p => p.id !== id));
      setTotalCount(prev => prev - 1);

      toast({
        title: 'Sucesso',
        description: 'Processo removido com sucesso!',
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao remover processo';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  const moverEtapa = useCallback(async (id: string, novaEtapa: string, observacao?: string): Promise<boolean> => {
    try {
      // Buscar etapa atual
      const processo = processos.find(p => p.id === id);
      const etapaAnterior = processo?.etapa_atual;

      // Atualizar processo
      const { error: updateError } = await supabase
        .from('processos_seletivos')
        .update({
          etapa_atual: novaEtapa,
          data_ultima_movimentacao: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // Registrar no histórico (o trigger deve fazer isso, mas garantimos)
      const historico: HistoricoEtapaInsert = {
        processo_id: id,
        etapa_anterior: etapaAnterior || null,
        etapa_nova: novaEtapa,
        observacao: observacao || null,
      };

      await supabase.from('historico_etapas').insert(historico);

      // Atualizar estado local
      setProcessos(prev => prev.map(p => 
        p.id === id 
          ? { ...p, etapa_atual: novaEtapa, data_ultima_movimentacao: new Date().toISOString() }
          : p
      ));

      toast({
        title: 'Etapa atualizada',
        description: `Candidato movido para ${novaEtapa.replace(/_/g, ' ')}`,
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao mover etapa';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return false;
    }
  }, [processos, toast]);

  const aprovarCandidato = useCallback(async (id: string): Promise<boolean> => {
    const result = await updateProcesso(id, {
      status: 'aprovado',
      etapa_atual: 'aprovado',
    });
    if (result) {
      toast({
        title: 'Candidato aprovado!',
        description: 'O candidato foi aprovado no processo seletivo.',
      });
    }
    return result !== null;
  }, [updateProcesso, toast]);

  const reprovarCandidato = useCallback(async (id: string, motivo?: string): Promise<boolean> => {
    const result = await updateProcesso(id, {
      status: 'reprovado',
      etapa_atual: 'reprovado',
      motivo_encerramento: motivo,
      data_conclusao: new Date().toISOString(),
    });
    return result !== null;
  }, [updateProcesso]);

  const marcarDesistente = useCallback(async (id: string, motivo?: string): Promise<boolean> => {
    const result = await updateProcesso(id, {
      status: 'desistente',
      motivo_encerramento: motivo,
      data_conclusao: new Date().toISOString(),
    });
    return result !== null;
  }, [updateProcesso]);

  const marcarContratado = useCallback(async (id: string): Promise<boolean> => {
    const result = await updateProcesso(id, {
      status: 'contratado',
      etapa_atual: 'contratado',
      data_conclusao: new Date().toISOString(),
    });
    if (result) {
      toast({
        title: '🎉 Contratação realizada!',
        description: 'Parabéns! O candidato foi contratado.',
      });
    }
    return result !== null;
  }, [updateProcesso, toast]);

  const fetchHistorico = useCallback(async (processoId: string) => {
    try {
      const { data, error: histError } = await supabase
        .from('historico_etapas')
        .select('*')
        .eq('processo_id', processoId)
        .order('created_at', { ascending: false });

      if (histError) throw histError;
      return data || [];
    } catch {
      return [];
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchProcessos(initialOptions);
    await fetchPipeline(initialOptions?.vagaId);
  }, [fetchProcessos, fetchPipeline, initialOptions]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('processos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'processos_seletivos',
        },
        () => {
          // Refetch ao receber mudanças
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Fetch inicial
  useEffect(() => {
    fetchProcessos(initialOptions);
    fetchPipeline(initialOptions?.vagaId);
  }, []);

  return {
    processos,
    pipeline,
    loading,
    error,
    totalCount,
    fetchProcessos,
    fetchPipeline,
    createProcesso,
    updateProcesso,
    deleteProcesso,
    moverEtapa,
    aprovarCandidato,
    reprovarCandidato,
    marcarDesistente,
    marcarContratado,
    fetchHistorico,
    refetch,
  };
}

// Hook para buscar processos de um candidato específico
export function useProcessosCandidato(candidatoId: string | undefined) {
  const [processos, setProcessos] = useState<ProcessoComDetalhes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!candidatoId) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      const { data } = await supabase
        .from('processos_seletivos')
        .select(`
          *,
          vaga:vagas(titulo, departamento, prioridade)
        `)
        .eq('candidato_id', candidatoId)
        .order('data_inscricao', { ascending: false });

      setProcessos(data || []);
      setLoading(false);
    };

    fetch();
  }, [candidatoId]);

  return { processos, loading };
}
