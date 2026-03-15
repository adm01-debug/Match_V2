
-- CREATE MISSING TABLES with correct trigger function name

-- 1. EMAIL TEMPLATES
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  assunto TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  etapa TEXT NOT NULL DEFAULT 'geral',
  categoria TEXT NOT NULL DEFAULT 'geral',
  variaveis TEXT[] DEFAULT '{}',
  ativo BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "HR view email templates" ON public.email_templates FOR SELECT TO authenticated USING (is_hr_staff(auth.uid()));
CREATE POLICY "HR manage email templates" ON public.email_templates FOR ALL TO authenticated USING (is_hr_staff(auth.uid())) WITH CHECK (is_hr_staff(auth.uid()));
CREATE TRIGGER set_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. DOCUMENTOS_CANDIDATOS
CREATE TABLE public.documentos_candidatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'outro',
  url TEXT NOT NULL,
  tamanho_bytes BIGINT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_documentos_candidato ON public.documentos_candidatos(candidato_id);
ALTER TABLE public.documentos_candidatos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "HR view documents" ON public.documentos_candidatos FOR SELECT TO authenticated USING (is_hr_staff(auth.uid()));
CREATE POLICY "HR manage documents" ON public.documentos_candidatos FOR ALL TO authenticated USING (is_hr_staff(auth.uid())) WITH CHECK (is_hr_staff(auth.uid()));
CREATE POLICY "Candidates view own docs" ON public.documentos_candidatos FOR SELECT TO authenticated USING (candidato_id IN (SELECT c.id FROM candidatos c JOIN candidatos_auth ca ON ca.candidato_id = c.id WHERE ca.user_id = auth.uid()));
CREATE POLICY "Candidates upload own docs" ON public.documentos_candidatos FOR INSERT TO authenticated WITH CHECK (candidato_id IN (SELECT c.id FROM candidatos c JOIN candidatos_auth ca ON ca.candidato_id = c.id WHERE ca.user_id = auth.uid()));
CREATE TRIGGER set_documentos_updated_at BEFORE UPDATE ON public.documentos_candidatos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. NOTAS_CANDIDATOS
CREATE TABLE public.notas_candidatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.processos_seletivos(id) ON DELETE SET NULL,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  autor_nome TEXT,
  conteudo TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'observacao',
  privada BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_notas_candidato ON public.notas_candidatos(candidato_id);
CREATE INDEX idx_notas_processo ON public.notas_candidatos(processo_id);
ALTER TABLE public.notas_candidatos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "HR view notes" ON public.notas_candidatos FOR SELECT TO authenticated USING (is_hr_staff(auth.uid()));
CREATE POLICY "HR manage notes" ON public.notas_candidatos FOR ALL TO authenticated USING (is_hr_staff(auth.uid())) WITH CHECK (is_hr_staff(auth.uid()));
CREATE TRIGGER set_notas_updated_at BEFORE UPDATE ON public.notas_candidatos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. HISTORICO_ETAPAS
CREATE TABLE public.historico_etapas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID NOT NULL REFERENCES public.processos_seletivos(id) ON DELETE CASCADE,
  etapa_anterior TEXT,
  etapa_nova TEXT NOT NULL,
  motivo TEXT,
  responsavel_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_historico_processo ON public.historico_etapas(processo_id);
CREATE INDEX idx_historico_created_at ON public.historico_etapas(created_at DESC);
ALTER TABLE public.historico_etapas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "HR view history" ON public.historico_etapas FOR SELECT TO authenticated USING (is_hr_staff(auth.uid()));
CREATE POLICY "Service role inserts history" ON public.historico_etapas FOR INSERT TO service_role WITH CHECK (true);

-- Auto-log stage changes trigger
CREATE OR REPLACE FUNCTION public.log_etapa_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF OLD.etapa_atual IS DISTINCT FROM NEW.etapa_atual THEN
    INSERT INTO public.historico_etapas (processo_id, etapa_anterior, etapa_nova)
    VALUES (NEW.id, OLD.etapa_atual, NEW.etapa_atual);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_etapa_change ON public.processos_seletivos;
CREATE TRIGGER trg_log_etapa_change AFTER UPDATE ON public.processos_seletivos FOR EACH ROW EXECUTE FUNCTION public.log_etapa_change();
