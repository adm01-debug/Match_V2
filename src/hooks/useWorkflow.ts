import { useState, useCallback } from 'react';
import type { Workflow } from '@/types/workflow';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'match_ats_workflows';

export function useWorkflow() {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<Workflow[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveToStorage = useCallback((data: Workflow[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setWorkflows(data);
  }, []);

  const createWorkflow = useCallback((name: string, description?: string): Workflow => {
    const workflow: Workflow = {
      id: crypto.randomUUID(),
      name,
      description,
      active: false,
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...workflows, workflow];
    saveToStorage(updated);
    toast({ title: 'Workflow criado', description: name });
    return workflow;
  }, [workflows, saveToStorage, toast]);

  const updateWorkflow = useCallback((id: string, updates: Partial<Workflow>) => {
    const updated = workflows.map(w =>
      w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
    );
    saveToStorage(updated);
  }, [workflows, saveToStorage]);

  const deleteWorkflow = useCallback((id: string) => {
    const updated = workflows.filter(w => w.id !== id);
    saveToStorage(updated);
    toast({ title: 'Workflow excluído' });
  }, [workflows, saveToStorage, toast]);

  const toggleActive = useCallback((id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (workflow) {
      updateWorkflow(id, { active: !workflow.active });
      toast({
        title: workflow.active ? 'Workflow desativado' : 'Workflow ativado',
        description: workflow.name,
      });
    }
  }, [workflows, updateWorkflow, toast]);

  return {
    workflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    toggleActive,
  };
}

export default useWorkflow;
