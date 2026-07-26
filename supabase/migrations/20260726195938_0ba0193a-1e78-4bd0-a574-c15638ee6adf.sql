CREATE OR REPLACE FUNCTION public.hr_candidatura_timeline(
  p_candidatura_id uuid,
  p_limit integer DEFAULT 50
)
RETURNS TABLE(
  evento_id uuid,
  etapa_anterior text,
  etapa_nova text,
  motivo text,
  responsavel_id uuid,
  responsavel_nome text,
  created_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_processo_id uuid;
  v_limit integer := GREATEST(1, LEAST(COALESCE(p_limit, 50), 200));
BEGIN
  IF NOT public.is_hr_staff(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  SELECT c.processo_id INTO v_processo_id
  FROM public.candidaturas c
  WHERE c.id = p_candidatura_id AND c.deleted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'candidatura_nao_encontrada' USING ERRCODE = 'P0002';
  END IF;

  -- Sem processo vinculado a timeline é legitimamente vazia: devolver
  -- zero linhas é mais honesto que erro, pois a UI já trata lista vazia.
  IF v_processo_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT h.id, h.etapa_anterior, h.etapa_nova, h.motivo,
         h.responsavel_id, p.nome, h.created_at
  FROM public.historico_etapas h
  LEFT JOIN public.profiles p ON p.user_id = h.responsavel_id
  WHERE h.processo_id = v_processo_id
  ORDER BY h.created_at DESC
  LIMIT v_limit;
END;
$$;