-- Migration: Role-Based Access Control (RBAC)
-- Creates tables for granular permissions management

-- Roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT,
    UNIQUE(resource, action)
);

-- Role-Permission mapping
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- User-Role mapping
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Indexes
CREATE INDEX idx_role_permissions_role ON public.role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON public.role_permissions(permission_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role_id);

-- RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Roles viewable by authenticated" ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permissions viewable by authenticated" ON public.permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Role permissions viewable" ON public.role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "User roles viewable" ON public.user_roles FOR SELECT TO authenticated USING (true);

-- Insert default roles
INSERT INTO public.roles (name, description, is_system) VALUES
('admin', 'Administrador com acesso total', true),
('recruiter', 'Recrutador com acesso a processos seletivos', true),
('hiring_manager', 'Gestor de contratação', true),
('viewer', 'Visualização apenas', true)
ON CONFLICT (name) DO NOTHING;

-- Insert permissions
INSERT INTO public.permissions (resource, action, description) VALUES
-- Candidatos
('candidatos', 'view', 'Visualizar candidatos'),
('candidatos', 'create', 'Criar candidatos'),
('candidatos', 'edit', 'Editar candidatos'),
('candidatos', 'delete', 'Excluir candidatos'),
('candidatos', 'export', 'Exportar candidatos'),
-- Vagas
('vagas', 'view', 'Visualizar vagas'),
('vagas', 'create', 'Criar vagas'),
('vagas', 'edit', 'Editar vagas'),
('vagas', 'delete', 'Excluir vagas'),
('vagas', 'publish', 'Publicar vagas'),
-- Entrevistas
('entrevistas', 'view', 'Visualizar entrevistas'),
('entrevistas', 'create', 'Agendar entrevistas'),
('entrevistas', 'edit', 'Editar entrevistas'),
('entrevistas', 'delete', 'Cancelar entrevistas'),
-- Avaliações
('avaliacoes', 'view', 'Visualizar avaliações'),
('avaliacoes', 'create', 'Criar avaliações'),
('avaliacoes', 'edit', 'Editar avaliações'),
-- Relatórios
('relatorios', 'view', 'Visualizar relatórios'),
('relatorios', 'export', 'Exportar relatórios'),
-- Configurações
('settings', 'view', 'Visualizar configurações'),
('settings', 'edit', 'Editar configurações'),
-- Usuários
('users', 'view', 'Visualizar usuários'),
('users', 'create', 'Criar usuários'),
('users', 'edit', 'Editar usuários'),
('users', 'delete', 'Excluir usuários')
ON CONFLICT (resource, action) DO NOTHING;

-- Assign all permissions to admin role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;

-- Assign recruiter permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'recruiter' 
AND p.resource IN ('candidatos', 'vagas', 'entrevistas', 'avaliacoes')
AND p.action IN ('view', 'create', 'edit')
ON CONFLICT DO NOTHING;

-- Function to check user permission
CREATE OR REPLACE FUNCTION check_user_permission(user_uuid UUID, resource_name TEXT, action_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.role_permissions rp ON ur.role_id = rp.role_id
        JOIN public.permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = user_uuid
        AND p.resource = resource_name
        AND p.action = action_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT ALL ON public.roles TO authenticated;
GRANT ALL ON public.permissions TO authenticated;
GRANT ALL ON public.role_permissions TO authenticated;
GRANT ALL ON public.user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION check_user_permission TO authenticated;
