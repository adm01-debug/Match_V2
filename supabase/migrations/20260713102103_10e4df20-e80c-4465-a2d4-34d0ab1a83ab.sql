-- 1) is_not_deleted: fix mutable search_path
ALTER FUNCTION public.is_not_deleted(timestamptz) SET search_path = public;

-- 2) Restrict "always true" policies to service_role only.
--    service_role bypasses RLS anyway; making the role explicit satisfies the linter
--    and prevents accidental grants from widening access later.

-- user_badges
DROP POLICY IF EXISTS "Service role inserts badges" ON public.user_badges;
CREATE POLICY "Service role inserts badges" ON public.user_badges
  FOR INSERT TO service_role WITH CHECK (true);

-- notificacoes_candidato
DROP POLICY IF EXISTS "Service role insert notifications" ON public.notificacoes_candidato;
CREATE POLICY "Service role insert notifications" ON public.notificacoes_candidato
  FOR INSERT TO service_role WITH CHECK (true);

-- user_2fa_logs
DROP POLICY IF EXISTS "Service role inserts 2FA logs" ON public.user_2fa_logs;
CREATE POLICY "Service role inserts 2FA logs" ON public.user_2fa_logs
  FOR INSERT TO service_role WITH CHECK (true);

-- ip_access_logs
DROP POLICY IF EXISTS "Service role inserts IP logs" ON public.ip_access_logs;
CREATE POLICY "Service role inserts IP logs" ON public.ip_access_logs
  FOR INSERT TO service_role WITH CHECK (true);

-- xp_transactions
DROP POLICY IF EXISTS "Service role inserts XP" ON public.xp_transactions;
CREATE POLICY "Service role inserts XP" ON public.xp_transactions
  FOR INSERT TO service_role WITH CHECK (true);

-- user_achievements
DROP POLICY IF EXISTS "Service role inserts achievements" ON public.user_achievements;
CREATE POLICY "Service role inserts achievements" ON public.user_achievements
  FOR INSERT TO service_role WITH CHECK (true);

-- user_gamification
DROP POLICY IF EXISTS "Service role inserts gamification" ON public.user_gamification;
CREATE POLICY "Service role inserts gamification" ON public.user_gamification
  FOR INSERT TO service_role WITH CHECK (true);
DROP POLICY IF EXISTS "Service role updates gamification" ON public.user_gamification;
CREATE POLICY "Service role updates gamification" ON public.user_gamification
  FOR UPDATE TO service_role USING (true);

-- geo_access_logs
DROP POLICY IF EXISTS "Service role inserts geo logs" ON public.geo_access_logs;
CREATE POLICY "Service role inserts geo logs" ON public.geo_access_logs
  FOR INSERT TO service_role WITH CHECK (true);

-- historico_etapas
DROP POLICY IF EXISTS "Service role inserts history" ON public.historico_etapas;
CREATE POLICY "Service role inserts history" ON public.historico_etapas
  FOR INSERT TO service_role WITH CHECK (true);

-- notifications
DROP POLICY IF EXISTS "Service role inserts notifications" ON public.notifications;
CREATE POLICY "Service role inserts notifications" ON public.notifications
  FOR INSERT TO service_role WITH CHECK (true);

-- rate_limit_logs
DROP POLICY IF EXISTS "Service role inserts rate limit logs" ON public.rate_limit_logs;
CREATE POLICY "Service role inserts rate limit logs" ON public.rate_limit_logs
  FOR INSERT TO service_role WITH CHECK (true);

-- login_attempts
DROP POLICY IF EXISTS "Service role manages login_attempts" ON public.login_attempts;
CREATE POLICY "Service role manages login_attempts" ON public.login_attempts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- password_reset_tokens
DROP POLICY IF EXISTS "Service role manages reset tokens" ON public.password_reset_tokens;
CREATE POLICY "Service role manages reset tokens" ON public.password_reset_tokens
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- password_reset_requests
DROP POLICY IF EXISTS "Service role manages resets" ON public.password_reset_requests;
CREATE POLICY "Service role manages resets" ON public.password_reset_requests
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- rate_limits
DROP POLICY IF EXISTS "service role manages rate limits" ON public.rate_limits;
CREATE POLICY "service role manages rate limits" ON public.rate_limits
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- web_vitals: intentionally public writes (client-side telemetry). Keep as is,
-- but scope the role explicitly to anon+authenticated for clarity.
DROP POLICY IF EXISTS "Anyone can insert web vitals" ON public.web_vitals;
CREATE POLICY "Anyone can insert web vitals" ON public.web_vitals
  FOR INSERT TO anon, authenticated WITH CHECK (true);