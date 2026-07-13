-- A10: Timeout recovery for stuck 'processing' items in communication_retry_queue
CREATE OR REPLACE FUNCTION public.recover_stuck_communication_retries(p_timeout_minutes integer DEFAULT 10)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_count integer;
BEGIN
  WITH recovered AS (
    UPDATE public.communication_retry_queue
    SET status = 'pending',
        next_retry_at = now(),
        last_error = COALESCE(last_error, '') || ' [recovered from stuck processing]',
        updated_at = now()
    WHERE status = 'processing'
      AND updated_at < now() - make_interval(mins => p_timeout_minutes)
    RETURNING 1
  )
  SELECT count(*) INTO v_count FROM recovered;
  RETURN v_count;
END;
$function$;

REVOKE ALL ON FUNCTION public.recover_stuck_communication_retries(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.recover_stuck_communication_retries(integer) TO service_role;