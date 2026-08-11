
CREATE TABLE public.hunter_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recrutador_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source TEXT NOT NULL DEFAULT 'linkedin',
  profile_url TEXT NOT NULL,
  profile_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  headline TEXT,
  current_company TEXT,
  current_title TEXT,
  location TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'novo',
  notes TEXT,
  vaga_id UUID REFERENCES public.vagas(id) ON DELETE SET NULL,
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE SET NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT hunter_leads_unique_per_user UNIQUE (recrutador_id, profile_hash)
);

CREATE INDEX idx_hunter_leads_recrutador ON public.hunter_leads (recrutador_id, captured_at DESC);
CREATE INDEX idx_hunter_leads_hash ON public.hunter_leads (profile_hash);
CREATE INDEX idx_hunter_leads_status ON public.hunter_leads (status);
CREATE INDEX idx_hunter_leads_vaga ON public.hunter_leads (vaga_id) WHERE vaga_id IS NOT NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.hunter_leads TO authenticated;
GRANT ALL ON public.hunter_leads TO service_role;

ALTER TABLE public.hunter_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recrutadores gerenciam seus próprios leads"
  ON public.hunter_leads
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = recrutador_id
    OR public.is_hr_staff(auth.uid())
  )
  WITH CHECK (
    auth.uid() = recrutador_id
    OR public.is_hr_staff(auth.uid())
  );

CREATE TRIGGER update_hunter_leads_updated_at
  BEFORE UPDATE ON public.hunter_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
