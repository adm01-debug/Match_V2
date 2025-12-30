export type WorkflowTrigger =
  | 'candidate_applied'
  | 'candidate_stage_changed'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'evaluation_completed'
  | 'offer_sent'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'time_in_stage'
  | 'manual';

export type WorkflowAction =
  | 'send_email'
  | 'send_sms'
  | 'send_whatsapp'
  | 'create_task'
  | 'move_stage'
  | 'assign_recruiter'
  | 'add_tag'
  | 'remove_tag'
  | 'schedule_interview'
  | 'send_evaluation'
  | 'add_to_talent_pool'
  | 'notify_team'
  | 'update_field'
  | 'call_webhook';

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'end';
  data: {
    label: string;
    trigger?: WorkflowTrigger;
    action?: WorkflowAction;
    config?: Record<string, unknown>;
  };
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowContext {
  candidatoId?: string;
  vagaId?: string;
  candidaturaId?: string;
  triggeredBy: WorkflowTrigger;
  data?: Record<string, unknown>;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number | boolean;
}

export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  nodeId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  executedAt: string;
}

export const TRIGGER_LABELS: Record<WorkflowTrigger, string> = {
  candidate_applied: 'Candidato se inscreveu',
  candidate_stage_changed: 'Mudança de etapa',
  interview_scheduled: 'Entrevista agendada',
  interview_completed: 'Entrevista realizada',
  evaluation_completed: 'Avaliação concluída',
  offer_sent: 'Proposta enviada',
  offer_accepted: 'Proposta aceita',
  offer_rejected: 'Proposta recusada',
  time_in_stage: 'Tempo na etapa',
  manual: 'Acionado manualmente',
};

export const ACTION_LABELS: Record<WorkflowAction, string> = {
  send_email: 'Enviar email',
  send_sms: 'Enviar SMS',
  send_whatsapp: 'Enviar WhatsApp',
  create_task: 'Criar tarefa',
  move_stage: 'Mover para etapa',
  assign_recruiter: 'Atribuir recrutador',
  add_tag: 'Adicionar tag',
  remove_tag: 'Remover tag',
  schedule_interview: 'Agendar entrevista',
  send_evaluation: 'Enviar avaliação',
  add_to_talent_pool: 'Adicionar ao Talent Pool',
  notify_team: 'Notificar equipe',
  update_field: 'Atualizar campo',
  call_webhook: 'Chamar webhook',
};
