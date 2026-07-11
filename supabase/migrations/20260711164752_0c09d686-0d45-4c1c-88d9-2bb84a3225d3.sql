
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route text NOT NULL,
  key text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT date_trunc('minute', now()),
  count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS rate_limits_route_key_window_uidx
  ON public.rate_limits (route, key, window_start);

CREATE INDEX IF NOT EXISTS rate_limits_window_idx
  ON public.rate_limits (window_start);

GRANT ALL ON public.rate_limits TO service_role;

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role manages rate limits"
  ON public.rate_limits FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- Atomic check+increment. Returns true when the request is allowed.
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_route text,
  p_key text,
  p_max integer,
  p_window_seconds integer DEFAULT 60
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window timestamptz := date_trunc('second', now()) - make_interval(secs => (extract(epoch from now())::int % p_window_seconds));
  v_count integer;
BEGIN
  INSERT INTO public.rate_limits (route, key, window_start, count)
  VALUES (p_route, p_key, v_window, 1)
  ON CONFLICT (route, key, window_start)
  DO UPDATE SET count = public.rate_limits.count + 1,
                updated_at = now()
  RETURNING count INTO v_count;

  -- Best-effort cleanup: remove rows older than 24h
  DELETE FROM public.rate_limits WHERE window_start < now() - interval '24 hours';

  RETURN v_count <= p_max;
END;
$$;

REVOKE ALL ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) TO service_role;
