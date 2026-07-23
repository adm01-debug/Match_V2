-- =====================================================
-- ETAPA 9 — Assinatura eletrônica de propostas
-- =====================================================

-- 1) Tabela principal de propostas
CREATE TABLE IF NOT EXISTS public.propostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE SET NULL,
  candidato_nome TEXT NOT NULL,
  candidato_email TEXT NOT NULL,
  vaga_id UUID REFERENCES public.vagas(id) ON DELETE SET NULL,
  vaga_titulo TEXT NOT NULL,
  salario NUMERIC(12,2) NOT NULL CHECK (salario >= 0),
  moeda TEXT NOT NULL DEFAULT 'BRL',
  data_inicio DATE NOT NULL,
  beneficios JSONB NOT NULL DEFAULT '[]'::jsonb,
  clausulas TEXT,
  status TEXT NOT NULL DEFAULT 'rascunho'
    CHECK (status IN ('rascunho','enviada','visualizada','aceita','recusada','expirada','cancelada')),
  access_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  expira_em TIMESTAMPTZ,
  enviada_em TIMESTAMPTZ,
  visualizada_em TIMESTAMPTZ,
  assinada_em TIMESTAMPTZ,
  recusada_em TIMESTAMPTZ,
  assinatura_hash TEXT,
  assinatura_ip TEXT,
  assinatura_user_agent TEXT,
  motivo_recusa TEXT,
  criado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.propostas TO authenticated;
GRANT ALL ON public.propostas TO service_role;

ALTER TABLE public.propostas ENABLE ROW LEVEL SECURITY;

-- Índices
CREATE INDEX IF NOT EXISTS idx_propostas_candidato ON public.propostas(candidato_id);
CREATE INDEX IF NOT EXISTS idx_propostas_vaga ON public.propostas(vaga_id);
CREATE INDEX IF NOT EXISTS idx_propostas_status ON public.propostas(status);
CREATE INDEX IF NOT EXISTS idx_propostas_created_by ON public.propostas(criado_por);
CREATE INDEX IF NOT EXISTS idx_propostas_token ON public.propostas(access_token);

-- Trigger updated_at
DROP TRIGGER IF EXISTS trg_propostas_updated_at ON public.propostas;
CREATE TRIGGER trg_propostas_updated_at
  BEFORE UPDATE ON public.propostas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Políticas RLS
CREATE POLICY "RH/admin/gestor podem ver propostas"
  ON public.propostas FOR SELECT
  TO authenticated
  USING (public.is_hr_staff(auth.uid()));

CREATE POLICY "RH/admin/gestor podem criar propostas"
  ON public.propostas FOR INSERT
  TO authenticated
  WITH CHECK (public.is_hr_staff(auth.uid()) AND criado_por = auth.uid());

CREATE POLICY "RH/admin/gestor podem atualizar propostas"
  ON public.propostas FOR UPDATE
  TO authenticated
  USING (public.is_hr_staff(auth.uid()))
  WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Admin pode excluir propostas"
  ON public.propostas FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2) Trilha de eventos (imutável via API)
CREATE TABLE IF NOT EXISTS public.propostas_eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposta_id UUID NOT NULL REFERENCES public.propostas(id) ON DELETE CASCADE,
  evento TEXT NOT NULL
    CHECK (evento IN ('criada','enviada','visualizada','aceita','recusada','expirada','cancelada','reenviada')),
  ator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ator_email TEXT,
  ip TEXT,
  user_agent TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.propostas_eventos TO authenticated;
GRANT ALL ON public.propostas_eventos TO service_role;

ALTER TABLE public.propostas_eventos ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_propostas_eventos_proposta ON public.propostas_eventos(proposta_id, created_at DESC);

CREATE POLICY "RH/admin/gestor leem trilha de eventos"
  ON public.propostas_eventos FOR SELECT
  TO authenticated
  USING (public.is_hr_staff(auth.uid()));

-- Trigger que bloqueia mutação direta (imutabilidade)
CREATE OR REPLACE FUNCTION public.prevent_propostas_eventos_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'propostas_eventos é imutável' USING ERRCODE = '42501';
END;
$$;

DROP TRIGGER IF EXISTS trg_propostas_eventos_no_update ON public.propostas_eventos;
CREATE TRIGGER trg_propostas_eventos_no_update
  BEFORE UPDATE OR DELETE ON public.propostas_eventos
  FOR EACH ROW EXECUTE FUNCTION public.prevent_propostas_eventos_mutation();

