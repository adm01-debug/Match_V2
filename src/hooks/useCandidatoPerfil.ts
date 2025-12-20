import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Candidato, ProcessoSeletivo } from '@/types/recruitment';

// ============================================================
// TYPES
// ============================================================

interface CandidatoPerfilCompleto extends Candidato {
  processos: ProcessoSeletivo[];
  avaliacoes: any[];
  entrevistas: any[];
  match_scores: any[];
  comunicacoes: any[];
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
    queryFn: async () => {
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
        .select(`
          *,
          vaga:vagas (id, titulo, departamento, status)
        `)
        .eq('candidato_id', candidatoId)
        .order('created_at', { ascending: false });

      // Buscar avaliações dos processos
      const processosIds = processos?.map(p => p.id) || [];
      let avaliacoes: any[] = [];
      if (processosIds.length > 0) {
        const { data: avaliacoesData } = await supabase
          .from('avaliacoes')
          .select(`
            *,
            avaliador:profiles (id, full_name)
          `)
          .in('processo_id', processosIds)
          .order('created_at', { ascending: false });
        avaliacoes = avaliacoesData || [];
      }

      // Buscar entrevistas dos processos
      let entrevistas: any[] = [];
      if (processosIds.length > 0) {
        const { data: entrevistasData } = await supabase
          .from('entrevistas')
          .select(`
            *,
            entrevistador:profiles (id, full_name)
          `)
          .in('processo_id', processosIds)
          .order('data_hora', { ascending: false });
        entrevistas = entrevistasData || [];
      }

      // Buscar match scores
      const { data: matchScores } = await supabase
        .from('match_scores')
        .select(`
          *,
          vaga:vagas (id, titulo)
        `)
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
        avaliacoes,
        entrevistas,
        match_scores: matchScores || [],
        comunicacoes: comunicacoes || [],
      } as CandidatoPerfilCompleto;
    },
    enabled: !!candidatoId,
  });

  // Mutation para atualizar candidato
  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<Candidato>) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidato-perfil', candidatoId] });
      queryClient.invalidateQueries({ queryKey: ['candidatos'] });
    },
  });

  // Adicionar ao banco de talentos
  const adicionarAoBancoTalentos = async () => {
    return updateMutation.mutateAsync({ status: 'banco_talentos' as any });
  };

  // Remover do banco de talentos
  const removerDoBancoTalentos = async () => {
    return updateMutation.mutateAsync({ status: 'ativo' as any });
  };

  // Atualizar habilidades
  const atualizarHabilidades = async (habilidades: string[]) => {
    return updateMutation.mutateAsync({ habilidades });
  };

  // Atualizar foto
  const atualizarFoto = async (fotoUrl: string) => {
    return updateMutation.mutateAsync({ foto_url: fotoUrl });
  };

  // Calcular estatísticas
  const estatisticas = candidato ? {
    totalProcessos: candidato.processos.length,
    processosAtivos: candidato.processos.filter(p => p.status === 'em_andamento').length,
    aprovacoes: candidato.processos.filter(p => p.status === 'aprovado' || p.status === 'contratado').length,
    reprovacoes: candidato.processos.filter(p => p.status === 'reprovado').length,
    totalEntrevistas: candidato.entrevistas.length,
    entrevistasRealizadas: candidato.entrevistas.filter((e: any) => e.status === 'realizada').length,
    mediaMatchScore: candidato.match_scores.length > 0
      ? candidato.match_scores.reduce((acc: number, m: any) => acc + (m.score_total || 0), 0) / candidato.match_scores.length
      : null,
    melhorMatchScore: candidato.match_scores.length > 0
      ? Math.max(...candidato.match_scores.map((m: any) => m.score_total || 0))
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
    atualizarFoto,
    estatisticas,
    isUpdating: updateMutation.isPending,
  };
}

export default useCandidatoPerfil;
