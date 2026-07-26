CREATE OR REPLACE FUNCTION public.hr_register_first_response(p_candidatura_id uuid, p_nota text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_processo_id uuid;
  v_etapa text;
  v_id uuid;
BEGIN
  IF NOT public.is_hr_staff(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  SELECT c.processo_id, c.etapa_atual
  INTO v_processo_id, v_etapa
  FROM public.candidaturas c
  WHERE c.id = p_candidatura_id AND c.deleted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'candidatura_nao_encontrada' USING ERRCODE = 'P0002';
  END IF;

  -- Sem processo vinculado não há onde ancorar o histórico: falhar explicitamente
  -- é melhor que criar um registro órfão que nunca sairia da fila de atraso.
  IF v_processo_id IS NULL THEN
    RAISE EXCEPTION 'candidatura_sem_processo' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.historico_etapas (processo_id, etapa_anterior, etapa_nova, motivo, responsavel_id)
  VALUES (
    v_processo_id,
    v_etapa,
    v_etapa,
    COALESCE(NULLIF(btrim(p_nota), ''), 'Primeiro contato registrado pelo RH'),
    auth.uid()
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.hr_register_first_response(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.hr_register_first_response(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.hr_register_first_response(uuid, text) TO service_role;