-- 3) Função pública: buscar proposta por token (para portal candidato)
CREATE OR REPLACE FUNCTION public.get_proposta_by_token(p_token TEXT)
RETURNS TABLE (
  id UUID,
  candidato_nome TEXT,
  candidato_email TEXT,
  vaga_titulo TEXT,
  salario NUMERIC,
  moeda TEXT,
  data_inicio DATE,
  beneficios JSONB,
  clausulas TEXT,
  status TEXT,
  expira_em TIMESTAMPTZ,
  assinada_em TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.candidato_nome, p.candidato_email, p.vaga_titulo,
         p.salario, p.moeda, p.data_inicio, p.beneficios, p.clausulas,
         p.status, p.expira_em, p.assinada_em
  FROM public.propostas p
  WHERE p.access_token = p_token
  LIMIT 1;
END;
$$;

REVOKE ALL ON FUNCTION public.get_proposta_by_token(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_proposta_by_token(TEXT) TO anon, authenticated, service_role;

-- 4) Função de assinatura (atômica, valida token/expiração/status)
CREATE OR REPLACE FUNCTION public.assinar_proposta(
  p_token TEXT,
  p_aceitar BOOLEAN,
  p_ip TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_motivo_recusa TEXT DEFAULT NULL,
  p_assinatura_nome TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.propostas;
  v_hash TEXT;
  v_evento TEXT;
BEGIN
  SELECT * INTO v_row FROM public.propostas WHERE access_token = p_token FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;

  IF v_row.status IN ('aceita','recusada','cancelada') THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_finalized', 'status', v_row.status);
  END IF;

  IF v_row.expira_em IS NOT NULL AND v_row.expira_em < now() THEN
    UPDATE public.propostas SET status = 'expirada', updated_at = now() WHERE id = v_row.id;
    INSERT INTO public.propostas_eventos (proposta_id, evento, ip, user_agent)
    VALUES (v_row.id, 'expirada', p_ip, p_user_agent);
    RETURN jsonb_build_object('success', false, 'error', 'expired');
  END IF;

  IF p_aceitar THEN
    v_hash := encode(digest(
      v_row.id::text || COALESCE(p_assinatura_nome, v_row.candidato_nome) || now()::text || COALESCE(p_ip,''),
      'sha256'
    ), 'hex');
    v_evento := 'aceita';

    UPDATE public.propostas SET
      status = 'aceita',
      assinada_em = now(),
      assinatura_hash = v_hash,
      assinatura_ip = p_ip,
      assinatura_user_agent = p_user_agent,
      updated_at = now()
    WHERE id = v_row.id;
  ELSE
    v_evento := 'recusada';
    UPDATE public.propostas SET
      status = 'recusada',
      recusada_em = now(),
      motivo_recusa = p_motivo_recusa,
      updated_at = now()
    WHERE id = v_row.id;
  END IF;

  INSERT INTO public.propostas_eventos (proposta_id, evento, ip, user_agent, metadata)
  VALUES (v_row.id, v_evento, p_ip, p_user_agent,
          jsonb_build_object('assinatura_hash', v_hash, 'assinatura_nome', p_assinatura_nome));

  RETURN jsonb_build_object(
    'success', true,
    'status', CASE WHEN p_aceitar THEN 'aceita' ELSE 'recusada' END,
    'assinatura_hash', v_hash,
    'assinada_em', CASE WHEN p_aceitar THEN now() ELSE NULL END
  );
END;
$$;

REVOKE ALL ON FUNCTION public.assinar_proposta(TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assinar_proposta(TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

-- 5) Trigger que registra evento ao marcar visualização (view)
CREATE OR REPLACE FUNCTION public.registrar_visualizacao_proposta()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status = 'enviada' AND NEW.status = 'visualizada' THEN
    INSERT INTO public.propostas_eventos (proposta_id, evento, metadata)
    VALUES (NEW.id, 'visualizada', jsonb_build_object('auto', true));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_propostas_visualizacao ON public.propostas;
CREATE TRIGGER trg_propostas_visualizacao
  AFTER UPDATE OF status ON public.propostas
  FOR EACH ROW EXECUTE FUNCTION public.registrar_visualizacao_proposta();
