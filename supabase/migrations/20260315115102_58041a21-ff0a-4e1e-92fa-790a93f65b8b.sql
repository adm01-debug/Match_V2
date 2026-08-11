
-- =============================================
-- SECURITY FIX ROUND 2: Remaining vulnerabilities
-- =============================================

-- 1. login_attempts: Drop the remaining public ALL policy
DROP POLICY IF EXISTS "System can manage login attempts" ON public.login_attempts;

-- 2. scorecards: Remove overly permissive authenticated SELECT, restrict to HR
DROP POLICY IF EXISTS "Authenticated can view scorecards" ON public.scorecards;

-- 3. resultados_provas: Restrict to HR staff + own results
DROP POLICY IF EXISTS "Authenticated can view resultados" ON public.resultados_provas;

CREATE POLICY "HR staff can view all resultados" ON public.resultados_provas
FOR SELECT TO authenticated USING (public.is_hr_staff(auth.uid()));

CREATE POLICY "Candidates can view own resultados" ON public.resultados_provas
FOR SELECT TO authenticated USING (
  candidato_id IN (
    SELECT c.id FROM candidatos c
    JOIN candidatos_auth ca ON ca.candidato_id = c.id
    WHERE ca.user_id = auth.uid()
  )
);

-- 4. assessment_respostas: Fix overly permissive SELECT
DROP POLICY IF EXISTS "Users can view own assessment_respostas" ON public.assessment_respostas;

CREATE POLICY "Candidates view own assessment_respostas" ON public.assessment_respostas
FOR SELECT TO authenticated USING (
  public.is_hr_staff(auth.uid()) OR
  candidato_id IN (
    SELECT c.id FROM candidatos c
    JOIN candidatos_auth ca ON ca.candidato_id = c.id
    WHERE ca.user_id = auth.uid()
  )
);

-- 5. scorecard_competencias: Restrict to HR
DROP POLICY IF EXISTS "Authenticated can view scorecard_competencias" ON public.scorecard_competencias;

-- 6. regras_log: Restrict to HR
DROP POLICY IF EXISTS "Authenticated can view regras_log" ON public.regras_log;

CREATE POLICY "HR staff can view regras_log" ON public.regras_log
FOR SELECT TO authenticated USING (public.is_hr_staff(auth.uid()));

-- 7. vagas: Fix public SELECT that bypasses status filter
DROP POLICY IF EXISTS "Usuários autenticados podem ver vagas" ON public.vagas;

-- Ensure HR can see all vagas and public only sees published
CREATE POLICY "HR staff can view all vagas" ON public.vagas
FOR SELECT TO authenticated USING (public.is_hr_staff(auth.uid()));

-- 8. questoes: Create a view-based approach - for now restrict to HR for resposta_correta access
-- The simpler approach: restrict questoes to HR staff only (candidates access via prova aplicacao)
DROP POLICY IF EXISTS "Authenticated users can view questoes" ON public.questoes;

CREATE POLICY "HR staff can view all questoes" ON public.questoes
FOR SELECT TO authenticated USING (public.is_hr_staff(auth.uid()));
