/**
 * @fileoverview Testes do WorkflowEngine
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { WorkflowEngine } from '../workflowEngine';
import type { WorkflowTrigger, WorkflowAction, WorkflowCondition, WorkflowDelay } from '@/types/workflow';

describe('WorkflowEngine', () => {
  let engine: WorkflowEngine;

  beforeEach(() => {
    engine = new WorkflowEngine();
  });

  describe('executeTrigger', () => {
    it('candidato_novo retorna true com candidatoId', async () => {
      const trigger = { type: 'candidato_novo', config: {} } as WorkflowTrigger;
      const result = await engine.executeTrigger(trigger, { candidatoId: '123', data: {} });
      expect(result).toBe(true);
    });

    it('candidato_novo retorna false sem candidatoId', async () => {
      const trigger = { type: 'candidato_novo', config: {} } as WorkflowTrigger;
      const result = await engine.executeTrigger(trigger, { data: {} });
      expect(result).toBe(false);
    });

    it('etapa_mudou retorna true quando etapas diferem', async () => {
      const trigger = { type: 'etapa_mudou', config: {} } as WorkflowTrigger;
      const result = await engine.executeTrigger(trigger, {
        etapaAnterior: 'triagem', etapaAtual: 'entrevista', data: {},
      });
      expect(result).toBe(true);
    });

    it('etapa_mudou retorna false quando etapas são iguais', async () => {
      const trigger = { type: 'etapa_mudou', config: {} } as WorkflowTrigger;
      const result = await engine.executeTrigger(trigger, {
        etapaAnterior: 'triagem', etapaAtual: 'triagem', data: {},
      });
      expect(result).toBe(false);
    });

    it('sla_vencido detecta dias excedidos', async () => {
      const trigger = { type: 'sla_vencido', config: { maxDias: 3 } } as WorkflowTrigger;
      const result = await engine.executeTrigger(trigger, { data: { diasNaEtapa: 5 } });
      expect(result).toBe(true);
    });

    it('sla_vencido retorna false dentro do prazo', async () => {
      const trigger = { type: 'sla_vencido', config: { maxDias: 7 } } as WorkflowTrigger;
      const result = await engine.executeTrigger(trigger, { data: { diasNaEtapa: 3 } });
      expect(result).toBe(false);
    });

    it('manual sempre retorna true', async () => {
      const trigger = { type: 'manual', config: {} } as WorkflowTrigger;
      expect(await engine.executeTrigger(trigger, { data: {} })).toBe(true);
    });

    it('tipo desconhecido retorna false', async () => {
      const trigger = { type: 'unknown_type', config: {} } as any;
      expect(await engine.executeTrigger(trigger, { data: {} })).toBe(false);
    });
  });

  describe('executeAction', () => {
    const ctx = { candidatoId: 'c1', data: {} };

    it('enviar_email retorna sucesso', async () => {
      const action = { type: 'enviar_email', config: {} } as WorkflowAction;
      const result = await engine.executeAction(action, ctx);
      expect(result.success).toBe(true);
      expect(result.message).toContain('Email');
    });

    it('mover_etapa retorna sucesso', async () => {
      const action = { type: 'mover_etapa', config: { etapa: 'entrevista' } } as WorkflowAction;
      const result = await engine.executeAction(action, ctx);
      expect(result.success).toBe(true);
      expect(result.message).toContain('entrevista');
    });

    it('ação desconhecida retorna falha', async () => {
      const action = { type: 'invalid', config: {} } as any;
      const result = await engine.executeAction(action, ctx);
      expect(result.success).toBe(false);
    });

    it('results acumula histórico de execução', async () => {
      await engine.executeAction({ type: 'enviar_email', config: {} } as WorkflowAction, ctx);
      await engine.executeAction({ type: 'notificar', config: { mensagem: 'test' } } as WorkflowAction, ctx);
      expect(engine.getResults().length).toBe(2);
    });

    it('clearResults limpa histórico', async () => {
      await engine.executeAction({ type: 'enviar_email', config: {} } as WorkflowAction, ctx);
      engine.clearResults();
      expect(engine.getResults().length).toBe(0);
    });

    // Todas as ações válidas
    const validActions = ['enviar_email', 'mover_etapa', 'notificar', 'atribuir_tag', 'agendar_entrevista', 'enviar_teste', 'webhook'];
    validActions.forEach(type => {
      it(`ação "${type}" retorna success:true`, async () => {
        const action = { type, config: { etapa: 'x', mensagem: 'y', tag: 'z', url: 'http://test.com' } } as WorkflowAction;
        const result = await engine.executeAction(action, ctx);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('evaluateCondition', () => {
    it('eq: verdadeiro quando valores são iguais', () => {
      const cond = { field: 'status', operator: 'eq', value: 'ativo' } as WorkflowCondition;
      expect(engine.evaluateCondition(cond, { data: { status: 'ativo' } })).toBe(true);
    });

    it('eq: falso quando valores diferem', () => {
      const cond = { field: 'status', operator: 'eq', value: 'ativo' } as WorkflowCondition;
      expect(engine.evaluateCondition(cond, { data: { status: 'inativo' } })).toBe(false);
    });

    it('neq: verdadeiro quando valores diferem', () => {
      const cond = { field: 'status', operator: 'neq', value: 'reprovado' } as WorkflowCondition;
      expect(engine.evaluateCondition(cond, { data: { status: 'aprovado' } })).toBe(true);
    });

    it('gt: compara números corretamente', () => {
      const cond = { field: 'score', operator: 'gt', value: 70 } as WorkflowCondition;
      expect(engine.evaluateCondition(cond, { data: { score: 85 } })).toBe(true);
      expect(engine.evaluateCondition(cond, { data: { score: 50 } })).toBe(false);
    });

    it('lt: compara números corretamente', () => {
      const cond = { field: 'dias', operator: 'lt', value: 5 } as WorkflowCondition;
      expect(engine.evaluateCondition(cond, { data: { dias: 3 } })).toBe(true);
      expect(engine.evaluateCondition(cond, { data: { dias: 7 } })).toBe(false);
    });

    it('contains: verifica substring', () => {
      const cond = { field: 'email', operator: 'contains', value: '@company' } as WorkflowCondition;
      expect(engine.evaluateCondition(cond, { data: { email: 'user@company.com' } })).toBe(true);
      expect(engine.evaluateCondition(cond, { data: { email: 'user@other.com' } })).toBe(false);
    });

    it('in: verifica se valor está na lista', () => {
      const cond = { field: 'status', operator: 'in', value: ['ativo', 'aprovado'] } as WorkflowCondition;
      expect(engine.evaluateCondition(cond, { data: { status: 'ativo' } })).toBe(true);
      expect(engine.evaluateCondition(cond, { data: { status: 'reprovado' } })).toBe(false);
    });

    it('operador desconhecido retorna false', () => {
      const cond = { field: 'x', operator: 'unknown', value: 'y' } as any;
      expect(engine.evaluateCondition(cond, { data: { x: 'y' } })).toBe(false);
    });
  });

  describe('getDelayMs', () => {
    it('minutos calculados corretamente', () => {
      expect(engine.getDelayMs({ duration: 5, unit: 'minutes' } as WorkflowDelay)).toBe(300000);
    });
    it('horas calculadas corretamente', () => {
      expect(engine.getDelayMs({ duration: 2, unit: 'hours' } as WorkflowDelay)).toBe(7200000);
    });
    it('dias calculados corretamente', () => {
      expect(engine.getDelayMs({ duration: 1, unit: 'days' } as WorkflowDelay)).toBe(86400000);
    });
  });
});
