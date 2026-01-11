/**
 * @module useCompetencias
 * @description Hooks para gerenciar competências, valores culturais e perfis de cargo
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Competencia, ValorCultural, PerfilCargo, CriterioSelecao } from '@/types/selection';

export function useCompetencias(tipo?: string) {
  return useQuery({
    queryKey: ['competencias', tipo],
    queryFn: async (): Promise<Competencia[]> => {
      let query = supabase.from('competencias').select('*').eq('ativo', true).order('nome');
      if (tipo) query = query.eq('tipo', tipo);
      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(row => ({
        id: row.id,
        nome: row.nome,
        descricao: row.descricao || undefined,
        tipo: row.tipo as Competencia['tipo'],
        categoria: row.categoria || undefined,
        indicadoresComportamentais: row.indicadores_comportamentais || undefined,
        perguntasSugeridas: row.perguntas_sugeridas || undefined,
        ativo: row.ativo ?? true,
      }));
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateCompetencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (competencia: Partial<Competencia>) => {
      const { data, error } = await supabase.from('competencias').insert({
        nome: competencia.nome || '',
        descricao: competencia.descricao,
        tipo: competencia.tipo || 'tecnica',
        categoria: competencia.categoria,
        indicadores_comportamentais: competencia.indicadoresComportamentais,
        perguntas_sugeridas: competencia.perguntasSugeridas,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['competencias'] }),
  });
}

export function useValoresCulturais() {
  return useQuery({
    queryKey: ['valores-culturais'],
    queryFn: async (): Promise<ValorCultural[]> => {
      const { data, error } = await supabase.from('valores_culturais').select('*').eq('ativo', true).order('ordem');
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        nome: row.nome,
        descricao: row.descricao || undefined,
        icone: row.icone || 'Heart',
        cor: row.cor || 'blue',
        ativo: row.ativo ?? true,
        ordem: row.ordem || 0,
      }));
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateValorCultural() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (valor: Partial<ValorCultural>) => {
      const { data, error } = await supabase.from('valores_culturais').insert({
        nome: valor.nome || '',
        descricao: valor.descricao,
        icone: valor.icone,
        cor: valor.cor,
        ordem: valor.ordem,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['valores-culturais'] }),
  });
}

export function usePerfisCargoByVaga(vagaId: string) {
  return useQuery({
    queryKey: ['perfis-cargo', vagaId],
    queryFn: async (): Promise<PerfilCargo | null> => {
      const { data, error } = await supabase.from('perfis_cargo').select('*').eq('vaga_id', vagaId).maybeSingle();
      if (error) throw error;
      if (!data) return null;

      const { data: criterios } = await supabase.from('criterios_selecao').select(`*, competencias (id, nome, tipo)`).eq('perfil_cargo_id', data.id).order('ordem');

      return {
        id: data.id,
        vagaId: data.vaga_id || undefined,
        nome: data.nome,
        descricao: data.descricao || undefined,
        perfilDominancia: data.perfil_dominancia || 50,
        perfilInfluencia: data.perfil_influencia || 50,
        perfilEstabilidade: data.perfil_estabilidade || 50,
        perfilConformidade: data.perfil_conformidade || 50,
        toleranciaPerfil: data.tolerancia_perfil || 20,
        pesoTecnico: Number(data.peso_tecnico) || 0.4,
        pesoBehavioral: Number(data.peso_comportamental) || 0.3,
        pesoCultural: Number(data.peso_cultural) || 0.3,
        notaMinimaAprovacao: data.nota_minima_aprovacao || 70,
        criterios: (criterios || []).map(c => ({
          id: c.id,
          perfilCargoId: c.perfil_cargo_id || '',
          competenciaId: c.competencia_id || undefined,
          nome: c.nome,
          descricao: c.descricao || undefined,
          tipo: c.tipo as CriterioSelecao['tipo'],
          peso: Number(c.peso) || 1,
          notaMinima: c.nota_minima || undefined,
          ordem: c.ordem || 0,
          ativo: c.ativo ?? true,
          competencia: c.competencias as Competencia | undefined,
        })),
      };
    },
    enabled: !!vagaId,
  });
}

export function useCreatePerfilCargo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (perfil: Partial<PerfilCargo>) => {
      const { data, error } = await supabase.from('perfis_cargo').insert({
        vaga_id: perfil.vagaId,
        nome: perfil.nome || '',
        descricao: perfil.descricao,
        perfil_dominancia: perfil.perfilDominancia,
        perfil_influencia: perfil.perfilInfluencia,
        perfil_estabilidade: perfil.perfilEstabilidade,
        perfil_conformidade: perfil.perfilConformidade,
        tolerancia_perfil: perfil.toleranciaPerfil,
        peso_tecnico: perfil.pesoTecnico,
        peso_comportamental: perfil.pesoBehavioral,
        peso_cultural: perfil.pesoCultural,
        nota_minima_aprovacao: perfil.notaMinimaAprovacao,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['perfis-cargo'] }),
  });
}

export function useUpdatePerfilCargo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PerfilCargo> & { id: string }) => {
      const { error } = await supabase.from('perfis_cargo').update({
        nome: updates.nome,
        descricao: updates.descricao,
        perfil_dominancia: updates.perfilDominancia,
        perfil_influencia: updates.perfilInfluencia,
        perfil_estabilidade: updates.perfilEstabilidade,
        perfil_conformidade: updates.perfilConformidade,
        tolerancia_perfil: updates.toleranciaPerfil,
        peso_tecnico: updates.pesoTecnico,
        peso_comportamental: updates.pesoBehavioral,
        peso_cultural: updates.pesoCultural,
        nota_minima_aprovacao: updates.notaMinimaAprovacao,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['perfis-cargo'] }),
  });
}

export function useCreateCriterio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (criterio: Partial<CriterioSelecao>) => {
      const { data, error } = await supabase.from('criterios_selecao').insert({
        perfil_cargo_id: criterio.perfilCargoId,
        competencia_id: criterio.competenciaId,
        nome: criterio.nome || '',
        descricao: criterio.descricao,
        tipo: criterio.tipo || 'classificatorio',
        peso: criterio.peso,
        nota_minima: criterio.notaMinima,
        ordem: criterio.ordem,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['perfis-cargo'] }),
  });
}

export function useDeleteCriterio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('criterios_selecao').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['perfis-cargo'] }),
  });
}
