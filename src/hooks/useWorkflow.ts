import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  auto_actions: any[];
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

export function useWorkflows() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Workflow[];
    },
  });

  const createWorkflow = useMutation({
    mutationFn: async (workflow: Partial<Workflow>) => {
      const { data, error } = await supabase
        .from('workflows')
        .insert(workflow)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({ title: 'Workflow criado com sucesso' });
    },
  });

  const updateWorkflow = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Workflow> & { id: string }) => {
      const { data, error } = await supabase
        .from('workflows')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({ title: 'Workflow atualizado' });
    },
  });

  const deleteWorkflow = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('workflows').delete().eq('id', id);
      if (error) throw error;
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
      const { data, error } = await supabase
        .from('workflow_stages')
        .select('*')
        .eq('workflow_id', workflowId)
        .order('stage_order');
      if (error) throw error;
      return data as WorkflowStage[];
    },
    enabled: !!workflowId,
  });

  const createStage = useMutation({
    mutationFn: async (stage: Partial<WorkflowStage>) => {
      const { data, error } = await supabase
        .from('workflow_stages')
        .insert(stage)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-stages', workflowId] });
    },
  });

  const updateStage = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WorkflowStage> & { id: string }) => {
      const { data, error } = await supabase
        .from('workflow_stages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-stages', workflowId] });
    },
  });

  const deleteStage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('workflow_stages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-stages', workflowId] });
    },
  });

  const reorderStages = useMutation({
    mutationFn: async (stageIds: string[]) => {
      const updates = stageIds.map((id, index) => 
        supabase.from('workflow_stages').update({ stage_order: index + 1 }).eq('id', id)
      );
      await Promise.all(updates);
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
      const { data, error } = await supabase
        .from('workflows')
        .select(`
          *,
          workflow_stages(*)
        `)
        .eq('is_default', true)
        .single();
      if (error) throw error;
      return data;
    },
  });

  return { defaultWorkflow: data };
}
