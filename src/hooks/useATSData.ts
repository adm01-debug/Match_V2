/**
 * Hook para buscar dados reais do Match ATS
 * MIGRAÇÃO: Mock → Produção
 * Substitui: src/data/*.ts (agenda, avaliacao, candidato, email, workflow)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface Candidato {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  cargo_pretendido?: string;
  experiencia_anos?: number;
  skills?: string[];
  formacao?: unknown;
  status?: string | null;
  vaga_id?: string;
  curriculum_url?: string;
  linkedin_url?: string;
  avaliacao?: number;
  notas?: string;
  created_at?: string | null;
}

export interface Vaga {
  id: string;
  titulo: string;
  departamento: string;
  descricao?: string;
  requisitos?: string[];
  salario_min?: number | null;
  salario_max?: number | null;
  tipo?: string;
  modalidade: string;
  status: string;
  responsavel_id?: string;
  candidatos_count?: number;
  created_at: string;
}

export interface Entrevista {
  id: string;
  candidato_id?: string | null;
  vaga_id: string;
  data: string;
  hora?: string;
  hora_inicio?: string;
  hora_fim?: string;
  tipo: string;
  local?: string | null;
  link_video?: string;
  link_online?: string | null;
  entrevistadores: string[];
  status: string;
  feedback?: string;
  avaliacao?: number;
}

export interface EmailTemplate {
  id: string;
  nome: string;
  assunto: string;
  corpo: string;
  tipo: 'convite' | 'feedback' | 'proposta' | 'rejeicao' | 'boas_vindas';
  variaveis: string[];
  ativo: boolean;
}

export interface WorkflowEtapa {
  id: string;
  workflow_id: string;
  nome: string;
  ordem: number;
  tipo: 'automatico' | 'manual';
  acao?: string;
  dias_prazo?: number;
}

// Hooks - Candidatos
export function useCandidatos(vagaId?: string, status?: string) {
  return useQuery({
    queryKey: ['candidatos', vagaId, status],
    queryFn: async () => {
      let query = supabase.from('candidatos').select('*').order('created_at', { ascending: false });
      if (vagaId) query = query.eq('vaga_id', vagaId);
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Candidato[];
    },
  });
}

export function useCandidato(id: string) {
  return useQuery({
    queryKey: ['candidato', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('candidatos').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Candidato;
    },
    enabled: !!id,
  });
}

// Hooks - Vagas
export function useVagas(status?: string) {
  return useQuery({
    queryKey: ['vagas', status],
    queryFn: async () => {
      let query = supabase.from('vagas').select('*').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Vaga[];
    },
  });
}

// Hooks - Entrevistas (Agenda)
export function useEntrevistas(data?: string) {
  return useQuery({
    queryKey: ['entrevistas', data],
    queryFn: async () => {
      let query = supabase.from('entrevistas').select('*').order('data').order('hora_inicio');
      if (data) query = query.eq('data', data);
      const { data: result, error } = await query;
      if (error) throw error;
      return (result ?? []) as Entrevista[];
    },
  });
}

export function useAgendaHoje() {
  const hoje = new Date().toISOString().split('T')[0];
  return useEntrevistas(hoje);
}

// Hooks - Templates de Email
export function useEmailTemplates() {
  return useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      // Note: email_templates table may not exist, returning empty array as fallback
      try {
        const { data, error } = await supabase.from('email_templates' as never).select('*');
        if (error) return [] as EmailTemplate[];
        return (data ?? []) as EmailTemplate[];
      } catch {
        return [] as EmailTemplate[];
      }
    },
  });
}

// Hooks - Workflows
export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      // Note: workflows table may not exist, returning empty array as fallback
      try {
        const { data, error } = await supabase.from('workflows' as never).select('*');
        if (error) return [];
        return data ?? [];
      } catch {
        return [];
      }
    },
  });
}

// Mutations
export function useUpdateCandidatoStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('candidatos').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['candidatos'] }); toast.success('Status atualizado!'); },
  });
}

export function useAgendarEntrevista() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entrevista: Omit<Entrevista, 'id'>) => {
      const { data, error } = await supabase.from('entrevistas').insert(entrevista as never).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['entrevistas'] }); toast.success('Entrevista agendada!'); },
  });
}

export function useAvaliarCandidato() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, avaliacao, notas }: { id: string; avaliacao: number; notas?: string }) => {
      const { error } = await supabase.from('candidatos').update({ avaliacao, notas } as never).eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { id }) => { qc.invalidateQueries({ queryKey: ['candidato', id] }); toast.success('Avaliação salva!'); },
  });
}

export default { useCandidatos, useCandidato, useVagas, useEntrevistas, useAgendaHoje, useEmailTemplates, useWorkflows, useUpdateCandidatoStatus, useAgendarEntrevista, useAvaliarCandidato };
