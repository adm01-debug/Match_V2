import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// ============================================================
// TYPES - Baseados no schema real do Supabase
// ============================================================

type CandidatoDB = Tables<'candidatos'>;
type ProcessoSeletivoDB = Tables<'processos_seletivos'>;
type MatchScoreDB = Tables<'match_scores'>;
type ComunicacaoDB = Tables<'comunicacoes'>;
type EntrevistaDB = Tables<'entrevistas'>;

interface CandidatoPerfilCompleto extends CandidatoDB {
  processos: ProcessoSeletivoDB[];
  entrevistas: EntrevistaDB[];
  match_scores: MatchScoreDB[];
  comunicacoes: ComunicacaoDB[];
}

// ============================================================
// HOOK PRINCIPAL
// ============================================================

export function useCandidatoPerfil(candidatoId: string | undefined) {
  const queryClient = useQueryClient();

  // Query para buscar perfil completo
  const {
    data: candidato,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['candidato-perfil', candidatoId],
    placeholderData: [], staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false, gcTime: 10 * 60 * 1000, retry: 3, queryFn: async () => {
      if (!candidatoId) return null;

      // Buscar candidato
      const { data: candidatoData, error: candidatoError } = await supabase
        .from('candidatos')
        .select('*')
        .eq('id', candidatoId)
        .single();

      if (candidatoError) throw candidatoError;

      // Buscar processos seletivos
      const { data: processos } = await supabase
        .from('processos_seletivos')
        .select('*')
        .eq('candidato_id', candidatoId)
        .order('created_at', { ascending: false });

      // Buscar entrevistas do candidato
      const { data: entrevistas } = await supabase
        .from('entrevistas')
        .select('*')
        .eq('candidato_id', candidatoId)
        .order('data', { ascending: false });

      // Buscar match scores
      const { data: matchScores } = await supabase
        .from('match_scores')
        .select('*')
        .eq('candidato_id', candidatoId)
        .order('created_at', { ascending: false });

      // Buscar comunicações
      const { data: comunicacoes } = await supabase
        .from('comunicacoes')
        .select('*')
        .eq('candidato_id', candidatoId)
        .order('created_at', { ascending: false });

      return {
        ...candidatoData,
        processos: processos || [],
        entrevistas: entrevistas || [],
        match_scores: matchScores || [],
        comunicacoes: comunicacoes || [],
      } as CandidatoPerfilCompleto;
    },
    enabled: !!candidatoId,
  });

  // Mutation para atualizar candidato
  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<CandidatoDB>) => {
      if (!candidatoId) throw new Error('ID do candidato não fornecido');

      const { data, error } = await supabase
        .from('candidatos')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', candidatoId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onError: (error) => { console.error('Mutation error:', error); toast.error('Ocorreu um erro'); }, onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidato-perfil', candidatoId] });
      queryClient.invalidateQueries({ queryKey: ['candidatos'] });
    },
  });

  // Adicionar ao banco de talentos
  const adicionarAoBancoTalentos = async () => {
    return updateMutation.mutateAsync({ status: 'banco_talentos' });
  };

  // Remover do banco de talentos
  const removerDoBancoTalentos = async () => {
    return updateMutation.mutateAsync({ status: 'ativo' });
  };

  // Atualizar habilidades
  const atualizarHabilidades = async (habilidades: string[]) => {
    return updateMutation.mutateAsync({ habilidades });
  };

  // Calcular estatísticas
  const estatisticas = candidato ? {
    totalProcessos: candidato.processos.length,
    processosAtivos: candidato.processos.filter(p => p.status === 'em_andamento').length,
    aprovacoes: candidato.processos.filter(p => p.status === 'aprovado' || p.status === 'contratado').length,
    reprovacoes: candidato.processos.filter(p => p.status === 'reprovado').length,
    totalEntrevistas: candidato.entrevistas.length,
    entrevistasRealizadas: candidato.entrevistas.filter((e) => e.status === 'realizada').length,
    mediaMatchScore: candidato.match_scores.length > 0
      ? candidato.match_scores.reduce((acc, m) => acc + (m.score_total || 0), 0) / candidato.match_scores.length
      : null,
    melhorMatchScore: candidato.match_scores.length > 0
      ? Math.max(...candidato.match_scores.map((m) => m.score_total || 0))
      : null,
  } : null;

  return {
    candidato,
    loading,
    error,
    refetch,
    updateCandidato: updateMutation.mutateAsync,
    adicionarAoBancoTalentos,
    removerDoBancoTalentos,
    atualizarHabilidades,
    estatisticas,
    isUpdating: updateMutation.isPending,
  };
}

export default useCandidatoPerfil;
