
-- Fix remaining ERROR + WARN findings

-- 1. ERROR: notifications INSERT policy targets public instead of service_role
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;
CREATE POLICY "Service role inserts notifications" ON public.notifications
FOR INSERT TO service_role WITH CHECK (true);

-- 2. WARN: behavioral_assessment_results SELECT leaks data via candidato_id IS NULL
DROP POLICY IF EXISTS "Users can view behavioral results" ON public.behavioral_assessment_results;
CREATE POLICY "Users view behavioral results" ON public.behavioral_assessment_results
FOR SELECT TO authenticated USING (
  is_hr_staff(auth.uid()) OR 
  candidato_id IN (
    SELECT c.id FROM candidatos c
    JOIN candidatos_auth ca ON ca.candidato_id = c.id
    WHERE ca.user_id = auth.uid()
  )
);

-- 3. WARN: user_gamification INSERT allows arbitrary values
DROP POLICY IF EXISTS "Users can insert their own gamification data" ON public.user_gamification;
CREATE POLICY "Service role inserts gamification" ON public.user_gamification
FOR INSERT TO service_role WITH CHECK (true);

-- 4. WARN: ip_access_logs and geo_access_logs INSERT targets public
DROP POLICY IF EXISTS "System can insert IP access logs" ON public.ip_access_logs;
CREATE POLICY "Service role inserts IP logs" ON public.ip_access_logs
FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS "System can insert geo access logs" ON public.geo_access_logs;
CREATE POLICY "Service role inserts geo logs" ON public.geo_access_logs
FOR INSERT TO service_role WITH CHECK (true);
