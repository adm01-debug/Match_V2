
-- Fix remaining security findings: restrict sensitive tables to HR staff only

-- 1. ERROR: allowed_ips readable by candidates
DROP POLICY IF EXISTS "Authenticated users can view allowed IPs" ON public.allowed_ips;
CREATE POLICY "HR staff can view allowed IPs" ON public.allowed_ips
FOR SELECT TO authenticated USING (is_hr_staff(auth.uid()));

-- 2. WARN: assessment_questoes readable by candidates
DROP POLICY IF EXISTS "Authenticated can view assessment_questoes" ON public.assessment_questoes;
CREATE POLICY "HR staff can view assessment_questoes" ON public.assessment_questoes
FOR SELECT TO authenticated USING (is_hr_staff(auth.uid()));

-- 3. WARN: competencias (interview questions) readable by candidates
DROP POLICY IF EXISTS "Authenticated can view competencias" ON public.competencias;
CREATE POLICY "HR staff can view competencias" ON public.competencias
FOR SELECT TO authenticated USING (is_hr_staff(auth.uid()));

-- 4. WARN: perfis_cargo, criterios_selecao, perfil_valores scoring weights
DROP POLICY IF EXISTS "Authenticated can view perfis_cargo" ON public.perfis_cargo;
CREATE POLICY "HR staff can view perfis_cargo" ON public.perfis_cargo
FOR SELECT TO authenticated USING (is_hr_staff(auth.uid()));

DROP POLICY IF EXISTS "Authenticated can view criterios_selecao" ON public.criterios_selecao;
CREATE POLICY "HR staff can view criterios_selecao" ON public.criterios_selecao
FOR SELECT TO authenticated USING (is_hr_staff(auth.uid()));

DROP POLICY IF EXISTS "Authenticated can view perfil_valores" ON public.perfil_valores;
CREATE POLICY "HR staff can view perfil_valores" ON public.perfil_valores
FOR SELECT TO authenticated USING (is_hr_staff(auth.uid()));

-- 5. WARN: regras_automacao readable by candidates
DROP POLICY IF EXISTS "Authenticated can view regras_automacao" ON public.regras_automacao;
CREATE POLICY "HR staff can view regras_automacao" ON public.regras_automacao
FOR SELECT TO authenticated USING (is_hr_staff(auth.uid()));
