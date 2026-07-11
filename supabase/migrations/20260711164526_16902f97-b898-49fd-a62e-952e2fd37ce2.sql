
CREATE TABLE IF NOT EXISTS public.web_vitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  metric_name TEXT NOT NULL CHECK (metric_name IN ('LCP','CLS','INP','FCP','TTFB','FID')),
  metric_value NUMERIC NOT NULL,
  metric_rating TEXT CHECK (metric_rating IN ('good','needs-improvement','poor')),
  navigation_type TEXT,
  path TEXT NOT NULL,
  user_agent TEXT,
  device_type TEXT,
  connection_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.web_vitals TO anon, authenticated;
GRANT SELECT ON public.web_vitals TO authenticated;
GRANT ALL ON public.web_vitals TO service_role;

ALTER TABLE public.web_vitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert web vitals"
  ON public.web_vitals FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read web vitals"
  ON public.web_vitals FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_web_vitals_created_at ON public.web_vitals (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_web_vitals_metric_path ON public.web_vitals (metric_name, path);
CREATE INDEX IF NOT EXISTS idx_web_vitals_user_id ON public.web_vitals (user_id) WHERE user_id IS NOT NULL;
