import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avaliacao, TipoCompetencia, Competencia, NotaCompetencia } from '@/types/recruitment';

// ============================================================
// CONSTANTES
// ============================================================

export const COMPETENCIAS_TECNICAS: Competencia[] = [
  { id: 'conhecimento_tecnico', nome: 'Conhecimento Técnico', tipo: 'tecnica' },
  { id: 'resolucao_problemas', nome: 'Resolução de Problemas', tipo: 'tecnica' },
  { id: 'qualidade_codigo', nome: 'Qualidade de Código/Trabalho', tipo: 'tecnica' },
  { id: 'conhecimento_ferramentas', nome: 'Conhecimento de Ferramentas', tipo: 'tecnica' },
  { id: 'capacidade_aprendizado', nome: 'Capacidade de Aprendizado', tipo: 'tecnica' },
];

export const COMPETENCIAS_COMPORTAMENTAIS: Competencia[] = [
  { id: 'comunicacao', nome: 'Comunicação', tipo: 'comportamental' },
  { id: 'trabalho_equipe', nome: 'Trabalho em Equipe', tipo: 'comportamental' },
  { id: 'proatividade', nome: 'Proatividade', tipo: 'comportamental' },
  { id: 'adaptabilidade', nome: 'Adaptabilidade', tipo: 'comportamental' },
  { id: 'lideranca', nome: 'Liderança', tipo: 'comportamental' },
  { id: 'organizacao', nome: 'Organização', tipo: 'comportamental' },
];

export const PARECERES = [
  { value: 'aprovar', label: 'Aprovar', color: 'green' },
  { value: 'reprovar', label: 'Reprovar', color: 'red' },
  { value: 'em_duvida', label: 'Em Dúvida', color: 'yellow' },
] as const;

// ============================================================
// TYPES
// ============================================================

interface AvaliacaoDB {
  id: string;
  processo_id: string;
  avaliador_id: string | null;
  etapa: string;
  parecer: string;
  notas_tecnicas: NotaCompetencia[] | null;
  notas_comportamentais: NotaCompetencia[] | null;
  nota_geral: number | null;
  pontos_fortes: string | null;
  pontos_desenvolvimento: string | null;
  observacoes_gerais: string | null;
  recomendacao: string | null;
  created_at: string;
  updated_at: string;
}

interface AvaliacaoInsert {
  processo_id: string;
  avaliador_id?: string;
  etapa: string;
  parecer?: string;
  notas_tecnicas?: NotaCompetencia[];
  notas_comportamentais?: NotaCompetencia[];
  nota_geral?: number;
  pontos_fortes?: string;
  pontos_desenvolvimento?: string;
  observacoes_gerais?: string;
  recomendacao?: string;
}

interface UseAvaliacoesOptions {
  processoId?: string;
  avaliadorId?: string;
  etapa?: string;
}

// ============================================================
// HOOK PRINCIPAL
// ============================================================

export function useAvaliacoes(options: UseAvaliacoesOptions = {}) {
  const queryClient = useQueryClient();
  const { processoId, avaliadorId, etapa } = options;

  // Query para listar avaliações
  const {
    data: avaliacoes = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['avaliacoes', processoId, avaliadorId, etapa],
    queryFn: async () => {
      let query = supabase
        .from('avaliacoes')
        .select(`
          *,
          processo:processos_seletivos (
            id,
            candidato:candidatos (id, nome, email, foto_url, cargo_atual),
            vaga:vagas (id, titulo, departamento)
          ),
          avaliador:profiles (id, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (processoId) {
        query = query.eq('processo_id', processoId);
      }
      if (avaliadorId) {
        query = query.eq('avaliador_id', avaliadorId);
      }
      if (etapa) {
        query = query.eq('etapa', etapa);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Mutation para criar avaliação
  const createMutation = useMutation({
    mutationFn: async (avaliacao: AvaliacaoInsert) => {
      // Pegar usuário atual para avaliador_id
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('avaliacoes')
        .insert({
          ...avaliacao,
          avaliador_id: avaliacao.avaliador_id || user?.id,
          parecer: avaliacao.parecer || 'em_duvida',
          notas_tecnicas: avaliacao.notas_tecnicas || COMPETENCIAS_TECNICAS.map(c => ({ ...c, nota: 5 })),
          notas_comportamentais: avaliacao.notas_comportamentais || COMPETENCIAS_COMPORTAMENTAIS.map(c => ({ ...c, nota: 5 })),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] });
    },
  });

  // Mutation para atualizar avaliação
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<AvaliacaoInsert>) => {
      const { data, error } = await supabase
        .from('avaliacoes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] });
    },
  });

  // Mutation para deletar avaliação
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('avaliacoes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] });
    },
  });

  // Buscar avaliação por ID
  const fetchAvaliacaoById = async (id: string) => {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select(`
        *,
        processo:processos_seletivos (
          id,
          candidato:candidatos (id, nome, email, foto_url, cargo_atual),
          vaga:vagas (id, titulo, departamento)
        ),
        avaliador:profiles (id, full_name, avatar_url)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  };

  // Salvar como rascunho
  const salvarRascunho = async (avaliacao: AvaliacaoInsert) => {
    // Verificar se já existe avaliação em andamento para este processo/etapa
    const { data: existing } = await supabase
      .from('avaliacoes')
      .select('id')
      .eq('processo_id', avaliacao.processo_id)
      .eq('etapa', avaliacao.etapa)
      .is('parecer', null)
      .single();

    if (existing) {
      return updateMutation.mutateAsync({ id: existing.id, ...avaliacao });
    } else {
      return createMutation.mutateAsync(avaliacao);
    }
  };

  // Finalizar avaliação
  const finalizarAvaliacao = async (id: string, parecer: string, recomendacao: string) => {
    return updateMutation.mutateAsync({
      id,
      parecer,
      recomendacao,
    });
  };

  // Calcular média de notas de um processo
  const getMediaNotasProcesso = async (processoId: string) => {
    const { data: avaliacoesProcesso } = await supabase
      .from('avaliacoes')
      .select('nota_geral')
      .eq('processo_id', processoId)
      .not('nota_geral', 'is', null);

    if (!avaliacoesProcesso || avaliacoesProcesso.length === 0) {
      return null;
    }

    const soma = avaliacoesProcesso.reduce((acc, a) => acc + (a.nota_geral || 0), 0);
    return soma / avaliacoesProcesso.length;
  };

  return {
    avaliacoes,
    loading,
    error,
    refetch,
    createAvaliacao: createMutation.mutateAsync,
    updateAvaliacao: updateMutation.mutateAsync,
    deleteAvaliacao: deleteMutation.mutateAsync,
    fetchAvaliacaoById,
    salvarRascunho,
    finalizarAvaliacao,
    getMediaNotasProcesso,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// ============================================================
// HOOK AUXILIAR - Avaliações de um Processo
// ============================================================

export function useAvaliacoesProcesso(processoId: string) {
  return useAvaliacoes({ processoId });
}

// ============================================================
// HOOK AUXILIAR - Avaliação única
// ============================================================

export function useAvaliacao(id: string | undefined) {
  return useQuery({
    queryKey: ['avaliacao', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          *,
          processo:processos_seletivos (
            id,
            candidato:candidatos (id, nome, email, foto_url, cargo_atual),
            vaga:vagas (id, titulo, departamento)
          ),
          avaliador:profiles (id, full_name, avatar_url)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export default useAvaliacoes;
