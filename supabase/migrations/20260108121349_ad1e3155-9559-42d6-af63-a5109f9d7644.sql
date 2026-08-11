-- ============================================
-- FIX VAGAS TABLE RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Usuários autenticados podem criar vagas" ON vagas;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar vagas" ON vagas;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar vagas" ON vagas;

CREATE POLICY "HR staff can create vagas"
ON vagas FOR INSERT TO authenticated
WITH CHECK (is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can update vagas"
ON vagas FOR UPDATE TO authenticated
USING (is_hr_staff(auth.uid()));

CREATE POLICY "Admins can delete vagas"
ON vagas FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- FIX PROVAS TABLE RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Usuários autenticados podem criar provas" ON provas;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar provas" ON provas;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar provas" ON provas;

CREATE POLICY "HR staff can create provas"
ON provas FOR INSERT TO authenticated
WITH CHECK (is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can update provas"
ON provas FOR UPDATE TO authenticated
USING (is_hr_staff(auth.uid()));

CREATE POLICY "Admins can delete provas"
ON provas FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- FIX QUESTOES TABLE RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Usuários autenticados podem criar questões" ON questoes;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar questões" ON questoes;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar questões" ON questoes;

CREATE POLICY "HR staff can create questoes"
ON questoes FOR INSERT TO authenticated
WITH CHECK (is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can update questoes"
ON questoes FOR UPDATE TO authenticated
USING (is_hr_staff(auth.uid()));

CREATE POLICY "Admins can delete questoes"
ON questoes FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- FIX BATERIAS_PROVAS TABLE RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Usuários autenticados podem criar baterias" ON baterias_provas;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar baterias" ON baterias_provas;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar baterias" ON baterias_provas;

CREATE POLICY "HR staff can create baterias"
ON baterias_provas FOR INSERT TO authenticated
WITH CHECK (is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can update baterias"
ON baterias_provas FOR UPDATE TO authenticated
USING (is_hr_staff(auth.uid()));

CREATE POLICY "Admins can delete baterias"
ON baterias_provas FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- FIX BATERIA_PROVAS_REL TABLE RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Usuários autenticados podem criar relações" ON bateria_provas_rel;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar relações" ON bateria_provas_rel;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar relações" ON bateria_provas_rel;

CREATE POLICY "HR staff can create bateria_provas_rel"
ON bateria_provas_rel FOR INSERT TO authenticated
WITH CHECK (is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can update bateria_provas_rel"
ON bateria_provas_rel FOR UPDATE TO authenticated
USING (is_hr_staff(auth.uid()));

CREATE POLICY "Admins can delete bateria_provas_rel"
ON bateria_provas_rel FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- FIX RESULTADOS_PROVAS TABLE RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Usuários autenticados podem criar resultados" ON resultados_provas;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar resultados" ON resultados_provas;

CREATE POLICY "HR staff can create resultados"
ON resultados_provas FOR INSERT TO authenticated
WITH CHECK (is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can update resultados"
ON resultados_provas FOR UPDATE TO authenticated
USING (is_hr_staff(auth.uid()));

-- ============================================
-- FIX INDICACOES TABLE RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Usuários autenticados podem criar indicações" ON indicacoes;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar indicações" ON indicacoes;

CREATE POLICY "HR staff can create indicacoes"
ON indicacoes FOR INSERT TO authenticated
WITH CHECK (is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can update indicacoes"
ON indicacoes FOR UPDATE TO authenticated
USING (is_hr_staff(auth.uid()));

-- ============================================
-- FIX COMUNICACOES TABLE RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Permitir inserção de comunicacoes" ON comunicacoes;

CREATE POLICY "HR staff can create comunicacoes"
ON comunicacoes FOR INSERT TO authenticated
WITH CHECK (is_hr_staff(auth.uid()));

-- ============================================
-- FIX MATCH_SCORES TABLE RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Permitir inserção de match_scores" ON match_scores;

CREATE POLICY "HR staff can create match_scores"
ON match_scores FOR INSERT TO authenticated
WITH CHECK (is_hr_staff(auth.uid()));