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
  telefone: string;
  cargo_pretendido: string;
  experiencia_anos: number;
  skills: string[];
  formacao: string;
  status: 'novo' | 'triagem' | 'entrevista' | 'teste' | 'proposta' | 'contratado' | 'rejeitado';
  vaga_id?: string;
  curriculum_url?: string;
  linkedin_url?: string;
  avaliacao?: number;
  notas?: string;
  created_at: string;
}

export interface Vaga {
  id: string;
  titulo: string;
  departamento: string;
  descricao: string;
  requisitos: string[];
  salario_min?: number;
  salario_max?: number;
  tipo: 'clt' | 'pj' | 'estagio' | 'temporario';
  modalidade: 'presencial' | 'hibrido' | 'remoto';
  status: 'aberta' | 'pausada' | 'fechada';
  responsavel_id?: string;
  candidatos_count?: number;
  created_at: string;
}

export interface Entrevista {
  id: string;
  candidato_id: string;
  vaga_id: string;
  data: string;
  hora: string;
  tipo: 'presencial' | 'video' | 'telefone';
  local?: string;
  link_video?: string;
  entrevistadores: string[];
  status: 'agendada' | 'realizada' | 'cancelada' | 'reagendada';
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
      return data as Candidato[];
    },
  });
}

export function useCandidato(id: string) {
  return useQuery({
    queryKey: ['candidato', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('candidatos').select('*, vaga:vagas(titulo)').eq('id', id).single();
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
      let query = supabase.from('vagas').select('*, candidatos(count)').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      return data.map(v => ({ ...v, candidatos_count: v.candidatos?.[0]?.count || 0 })) as Vaga[];
    },
  });
}

// Hooks - Entrevistas (Agenda)
export function useEntrevistas(data?: string) {
  return useQuery({
    queryKey: ['entrevistas', data],
    queryFn: async () => {
      let query = supabase.from('entrevistas').select('*, candidato:candidatos(nome, email), vaga:vagas(titulo)').order('data').order('hora');
      if (data) query = query.eq('data', data);
      const { data: result, error } = await query;
      if (error) throw error;
      return result as Entrevista[];
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
      const { data, error } = await supabase.from('email_templates').select('*').eq('ativo', true).order('nome');
      if (error) throw error;
      return data as EmailTemplate[];
    },
  });
}

// Hooks - Workflows
export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data, error } = await supabase.from('workflows').select('*, etapas:workflow_etapas(*)').eq('ativo', true);
      if (error) throw error;
      return data;
    },
  });
}

// Mutations
export function useUpdateCandidatoStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Candidato['status'] }) => {
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
      const { data, error } = await supabase.from('entrevistas').insert(entrevista).select().single();
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
      const { error } = await supabase.from('candidatos').update({ avaliacao, notas }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { id }) => { qc.invalidateQueries({ queryKey: ['candidato', id] }); toast.success('Avaliação salva!'); },
  });
}

export default { useCandidatos, useCandidato, useVagas, useEntrevistas, useAgendaHoje, useEmailTemplates, useWorkflows, useUpdateCandidatoStatus, useAgendarEntrevista, useAvaliarCandidato };
