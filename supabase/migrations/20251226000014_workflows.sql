-- Workflows System
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

CREATE TABLE IF NOT EXISTS public.workflow_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'stage' CHECK (type IN ('stage', 'action', 'condition')),
  position INTEGER NOT NULL,
  config JSONB DEFAULT '{}',
  sla_hours INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workflow_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  from_stage_id UUID REFERENCES public.workflow_stages(id) ON DELETE CASCADE,
  to_stage_id UUID NOT NULL REFERENCES public.workflow_stages(id) ON DELETE CASCADE,
  condition JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workflow_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID NOT NULL REFERENCES public.workflow_stages(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('email', 'notification', 'webhook', 'task', 'tag')),
  trigger TEXT NOT NULL CHECK (trigger IN ('on_enter', 'on_exit', 'on_sla_breach')),
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workflow_stages_workflow ON public.workflow_stages(workflow_id);
CREATE INDEX idx_workflow_transitions_workflow ON public.workflow_transitions(workflow_id);
CREATE INDEX idx_workflow_actions_stage ON public.workflow_actions(stage_id);

ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workflows" ON public.workflows FOR SELECT USING (true);
CREATE POLICY "Users can manage workflows" ON public.workflows FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Users can view stages" ON public.workflow_stages FOR SELECT USING (true);
CREATE POLICY "Users can view transitions" ON public.workflow_transitions FOR SELECT USING (true);
CREATE POLICY "Users can view actions" ON public.workflow_actions FOR SELECT USING (true);

-- Insert default workflow
INSERT INTO public.workflows (name, description, is_default, is_active) VALUES
  ('Processo Padrão', 'Workflow padrão para recrutamento', true, true);
