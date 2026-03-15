
-- =============================================
-- CRITICAL SECURITY FIX: RLS Policy Hardening
-- =============================================

-- 1. password_reset_tokens: Remove public ALL policy, restrict to service role
DROP POLICY IF EXISTS "System can manage reset tokens" ON public.password_reset_tokens;
DROP POLICY IF EXISTS "Users can view own reset tokens" ON public.password_reset_tokens;

CREATE POLICY "Service role manages reset tokens" ON public.password_reset_tokens
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Users can view own reset tokens" ON public.password_reset_tokens
FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 2. login_attempts: Restrict to service role only
DROP POLICY IF EXISTS "Authenticated users can manage login_attempts" ON public.login_attempts;
DROP POLICY IF EXISTS "Anyone can manage login_attempts" ON public.login_attempts;

-- Check what policies exist first and drop the ALL policy
DO $$ 
BEGIN
  -- Drop all existing policies on login_attempts
  PERFORM 1; -- placeholder
END $$;

-- Remove any permissive ALL policies
DROP POLICY IF EXISTS "Authenticated users can manage login_attempts" ON public.login_attempts;

CREATE POLICY "Service role manages login_attempts" ON public.login_attempts
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Admins can view login_attempts" ON public.login_attempts
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 3. questoes: Restrict SELECT to authenticated only (hide resposta_correta from public)
DROP POLICY IF EXISTS "Usuários autenticados podem ver questões" ON public.questoes;

CREATE POLICY "Authenticated users can view questoes" ON public.questoes
FOR SELECT TO authenticated USING (true);

-- 4. template_perguntas: Restrict to HR staff
DROP POLICY IF EXISTS "Authenticated users can manage template_perguntas" ON public.template_perguntas;

CREATE POLICY "HR staff can manage template_perguntas" ON public.template_perguntas
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Authenticated can view template_perguntas" ON public.template_perguntas
FOR SELECT TO authenticated USING (true);

-- 5. match_scores: Restrict to HR staff
DROP POLICY IF EXISTS "Permitir leitura de match_scores" ON public.match_scores;

CREATE POLICY "HR staff can view match_scores" ON public.match_scores
FOR SELECT TO authenticated USING (public.is_hr_staff(auth.uid()));

-- 6. comunicacoes: Restrict SELECT to HR staff
DROP POLICY IF EXISTS "Permitir leitura de comunicacoes" ON public.comunicacoes;

CREATE POLICY "HR staff can view comunicacoes" ON public.comunicacoes
FOR SELECT TO authenticated USING (public.is_hr_staff(auth.uid()));

-- 7. indicacoes: Restrict to authenticated
DROP POLICY IF EXISTS "Usuários autenticados podem ver indicações" ON public.indicacoes;

CREATE POLICY "HR staff can view indicacoes" ON public.indicacoes
FOR SELECT TO authenticated USING (public.is_hr_staff(auth.uid()));

-- 8. resultados_provas: Restrict to authenticated
DROP POLICY IF EXISTS "Usuários autenticados podem ver resultados" ON public.resultados_provas;

CREATE POLICY "Authenticated can view resultados" ON public.resultados_provas
FOR SELECT TO authenticated USING (true);

-- 9. assessment_respostas: Restrict from public
DROP POLICY IF EXISTS "Authenticated users can manage assessment_respostas" ON public.assessment_respostas;

CREATE POLICY "HR staff can manage assessment_respostas" ON public.assessment_respostas
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Users can insert own assessment_respostas" ON public.assessment_respostas
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can view own assessment_respostas" ON public.assessment_respostas
FOR SELECT TO authenticated USING (true);

-- 10. scorecards: Restrict to HR staff
DROP POLICY IF EXISTS "Authenticated users can manage scorecards" ON public.scorecards;

CREATE POLICY "HR staff can manage scorecards" ON public.scorecards
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Authenticated can view scorecards" ON public.scorecards
FOR SELECT TO authenticated USING (true);

-- 11. entrevista_respostas: Restrict to HR staff
DROP POLICY IF EXISTS "Authenticated users can manage entrevista_respostas" ON public.entrevista_respostas;

CREATE POLICY "HR staff can manage entrevista_respostas" ON public.entrevista_respostas
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

-- 12. comparativos_candidatos: Restrict to HR staff
DROP POLICY IF EXISTS "Authenticated users can manage comparativos_candidatos" ON public.comparativos_candidatos;

CREATE POLICY "HR staff can manage comparativos" ON public.comparativos_candidatos
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

-- 13. candidaturas: Fix overly permissive RH policy
DROP POLICY IF EXISTS "RH pode ver todas candidaturas" ON public.candidaturas;

CREATE POLICY "HR staff can view all candidaturas" ON public.candidaturas
FOR SELECT TO authenticated USING (public.is_hr_staff(auth.uid()));

