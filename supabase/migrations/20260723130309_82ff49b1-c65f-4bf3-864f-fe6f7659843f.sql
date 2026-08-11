
-- Link vaga <-> template de entrevista (Interview Kit)
CREATE TABLE public.vaga_interview_kits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vaga_id UUID NOT NULL REFERENCES public.vagas(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.templates_entrevista(id) ON DELETE CASCADE,
  etapa TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (vaga_id, template_id, etapa)
);

CREATE INDEX idx_vaga_interview_kits_vaga ON public.vaga_interview_kits(vaga_id);
CREATE INDEX idx_vaga_interview_kits_template ON public.vaga_interview_kits(template_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vaga_interview_kits TO authenticated;
GRANT ALL ON public.vaga_interview_kits TO service_role;

ALTER TABLE public.vaga_interview_kits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view vaga_interview_kits"
  ON public.vaga_interview_kits FOR SELECT TO authenticated USING (true);

CREATE POLICY "HR staff can manage vaga_interview_kits"
  ON public.vaga_interview_kits FOR ALL TO authenticated
  USING (public.is_hr_staff(auth.uid()))
  WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE TRIGGER update_vaga_interview_kits_updated_at
  BEFORE UPDATE ON public.vaga_interview_kits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Associa uma entrevista a um roteiro
ALTER TABLE public.entrevistas
  ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.templates_entrevista(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_entrevistas_template ON public.entrevistas(template_id);
