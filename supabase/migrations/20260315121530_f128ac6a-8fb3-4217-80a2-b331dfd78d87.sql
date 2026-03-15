
-- Fix last 2 findings: rate_limit_logs and user_2fa_logs

DROP POLICY IF EXISTS "System can insert rate limit logs" ON public.rate_limit_logs;
CREATE POLICY "Service role inserts rate limit logs" ON public.rate_limit_logs
FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS "Users can insert own 2FA logs" ON public.user_2fa_logs;
DROP POLICY IF EXISTS "Authenticated users can insert 2FA logs" ON public.user_2fa_logs;
CREATE POLICY "Service role inserts 2FA logs" ON public.user_2fa_logs
FOR INSERT TO service_role WITH CHECK (true);
