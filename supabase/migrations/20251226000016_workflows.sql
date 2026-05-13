-- Migration: Custom Workflows
-- Creates tables for customizable recruitment workflows

-- Workflow templates table
CREATE TABLE IF NOT EXISTS public.workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow stages/steps
CREATE TABLE IF NOT EXISTS public.workflow_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    stage_order INT NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    is_final BOOLEAN DEFAULT false,
    auto_actions JSONB DEFAULT '[]',
    required_fields JSONB DEFAULT '[]',
    sla_hours INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow transitions (allowed moves between stages)
CREATE TABLE IF NOT EXISTS public.workflow_transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
    from_stage_id UUID REFERENCES public.workflow_stages(id) ON DELETE CASCADE,
    to_stage_id UUID NOT NULL REFERENCES public.workflow_stages(id) ON DELETE CASCADE,
    condition JSONB,
    requires_approval BOOLEAN DEFAULT false,
    approval_role TEXT,
    auto_trigger BOOLEAN DEFAULT false,
    trigger_condition JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow actions (automated actions on stage change)
CREATE TABLE IF NOT EXISTS public.workflow_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_id UUID NOT NULL REFERENCES public.workflow_stages(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN ('email', 'notification', 'task', 'webhook', 'update_field')),
    action_config JSONB NOT NULL,
    execute_on TEXT DEFAULT 'enter' CHECK (execute_on IN ('enter', 'exit', 'both')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Associate workflows with vagas
ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS workflow_id UUID REFERENCES public.workflows(id);

-- Indexes
CREATE INDEX idx_workflow_stages_workflow ON public.workflow_stages(workflow_id);
CREATE INDEX idx_workflow_stages_order ON public.workflow_stages(workflow_id, stage_order);
CREATE INDEX idx_workflow_transitions_workflow ON public.workflow_transitions(workflow_id);
CREATE INDEX idx_workflow_actions_stage ON public.workflow_actions(stage_id);
CREATE INDEX idx_vagas_workflow ON public.vagas(workflow_id);

-- RLS
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_actions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Workflows are viewable by authenticated users" ON public.workflows FOR SELECT TO authenticated USING (true);
CREATE POLICY "Workflows are manageable by admins" ON public.workflows FOR ALL TO authenticated USING (true);

CREATE POLICY "Workflow stages viewable" ON public.workflow_stages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Workflow stages manageable" ON public.workflow_stages FOR ALL TO authenticated USING (true);

CREATE POLICY "Workflow transitions viewable" ON public.workflow_transitions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Workflow transitions manageable" ON public.workflow_transitions FOR ALL TO authenticated USING (true);

CREATE POLICY "Workflow actions viewable" ON public.workflow_actions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Workflow actions manageable" ON public.workflow_actions FOR ALL TO authenticated USING (true);

-- Insert default workflow
INSERT INTO public.workflows (name, description, is_default, is_active) VALUES
('Processo Padrão', 'Fluxo padrão de recrutamento', true, true)
ON CONFLICT DO NOTHING;

-- Get default workflow ID and insert stages
DO $$
DECLARE
    default_workflow_id UUID;
BEGIN
    SELECT id INTO default_workflow_id FROM public.workflows WHERE is_default = true LIMIT 1;
    
    IF default_workflow_id IS NOT NULL THEN
        INSERT INTO public.workflow_stages (workflow_id, name, stage_order, color, is_final) VALUES
        (default_workflow_id, 'Novo', 1, '#6B7280', false),
        (default_workflow_id, 'Triagem', 2, '#3B82F6', false),
        (default_workflow_id, 'Entrevista RH', 3, '#8B5CF6', false),
        (default_workflow_id, 'Entrevista Técnica', 4, '#F59E0B', false),
        (default_workflow_id, 'Proposta', 5, '#10B981', false),
        (default_workflow_id, 'Contratado', 6, '#059669', true),
        (default_workflow_id, 'Reprovado', 7, '#EF4444', true)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

GRANT ALL ON public.workflows TO authenticated;
GRANT ALL ON public.workflow_stages TO authenticated;
GRANT ALL ON public.workflow_transitions TO authenticated;
GRANT ALL ON public.workflow_actions TO authenticated;
