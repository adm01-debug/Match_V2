
-- =============================================
-- SECURITY FIX: All remaining vulnerabilities
-- =============================================

-- 1. GAMIFICATION: Restrict direct writes
-- xp_transactions
DROP POLICY IF EXISTS "Users can insert their own XP transactions" ON public.xp_transactions;
DROP POLICY IF EXISTS "Service role manages XP transactions" ON public.xp_transactions;
DROP POLICY IF EXISTS "Authenticated users can insert own XP" ON public.xp_transactions;

CREATE POLICY "Service role inserts XP" ON public.xp_transactions
FOR INSERT TO service_role WITH CHECK (true);

-- user_gamification: remove direct UPDATE
DROP POLICY IF EXISTS "Users can update their own gamification data" ON public.user_gamification;
DROP POLICY IF EXISTS "Service role manages gamification" ON public.user_gamification;

CREATE POLICY "Service role updates gamification" ON public.user_gamification
FOR UPDATE TO service_role USING (true);

-- user_achievements: restrict to service_role
DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Service role manages achievements" ON public.user_achievements;

CREATE POLICY "Service role inserts achievements" ON public.user_achievements
FOR INSERT TO service_role WITH CHECK (true);

-- user_badges: restrict to service_role
DROP POLICY IF EXISTS "Users can insert their own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Service role manages badges" ON public.user_badges;

CREATE POLICY "Service role inserts badges" ON public.user_badges
FOR INSERT TO service_role WITH CHECK (true);

-- 2. PASSWORD RESET: Restrict to authenticated
DROP POLICY IF EXISTS "Anyone can create reset requests" ON public.password_reset_requests;
DROP POLICY IF EXISTS "Authenticated users can create own reset requests" ON public.password_reset_requests;
DROP POLICY IF EXISTS "Service role manages reset requests" ON public.password_reset_requests;

CREATE POLICY "Auth users create own reset requests" ON public.password_reset_requests
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role manages resets" ON public.password_reset_requests
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 3. ASSESSMENT FORGERY: Fix INSERT policies
DROP POLICY IF EXISTS "Users can insert own behavioral results" ON public.behavioral_assessment_results;
DROP POLICY IF EXISTS "HR staff can insert behavioral results" ON public.behavioral_assessment_results;

CREATE POLICY "HR inserts behavioral results" ON public.behavioral_assessment_results
FOR INSERT TO authenticated WITH CHECK (is_hr_staff(auth.uid()));

DROP POLICY IF EXISTS "Users can insert own assessment_respostas" ON public.assessment_respostas;
DROP POLICY IF EXISTS "HR or own assessment_respostas insert" ON public.assessment_respostas;

CREATE POLICY "Validated assessment insert" ON public.assessment_respostas
FOR INSERT TO authenticated WITH CHECK (
  is_hr_staff(auth.uid()) OR 
  candidato_id IN (
    SELECT c.id FROM candidatos c
    JOIN candidatos_auth ca ON ca.candidato_id = c.id
    WHERE ca.user_id = auth.uid()
  )
);

-- 4. TEMPLATE_PERGUNTAS: Hide answers from candidates
DROP POLICY IF EXISTS "Authenticated can view template_perguntas" ON public.template_perguntas;
DROP POLICY IF EXISTS "HR staff can view template_perguntas" ON public.template_perguntas;

CREATE POLICY "HR views template_perguntas" ON public.template_perguntas
FOR SELECT TO authenticated USING (is_hr_staff(auth.uid()));

-- 5. USER_2FA: Remove SELECT that exposes TOTP secrets
DROP POLICY IF EXISTS "Users can view own 2FA" ON public.user_2fa;
DROP POLICY IF EXISTS "Users can view their own 2FA" ON public.user_2fa;
DROP POLICY IF EXISTS "Service role manages 2FA" ON public.user_2fa;

CREATE POLICY "Service role reads 2FA" ON public.user_2fa
FOR SELECT TO service_role USING (true);

-- Security definer function for gamification
CREATE OR REPLACE FUNCTION public.safe_update_gamification(
  p_streak integer DEFAULT NULL,
  p_last_active_date date DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE user_gamification
  SET 
    streak = COALESCE(p_streak, streak),
    last_active_date = COALESCE(p_last_active_date, last_active_date),
    total_actions = total_actions + 1,
    updated_at = now()
  WHERE user_id = auth.uid();
END;
$$;

-- Security definer for XP award
CREATE OR REPLACE FUNCTION public.award_xp(
  p_action text,
  p_amount integer,
  p_description text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_amount > 100 OR p_amount < 0 THEN
    RAISE EXCEPTION 'Invalid XP amount';
  END IF;
  
  INSERT INTO xp_transactions (user_id, action, amount, description)
  VALUES (auth.uid(), p_action, p_amount, p_description);
  
  UPDATE user_gamification
  SET xp = xp + p_amount, updated_at = now()
  WHERE user_id = auth.uid();
END;
$$;
