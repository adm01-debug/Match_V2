-- Create helper function to check if user is HR staff (admin, rh, or gestor)
CREATE OR REPLACE FUNCTION public.is_hr_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'rh', 'gestor')
  )
$$;

-- ============================================
-- FIX CANDIDATOS TABLE RLS POLICIES
-- ============================================

-- Drop insecure policies
DROP POLICY IF EXISTS "Permitir leitura de candidatos" ON candidatos;
DROP POLICY IF EXISTS "Permitir inserção de candidatos" ON candidatos;
DROP POLICY IF EXISTS "Permitir atualização de candidatos" ON candidatos;
DROP POLICY IF EXISTS "Permitir exclusão de candidatos" ON candidatos;

-- Create secure role-based policies
CREATE POLICY "HR staff can view candidates"
ON candidatos FOR SELECT
TO authenticated
USING (is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can insert candidates"
ON candidatos FOR INSERT
TO authenticated
WITH CHECK (is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can update candidates"
ON candidatos FOR UPDATE
TO authenticated
USING (is_hr_staff(auth.uid()));

CREATE POLICY "Admins can delete candidates"
ON candidatos FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- FIX ENTREVISTAS TABLE RLS POLICIES
-- ============================================

-- Drop insecure policies
DROP POLICY IF EXISTS "Usuários autenticados podem ver todas as entrevistas" ON entrevistas;
DROP POLICY IF EXISTS "Usuários autenticados podem criar entrevistas" ON entrevistas;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar entrevistas" ON entrevistas;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar entrevistas" ON entrevistas;

-- Create secure role-based policies
CREATE POLICY "HR staff can view interviews"
ON entrevistas FOR SELECT
TO authenticated
USING (is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can create interviews"
ON entrevistas FOR INSERT
TO authenticated
WITH CHECK (is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can update interviews"
ON entrevistas FOR UPDATE
TO authenticated
USING (is_hr_staff(auth.uid()));

CREATE POLICY "Admins can delete interviews"
ON entrevistas FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- FIX PROCESSOS_SELETIVOS TABLE RLS POLICIES
-- ============================================

-- Drop insecure policies
DROP POLICY IF EXISTS "Usuários autenticados podem ver processos" ON processos_seletivos;
DROP POLICY IF EXISTS "Usuários autenticados podem criar processos" ON processos_seletivos;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar processos" ON processos_seletivos;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar processos" ON processos_seletivos;

-- Create secure role-based policies
CREATE POLICY "HR staff can view selection processes"
ON processos_seletivos FOR SELECT
TO authenticated
USING (is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can create selection processes"
ON processos_seletivos FOR INSERT
TO authenticated
WITH CHECK (is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can update selection processes"
ON processos_seletivos FOR UPDATE
TO authenticated
USING (is_hr_staff(auth.uid()));

CREATE POLICY "Admins can delete selection processes"
ON processos_seletivos FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));