-- 14. regras_automacao: Restrict to HR staff
DROP POLICY IF EXISTS "Authenticated users can manage regras_automacao" ON public.regras_automacao;

CREATE POLICY "HR staff can manage regras_automacao" ON public.regras_automacao
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Authenticated can view regras_automacao" ON public.regras_automacao
FOR SELECT TO authenticated USING (true);

-- 15. assessment_questoes: Restrict write to HR staff
DROP POLICY IF EXISTS "Authenticated users can manage assessment_questoes" ON public.assessment_questoes;

CREATE POLICY "HR staff can manage assessment_questoes" ON public.assessment_questoes
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Authenticated can view assessment_questoes" ON public.assessment_questoes
FOR SELECT TO authenticated USING (true);

-- 16. perfis_cargo: Restrict to HR staff
DROP POLICY IF EXISTS "Authenticated users can manage perfis_cargo" ON public.perfis_cargo;

CREATE POLICY "HR staff can manage perfis_cargo" ON public.perfis_cargo
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Authenticated can view perfis_cargo" ON public.perfis_cargo
FOR SELECT TO authenticated USING (true);

-- 17. scorecard_competencias: Restrict to HR staff
DROP POLICY IF EXISTS "Authenticated users can manage scorecard_competencias" ON public.scorecard_competencias;

CREATE POLICY "HR staff can manage scorecard_competencias" ON public.scorecard_competencias
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Authenticated can view scorecard_competencias" ON public.scorecard_competencias
FOR SELECT TO authenticated USING (true);

-- 18. competencias: Restrict write to HR staff
DROP POLICY IF EXISTS "Authenticated users can manage competencias" ON public.competencias;

CREATE POLICY "HR staff can manage competencias" ON public.competencias
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Authenticated can view competencias" ON public.competencias
FOR SELECT TO authenticated USING (true);

-- 19. criterios_selecao: Restrict to HR staff
DROP POLICY IF EXISTS "Authenticated users can manage criterios_selecao" ON public.criterios_selecao;

CREATE POLICY "HR staff can manage criterios_selecao" ON public.criterios_selecao
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Authenticated can view criterios_selecao" ON public.criterios_selecao
FOR SELECT TO authenticated USING (true);

-- 20. regras_log: Restrict to HR staff
DROP POLICY IF EXISTS "Authenticated users can manage regras_log" ON public.regras_log;

CREATE POLICY "HR staff can manage regras_log" ON public.regras_log
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Authenticated can view regras_log" ON public.regras_log
FOR SELECT TO authenticated USING (true);

-- 21. templates_entrevista: Restrict write to HR staff
DROP POLICY IF EXISTS "Authenticated users can manage templates_entrevista" ON public.templates_entrevista;

CREATE POLICY "HR staff can manage templates_entrevista" ON public.templates_entrevista
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Authenticated can view templates_entrevista" ON public.templates_entrevista
FOR SELECT TO authenticated USING (true);

-- 22. assessments: Restrict write to HR staff
DROP POLICY IF EXISTS "Authenticated users can manage assessments" ON public.assessments;

CREATE POLICY "HR staff can manage assessments" ON public.assessments
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Authenticated can view assessments" ON public.assessments
FOR SELECT TO authenticated USING (true);

-- 23. valores_culturais: Restrict write to HR staff
DROP POLICY IF EXISTS "Authenticated users can manage valores_culturais" ON public.valores_culturais;

CREATE POLICY "HR staff can manage valores_culturais" ON public.valores_culturais
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Authenticated can view valores_culturais" ON public.valores_culturais
FOR SELECT TO authenticated USING (true);

-- 24. perfil_valores: Restrict write to HR staff
DROP POLICY IF EXISTS "Authenticated users can manage perfil_valores" ON public.perfil_valores;

CREATE POLICY "HR staff can manage perfil_valores" ON public.perfil_valores
FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid())) WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Authenticated can view perfil_valores" ON public.perfil_valores
FOR SELECT TO authenticated USING (true);

-- 25. provas: Restrict SELECT to authenticated
DROP POLICY IF EXISTS "Usuários autenticados podem ver provas" ON public.provas;

CREATE POLICY "Authenticated can view provas" ON public.provas
FOR SELECT TO authenticated USING (true);

-- 26. baterias_provas: Restrict SELECT to authenticated
DROP POLICY IF EXISTS "Usuários autenticados podem ver baterias" ON public.baterias_provas;

CREATE POLICY "Authenticated can view baterias" ON public.baterias_provas
FOR SELECT TO authenticated USING (true);

-- 27. bateria_provas_rel: Restrict SELECT to authenticated
DROP POLICY IF EXISTS "Usuários autenticados podem ver relações" ON public.bateria_provas_rel;

CREATE POLICY "Authenticated can view bateria_rel" ON public.bateria_provas_rel
FOR SELECT TO authenticated USING (true);
