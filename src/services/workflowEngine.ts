import { supabase } from "@/integrations/supabase/client";
import type { Workflow, WorkflowContext, WorkflowNode, WorkflowCondition, WorkflowExecutionLog, WorkflowAction } from "@/types/workflow";

class WorkflowEngine {
  private logs: WorkflowExecutionLog[] = [];

  async executeWorkflow(workflow: Workflow, context: WorkflowContext): Promise<void> {
    if (!workflow.isActive) return;

    const triggerNode = workflow.nodes.find(n => n.type === "trigger");
    if (!triggerNode) return;

    this.log(workflow.id, triggerNode.id, "running");

    try {
      await this.processNode(workflow, triggerNode.id, context);
      this.log(workflow.id, triggerNode.id, "completed");
    } catch (error) {
      this.log(workflow.id, triggerNode.id, "failed", { error: String(error) });
    }
  }

  private async processNode(workflow: Workflow, nodeId: string, context: WorkflowContext): Promise<void> {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;

    this.log(workflow.id, nodeId, "running");

    try {
      switch (node.type) {
        case "trigger":
          break;
        case "action":
          await this.executeAction(node, context);
          break;
        case "condition":
          const result = await this.evaluateCondition(node.data.config as WorkflowCondition, context);
          const nextEdge = workflow.edges.find(e => e.source === nodeId && e.sourceHandle === (result ? "yes" : "no"));
          if (nextEdge) await this.processNode(workflow, nextEdge.target, context);
          return;
        case "delay":
          await this.executeDelay(node.data.config?.duration as number || 0);
          break;
        case "end":
          return;
      }

      this.log(workflow.id, nodeId, "completed");
      const nextEdges = workflow.edges.filter(e => e.source === nodeId);
      for (const edge of nextEdges) {
        await this.processNode(workflow, edge.target, context);
      }
    } catch (error) {
      this.log(workflow.id, nodeId, "failed", { error: String(error) });
      throw error;
    }
  }

  private async executeAction(node: WorkflowNode, context: WorkflowContext): Promise<void> {
    const action = node.data.action as WorkflowAction;
    const config = node.data.config || {};

    switch (action) {
      case "send_email":
        await this.sendEmail(config, context);
        break;
      case "move_stage":
        await this.moveStage(config.stage as string, context);
        break;
      case "add_tag":
        await this.addTag(config.tag as string, context);
        break;
      case "create_task":
        await this.createTask(config, context);
        break;
      case "notify_team":
        await this.notifyTeam(config.message as string, context);
        break;
      case "call_webhook":
        await this.callWebhook(config.url as string, context);
        break;
      default:
        console.log(`Action ${action} not implemented yet`);
    }
  }

  async evaluateCondition(condition: WorkflowCondition, context: WorkflowContext): Promise<boolean> {
    const value = this.getContextValue(condition.field, context);
    
    switch (condition.operator) {
      case "equals": return value === condition.value;
      case "not_equals": return value !== condition.value;
      case "contains": return String(value).includes(String(condition.value));
      case "greater_than": return Number(value) > Number(condition.value);
      case "less_than": return Number(value) < Number(condition.value);
      default: return false;
    }
  }

  private getContextValue(field: string, context: WorkflowContext): unknown {
    const parts = field.split(".");
    let value: unknown = context;
    for (const part of parts) {
      value = (value as Record<string, unknown>)?.[part];
    }
    return value;
  }

  private async sendEmail(config: Record<string, unknown>, context: WorkflowContext): Promise<void> {
    console.log("Sending email:", { to: config.to, template: config.template, context });
  }

  private async moveStage(stage: string, context: WorkflowContext): Promise<void> {
    if (!context.candidaturaId) return;
    await supabase.from("candidaturas").update({ etapa_atual: stage }).eq("id", context.candidaturaId);
  }

  private async addTag(tag: string, context: WorkflowContext): Promise<void> {
    if (!context.candidatoId) return;
    console.log("Adding tag:", tag, "to candidate:", context.candidatoId);
  }

  private async createTask(config: Record<string, unknown>, context: WorkflowContext): Promise<void> {
    console.log("Creating task:", config, context);
  }

  private async notifyTeam(message: string, context: WorkflowContext): Promise<void> {
    console.log("Notifying team:", message, context);
  }

  private async callWebhook(url: string, context: WorkflowContext): Promise<void> {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(context),
    });
  }

  private async executeDelay(duration: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, duration * 1000));
  }

  private log(workflowId: string, nodeId: string, status: WorkflowExecutionLog["status"], extra?: Record<string, unknown>): void {
    this.logs.push({
      id: crypto.randomUUID(),
      workflowId,
      nodeId,
      status,
      executedAt: new Date().toISOString(),
      ...extra,
    });
  }

  getLogs(): WorkflowExecutionLog[] {
    return this.logs;
  }
}

export const workflowEngine = new WorkflowEngine();
