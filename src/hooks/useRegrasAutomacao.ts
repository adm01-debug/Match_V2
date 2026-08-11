/**
 * @fileoverview Hook para buscar regras de automação do Supabase (tabela regras_automacao)
 * @module hooks/useRegrasAutomacao
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Workflow } from '@/types/workflow';

const mapTipoToTrigger = (tipo: string): unknown[] => {
  switch (tipo) {
    case 'comunicacao':
    case 'notificacao':
      return [
        {
          id: 't1',
          type: 'trigger',
          position: { x: 0, y: 0 },
          data: { label: 'Trigger automático', type: 'trigger', trigger: { type: 'etapa_mudou', config: {} } },
        },
        {
          id: 'a1',
          type: 'action',
          position: { x: 0, y: 100 },
          data: { label: 'Enviar email', type: 'action', action: { type: 'enviar_email', config: {} } },
        },
      ];
    case 'triagem':
      return [
        {
          id: 't1',
          type: 'trigger',
          position: { x: 0, y: 0 },
          data: { label: 'Candidato novo', type: 'trigger', trigger: { type: 'candidato_novo', config: {} } },
        },
        {
          id: 'a1',
          type: 'action',
          position: { x: 0, y: 100 },
          data: { label: 'Mover etapa', type: 'action', action: { type: 'mover_etapa', config: {} } },
        },
      ];
    case 'agendamento':
      return [
        {
          id: 't1',
          type: 'trigger',
          position: { x: 0, y: 0 },
          data: { label: 'Entrevista agendada', type: 'trigger', trigger: { type: 'entrevista_agendada', config: {} } },
        },
        {
          id: 'a1',
          type: 'action',
          position: { x: 0, y: 100 },
          data: { label: 'Agendar entrevista', type: 'action', action: { type: 'agendar_entrevista', config: {} } },
        },
      ];
    case 'feedback':
      return [
        {
          id: 't1',
          type: 'trigger',
          position: { x: 0, y: 0 },
          data: { label: 'Teste concluído', type: 'trigger', trigger: { type: 'teste_concluido', config: {} } },
        },
        {
          id: 'a1',
          type: 'action',
          position: { x: 0, y: 100 },
          data: { label: 'Notificar', type: 'action', action: { type: 'notificar', config: {} } },
        },
      ];
    case 'followup':
    case 'reengajamento':
      return [
        {
          id: 't1',
          type: 'trigger',
          position: { x: 0, y: 0 },
          data: { label: 'SLA vencido', type: 'trigger', trigger: { type: 'sla_vencido', config: {} } },
        },
        {
          id: 'a1',
          type: 'delay',
          position: { x: 0, y: 100 },
          data: { label: 'Aguardar 7 dias', type: 'delay', delay: { duration: 7, unit: 'days' } },
        },
        {
          id: 'a2',
          type: 'action',
          position: { x: 0, y: 200 },
          data: { label: 'Enviar email', type: 'action', action: { type: 'enviar_email', config: {} } },
        },
      ];
    case 'proposta':
      return [
        {
          id: 't1',
          type: 'trigger',
          position: { x: 0, y: 0 },
          data: { label: 'Match aprovado', type: 'trigger', trigger: { type: 'etapa_mudou', config: {} } },
        },
        {
          id: 'a1',
          type: 'action',
          position: { x: 0, y: 100 },
          data: { label: 'Notificar gestor', type: 'action', action: { type: 'notificar', config: {} } },
        },
      ];
    case 'validacao':
      return [
        {
          id: 't1',
          type: 'trigger',
          position: { x: 0, y: 0 },
          data: { label: 'Candidato novo', type: 'trigger', trigger: { type: 'candidato_novo', config: {} } },
        },
        {
          id: 'c1',
          type: 'condition',
          position: { x: 0, y: 100 },
          data: { label: 'Email já existe?', type: 'condition', condition: { field: 'email', operator: 'contains', value: '' } },
        },
        {
          id: 'a1',
          type: 'action',
          position: { x: 0, y: 200 },
          data: { label: 'Notificar recrutador', type: 'action', action: { type: 'notificar', config: {} } },
        },
      ];
    default:
      return [
        {
          id: 't1',
          type: 'trigger',
          position: { x: 0, y: 0 },
          data: { label: 'Trigger', type: 'trigger', trigger: { type: 'manual', config: {} } },
        },
      ];
  }
};

const rowToWorkflow = (row: {
  id: string;
  nome: string;
  descricao: string | null;
  tipo: string;
  ativo: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}): Workflow => ({
  id: row.id,
  name: row.nome,
  description: row.descricao ?? '',
  active: row.ativo ?? false,
  nodes: mapTipoToTrigger(row.tipo),
  edges: [],
  createdAt: row.created_at ?? new Date().toISOString(),
  updatedAt: row.updated_at ?? new Date().toISOString(),
});

export function useRegrasAutomacao() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('regras_automacao')
      .select('id, nome, descricao, tipo, ativo, created_at, updated_at')
      .order('created_at', { ascending: false });
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[useRegrasAutomacao] erro ao buscar regras:', error);
      setWorkflows([]);
    } else {
      setWorkflows((data ?? []).map(rowToWorkflow));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchRules();
  }, [fetchRules]);

  return { workflows, loading, refresh: fetchRules };
}

export default useRegrasAutomacao;
