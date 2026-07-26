CREATE OR REPLACE FUNCTION public.hr_funnel_sla(p_dias integer DEFAULT 30, p_sla_horas integer DEFAULT 48)
RETURNS TABLE(
  vaga_id uuid,
  vaga_titulo text,
  total_candidaturas bigint,
  com_primeira_resposta bigint,
  dentro_do_sla bigint,
  percentual_sla numeric,
  horas_medias_primeira_resposta numeric,
  aguardando_agora bigint
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_dias integer := GREATEST(1, LEAST(COALESCE(p_dias, 30), 365));
  v_sla  integer := GREATEST(1, LEAST(COALESCE(p_sla_horas, 48), 720));
BEGIN
  IF NOT public.is_hr_staff(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  WITH base AS (
    SELECT
      c.id,
      c.vaga_id,
      c.data_candidatura,
      (
        SELECT min(h.created_at)
        FROM public.historico_etapas h
        WHERE h.processo_id = c.processo_id
          AND h.created_at > c.data_candidatura
      ) AS primeira_resposta_em
    FROM public.candidaturas c
    WHERE c.deleted_at IS NULL
      AND c.data_candidatura >= now() - make_interval(days => v_dias)
  ),
  calc AS (
    SELECT
      b.vaga_id,
      b.primeira_resposta_em,
      CASE WHEN b.primeira_resposta_em IS NULL THEN NULL
           ELSE EXTRACT(EPOCH FROM (b.primeira_resposta_em - b.data_candidatura)) / 3600.0
      END AS horas,
      -- Ainda sem resposta e já estourou o prazo: fila de risco do agora.
      (b.primeira_resposta_em IS NULL
        AND b.data_candidatura < now() - make_interval(hours => v_sla)) AS atrasada
    FROM base b
  )
  SELECT
    v.id,
    v.titulo,
    count(*)::bigint,
    count(*) FILTER (WHERE k.primeira_resposta_em IS NOT NULL)::bigint,
    count(*) FILTER (WHERE k.horas IS NOT NULL AND k.horas <= v_sla)::bigint,
    CASE WHEN count(*) FILTER (WHERE k.primeira_resposta_em IS NOT NULL) > 0
      THEN ROUND(
        (count(*) FILTER (WHERE k.horas IS NOT NULL AND k.horas <= v_sla))::numeric
        / count(*) FILTER (WHERE k.primeira_resposta_em IS NOT NULL)::numeric * 100, 2)
      ELSE NULL END,
    ROUND(AVG(k.horas)::numeric, 1),
    count(*) FILTER (WHERE k.atrasada)::bigint
  FROM calc k
  JOIN public.vagas v ON v.id = k.vaga_id
  GROUP BY v.id, v.titulo
  ORDER BY count(*) FILTER (WHERE k.atrasada) DESC, count(*) DESC;
END;
$function$;

REVOKE ALL ON FUNCTION public.hr_funnel_sla(integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.hr_funnel_sla(integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.hr_funnel_sla(integer, integer) TO service_role;