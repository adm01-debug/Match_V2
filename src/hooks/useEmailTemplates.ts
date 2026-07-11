/**
 * @module useEmailTemplates
 * @description Hook para gerenciar templates de email persistidos no banco
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EmailTemplate {
  id: string;
  nome: string;
  assunto: string;
  conteudo: string;
  etapa: string;
  categoria: string;
  variaveis: string[];
  ativo: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface EmailTemplateInput {
  nome: string;
  assunto: string;
  conteudo: string;
  etapa?: string;
  categoria?: string;
  variaveis?: string[];
  ativo?: boolean;
}


const db = supabase;

export function useEmailTemplates(etapa?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['email_templates', etapa],
    queryFn: async () => {
      let query = db.from('email_templates').select('*').eq('ativo', true).order('nome');
      if (etapa) query = query.eq('etapa', etapa);
      const { data, error: queryError } = await query;
      if (queryError) throw queryError;
      return (data || []) as EmailTemplate[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (input: EmailTemplateInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await db.from('email_templates').insert({ ...input, created_by: user?.id }).select().single();
      if (error) throw error;
      return data as EmailTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email_templates'] });
      toast({ title: 'Template criado com sucesso!' });
    },
    onError: (err: Error) => toast({ title: 'Erro ao criar template', description: err.message, variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<EmailTemplateInput>) => {
      const { data, error } = await db.from('email_templates').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as EmailTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email_templates'] });
      toast({ title: 'Template atualizado!' });
    },
    onError: (err: Error) => toast({ title: 'Erro ao atualizar template', description: err.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from('email_templates').update({ ativo: false }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email_templates'] });
      toast({ title: 'Template removido!' });
    },
  });

  return {
    templates,
    isLoading,
    error,
    createTemplate: createMutation.mutateAsync,
    updateTemplate: updateMutation.mutateAsync,
    deleteTemplate: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
