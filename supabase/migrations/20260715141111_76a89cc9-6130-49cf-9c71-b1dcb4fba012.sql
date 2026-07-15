CREATE OR REPLACE FUNCTION public.admin_email_delivery_sla(p_window_minutes integer DEFAULT 1440)
RETURNS TABLE(total_sent bigint, total_delivered bigint, total_bounced bigint, total_complained bigint, total_opened bigint, total_clicked bigint, delivery_rate numeric, bounce_rate numeric)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
  WITH w AS (
    SELECT event_type FROM public.integration_health_events
    WHERE integration = 'resend-api' AND created_at >= now() - make_interval(mins => p_window_minutes)
  )
  SELECT
    count(*) FILTER (WHERE event_type = 'success')::bigint,
    count(*) FILTER (WHERE event_type = 'email_delivered')::bigint,
    count(*) FILTER (WHERE event_type IN ('email_bounced','email_hard_bounced'))::bigint,
    count(*) FILTER (WHERE event_type = 'email_complained')::bigint,
    count(*) FILTER (WHERE event_type = 'email_opened')::bigint,
    count(*) FILTER (WHERE event_type = 'email_clicked')::bigint,
    CASE WHEN count(*) FILTER (WHERE event_type = 'success') > 0
      THEN ROUND((count(*) FILTER (WHERE event_type = 'email_delivered')::numeric / count(*) FILTER (WHERE event_type = 'success')::numeric) * 100, 2)
      ELSE 0 END,
    CASE WHEN count(*) FILTER (WHERE event_type = 'success') > 0
      THEN ROUND((count(*) FILTER (WHERE event_type IN ('email_bounced','email_hard_bounced'))::numeric / count(*) FILTER (WHERE event_type = 'success')::numeric) * 100, 2)
      ELSE 0 END
  FROM w;
END;
$$;

CREATE OR REPLACE FUNCTION public.public_email_delivery_sla(p_window_minutes integer DEFAULT 60)
RETURNS TABLE(sent bigint, delivered bigint, bounced bigint, delivery_rate numeric)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH w AS (
    SELECT event_type FROM public.integration_health_events
    WHERE integration = 'resend-api' AND created_at >= now() - make_interval(mins => p_window_minutes)
  )
  SELECT
    count(*) FILTER (WHERE event_type = 'success')::bigint,
    count(*) FILTER (WHERE event_type = 'email_delivered')::bigint,
    count(*) FILTER (WHERE event_type IN ('email_bounced','email_hard_bounced'))::bigint,
    CASE WHEN count(*) FILTER (WHERE event_type = 'success') > 0
      THEN ROUND((count(*) FILTER (WHERE event_type = 'email_delivered')::numeric / count(*) FILTER (WHERE event_type = 'success')::numeric) * 100, 2)
      ELSE 100 END
  FROM w;
END;
$$;

REVOKE ALL ON FUNCTION public.public_email_delivery_sla(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_email_delivery_sla(integer) TO anon, authenticated, service_role;
REVOKE ALL ON FUNCTION public.admin_email_delivery_sla(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_email_delivery_sla(integer) TO authenticated, service_role;