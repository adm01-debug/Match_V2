-- ============================================================
-- Etapa 1 — Banco de itens de testes cognitivos
-- ============================================================

CREATE TYPE public.cognitive_domain AS ENUM ('logico', 'numerico', 'verbal', 'atencao');
CREATE TYPE public.cognitive_session_status AS ENUM ('em_andamento', 'concluida', 'expirada', 'cancelada');

-- ---------- Itens ----------
CREATE TABLE public.cognitive_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dominio public.cognitive_domain NOT NULL,
  enunciado TEXT NOT NULL,
  contexto TEXT,
  alternativas JSONB NOT NULL,
  resposta_correta TEXT NOT NULL,
  explicacao TEXT,
  dificuldade SMALLINT NOT NULL DEFAULT 3 CHECK (dificuldade BETWEEN 1 AND 5),
  tempo_sugerido_seg INTEGER NOT NULL DEFAULT 60 CHECK (tempo_sugerido_seg BETWEEN 5 AND 900),
  ativo BOOLEAN NOT NULL DEFAULT true,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT cognitive_items_alternativas_array CHECK (jsonb_typeof(alternativas) = 'array')
);

CREATE INDEX idx_cognitive_items_dominio ON public.cognitive_items (dominio, dificuldade) WHERE deleted_at IS NULL AND ativo;
CREATE INDEX idx_cognitive_items_tags ON public.cognitive_items USING GIN (tags);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cognitive_items TO authenticated;
GRANT ALL ON public.cognitive_items TO service_role;
ALTER TABLE public.cognitive_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RH gerencia banco de itens cognitivos"
  ON public.cognitive_items FOR ALL TO authenticated
  USING (public.is_hr_staff(auth.uid()))
  WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Service role total em cognitive_items"
  ON public.cognitive_items FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ---------- Sessões ----------
CREATE TABLE public.cognitive_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE CASCADE,
  user_id UUID,
  vaga_id UUID REFERENCES public.vagas(id) ON DELETE SET NULL,
  dominios public.cognitive_domain[] NOT NULL DEFAULT ARRAY['logico','numerico','verbal','atencao']::public.cognitive_domain[],
  total_itens INTEGER NOT NULL DEFAULT 0,
  status public.cognitive_session_status NOT NULL DEFAULT 'em_andamento',
  tempo_limite_seg INTEGER NOT NULL DEFAULT 900 CHECK (tempo_limite_seg BETWEEN 60 AND 7200),
  iniciada_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  finalizada_em TIMESTAMPTZ,
  score_bruto INTEGER,
  score_normalizado NUMERIC(5,2),
  scores_por_dominio JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_cognitive_sessions_candidato ON public.cognitive_sessions (candidato_id, created_at DESC);
CREATE INDEX idx_cognitive_sessions_user ON public.cognitive_sessions (user_id);
CREATE INDEX idx_cognitive_sessions_vaga ON public.cognitive_sessions (vaga_id);

GRANT SELECT, INSERT, UPDATE ON public.cognitive_sessions TO authenticated;
GRANT ALL ON public.cognitive_sessions TO service_role;
ALTER TABLE public.cognitive_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RH visualiza todas as sessoes cognitivas"
  ON public.cognitive_sessions FOR SELECT TO authenticated
  USING (public.is_hr_staff(auth.uid()) OR user_id = auth.uid());

CREATE POLICY "RH gerencia sessoes cognitivas"
  ON public.cognitive_sessions FOR INSERT TO authenticated
  WITH CHECK (public.is_hr_staff(auth.uid()) OR user_id = auth.uid());

CREATE POLICY "Dono ou RH atualiza sessao cognitiva"
  ON public.cognitive_sessions FOR UPDATE TO authenticated
  USING (public.is_hr_staff(auth.uid()) OR user_id = auth.uid())
  WITH CHECK (public.is_hr_staff(auth.uid()) OR user_id = auth.uid());

CREATE POLICY "Service role total em cognitive_sessions"
  ON public.cognitive_sessions FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ---------- Respostas ----------
CREATE TABLE public.cognitive_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.cognitive_sessions(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.cognitive_items(id) ON DELETE CASCADE,
  ordem SMALLINT NOT NULL DEFAULT 0,
  resposta TEXT,
  correta BOOLEAN,
  tempo_gasto_seg INTEGER CHECK (tempo_gasto_seg IS NULL OR tempo_gasto_seg >= 0),
  respondida_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_id, item_id)
);

CREATE INDEX idx_cognitive_responses_session ON public.cognitive_responses (session_id, ordem);

GRANT SELECT, INSERT, UPDATE ON public.cognitive_responses TO authenticated;
GRANT ALL ON public.cognitive_responses TO service_role;
ALTER TABLE public.cognitive_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dono ou RH visualiza respostas cognitivas"
  ON public.cognitive_responses FOR SELECT TO authenticated
  USING (
    public.is_hr_staff(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.cognitive_sessions s
      WHERE s.id = cognitive_responses.session_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Dono ou RH grava respostas cognitivas"
  ON public.cognitive_responses FOR INSERT TO authenticated
  WITH CHECK (
    public.is_hr_staff(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.cognitive_sessions s
      WHERE s.id = cognitive_responses.session_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Dono ou RH atualiza respostas cognitivas"
  ON public.cognitive_responses FOR UPDATE TO authenticated
  USING (
    public.is_hr_staff(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.cognitive_sessions s
      WHERE s.id = cognitive_responses.session_id AND s.user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_hr_staff(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.cognitive_sessions s
      WHERE s.id = cognitive_responses.session_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role total em cognitive_responses"
  ON public.cognitive_responses FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ---------- Triggers de updated_at ----------
CREATE TRIGGER trg_cognitive_items_updated_at
  BEFORE UPDATE ON public.cognitive_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_cognitive_sessions_updated_at
  BEFORE UPDATE ON public.cognitive_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_cognitive_responses_updated_at
  BEFORE UPDATE ON public.cognitive_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- Entrega de itens SEM gabarito ----------
-- O cliente jamais recebe resposta_correta: essa RPC é a única porta
-- de leitura dos itens durante a aplicação da prova.
CREATE OR REPLACE FUNCTION public.get_cognitive_session_items(p_session_id UUID)
RETURNS TABLE(
  item_id UUID,
  ordem SMALLINT,
  dominio public.cognitive_domain,
  enunciado TEXT,
  contexto TEXT,
  alternativas JSONB,
  dificuldade SMALLINT,
  tempo_sugerido_seg INTEGER,
  resposta TEXT
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.cognitive_sessions s
    WHERE s.id = p_session_id
      AND (s.user_id = auth.uid() OR public.is_hr_staff(auth.uid()))
  ) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT r.item_id, r.ordem, i.dominio, i.enunciado, i.contexto,
         i.alternativas, i.dificuldade, i.tempo_sugerido_seg, r.resposta
  FROM public.cognitive_responses r
  JOIN public.cognitive_items i ON i.id = r.item_id
  WHERE r.session_id = p_session_id
  ORDER BY r.ordem;
END;
$$;

REVOKE ALL ON FUNCTION public.get_cognitive_session_items(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_cognitive_session_items(UUID) TO authenticated, service_role;