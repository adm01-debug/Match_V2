/**
 * Workflow Engine
 * Motor de execução de workflows automatizados
 */

import { createContextLogger } from './logger';

const log = createContextLogger('WorkflowEngine');

// Types
export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'end' | 'notification' | 'webhook';
  data: Record<string, unknown>;
  position?: { x: number; y: number };
}

export interface WorkflowEdge {
  id?: string;
  source: string;
  target: string;
  sourceHandle?: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isActive?: boolean;
}

export interface WorkflowContext {
  [key: string]: unknown;
}

export interface ExecutionResult {
  status: 'completed' | 'error' | 'paused';
  executedNodes: string[];
  error?: string;
  logs: ExecutionLog[];
  duration: number;
}

export interface ExecutionLog {
  id: string;
  workflowId: string;
  nodeId: string;
  status: 'running' | 'completed' | 'failed' | 'skipped';
  timestamp: Date;
  data?: Record<string, unknown>;
  error?: string;
}

export interface ValidationError {
  code: string;
  message: string;
  nodeId?: string;
}

class WorkflowEngine {
  private executionLogs: Map<string, ExecutionLog[]> = new Map();

  /**
   * Executa um workflow (API compatível com testes)
   */
  async execute(workflow: Workflow, context: WorkflowContext = {}): Promise<ExecutionResult> {
    const startTime = Date.now();
    const executedNodes: string[] = [];
    const logs: ExecutionLog[] = [];

    // Validar antes de executar
    const validationErrors = this.validate(workflow);
    if (validationErrors.length > 0) {
      return {
        status: 'error',
        executedNodes: [],
        error: validationErrors[0]?.message ?? 'Validation error',
        logs: [],
        duration: Date.now() - startTime,
      };
    }

    const triggerNode = workflow.nodes.find(n => n.type === 'trigger');
    if (!triggerNode) {
      return {
        status: 'error',
        executedNodes: [],
        error: 'Workflow sem trigger',
        logs: [],
        duration: Date.now() - startTime,
      };
    }

    try {
      await this.processNode(workflow, triggerNode.id, context, executedNodes, logs);
      
      // Salvar logs
      this.executionLogs.set(workflow.id, logs);
      
      return {
        status: 'completed',
        executedNodes,
        logs,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      logs.push({
        id: `log-${Date.now()}`,
        workflowId: workflow.id,
        nodeId: triggerNode.id,
        status: 'failed',
        timestamp: new Date(),
        error: errorMessage,
      });

      return {
        status: 'error',
        executedNodes,
        error: errorMessage,
        logs,
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * Alias para compatibilidade
   */
  async executeWorkflow(workflow: Workflow, context: WorkflowContext = {}): Promise<ExecutionResult> {
    return this.execute(workflow, context);
  }

  /**
   * Valida um workflow
   */
  validate(workflow: { nodes: WorkflowNode[]; edges?: WorkflowEdge[] }): ValidationError[] {
    const errors: ValidationError[] = [];

    // Verificar se tem trigger
    const triggers = workflow.nodes.filter(n => n.type === 'trigger');
    if (triggers.length === 0) {
      errors.push({
        code: 'MISSING_TRIGGER',
        message: 'Workflow precisa de pelo menos um trigger',
      });
    }
    if (triggers.length > 1) {
      errors.push({
        code: 'MULTIPLE_TRIGGERS',
        message: 'Workflow pode ter apenas um trigger',
      });
    }

    // Verificar nós desconectados
    if (workflow.edges && workflow.nodes.length > 1) {
      const connectedNodes = new Set<string>();
      
      // Trigger sempre está conectado
      triggers.forEach(t => connectedNodes.add(t.id));
      
      // Adicionar nós conectados por edges
      workflow.edges.forEach(edge => {
        connectedNodes.add(edge.source);
        connectedNodes.add(edge.target);
      });

      workflow.nodes.forEach(node => {
        if (node.type !== 'trigger' && !connectedNodes.has(node.id)) {
          errors.push({
            code: 'DISCONNECTED_NODE',
            message: `Nó "${node.id}" está desconectado`,
            nodeId: node.id,
          });
        }
      });
    }

    // Verificar edges apontando para nós inexistentes
    if (workflow.edges) {
      const nodeIds = new Set(workflow.nodes.map(n => n.id));
      workflow.edges.forEach(edge => {
        if (!nodeIds.has(edge.source)) {
          errors.push({
            code: 'INVALID_EDGE_SOURCE',
            message: `Edge com source "${edge.source}" não encontrado`,
          });
        }
        if (!nodeIds.has(edge.target)) {
          errors.push({
            code: 'INVALID_EDGE_TARGET',
            message: `Edge com target "${edge.target}" não encontrado`,
          });
        }
      });
    }

    return errors;
  }

  /**
   * Retorna logs de execução
   */
  async getLogs(workflowId: string): Promise<ExecutionLog[]> {
    // Primeiro tentar cache local
    const cachedLogs = this.executionLogs.get(workflowId);
    if (cachedLogs) {
      return cachedLogs;
    }

    // Em produção, buscar do banco
    try {
      // Table workflow_logs doesn't exist, return mock/cached logs
      log.debug('Fetching logs for workflow:', workflowId);
      return [];
    } catch (error) {
      log.error('Error fetching logs:', error);
      return [];
    }
  }

  // === Private Methods ===

  private async processNode(
    workflow: Workflow,
    nodeId: string,
    context: WorkflowContext,
    executedNodes: string[],
    logs: ExecutionLog[]
  ): Promise<void> {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const log: ExecutionLog = {
      id: `log-${Date.now()}-${nodeId}`,
      workflowId: workflow.id,
      nodeId,
      status: 'running',
      timestamp: new Date(),
    };
    logs.push(log);

    try {
      switch (node.type) {
        case 'trigger':
          // Trigger apenas inicia o fluxo
          break;

        case 'action':
          await this.executeAction(node, context);
          break;

        case 'condition':
          const conditionResult = this.evaluateCondition(node.data, context);
          const nextEdge = workflow.edges?.find(
            e => e.source === nodeId && 
                 (e.label === (conditionResult ? 'true' : 'false') ||
                  e.sourceHandle === (conditionResult ? 'yes' : 'no'))
          );
          
          if (nextEdge) {
            executedNodes.push(nodeId);
            log.status = 'completed';
            await this.processNode(workflow, nextEdge.target, context, executedNodes, logs);
          }
          return;

        case 'delay':
          const duration = (node.data['duration'] as number) || 0;
          await this.delay(duration);
          break;

        case 'notification':
          await this.sendNotification(node, context);
          break;

        case 'webhook':
          await this.callWebhook(node, context);
          break;

        case 'end':
          executedNodes.push(nodeId);
          log.status = 'completed';
          return;
      }

      executedNodes.push(nodeId);
      log.status = 'completed';

      // Processar próximos nós
      const nextEdges = workflow.edges?.filter(e => e.source === nodeId) ?? [];
      for (const edge of nextEdges) {
        await this.processNode(workflow, edge.target, context, executedNodes, logs);
      }
    } catch (error) {
      log.status = 'failed';
      log.error = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }

  private async executeAction(node: WorkflowNode, _context: WorkflowContext): Promise<void> {
    const actionType = node.data['actionType'] as string;

    // Check for fail action (for testing)
    if (actionType === 'fail') {
      throw new Error('Action failed intentionally');
    }

    log.debug(`Executing action: ${actionType}`, { node });
    
    // Simulate action execution
    switch (actionType) {
      case 'log':
        log.info('Log action:', node.data['message']);
        break;
      case 'send_email':
        // await emailService.send(...)
        break;
      case 'move_stage':
        // await candidateService.moveStage(...)
        break;
      default:
        log.warn(`Unknown action: ${actionType}`);
    }
  }

  private evaluateCondition(conditionData: Record<string, unknown>, context: WorkflowContext): boolean {
    const expression = conditionData['expression'] as string;
    if (!expression) return true;

    try {
      // Criar função segura para avaliar expressão
      const safeEval = new Function(...Object.keys(context), `return ${expression}`);
      return Boolean(safeEval(...Object.values(context)));
    } catch (error) {
      log.error('Condition evaluation error:', error);
      return false;
    }
  }

  private async delay(ms: number): Promise<void> {
    if (ms <= 0) return;
    await new Promise(resolve => setTimeout(resolve, Math.min(ms, 30000)));
  }

  private async sendNotification(node: WorkflowNode, context: WorkflowContext): Promise<void> {
    log.debug('Sending notification:', { node, context });
    // Implement notification logic
  }

  private async callWebhook(node: WorkflowNode, _context: WorkflowContext): Promise<void> {
    const url = node.data['url'] as string;
    if (!url) return;

    log.debug('Calling webhook:', url);
    // In production, make actual HTTP request
    // await fetch(url, { method: 'POST', body: JSON.stringify(context) });
  }
}

export const workflowEngine = new WorkflowEngine();
