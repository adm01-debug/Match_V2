import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Candidato, 
  CandidatoInsert, 
  CandidatoUpdate,
  MatchScore
} from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

interface UseCandidatosOptions {
  status?: string;
  skill?: string;
  origem?: string;
  search?: string;
  orderBy?: 'nome' | 'created_at' | 'experiencia_anos';
  orderDirection?: 'asc' | 'desc';
  limit?: number;
}

interface CandidatoComMatchScores extends Candidato {
  match_scores?: MatchScore[];
}

interface UseCandidatosReturn {
  candidatos: CandidatoComMatchScores[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  // CRUD
  fetchCandidatos: (options?: UseCandidatosOptions) => Promise<void>;
  fetchCandidatoById: (id: string) => Promise<CandidatoComMatchScores | null>;
  createCandidato: (candidato: CandidatoInsert) => Promise<Candidato | null>;
  updateCandidato: (id: string, updates: CandidatoUpdate) => Promise<Candidato | null>;
  deleteCandidato: (id: string) => Promise<boolean>;
  // Ações
  adicionarAoBancoTalentos: (id: string) => Promise<boolean>;
  removerDoBancoTalentos: (id: string) => Promise<boolean>;
  atualizarHabilidades: (id: string, habilidades: string[]) => Promise<boolean>;
  // Busca
  searchCandidatos: (query: string) => Promise<Candidato[]>;
  refetch: () => Promise<void>;
}

export function useCandidatos(initialOptions?: UseCandidatosOptions): UseCandidatosReturn {
  const [candidatos, setCandidatos] = useState<CandidatoComMatchScores[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchCandidatos = useCallback(async (options?: UseCandidatosOptions) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('candidatos')
        .select('*', { count: 'exact' });

      if (options?.status) {
        query = query.eq('status', options.status);
      }

      if (options?.origem) {
        query = query.eq('origem', options.origem);
      }

      if (options?.skill) {
        query = query.contains('habilidades', [options.skill]);
      }

      if (options?.search) {
        query = query.or(`nome.ilike.%${options.search}%,email.ilike.%${options.search}%`);
      }

      const orderColumn = options?.orderBy || 'created_at';
      const orderDirection = options?.orderDirection || 'desc';
      query = query.order(orderColumn, { ascending: orderDirection === 'asc' });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      // Buscar match scores para cada candidato
      if (data && data.length > 0) {
        const { data: matchScores } = await supabase
          .from('match_scores')
          .select('*')
          .in('candidato_id', data.map(c => c.id));

        const candidatosComScores = data.map(c => ({
          ...c,
          match_scores: matchScores?.filter(ms => ms.candidato_id === c.id) || [],
        }));

        setCandidatos(candidatosComScores);
      } else {
        setCandidatos([]);
      }

      setTotalCount(count || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar candidatos';
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

  const fetchCandidatoById = useCallback(async (id: string): Promise<CandidatoComMatchScores | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('candidatos')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Buscar match scores
      const { data: matchScores } = await supabase
        .from('match_scores')
        .select('*')
        .eq('candidato_id', id);

      return {
        ...data,
        match_scores: matchScores || [],
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar candidato';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  const createCandidato = useCallback(async (candidato: CandidatoInsert): Promise<Candidato | null> => {
    try {
      const { data, error: createError } = await supabase
        .from('candidatos')
        .insert({
          ...candidato,
          status: candidato.status || 'ativo',
          origem: candidato.origem || 'manual',
        })
        .select()
        .single();

      if (createError) throw createError;

      setCandidatos(prev => [data, ...prev]);
      setTotalCount(prev => prev + 1);

      toast({
        title: 'Candidato cadastrado!',
        description: `${data.nome} foi adicionado ao banco de talentos.`,
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao cadastrar candidato';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  const updateCandidato = useCallback(async (id: string, updates: CandidatoUpdate): Promise<Candidato | null> => {
    try {
      const { data, error: updateError } = await supabase
        .from('candidatos')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setCandidatos(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));

      toast({
        title: 'Candidato atualizado!',
        description: 'As informações foram salvas.',
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar candidato';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  const deleteCandidato = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('candidatos')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setCandidatos(prev => prev.filter(c => c.id !== id));
      setTotalCount(prev => prev - 1);

      toast({
        title: 'Candidato removido',
        description: 'O candidato foi removido do sistema.',
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao remover candidato';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  const adicionarAoBancoTalentos = useCallback(async (id: string): Promise<boolean> => {
    const result = await updateCandidato(id, { status: 'banco_talentos' });
    if (result) {
      toast({
        title: 'Adicionado ao Banco de Talentos!',
        description: 'O candidato foi adicionado para futuras oportunidades.',
      });
    }
    return result !== null;
  }, [updateCandidato, toast]);

  const removerDoBancoTalentos = useCallback(async (id: string): Promise<boolean> => {
    const result = await updateCandidato(id, { status: 'inativo' });
    return result !== null;
  }, [updateCandidato]);

  const atualizarHabilidades = useCallback(async (id: string, habilidades: string[]): Promise<boolean> => {
    const result = await updateCandidato(id, { habilidades });
    return result !== null;
  }, [updateCandidato]);

  const searchCandidatos = useCallback(async (query: string): Promise<Candidato[]> => {
    try {
      const { data } = await supabase
        .from('candidatos')
        .select('*')
        .or(`nome.ilike.%${query}%,email.ilike.%${query}%,cargo_atual.ilike.%${query}%`)
        .limit(20);

      return data || [];
    } catch {
      return [];
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchCandidatos(initialOptions);
  }, [fetchCandidatos, initialOptions]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('candidatos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'candidatos',
        },
        () => {
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
    fetchCandidatos(initialOptions);
  }, []);

  return {
    candidatos,
    loading,
    error,
    totalCount,
    fetchCandidatos,
    fetchCandidatoById,
    createCandidato,
    updateCandidato,
    deleteCandidato,
    adicionarAoBancoTalentos,
    removerDoBancoTalentos,
    atualizarHabilidades,
    searchCandidatos,
    refetch,
  };
}

// Hook para um candidato específico
export function useCandidato(id: string | undefined) {
  const [candidato, setCandidato] = useState<CandidatoComMatchScores | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('candidatos')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        const { data: matchScores } = await supabase
          .from('match_scores')
          .select('*')
          .eq('candidato_id', id);

        setCandidato({
          ...data,
          match_scores: matchScores || [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar candidato');
      } finally {
        setLoading(false);
      }
    };

    fetch();

    // Subscription para atualizações
    const channel = supabase
      .channel(`candidato-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'candidatos',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setCandidato(prev => prev ? { ...prev, ...payload.new } : null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return { candidato, loading, error };
}

// Hook para estatísticas de candidatos
export function useCandidatosStats() {
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    emProcesso: 0,
    bancoTalentos: 0,
    novosMes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const inicioMes = new Date();
        inicioMes.setDate(1);
        inicioMes.setHours(0, 0, 0, 0);

        const [total, ativos, emProcesso, bancoTalentos, novosMes] = await Promise.all([
          supabase.from('candidatos').select('*', { count: 'exact', head: true }),
          supabase.from('candidatos').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
          supabase.from('candidatos').select('*', { count: 'exact', head: true }).eq('status', 'em_processo'),
          supabase.from('candidatos').select('*', { count: 'exact', head: true }).eq('status', 'banco_talentos'),
          supabase.from('candidatos').select('*', { count: 'exact', head: true }).gte('created_at', inicioMes.toISOString()),
        ]);

        setStats({
          total: total.count || 0,
          ativos: ativos.count || 0,
          emProcesso: emProcesso.count || 0,
          bancoTalentos: bancoTalentos.count || 0,
          novosMes: novosMes.count || 0,
        });
      } catch {
        // Silenciar
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { stats, loading };
}

// Constantes
export const STATUS_CANDIDATO = [
  { value: 'ativo', label: 'Ativo', color: 'green' },
  { value: 'em_processo', label: 'Em Processo', color: 'blue' },
  { value: 'banco_talentos', label: 'Banco de Talentos', color: 'purple' },
  { value: 'inativo', label: 'Inativo', color: 'gray' },
  { value: 'contratado', label: 'Contratado', color: 'emerald' },
] as const;

export const ORIGENS_CANDIDATO = [
  { value: 'linkedin', label: 'LinkedIn', icon: '🔗' },
  { value: 'indeed', label: 'Indeed', icon: '📋' },
  { value: 'indicacao', label: 'Indicação', icon: '👥' },
  { value: 'site', label: 'Site Próprio', icon: '🌐' },
  { value: 'manual', label: 'Cadastro Manual', icon: '✍️' },
  { value: 'parser', label: 'Parser de CV', icon: '🤖' },
] as const;
