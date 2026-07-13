CREATE OR REPLACE FUNCTION public.admin_list_communication_retries(
  p_status text DEFAULT NULL,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS SETOF public.communication_retry_queue
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT *
  FROM public.communication_retry_queue
  WHERE (p_status IS NULL OR status = p_status)
  ORDER BY updated_at DESC
  LIMIT GREATEST(1, LEAST(p_limit, 500))
  OFFSET GREATEST(0, p_offset);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_communication_retries(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_communication_retries(text, integer, integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_requeue_communication_retry(p_id uuid)
RETURNS public.communication_retry_queue
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_row public.communication_retry_queue;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  UPDATE public.communication_retry_queue
  SET status = 'pending',
      attempts = 0,
      next_retry_at = now(),
      last_error = COALESCE(last_error, '') || ' [manually requeued by admin]',
      updated_at = now()
  WHERE id = p_id
  RETURNING * INTO v_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'not_found' USING ERRCODE = 'P0002';
  END IF;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_requeue_communication_retry(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_requeue_communication_retry(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_communication_retry_stats()
RETURNS TABLE(status text, total bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT q.status::text, count(*)::bigint
  FROM public.communication_retry_queue q
  GROUP BY q.status;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_communication_retry_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_communication_retry_stats() TO authenticated;