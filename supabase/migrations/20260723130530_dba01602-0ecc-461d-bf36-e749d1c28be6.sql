
CREATE TABLE public.triagem_ia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidatura_id UUID NOT NULL REFERENCES public.candidaturas(id) ON DELETE CASCADE,
  vaga_id UUID NOT NULL REFERENCES public.vagas(id) ON DELETE CASCADE,
  candidato_auth_id UUID NOT NULL REFERENCES public.candidatos_auth(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  resumo TEXT NOT NULL,
  pontos_fortes TEXT[] NOT NULL DEFAULT '{}',
  red_flags TEXT[] NOT NULL DEFAULT '{}',
  recomendacao TEXT NOT NULL CHECK (recomendacao IN ('aprovar','revisar','reprovar')),
  match_habilidades JSONB NOT NULL DEFAULT '{}'::jsonb,
  modelo TEXT NOT NULL,
  cache_hit BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (candidatura_id)
);

CREATE INDEX idx_triagem_ia_vaga_score ON public.triagem_ia(vaga_id, score DESC);
CREATE INDEX idx_triagem_ia_candidatura ON public.triagem_ia(candidatura_id);

GRANT SELECT ON public.triagem_ia TO authenticated;
GRANT ALL ON public.triagem_ia TO service_role;

ALTER TABLE public.triagem_ia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "HR staff can view triagem_ia"
  ON public.triagem_ia FOR SELECT TO authenticated
  USING (public.is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can delete triagem_ia"
  ON public.triagem_ia FOR DELETE TO authenticated
  USING (public.is_hr_staff(auth.uid()));

CREATE TRIGGER update_triagem_ia_updated_at
  BEFORE UPDATE ON public.triagem_ia
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
