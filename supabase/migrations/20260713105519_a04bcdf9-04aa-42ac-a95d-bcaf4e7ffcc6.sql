
CREATE TABLE public.ai_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL,
  operation TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT 'v1',
  result JSONB NOT NULL,
  hit_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),
  CONSTRAINT ai_cache_key_op_ver_unique UNIQUE (cache_key, operation, version)
);

CREATE INDEX idx_ai_cache_lookup ON public.ai_cache (cache_key, operation, version);
CREATE INDEX idx_ai_cache_expires ON public.ai_cache (expires_at);

GRANT ALL ON public.ai_cache TO service_role;

ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_cache service_role only"
  ON public.ai_cache
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.cleanup_expired_ai_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.ai_cache WHERE expires_at < now();
END;
$$;

REVOKE EXECUTE ON FUNCTION public.cleanup_expired_ai_cache() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_ai_cache() TO service_role;
