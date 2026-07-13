CREATE TABLE public.integration_health_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('success','failure','breaker_open','breaker_half_open','breaker_close')),
  error TEXT,
  latency_ms INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_integration_health_events_int_time
  ON public.integration_health_events (integration, created_at DESC);
CREATE INDEX idx_integration_health_events_type_time
  ON public.integration_health_events (event_type, created_at DESC);

GRANT ALL ON public.integration_health_events TO service_role;

ALTER TABLE public.integration_health_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role manages integration health events"
  ON public.integration_health_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.admin_integration_health_summary(p_window_minutes integer DEFAULT 60)
RETURNS TABLE(
  integration text,
  total_success bigint,
  total_failure bigint,
  breaker_opens bigint,
  last_state text,
  last_error text,
  last_event_at timestamptz,
  avg_latency_ms numeric
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  WITH windowed AS (
    SELECT * FROM public.integration_health_events
    WHERE created_at >= now() - make_interval(mins => p_window_minutes)
  ),
  last_state_per AS (
    SELECT DISTINCT ON (e.integration)
      e.integration, e.event_type AS last_state, e.created_at AS state_at
    FROM windowed e
    WHERE e.event_type IN ('breaker_open','breaker_half_open','breaker_close')
    ORDER BY e.integration, e.created_at DESC
  ),
  last_err AS (
    SELECT DISTINCT ON (e.integration)
      e.integration, e.error AS last_error, e.created_at AS err_at
    FROM windowed e
    WHERE e.event_type = 'failure' AND e.error IS NOT NULL
    ORDER BY e.integration, e.created_at DESC
  ),
  last_any AS (
    SELECT e.integration, max(e.created_at) AS last_event_at
    FROM windowed e GROUP BY e.integration
  )
  SELECT
    w.integration,
    count(*) FILTER (WHERE w.event_type = 'success')::bigint,
    count(*) FILTER (WHERE w.event_type = 'failure')::bigint,
    count(*) FILTER (WHERE w.event_type = 'breaker_open')::bigint,
    COALESCE(ls.last_state, 'closed'),
    le.last_error,
    la.last_event_at,
    ROUND(AVG(w.latency_ms) FILTER (WHERE w.latency_ms IS NOT NULL)::numeric, 2)
  FROM windowed w
  LEFT JOIN last_state_per ls ON ls.integration = w.integration
  LEFT JOIN last_err le ON le.integration = w.integration
  LEFT JOIN last_any la ON la.integration = w.integration
  GROUP BY w.integration, ls.last_state, le.last_error, la.last_event_at
  ORDER BY w.integration;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_integration_health_summary(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_integration_health_summary(integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.cleanup_old_integration_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.integration_health_events
  WHERE created_at < now() - interval '30 days';
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_old_integration_events() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cleanup_old_integration_events() TO service_role;