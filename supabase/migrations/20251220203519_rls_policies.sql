-- Migration: Row Level Security Policies
-- Garante que usuários só acessem dados permitidos

-- Habilitar RLS em todas as tabelas principais
ALTER TABLE vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE processos_seletivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE entrevistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE provas ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunicacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicacoes ENABLE ROW LEVEL SECURITY;

-- VAGAS: Todos autenticados podem ver, apenas admins podem modificar
CREATE POLICY "vagas_select_policy" ON vagas
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "vagas_insert_policy" ON vagas
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'recruiter')
        )
    );

CREATE POLICY "vagas_update_policy" ON vagas
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'recruiter')
        )
    );

-- CANDIDATOS: Recruiter pode ver todos, candidato vê só o próprio
CREATE POLICY "candidatos_select_policy" ON candidatos
    FOR SELECT TO authenticated
    USING (
        -- Admin/Recruiter vê todos
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'recruiter', 'manager')
        )
        OR
        -- Candidato vê apenas o próprio perfil
        id IN (
            SELECT candidato_id FROM candidatos_auth 
            WHERE user_id = auth.uid()
        )
    );

-- PROCESSOS SELETIVOS: Apenas staff pode ver/modificar
CREATE POLICY "processos_select_policy" ON processos_seletivos
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'recruiter', 'manager')
        )
    );

-- ENTREVISTAS: Staff pode ver todas, candidato vê as próprias
CREATE POLICY "entrevistas_select_policy" ON entrevistas
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'recruiter', 'manager')
        )
        OR
        processo_seletivo_id IN (
            SELECT ps.id FROM processos_seletivos ps
            JOIN candidatos c ON c.id = ps.candidato_id
            JOIN candidatos_auth ca ON ca.candidato_id = c.id
            WHERE ca.user_id = auth.uid()
        )
    );

-- PROVAS: Todos autenticados podem ver provas ativas
CREATE POLICY "provas_select_policy" ON provas
    FOR SELECT TO authenticated
    USING (ativo = true OR EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'recruiter')
    ));

-- COMUNICAÇÕES: Usuário vê suas próprias comunicações
CREATE POLICY "comunicacoes_select_policy" ON comunicacoes
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'recruiter')
        )
        OR
        candidato_id IN (
            SELECT candidato_id FROM candidatos_auth 
            WHERE user_id = auth.uid()
        )
    );

-- INDICAÇÕES: Criador pode ver suas indicações
CREATE POLICY "indicacoes_select_policy" ON indicacoes
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'recruiter')
        )
        OR
        indicador_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- Comentário para referência
COMMENT ON POLICY "vagas_select_policy" ON vagas IS 'Permite que usuários autenticados vejam todas as vagas';
