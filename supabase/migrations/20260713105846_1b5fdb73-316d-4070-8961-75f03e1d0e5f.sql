
CREATE TABLE public.communication_retry_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel TEXT NOT NULL CHECK (channel IN ('email','whatsapp')),
  recipient TEXT NOT NULL,
  payload JSONB NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  next_retry_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_error TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','sent','failed','dead')),
  dedup_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.communication_retry_queue TO service_role;

ALTER TABLE public.communication_retry_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages retry queue"
  ON public.communication_retry_queue
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_comm_retry_pending ON public.communication_retry_queue (status, next_retry_at) WHERE status = 'pending';
CREATE INDEX idx_comm_retry_channel ON public.communication_retry_queue (channel);

CREATE TRIGGER update_communication_retry_queue_updated_at
  BEFORE UPDATE ON public.communication_retry_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.enqueue_communication_retry(
  p_channel TEXT,
  p_recipient TEXT,
  p_payload JSONB,
  p_error TEXT DEFAULT NULL,
  p_dedup_key TEXT DEFAULT NULL,
  p_max_attempts INTEGER DEFAULT 5
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.communication_retry_queue (channel, recipient, payload, last_error, dedup_key, max_attempts, next_retry_at)
  VALUES (p_channel, p_recipient, p_payload, p_error, p_dedup_key, p_max_attempts, now() + interval '1 minute')
  ON CONFLICT (dedup_key) DO UPDATE
    SET attempts = communication_retry_queue.attempts,
        last_error = EXCLUDED.last_error,
        updated_at = now()
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enqueue_communication_retry(TEXT,TEXT,JSONB,TEXT,TEXT,INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_communication_retry(TEXT,TEXT,JSONB,TEXT,TEXT,INTEGER) TO service_role;

CREATE OR REPLACE FUNCTION public.claim_communication_retry_batch(p_limit INTEGER DEFAULT 20)
RETURNS SETOF public.communication_retry_queue
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE public.communication_retry_queue q
  SET status = 'processing', updated_at = now()
  WHERE q.id IN (
    SELECT id FROM public.communication_retry_queue
    WHERE status = 'pending' AND next_retry_at <= now()
    ORDER BY next_retry_at ASC
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  )
  RETURNING q.*;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_communication_retry_batch(INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_communication_retry_batch(INTEGER) TO service_role;

CREATE OR REPLACE FUNCTION public.mark_retry_result(
  p_id UUID,
  p_success BOOLEAN,
  p_error TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.communication_retry_queue;
  v_backoff_seconds INTEGER;
BEGIN
  SELECT * INTO v_row FROM public.communication_retry_queue WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RETURN; END IF;

  IF p_success THEN
    UPDATE public.communication_retry_queue
      SET status='sent', updated_at=now(), last_error=NULL
      WHERE id = p_id;
    RETURN;
  END IF;

  IF v_row.attempts + 1 >= v_row.max_attempts THEN
    UPDATE public.communication_retry_queue
      SET status='dead', attempts = attempts + 1, last_error = p_error, updated_at = now()
      WHERE id = p_id;
  ELSE
    v_backoff_seconds := LEAST(3600, POWER(2, v_row.attempts + 1)::INTEGER * 30);
    UPDATE public.communication_retry_queue
      SET status='pending',
          attempts = attempts + 1,
          last_error = p_error,
          next_retry_at = now() + make_interval(secs => v_backoff_seconds),
          updated_at = now()
      WHERE id = p_id;
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.mark_retry_result(UUID,BOOLEAN,TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_retry_result(UUID,BOOLEAN,TEXT) TO service_role;
