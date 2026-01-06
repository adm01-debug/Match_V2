import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface AutoAction {
  type: 'send_email' | 'create_task' | 'notify' | 'update_status';
  config: Record<string, unknown>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

export interface WorkflowStage {
  id: string;
  workflow_id: string;
  name: string;
  description: string | null;
  stage_order: number;
  color: string;
  is_final: boolean;
  auto_actions: AutoAction[];
  required_fields: string[];
  sla_hours: number | null;
}

export interface WorkflowTransition {
  id: string;
  workflow_id: string;
  from_stage_id: string | null;
  to_stage_id: string;
  requires_approval: boolean;
  approval_role: string | null;
}

const WORKFLOWS_KEY = 'workflows';
const STAGES_KEY = 'workflow_stages';

function getStoredWorkflows(): Workflow[] {
  try {
    const stored = localStorage.getItem(WORKFLOWS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredWorkflows(workflows: Workflow[]): void {
  localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(workflows));
}

function getStoredStages(): WorkflowStage[] {
  try {
    const stored = localStorage.getItem(STAGES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredStages(stages: WorkflowStage[]): void {
  localStorage.setItem(STAGES_KEY, JSON.stringify(stages));
}

export function useWorkflows() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      return getStoredWorkflows();
    },
  });

  const createWorkflow = useMutation({
    mutationFn: async (workflow: Partial<Workflow>) => {
      const allWorkflows = getStoredWorkflows();
      const newWorkflow: Workflow = {
        id: crypto.randomUUID(),
        name: workflow.name || 'Novo Workflow',
        description: workflow.description || null,
        is_default: workflow.is_default ?? false,
        is_active: workflow.is_active ?? true,
        created_at: new Date().toISOString(),
      };
      setStoredWorkflows([...allWorkflows, newWorkflow]);
      return newWorkflow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({ title: 'Workflow criado com sucesso' });
    },
  });

  const updateWorkflow = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Workflow> & { id: string }) => {
      const allWorkflows = getStoredWorkflows();
      const updated = allWorkflows.map(w => 
        w.id === id ? { ...w, ...updates } : w
      );
      setStoredWorkflows(updated);
      return updated.find(w => w.id === id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({ title: 'Workflow atualizado' });
    },
  });

  const deleteWorkflow = useMutation({
    mutationFn: async (id: string) => {
      const allWorkflows = getStoredWorkflows();
      setStoredWorkflows(allWorkflows.filter(w => w.id !== id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({ title: 'Workflow excluído' });
    },
  });

  return {
    workflows,
    isLoading,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
  };
}

export function useWorkflowStages(workflowId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: stages, isLoading } = useQuery({
    queryKey: ['workflow-stages', workflowId],
    queryFn: async () => {
      if (!workflowId) return [];
      const allStages = getStoredStages();
      return allStages
        .filter(s => s.workflow_id === workflowId)
        .sort((a, b) => a.stage_order - b.stage_order);
    },
    enabled: !!workflowId,
  });

  const createStage = useMutation({
    mutationFn: async (stage: Partial<WorkflowStage>) => {
      const allStages = getStoredStages();
      const newStage: WorkflowStage = {
        id: crypto.randomUUID(),
        workflow_id: stage.workflow_id || workflowId || '',
        name: stage.name || 'Nova Etapa',
        description: stage.description || null,
        stage_order: stage.stage_order ?? allStages.length + 1,
        color: stage.color || '#6366f1',
        is_final: stage.is_final ?? false,
        auto_actions: stage.auto_actions || [],
        required_fields: stage.required_fields || [],
        sla_hours: stage.sla_hours ?? null,
      };
      setStoredStages([...allStages, newStage]);
      return newStage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-stages', workflowId] });
    },
  });

  const updateStage = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WorkflowStage> & { id: string }) => {
      const allStages = getStoredStages();
      const updated = allStages.map(s => 
        s.id === id ? { ...s, ...updates } : s
      );
      setStoredStages(updated);
      return updated.find(s => s.id === id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-stages', workflowId] });
    },
  });

  const deleteStage = useMutation({
    mutationFn: async (id: string) => {
      const allStages = getStoredStages();
      setStoredStages(allStages.filter(s => s.id !== id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-stages', workflowId] });
    },
  });

  const reorderStages = useMutation({
    mutationFn: async (stageIds: string[]) => {
      const allStages = getStoredStages();
      const updated = allStages.map(s => {
        const newOrder = stageIds.indexOf(s.id);
        return newOrder >= 0 ? { ...s, stage_order: newOrder + 1 } : s;
      });
      setStoredStages(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-stages', workflowId] });
    },
  });

  return {
    stages,
    isLoading,
    createStage,
    updateStage,
    deleteStage,
    reorderStages,
  };
}

export function useDefaultWorkflow() {
  const { data } = useQuery({
    queryKey: ['default-workflow'],
    queryFn: async () => {
      const workflows = getStoredWorkflows();
      const defaultWorkflow = workflows.find(w => w.is_default);
      if (!defaultWorkflow) return null;
      
      const stages = getStoredStages().filter(s => s.workflow_id === defaultWorkflow.id);
      return { ...defaultWorkflow, workflow_stages: stages };
    },
  });

  return { defaultWorkflow: data };
}
