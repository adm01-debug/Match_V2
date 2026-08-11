
-- A13: Immutable admin audit log
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_actor ON public.admin_audit_log(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON public.admin_audit_log(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target ON public.admin_audit_log(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created ON public.admin_audit_log(created_at DESC);

GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read
CREATE POLICY "admins read audit log"
  ON public.admin_audit_log
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Immutability: block updates/deletes at policy level (no INSERT policy = no client insert either)
CREATE POLICY "nobody updates audit log"
  ON public.admin_audit_log
  FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "nobody deletes audit log"
  ON public.admin_audit_log
  FOR DELETE
  TO authenticated
  USING (false);

-- Trigger enforces immutability even against service_role usage patterns
CREATE OR REPLACE FUNCTION public.prevent_audit_log_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'admin_audit_log is immutable' USING ERRCODE = '42501';
END;
$$;

DROP TRIGGER IF EXISTS admin_audit_log_no_update ON public.admin_audit_log;
CREATE TRIGGER admin_audit_log_no_update
  BEFORE UPDATE OR DELETE ON public.admin_audit_log
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_log_mutation();

-- RPC to record an audit event (authenticated users; captures actor from auth.uid())
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action TEXT,
  p_target_type TEXT DEFAULT NULL,
  p_target_id TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_email TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'unauthenticated' USING ERRCODE = '42501';
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = auth.uid();

  INSERT INTO public.admin_audit_log (actor_id, actor_email, action, target_type, target_id, metadata)
  VALUES (auth.uid(), v_email, p_action, p_target_type, p_target_id, COALESCE(p_metadata, '{}'::jsonb))
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.log_admin_action(TEXT, TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_admin_action(TEXT, TEXT, TEXT, JSONB) TO authenticated;

-- Admin listing RPC
CREATE OR REPLACE FUNCTION public.admin_list_audit_log(
  p_action TEXT DEFAULT NULL,
  p_actor UUID DEFAULT NULL,
  p_limit INT DEFAULT 100,
  p_offset INT DEFAULT 0
)
RETURNS SETOF public.admin_audit_log
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT *
  FROM public.admin_audit_log
  WHERE (p_action IS NULL OR action = p_action)
    AND (p_actor IS NULL OR actor_id = p_actor)
  ORDER BY created_at DESC
  LIMIT GREATEST(1, LEAST(p_limit, 500))
  OFFSET GREATEST(0, p_offset);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_list_audit_log(TEXT, UUID, INT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_audit_log(TEXT, UUID, INT, INT) TO authenticated;

-- Integrate into requeue: overwrite admin_requeue_communication_retry to record audit
CREATE OR REPLACE FUNCTION public.admin_requeue_communication_retry(p_id uuid)
RETURNS communication_retry_queue
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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

  PERFORM public.log_admin_action(
    'requeue_communication_retry',
    'communication_retry_queue',
    p_id::text,
    jsonb_build_object('channel', v_row.channel, 'recipient', v_row.recipient)
  );

  RETURN v_row;
END;
$function$;
