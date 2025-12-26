-- Scorecards and Interview Evaluations Migration
CREATE TABLE IF NOT EXISTS public.scorecard_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  competencies JSONB NOT NULL DEFAULT '[]',
  is_default BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.scorecards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.scorecard_templates(id) ON DELETE SET NULL,
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  entrevista_id UUID REFERENCES public.entrevistas(id) ON DELETE SET NULL,
  avaliador_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scores JSONB NOT NULL DEFAULT '[]',
  notes TEXT,
  recommendation TEXT CHECK (recommendation IN ('aprovar', 'reprovar', 'talvez')),
  overall_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scorecards_candidato ON public.scorecards(candidato_id);
CREATE INDEX idx_scorecards_entrevista ON public.scorecards(entrevista_id);
CREATE INDEX idx_scorecards_avaliador ON public.scorecards(avaliador_id);
CREATE INDEX idx_scorecard_templates_tenant ON public.scorecard_templates(tenant_id);

ALTER TABLE public.scorecard_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorecards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view templates" ON public.scorecard_templates FOR SELECT USING (true);
CREATE POLICY "Users manage templates" ON public.scorecard_templates FOR ALL USING (true);
CREATE POLICY "Users view scorecards" ON public.scorecards FOR SELECT USING (true);
CREATE POLICY "Users create scorecards" ON public.scorecards FOR INSERT WITH CHECK (avaliador_id = auth.uid());
CREATE POLICY "Users update own scorecards" ON public.scorecards FOR UPDATE USING (avaliador_id = auth.uid());

-- Default template
INSERT INTO public.scorecard_templates (name, description, competencies, is_default) VALUES
('Avaliação Padrão', 'Template padrão de avaliação de entrevistas', '[
  {"id": "1", "name": "Comunicação", "description": "Clareza e objetividade", "category": "Comportamental"},
  {"id": "2", "name": "Trabalho em Equipe", "description": "Colaboração", "category": "Comportamental"},
  {"id": "3", "name": "Resolução de Problemas", "description": "Capacidade analítica", "category": "Técnica"},
  {"id": "4", "name": "Conhecimento Técnico", "description": "Domínio das habilidades", "category": "Técnica"},
  {"id": "5", "name": "Proatividade", "description": "Iniciativa e autonomia", "category": "Comportamental"},
  {"id": "6", "name": "Adaptabilidade", "description": "Flexibilidade", "category": "Comportamental"}
]'::jsonb, true);
