/**
 * @fileoverview Engine de execução de workflows
 */

import type { WorkflowNodeData, WorkflowTrigger, WorkflowAction, WorkflowCondition, WorkflowDelay } from '@/types/workflow';

export interface WorkflowExecutionContext {
  candidatoId?: string;
  processoId?: string;
  vagaId?: string;
  etapaAnterior?: string;
  etapaAtual?: string;
  data: Record<string, unknown>;
}

export interface WorkflowExecutionResult {
  success: boolean;
  nodeId: string;
  action: string;
  message: string;
  timestamp: string;
}

export class WorkflowEngine {
  private results: WorkflowExecutionResult[] = [];

  async executeTrigger(trigger: WorkflowTrigger, context: WorkflowExecutionContext): Promise<boolean> {
    switch (trigger.type) {
      case 'candidato_novo':
        return !!context.candidatoId;
      case 'etapa_mudou':
        return context.etapaAnterior !== context.etapaAtual;
      case 'entrevista_agendada':
        return !!context.data.entrevistaId;
      case 'teste_concluido':
        return !!context.data.testeId;
      case 'sla_vencido':
        return (context.data.diasNaEtapa as number) > (trigger.config.maxDias as number || 5);
      case 'manual':
        return true;
      default:
        return false;
    }
  }

  async executeAction(action: WorkflowAction, context: WorkflowExecutionContext): Promise<WorkflowExecutionResult> {
    const result: WorkflowExecutionResult = {
      success: true,
      nodeId: '',
      action: action.type,
      message: '',
      timestamp: new Date().toISOString(),
    };

    switch (action.type) {
      case 'enviar_email':
        result.message = `Email enviado para candidato ${context.candidatoId}`;
        break;
      case 'mover_etapa':
        result.message = `Candidato movido para etapa ${action.config.etapa}`;
        break;
      case 'notificar':
        result.message = `Notificação enviada: ${action.config.mensagem}`;
        break;
      case 'atribuir_tag':
        result.message = `Tag "${action.config.tag}" atribuída`;
        break;
      case 'agendar_entrevista':
        result.message = `Entrevista agendada automaticamente`;
        break;
      case 'enviar_teste':
        result.message = `Teste enviado ao candidato`;
        break;
      case 'webhook':
        result.message = `Webhook chamado: ${action.config.url}`;
        break;
      default:
        result.success = false;
        result.message = 'Ação desconhecida';
    }

    this.results.push(result);
    return result;
  }

  evaluateCondition(condition: WorkflowCondition, context: WorkflowExecutionContext): boolean {
    const fieldValue = context.data[condition.field];
    switch (condition.operator) {
      case 'eq':
        return fieldValue === condition.value;
      case 'neq':
        return fieldValue !== condition.value;
      case 'gt':
        return Number(fieldValue) > Number(condition.value);
      case 'lt':
        return Number(fieldValue) < Number(condition.value);
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(String(fieldValue));
      default:
        return false;
    }
  }

  getDelayMs(delay: WorkflowDelay): number {
    const multipliers = { minutes: 60000, hours: 3600000, days: 86400000 };
    return delay.duration * (multipliers[delay.unit] || 60000);
  }

  getResults(): WorkflowExecutionResult[] {
    return this.results;
  }

  clearResults(): void {
    this.results = [];
  }
}

export const workflowEngine = new WorkflowEngine();
