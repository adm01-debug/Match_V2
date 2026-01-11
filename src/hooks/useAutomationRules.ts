/**
 * @module useAutomationRules
 * @description Hooks para gerenciar regras de automação do processo seletivo
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface AutomationCondition {
  campo: string;
  operador: 'igual' | 'maior' | 'menor' | 'contem' | 'entre';
  valor: string | number | boolean;
}

export interface AutomationAction {
  tipo: 'mover_etapa' | 'enviar_email' | 'notificar' | 'agendar' | 'reprovar' | 'aprovar';
  parametros: Record<string, unknown>;
}

export interface AutomationRule {
  id: string;
  nome: string;
  descricao?: string;
  tipo: 'triagem' | 'avaliacao' | 'entrevista' | 'oferta' | 'geral';
  condicoes: AutomationCondition[];
  acoes: AutomationAction[];
  ativo: boolean;
  prioridade: number;
  aplicavelA?: string[];
}

export interface AutomationLog {
  id: string;
  regraId: string;
  processoId?: string;
  candidatoId?: string;
  resultado: 'sucesso' | 'erro' | 'ignorado';
  acaoExecutada?: AutomationAction;
  detalhes?: string;
  executadoEm: string;
}

export function useAutomationRules(tipo?: string) {
  return useQuery({
    queryKey: ['automation-rules', tipo],
    queryFn: async (): Promise<AutomationRule[]> => {
      let query = supabase
        .from('regras_automacao')
        .select('*')
        .order('prioridade', { ascending: true });
      
      if (tipo) {
        query = query.eq('tipo', tipo);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(row => ({
        id: row.id,
        nome: row.nome,
        descricao: row.descricao || undefined,
        tipo: row.tipo as AutomationRule['tipo'],
        condicoes: (row.condicoes as unknown as AutomationCondition[]) || [],
        acoes: (row.acoes as unknown as AutomationAction[]) || [],
        ativo: row.ativo ?? true,
        prioridade: row.prioridade || 0,
        aplicavelA: row.aplicavel_a || undefined,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useActiveAutomationRules() {
  return useQuery({
    queryKey: ['automation-rules', 'active'],
    queryFn: async (): Promise<AutomationRule[]> => {
      const { data, error } = await supabase
        .from('regras_automacao')
        .select('*')
        .eq('ativo', true)
        .order('prioridade', { ascending: true });

      if (error) throw error;

      return (data || []).map(row => ({
        id: row.id,
        nome: row.nome,
        descricao: row.descricao || undefined,
        tipo: row.tipo as AutomationRule['tipo'],
        condicoes: (row.condicoes as unknown as AutomationCondition[]) || [],
        acoes: (row.acoes as unknown as AutomationAction[]) || [],
        ativo: true,
        prioridade: row.prioridade || 0,
        aplicavelA: row.aplicavel_a || undefined,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateAutomationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rule: Omit<AutomationRule, 'id'>) => {
      const { data, error } = await supabase
        .from('regras_automacao')
        .insert({
          nome: rule.nome,
          descricao: rule.descricao,
          tipo: rule.tipo,
          condicoes: rule.condicoes as unknown as Json,
          acoes: rule.acoes as unknown as Json,
          ativo: rule.ativo,
          prioridade: rule.prioridade,
          aplicavel_a: rule.aplicavelA,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
    },
  });
}

export function useUpdateAutomationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AutomationRule> & { id: string }) => {
      const { error } = await supabase
        .from('regras_automacao')
        .update({
          nome: updates.nome,
          descricao: updates.descricao,
          tipo: updates.tipo,
          condicoes: updates.condicoes as unknown as Json,
          acoes: updates.acoes as unknown as Json,
          ativo: updates.ativo,
          prioridade: updates.prioridade,
          aplicavel_a: updates.aplicavelA,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
    },
  });
}

export function useDeleteAutomationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('regras_automacao')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
    },
  });
}

export function useToggleAutomationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase
        .from('regras_automacao')
        .update({ ativo })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
    },
  });
}

export function useAutomationLogs(regraId?: string) {
  return useQuery({
    queryKey: ['automation-logs', regraId],
    queryFn: async (): Promise<AutomationLog[]> => {
      let query = supabase
        .from('regras_log')
        .select('*')
        .order('executado_em', { ascending: false })
        .limit(100);

      if (regraId) {
        query = query.eq('regra_id', regraId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(row => ({
        id: row.id,
        regraId: row.regra_id || '',
        processoId: row.processo_id || undefined,
        candidatoId: row.candidato_id || undefined,
        resultado: (row.resultado as AutomationLog['resultado']) || 'ignorado',
        acaoExecutada: row.acao_executada as unknown as AutomationAction | undefined,
        detalhes: row.detalhes || undefined,
        executadoEm: row.executado_em || new Date().toISOString(),
      }));
    },
    enabled: true,
  });
}

export function useExecuteAutomationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      regraId,
      processoId,
      candidatoId,
    }: {
      regraId: string;
      processoId?: string;
      candidatoId?: string;
    }) => {
      // Get the rule
      const { data: rule, error: ruleError } = await supabase
        .from('regras_automacao')
        .select('*')
        .eq('id', regraId)
        .single();

      if (ruleError) throw ruleError;

      // Log the execution
      const { data: log, error: logError } = await supabase
        .from('regras_log')
        .insert({
          regra_id: regraId,
          processo_id: processoId,
          candidato_id: candidatoId,
          resultado: 'sucesso',
          acao_executada: rule.acoes,
          detalhes: `Regra "${rule.nome}" executada manualmente`,
        })
        .select()
        .single();

      if (logError) throw logError;
      return log;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-logs'] });
    },
  });
}
