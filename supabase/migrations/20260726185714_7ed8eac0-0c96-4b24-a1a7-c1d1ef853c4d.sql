-- ============================================================
-- Etapas 2 e 3 — Motor de aplicação (anti-cola) e scoring
-- ============================================================

-- Inicia sessão: sorteia itens ativos, embaralha e materializa as respostas
-- em branco. O gabarito nunca sai do servidor.
CREATE OR REPLACE FUNCTION public.start_cognitive_session(
  p_candidato_id UUID DEFAULT NULL,
  p_vaga_id UUID DEFAULT NULL,
  p_dominios public.cognitive_domain[] DEFAULT ARRAY['logico','numerico','verbal','atencao']::public.cognitive_domain[],
  p_itens_por_dominio INTEGER DEFAULT 5,
  p_tempo_limite_seg INTEGER DEFAULT 900
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_session_id UUID;
  v_qtd INTEGER := GREATEST(1, LEAST(COALESCE(p_itens_por_dominio, 5), 25));
  v_tempo INTEGER := GREATEST(60, LEAST(COALESCE(p_tempo_limite_seg, 900), 7200));
  v_total INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'unauthenticated' USING ERRCODE = '42501';
  END IF;

  IF p_dominios IS NULL OR array_length(p_dominios, 1) IS NULL THEN
    RAISE EXCEPTION 'dominios_obrigatorios' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.cognitive_sessions (candidato_id, user_id, vaga_id, dominios, tempo_limite_seg)
  VALUES (p_candidato_id, auth.uid(), p_vaga_id, p_dominios, v_tempo)
  RETURNING id INTO v_session_id;

  -- Sorteio estratificado por domínio: mantém a prova balanceada mesmo
  -- quando o banco tem volumes desiguais entre domínios.
  WITH sorteio AS (
    SELECT i.id,
           row_number() OVER (PARTITION BY i.dominio ORDER BY random()) AS rn
    FROM public.cognitive_items i
    WHERE i.ativo
      AND i.deleted_at IS NULL
      AND i.dominio = ANY (p_dominios)
  ),
  selecionados AS (
    SELECT id, row_number() OVER (ORDER BY random()) AS ordem
    FROM sorteio WHERE rn <= v_qtd
  )
  INSERT INTO public.cognitive_responses (session_id, item_id, ordem)
  SELECT v_session_id, s.id, s.ordem::smallint FROM selecionados s;

  SELECT count(*) INTO v_total FROM public.cognitive_responses WHERE session_id = v_session_id;

  IF v_total = 0 THEN
    RAISE EXCEPTION 'banco_de_itens_vazio' USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.cognitive_sessions
  SET total_itens = v_total, updated_at = now()
  WHERE id = v_session_id;

  RETURN v_session_id;
END;
$$;

REVOKE ALL ON FUNCTION public.start_cognitive_session(UUID, UUID, public.cognitive_domain[], INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.start_cognitive_session(UUID, UUID, public.cognitive_domain[], INTEGER, INTEGER) TO authenticated, service_role;

-- Registra resposta com correção server-side e guarda de tempo.
CREATE OR REPLACE FUNCTION public.submit_cognitive_response(
  p_session_id UUID,
  p_item_id UUID,
  p_resposta TEXT,
  p_tempo_gasto_seg INTEGER DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_session public.cognitive_sessions;
  v_correta TEXT;
BEGIN
  SELECT * INTO v_session FROM public.cognitive_sessions WHERE id = p_session_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'sessao_nao_encontrada' USING ERRCODE = 'P0002';
  END IF;

  IF v_session.user_id IS DISTINCT FROM auth.uid() AND NOT public.is_hr_staff(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  IF v_session.status <> 'em_andamento' THEN
    RAISE EXCEPTION 'sessao_encerrada' USING ERRCODE = '22023';
  END IF;

  -- Expiração é decidida pelo relógio do servidor, não do navegador.
  IF now() > v_session.iniciada_em + make_interval(secs => v_session.tempo_limite_seg) THEN
    UPDATE public.cognitive_sessions
    SET status = 'expirada', finalizada_em = now(), updated_at = now()
    WHERE id = p_session_id;
    RAISE EXCEPTION 'tempo_esgotado' USING ERRCODE = '22023';
  END IF;

  SELECT resposta_correta INTO v_correta FROM public.cognitive_items WHERE id = p_item_id;
  IF v_correta IS NULL THEN
    RAISE EXCEPTION 'item_nao_encontrado' USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.cognitive_responses
  SET resposta = p_resposta,
      correta = (p_resposta IS NOT NULL AND upper(btrim(p_resposta)) = upper(btrim(v_correta))),
      tempo_gasto_seg = GREATEST(0, COALESCE(p_tempo_gasto_seg, 0)),
      respondida_em = now(),
      updated_at = now()
  WHERE session_id = p_session_id AND item_id = p_item_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'item_fora_da_sessao' USING ERRCODE = '22023';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_cognitive_response(UUID, UUID, TEXT, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_cognitive_response(UUID, UUID, TEXT, INTEGER) TO authenticated, service_role;

-- Finaliza e pontua: bruto, ponderado por dificuldade e por domínio.
CREATE OR REPLACE FUNCTION public.finish_cognitive_session(p_session_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_session public.cognitive_sessions;
  v_acertos INTEGER;
  v_peso_total NUMERIC;
  v_peso_obtido NUMERIC;
  v_norm NUMERIC(5,2);
  v_por_dominio JSONB;
BEGIN
  SELECT * INTO v_session FROM public.cognitive_sessions WHERE id = p_session_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'sessao_nao_encontrada' USING ERRCODE = 'P0002';
  END IF;

  IF v_session.user_id IS DISTINCT FROM auth.uid() AND NOT public.is_hr_staff(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  IF v_session.status = 'concluida' THEN
    RETURN jsonb_build_object(
      'session_id', v_session.id,
      'score_bruto', v_session.score_bruto,
      'score_normalizado', v_session.score_normalizado,
      'por_dominio', v_session.scores_por_dominio,
      'ja_finalizada', true
    );
  END IF;

  SELECT
    count(*) FILTER (WHERE r.correta),
    COALESCE(sum(i.dificuldade), 0),
    COALESCE(sum(i.dificuldade) FILTER (WHERE r.correta), 0)
  INTO v_acertos, v_peso_total, v_peso_obtido
  FROM public.cognitive_responses r
  JOIN public.cognitive_items i ON i.id = r.item_id
  WHERE r.session_id = p_session_id;

  v_norm := CASE WHEN v_peso_total > 0
                 THEN ROUND((v_peso_obtido / v_peso_total) * 100, 2)
                 ELSE 0 END;

  SELECT COALESCE(jsonb_object_agg(d.dominio, d.detalhe), '{}'::jsonb) INTO v_por_dominio
  FROM (
    SELECT i.dominio::text AS dominio,
           jsonb_build_object(
             'itens', count(*),
             'acertos', count(*) FILTER (WHERE r.correta),
             'percentual', ROUND((count(*) FILTER (WHERE r.correta))::numeric / NULLIF(count(*), 0) * 100, 2),
             'tempo_medio_seg', ROUND(AVG(COALESCE(r.tempo_gasto_seg, 0))::numeric, 1)
           ) AS detalhe
    FROM public.cognitive_responses r
    JOIN public.cognitive_items i ON i.id = r.item_id
    WHERE r.session_id = p_session_id
    GROUP BY i.dominio
  ) d;

  UPDATE public.cognitive_sessions
  SET status = 'concluida',
      finalizada_em = now(),
      score_bruto = v_acertos,
      score_normalizado = v_norm,
      scores_por_dominio = v_por_dominio,
      updated_at = now()
  WHERE id = p_session_id;

  RETURN jsonb_build_object(
    'session_id', p_session_id,
    'score_bruto', v_acertos,
    'score_normalizado', v_norm,
    'por_dominio', v_por_dominio,
    'ja_finalizada', false
  );
END;
$$;

REVOKE ALL ON FUNCTION public.finish_cognitive_session(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.finish_cognitive_session(UUID) TO authenticated, service_role;

-- Resultado com percentil normativo calculado sobre as sessões concluídas.
CREATE OR REPLACE FUNCTION public.get_cognitive_result(p_session_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_session public.cognitive_sessions;
  v_percentil NUMERIC;
  v_amostra INTEGER;
BEGIN
  SELECT * INTO v_session FROM public.cognitive_sessions WHERE id = p_session_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'sessao_nao_encontrada' USING ERRCODE = 'P0002';
  END IF;

  IF v_session.user_id IS DISTINCT FROM auth.uid() AND NOT public.is_hr_staff(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  SELECT count(*) INTO v_amostra
  FROM public.cognitive_sessions
  WHERE status = 'concluida' AND deleted_at IS NULL AND score_normalizado IS NOT NULL;

  IF v_amostra >= 5 AND v_session.score_normalizado IS NOT NULL THEN
    SELECT ROUND(
      (count(*) FILTER (WHERE s.score_normalizado < v_session.score_normalizado))::numeric
      / NULLIF(count(*), 0) * 100, 1)
    INTO v_percentil
    FROM public.cognitive_sessions s
    WHERE s.status = 'concluida' AND s.deleted_at IS NULL AND s.score_normalizado IS NOT NULL;
  ELSE
    v_percentil := NULL;
  END IF;

  RETURN jsonb_build_object(
    'session_id', v_session.id,
    'status', v_session.status,
    'score_bruto', v_session.score_bruto,
    'total_itens', v_session.total_itens,
    'score_normalizado', v_session.score_normalizado,
    'por_dominio', v_session.scores_por_dominio,
    'percentil', v_percentil,
    'amostra_normativa', v_amostra,
    'iniciada_em', v_session.iniciada_em,
    'finalizada_em', v_session.finalizada_em
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_cognitive_result(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_cognitive_result(UUID) TO authenticated, service_role;