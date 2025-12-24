import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avaliacao, Competencia, NotaCompetencia } from '@/types/recruitment';

// ============================================================
// NOTA IMPORTANTE (tipagem)
// ============================================================
// A tabela "avaliacoes" ainda não está presente na tipagem gerada do backend.
// Para o build não quebrar, este hook usa um client sem tipagem estrita.
const db = supabase as any;

// ============================================================
// CONSTANTES
// ============================================================

export const COMPETENCIAS_TECNICAS: Competencia[] = [
  { id: 'conhecimento_tecnico', nome: 'Conhecimento Técnico', descricao: 'Domínio dos conceitos e ferramentas essenciais.', tipo: 'tecnica' },
  { id: 'resolucao_problemas', nome: 'Resolução de Problemas', descricao: 'Capacidade de analisar e propor soluções efetivas.', tipo: 'tecnica' },
  { id: 'qualidade_codigo', nome: 'Qualidade de Código/Trabalho', descricao: 'Qualidade, consistência e atenção a detalhes.', tipo: 'tecnica' },
  { id: 'conhecimento_ferramentas', nome: 'Conhecimento de Ferramentas', descricao: 'Experiência com ferramentas e processos do dia a dia.', tipo: 'tecnica' },
  { id: 'capacidade_aprendizado', nome: 'Capacidade de Aprendizado', descricao: 'Velocidade e autonomia para aprender coisas novas.', tipo: 'tecnica' },
];

export const COMPETENCIAS_COMPORTAMENTAIS: Competencia[] = [
  { id: 'comunicacao', nome: 'Comunicação', descricao: 'Clareza, objetividade e escuta ativa.', tipo: 'comportamental' },
  { id: 'trabalho_equipe', nome: 'Trabalho em Equipe', descricao: 'Colaboração e postura construtiva.', tipo: 'comportamental' },
  { id: 'proatividade', nome: 'Proatividade', descricao: 'Iniciativa e senso de dono.', tipo: 'comportamental' },
  { id: 'adaptabilidade', nome: 'Adaptabilidade', descricao: 'Flexibilidade diante de mudanças.', tipo: 'comportamental' },
  { id: 'lideranca', nome: 'Liderança', descricao: 'Influência positiva e condução de pessoas.', tipo: 'comportamental' },
  { id: 'organizacao', nome: 'Organização', descricao: 'Planejamento, priorização e execução.', tipo: 'comportamental' },
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

  const {
    data: avaliacoes = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['avaliacoes', processoId, avaliadorId, etapa],
    queryFn: async () => {
      let query = db
        .from('avaliacoes')
        .select('*')
        .order('created_at', { ascending: false , placeholderData: [], staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false, gcTime: 10 * 60 * 1000, retry: 3});

      if (processoId) query = query.eq('processo_id', processoId);
      if (avaliadorId) query = query.eq('avaliador_id', avaliadorId);
      if (etapa) query = query.eq('etapa', etapa);

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as AvaliacaoDB[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (avaliacao: AvaliacaoInsert) => {
      const { data: auth } = await supabase.auth.getUser();

      const payload = {
        ...avaliacao,
        avaliador_id: avaliacao.avaliador_id || auth.user?.id,
        parecer: avaliacao.parecer || 'em_duvida',
        notas_tecnicas: avaliacao.notas_tecnicas || COMPETENCIAS_TECNICAS.map((c) => ({ ...c, nota: 5 })),
        notas_comportamentais:
          avaliacao.notas_comportamentais || COMPETENCIAS_COMPORTAMENTAIS.map((c) => ({ ...c, nota: 5 })),
      };

      const { data, error } = await db.from('avaliacoes').insert(payload).select().single();
      if (error) throw error;
      return data as AvaliacaoDB;
    },
    onError: (error) => { console.error('Mutation error:', error); toast.error('Ocorreu um erro'); }, onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<AvaliacaoInsert>) => {
      const { data, error } = await db
        .from('avaliacoes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as AvaliacaoDB;
    },
    onError: (error) => { console.error('Mutation error:', error); toast.error('Ocorreu um erro'); }, onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from('avaliacoes').delete().eq('id', id);
      if (error) throw error;
    },
    onError: (error) => { console.error('Mutation error:', error); toast.error('Ocorreu um erro'); }, onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] });
    },
  });

  const fetchAvaliacaoById = async (id: string) => {
    const { data, error } = await db.from('avaliacoes').select('*').eq('id', id).single();
    if (error) throw error;
    return data as AvaliacaoDB;
  };

  const salvarRascunho = async (avaliacao: AvaliacaoInsert) => {
    const { data: existing } = await db
      .from('avaliacoes')
      .select('id')
      .eq('processo_id', avaliacao.processo_id)
      .eq('etapa', avaliacao.etapa)
      .single();

    if (existing?.id) {
      return updateMutation.mutateAsync({ id: existing.id, ...avaliacao });
    }
    return createMutation.mutateAsync(avaliacao);
  };

  const finalizarAvaliacao = async (id: string, parecer: string, recomendacao: string) => {
    return updateMutation.mutateAsync({ id, parecer, recomendacao });
  };

  const getMediaNotasProcesso = async (processoIdParam: string) => {
    const { data } = await db
      .from('avaliacoes')
      .select('nota_geral')
      .eq('processo_id', processoIdParam)
      .not('nota_geral', 'is', null);

    const rows = (data || []) as { nota_geral: number | null }[];
    if (rows.length === 0) return null;

    const soma = rows.reduce((acc, a) => acc + Number(a.nota_geral || 0), 0);
    return soma / rows.length;
  };

  return {
    avaliacoes: avaliacoes as unknown as Avaliacao[],
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

export function useAvaliacoesProcesso(processoId: string) {
  return useAvaliacoes({ processoId });
}

export function useAvaliacao(id: string | undefined) {
  return useQuery({
    queryKey: ['avaliacao', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await db.from('avaliacoes').select('*').eq('id', id).single();
      if (error) throw error;
      return data as AvaliacaoDB;
    },
    enabled: !!id,
  });
}

export default useAvaliacoes;

