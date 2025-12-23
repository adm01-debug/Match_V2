import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Prova, BateriaProvas, CategoriaProva, Departamento, NivelCargo } from '@/types/tests';

// Converter dados do BD para o tipo Prova
function dbToProva(row: any): Prova {
  return {
    id: row.id,
    titulo: row.titulo,
    descricao: row.descricao || '',
    categoria: row.categoria as CategoriaProva,
    departamentos: (row.departamentos || ['geral']) as Departamento[],
    niveisAplicaveis: (row.niveis_aplicaveis || []) as NivelCargo[],
    duracao: row.duracao || 30,
    totalQuestoes: row.total_questoes || 0,
    pontuacaoMaxima: row.pontuacao_maxima || 100,
    notaMinima: row.nota_minima || 60,
    questoes: [],
    ativo: row.ativo ?? true,
    criadoEm: row.created_at?.split('T')[0] || '',
    atualizadoEm: row.updated_at?.split('T')[0] || '',
    aplicacoes: row.aplicacoes || 0,
    mediaNotas: Number(row.media_notas) || 0,
    tags: row.tags || [],
  };
}

// Converter dados do BD para BateriaProvas
function dbToBateria(row: any, provasIds: string[]): BateriaProvas {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao || '',
    departamento: row.departamento as Departamento,
    nivel: row.nivel as NivelCargo,
    provas: provasIds,
    duracaoTotal: row.duracao_total || 0,
    obrigatorias: provasIds, // Por simplicidade, todas obrigatórias
    opcionais: [],
  };
}

// Hook para buscar todas as provas
export function useProvas() {
  return useQuery({
    queryKey: ['provas'],
    queryFn: async (): Promise<Prova[]> => {
      const { data, error } = await supabase
        .from('provas')
        .select('*')
        .order('titulo', { ascending: true });

      if (error) throw error;
      return (data || []).map(dbToProva);
    },
    placeholderData: [], staleTime: 60000,
  });
}

// Hook para buscar provas ativas
export function useProvasAtivas() {
  return useQuery({
    queryKey: ['provas', 'ativas'],
    queryFn: async (): Promise<Prova[]> => {
      const { data, error } = await supabase
        .from('provas')
        .select('*')
        .eq('ativo', true)
        .order('titulo', { ascending: true });

      if (error) throw error;
      return (data || []).map(dbToProva);
    },
    placeholderData: [], staleTime: 60000,
  });
}

// Hook para buscar uma prova específica
export function useProva(id: string) {
  return useQuery({
    queryKey: ['provas', id],
    queryFn: async (): Promise<Prova | null> => {
      const { data, error } = await supabase
        .from('provas')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data ? dbToProva(data) : null;
    },
    enabled: !!id,
  });
}

// Hook para criar prova
export function useCreateProva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prova: Partial<Prova>) => {
      const { data, error } = await supabase
        .from('provas')
        .insert({
          titulo: prova.titulo,
          descricao: prova.descricao,
          categoria: prova.categoria,
          departamentos: prova.departamentos,
          niveis_aplicaveis: prova.niveisAplicaveis,
          duracao: prova.duracao,
          total_questoes: prova.totalQuestoes,
          pontuacao_maxima: prova.pontuacaoMaxima,
          nota_minima: prova.notaMinima,
          ativo: prova.ativo ?? true,
          tags: prova.tags,
        })
        .select()
        .single();

      if (error) throw error;
      return dbToProva(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provas'] },
      onError: (error: Error) => {
        console.error('Mutation error:', error);
      });
    },
  });
}

// Hook para atualizar prova
export function useUpdateProva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Prova> & { id: string }) => {
      const { error } = await supabase
        .from('provas')
        .update({
          titulo: updates.titulo,
          descricao: updates.descricao,
          categoria: updates.categoria,
          departamentos: updates.departamentos,
          niveis_aplicaveis: updates.niveisAplicaveis,
          duracao: updates.duracao,
          total_questoes: updates.totalQuestoes,
          pontuacao_maxima: updates.pontuacaoMaxima,
          nota_minima: updates.notaMinima,
          ativo: updates.ativo,
          tags: updates.tags,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provas'] },
      onError: (error: Error) => {
        console.error('Mutation error:', error);
      });
    },
  });
}

// Hook para deletar prova
export function useDeleteProva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('provas')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provas'] },
      onError: (error: Error) => {
        console.error('Mutation error:', error);
      });
    },
  });
}

// Hook para duplicar prova
export function useDuplicateProva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (provaId: string) => {
      // Buscar prova original
      const { data: original, error: fetchError } = await supabase
        .from('provas')
        .select('*')
        .eq('id', provaId)
        .single();

      if (fetchError) throw fetchError;

      // Criar cópia
      const { data, error } = await supabase
        .from('provas')
        .insert({
          titulo: `${original.titulo} (Cópia)`,
          descricao: original.descricao,
          categoria: original.categoria,
          departamentos: original.departamentos,
          niveis_aplicaveis: original.niveis_aplicaveis,
          duracao: original.duracao,
          total_questoes: original.total_questoes,
          pontuacao_maxima: original.pontuacao_maxima,
          nota_minima: original.nota_minima,
          ativo: false, // Começa inativa
          tags: original.tags,
        })
        .select()
        .single();

      if (error) throw error;
      return dbToProva(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provas'] },
      onError: (error: Error) => {
        console.error('Mutation error:', error);
      });
    },
  });
}

// Hook para buscar baterias
export function useBaterias() {
  return useQuery({
    queryKey: ['baterias'],
    queryFn: async (): Promise<BateriaProvas[]> => {
      const { data: baterias, error } = await supabase
        .from('baterias_provas')
        .select('*')
        .eq('ativo', true)
        .order('nome', { ascending: true });

      if (error) throw error;

      // Buscar relações
      const bateriaIds = (baterias || []).map(b => b.id);
      const { data: relacoes } = await supabase
        .from('bateria_provas_rel')
        .select('bateria_id, prova_id')
        .in('bateria_id', bateriaIds);

      // Agrupar provas por bateria
      const provasPorBateria: Record<string, string[]> = {};
      (relacoes || []).forEach(rel => {
        if (!provasPorBateria[rel.bateria_id]) {
          provasPorBateria[rel.bateria_id] = [];
        }
        provasPorBateria[rel.bateria_id].push(rel.prova_id);
      });

      return (baterias || []).map(b => 
        dbToBateria(b, provasPorBateria[b.id] || [])
      );
    },
    placeholderData: [], staleTime: 60000,
  });
}

// Hook para estatísticas
export function useProvasStats() {
  return useQuery({
    queryKey: ['provas', 'stats'],
    queryFn: async () => {
      const { data: provas, error } = await supabase
        .from('provas')
        .select('duracao, aplicacoes');

      if (error) throw error;

      const { count: totalBaterias } = await supabase
        .from('baterias_provas')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true);

      const totalProvas = provas?.length || 0;
      const totalAplicacoes = provas?.reduce((sum, p) => sum + (p.aplicacoes || 0), 0) || 0;
      const mediaDuracao = totalProvas > 0
        ? Math.round(provas.reduce((sum, p) => sum + (p.duracao || 0), 0) / totalProvas)
        : 0;

      return {
        totalProvas,
        totalAplicacoes,
        mediaDuracao,
        totalBaterias: totalBaterias || 0,
      };
    },
    placeholderData: [], staleTime: 60000,
  });
}
