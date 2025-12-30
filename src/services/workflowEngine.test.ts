import { describe, it, expect, vi, beforeEach } from 'vitest';
import { workflowEngine } from './workflowEngine';

describe('workflowEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('executeWorkflow', () => {
    it('executes a simple workflow', async () => {
      const workflow = {
        id: 'wf-1',
        nodes: [
          { id: '1', type: 'trigger', data: { triggerType: 'manual' } },
          { id: '2', type: 'action', data: { actionType: 'log' } },
        ],
        edges: [{ source: '1', target: '2' }],
      };
      const result = await workflowEngine.execute(workflow, { test: true });
      expect(result.status).toBe('completed');
    });

    it('handles workflow with conditions', async () => {
      const workflow = {
        id: 'wf-2',
        nodes: [
          { id: '1', type: 'trigger', data: {} },
          { id: '2', type: 'condition', data: { expression: 'value > 10' } },
          { id: '3', type: 'action', data: {} },
        ],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3', label: 'true' },
        ],
      };
      const result = await workflowEngine.execute(workflow, { value: 15 });
      expect(result.executedNodes).toContain('3');
    });

    it('handles errors gracefully', async () => {
      const workflow = {
        id: 'wf-3',
        nodes: [
          { id: '1', type: 'trigger', data: {} },
          { id: '2', type: 'action', data: { actionType: 'fail' } },
        ],
        edges: [{ source: '1', target: '2' }],
      };
      const result = await workflowEngine.execute(workflow, {});
      expect(result.status).toBe('error');
      expect(result.error).toBeDefined();
    });
  });

  describe('validateWorkflow', () => {
    it('validates a correct workflow', () => {
      const workflow = {
        nodes: [{ id: '1', type: 'trigger' }],
        edges: [],
      };
      const errors = workflowEngine.validate(workflow);
      expect(errors).toHaveLength(0);
    });

    it('detects missing trigger', () => {
      const workflow = {
        nodes: [{ id: '1', type: 'action' }],
        edges: [],
      };
      const errors = workflowEngine.validate(workflow);
      expect(errors).toContainEqual(expect.objectContaining({ code: 'MISSING_TRIGGER' }));
    });

    it('detects disconnected nodes', () => {
      const workflow = {
        nodes: [
          { id: '1', type: 'trigger' },
          { id: '2', type: 'action' },
        ],
        edges: [],
      };
      const errors = workflowEngine.validate(workflow);
      expect(errors).toContainEqual(expect.objectContaining({ code: 'DISCONNECTED_NODE' }));
    });
  });

  describe('getExecutionLogs', () => {
    it('returns execution history', async () => {
      const logs = await workflowEngine.getLogs('wf-1');
      expect(Array.isArray(logs)).toBe(true);
    });
  });
});
