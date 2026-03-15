/**
 * @fileoverview Tipos para o módulo de Workflows
 */

export type WorkflowNodeType = 'trigger' | 'action' | 'condition' | 'delay';

export interface WorkflowTrigger {
  type: 'candidato_novo' | 'etapa_mudou' | 'entrevista_agendada' | 'teste_concluido' | 'sla_vencido' | 'manual';
  config: Record<string, unknown>;
}

export interface WorkflowAction {
  type: 'enviar_email' | 'mover_etapa' | 'notificar' | 'atribuir_tag' | 'agendar_entrevista' | 'enviar_teste' | 'webhook';
  config: Record<string, unknown>;
}

export interface WorkflowCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains' | 'in';
  value: string | number | string[];
}

export interface WorkflowDelay {
  duration: number;
  unit: 'minutes' | 'hours' | 'days';
}

export interface WorkflowNodeData {
  label: string;
  type: WorkflowNodeType;
  trigger?: WorkflowTrigger;
  action?: WorkflowAction;
  condition?: WorkflowCondition;
  delay?: WorkflowDelay;
  description?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  nodes: unknown[];
  edges: unknown[];
  createdAt: string;
  updatedAt: string;
}

export const TRIGGER_OPTIONS = [
  { value: 'candidato_novo', label: 'Novo Candidato', description: 'Quando um candidato se inscreve' },
  { value: 'etapa_mudou', label: 'Etapa Alterada', description: 'Quando candidato muda de etapa' },
  { value: 'entrevista_agendada', label: 'Entrevista Agendada', description: 'Quando uma entrevista é criada' },
  { value: 'teste_concluido', label: 'Teste Concluído', description: 'Quando um teste é finalizado' },
  { value: 'sla_vencido', label: 'SLA Vencido', description: 'Quando o prazo de SLA expira' },
  { value: 'manual', label: 'Manual', description: 'Executar manualmente' },
];

export const ACTION_OPTIONS = [
  { value: 'enviar_email', label: 'Enviar Email', description: 'Enviar email ao candidato' },
  { value: 'mover_etapa', label: 'Mover Etapa', description: 'Mover candidato para outra etapa' },
  { value: 'notificar', label: 'Notificar', description: 'Enviar notificação ao recrutador' },
  { value: 'atribuir_tag', label: 'Atribuir Tag', description: 'Adicionar tag ao candidato' },
  { value: 'agendar_entrevista', label: 'Agendar Entrevista', description: 'Criar entrevista automaticamente' },
  { value: 'enviar_teste', label: 'Enviar Teste', description: 'Enviar prova ao candidato' },
  { value: 'webhook', label: 'Webhook', description: 'Chamar URL externa' },
];
