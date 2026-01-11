/**
 * @module useInterviewTemplates
 * @description Hooks para gerenciar templates de entrevista estruturada
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TemplatePergunta {
  id: string;
  templateId: string;
  texto: string;
  tipo: 'comportamental' | 'tecnica' | 'situacional' | 'cultural';
  competenciaId?: string;
  ordem: number;
  obrigatoria: boolean;
  criteriosAvaliacao?: string[];
  respostaEsperada?: string;
}

export interface InterviewTemplate {
  id: string;
  nome: string;
  descricao?: string;
  tipo: 'tecnica' | 'comportamental' | 'cultural' | 'final' | 'mista';
  duracaoEstimada: number;
  ativo: boolean;
  perguntas: TemplatePergunta[];
}

export interface InterviewResponse {
  id: string;
  entrevistaId?: string;
  templateId?: string;
  perguntaId?: string;
  respostaCandidato?: string;
  nota?: number;
  observacoes?: string;
  avaliadorId?: string;
}

export function useInterviewTemplates(tipo?: string) {
  return useQuery({
    queryKey: ['interview-templates', tipo],
    queryFn: async (): Promise<InterviewTemplate[]> => {
      let query = supabase
        .from('templates_entrevista')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (tipo) {
        query = query.eq('tipo_entrevista', tipo);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch perguntas for each template
      const templates = await Promise.all(
        (data || []).map(async (template) => {
          const { data: perguntas } = await supabase
            .from('template_perguntas')
            .select('*')
            .eq('template_id', template.id)
            .order('ordem');

          return {
            id: template.id,
            nome: template.nome,
            descricao: template.descricao || undefined,
            tipo: (template.tipo_entrevista || 'mista') as InterviewTemplate['tipo'],
            duracaoEstimada: template.duracao_sugerida || 60,
            ativo: template.ativo ?? true,
            perguntas: (perguntas || []).map(p => ({
              id: p.id,
              templateId: p.template_id || '',
              texto: p.pergunta,
              tipo: (p.tipo || 'comportamental') as TemplatePergunta['tipo'],
              competenciaId: p.competencia_id || undefined,
              ordem: p.ordem || 0,
              obrigatoria: p.obrigatoria ?? true,
              criteriosAvaliacao: p.criterios_avaliacao || undefined,
              respostaEsperada: p.resposta_ideal || undefined,
            })),
          };
        })
      );

      return templates;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useInterviewTemplate(id: string) {
  return useQuery({
    queryKey: ['interview-template', id],
    queryFn: async (): Promise<InterviewTemplate | null> => {
      const { data: template, error } = await supabase
        .from('templates_entrevista')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!template) return null;

      const { data: perguntas } = await supabase
        .from('template_perguntas')
        .select('*')
        .eq('template_id', id)
        .order('ordem');

      return {
        id: template.id,
        nome: template.nome,
        descricao: template.descricao || undefined,
        tipo: (template.tipo_entrevista || 'mista') as InterviewTemplate['tipo'],
        duracaoEstimada: template.duracao_sugerida || 60,
        ativo: template.ativo ?? true,
        perguntas: (perguntas || []).map(p => ({
          id: p.id,
          templateId: p.template_id || '',
          texto: p.pergunta,
          tipo: (p.tipo || 'comportamental') as TemplatePergunta['tipo'],
          competenciaId: p.competencia_id || undefined,
          ordem: p.ordem || 0,
          obrigatoria: p.obrigatoria ?? true,
          criteriosAvaliacao: p.criterios_avaliacao || undefined,
          respostaEsperada: p.resposta_ideal || undefined,
        })),
      };
    },
    enabled: !!id,
  });
}

export function useCreateInterviewTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: Omit<InterviewTemplate, 'id' | 'perguntas'> & { perguntas?: Omit<TemplatePergunta, 'id' | 'templateId'>[] }) => {
      const { data, error } = await supabase
        .from('templates_entrevista')
        .insert({
          nome: template.nome,
          descricao: template.descricao,
          tipo_entrevista: template.tipo,
          duracao_sugerida: template.duracaoEstimada,
          ativo: template.ativo,
        })
        .select()
        .single();

      if (error) throw error;

      // Insert perguntas if provided
      if (template.perguntas && template.perguntas.length > 0) {
        const { error: perguntasError } = await supabase
          .from('template_perguntas')
          .insert(
            template.perguntas.map((p, index) => ({
              template_id: data.id,
              pergunta: p.texto,
              tipo: p.tipo,
              competencia_id: p.competenciaId,
              ordem: p.ordem ?? index,
              obrigatoria: p.obrigatoria ?? true,
              criterios_avaliacao: p.criteriosAvaliacao,
              resposta_ideal: p.respostaEsperada,
            }))
          );

        if (perguntasError) throw perguntasError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-templates'] });
    },
  });
}

export function useUpdateInterviewTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<InterviewTemplate> & { id: string }) => {
      const { error } = await supabase
        .from('templates_entrevista')
        .update({
          nome: updates.nome,
          descricao: updates.descricao,
          tipo_entrevista: updates.tipo,
          duracao_sugerida: updates.duracaoEstimada,
          ativo: updates.ativo,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-templates'] });
    },
  });
}

export function useDeleteInterviewTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // First delete all perguntas
      await supabase.from('template_perguntas').delete().eq('template_id', id);
      
      // Then delete the template
      const { error } = await supabase
        .from('templates_entrevista')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-templates'] });
    },
  });
}

export function useAddTemplatePergunta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pergunta: Omit<TemplatePergunta, 'id'>) => {
      const { data, error } = await supabase
        .from('template_perguntas')
        .insert({
          template_id: pergunta.templateId,
          pergunta: pergunta.texto,
          tipo: pergunta.tipo,
          competencia_id: pergunta.competenciaId,
          ordem: pergunta.ordem,
          obrigatoria: pergunta.obrigatoria,
          criterios_avaliacao: pergunta.criteriosAvaliacao,
          resposta_ideal: pergunta.respostaEsperada,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-templates'] });
      queryClient.invalidateQueries({ queryKey: ['interview-template'] });
    },
  });
}

export function useUpdateTemplatePergunta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TemplatePergunta> & { id: string }) => {
      const { error } = await supabase
        .from('template_perguntas')
        .update({
          pergunta: updates.texto,
          tipo: updates.tipo,
          competencia_id: updates.competenciaId,
          ordem: updates.ordem,
          obrigatoria: updates.obrigatoria,
          criterios_avaliacao: updates.criteriosAvaliacao,
          resposta_ideal: updates.respostaEsperada,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-templates'] });
      queryClient.invalidateQueries({ queryKey: ['interview-template'] });
    },
  });
}

export function useDeleteTemplatePergunta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('template_perguntas')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-templates'] });
      queryClient.invalidateQueries({ queryKey: ['interview-template'] });
    },
  });
}

export function useSaveInterviewResponses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (responses: Omit<InterviewResponse, 'id'>[]) => {
      const { data, error } = await supabase
        .from('entrevista_respostas')
        .insert(
          responses.map(r => ({
            entrevista_id: r.entrevistaId,
            template_id: r.templateId,
            pergunta_id: r.perguntaId,
            resposta_candidato: r.respostaCandidato,
            nota: r.nota,
            observacoes: r.observacoes,
            avaliador_id: r.avaliadorId,
          }))
        )
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-responses'] });
    },
  });
}

export function useInterviewResponses(entrevistaId: string) {
  return useQuery({
    queryKey: ['interview-responses', entrevistaId],
    queryFn: async (): Promise<InterviewResponse[]> => {
      const { data, error } = await supabase
        .from('entrevista_respostas')
        .select('*')
        .eq('entrevista_id', entrevistaId);

      if (error) throw error;

      return (data || []).map(r => ({
        id: r.id,
        entrevistaId: r.entrevista_id || undefined,
        templateId: r.template_id || undefined,
        perguntaId: r.pergunta_id || undefined,
        respostaCandidato: r.resposta_candidato || undefined,
        nota: r.nota || undefined,
        observacoes: r.observacoes || undefined,
        avaliadorId: r.avaliador_id || undefined,
      }));
    },
    enabled: !!entrevistaId,
  });
}
