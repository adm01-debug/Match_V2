CREATE OR REPLACE FUNCTION public.hr_sla_overdue_list(p_sla_horas integer DEFAULT 48, p_limit integer DEFAULT 50)
RETURNS TABLE(
  candidatura_id uuid,
  candidato_nome text,
  candidato_email text,
  vaga_id uuid,
  vaga_titulo text,
  data_candidatura timestamptz,
  horas_esperando numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_sla   integer := GREATEST(1, LEAST(COALESCE(p_sla_horas, 48), 720));
  v_limit integer := GREATEST(1, LEAST(COALESCE(p_limit, 50), 500));
BEGIN
  IF NOT public.is_hr_staff(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    c.id,
    COALESCE(ca.nome, 'Candidato sem nome'),
    ca.email,
    c.vaga_id,
    COALESCE(v.titulo, 'Vaga sem título'),
    c.data_candidatura,
    ROUND((EXTRACT(EPOCH FROM (now() - c.data_candidatura)) / 3600.0)::numeric, 1)
  FROM public.candidaturas c
  LEFT JOIN public.candidatos_auth ca ON ca.id = c.candidato_auth_id
  LEFT JOIN public.vagas v ON v.id = c.vaga_id
  WHERE c.deleted_at IS NULL
    AND c.data_candidatura < now() - make_interval(hours => v_sla)
    AND NOT EXISTS (
      SELECT 1 FROM public.historico_etapas h
      WHERE h.processo_id = c.processo_id
        AND h.created_at > c.data_candidatura
    )
  ORDER BY c.data_candidatura ASC
  LIMIT v_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.hr_sla_overdue_list(integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.hr_sla_overdue_list(integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.hr_sla_overdue_list(integer, integer) TO service_role;