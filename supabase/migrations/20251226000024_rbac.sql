-- RBAC (Role-Based Access Control) Migration
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('read', 'write', 'delete', 'admin')),
  description TEXT,
  UNIQUE(resource, action)
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id, tenant_id)
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'recrutador';

-- Default permissions
INSERT INTO public.permissions (resource, action, description) VALUES
  ('candidatos', 'read', 'Visualizar candidatos'),
  ('candidatos', 'write', 'Criar/editar candidatos'),
  ('candidatos', 'delete', 'Excluir candidatos'),
  ('vagas', 'read', 'Visualizar vagas'),
  ('vagas', 'write', 'Criar/editar vagas'),
  ('vagas', 'delete', 'Excluir vagas'),
  ('entrevistas', 'read', 'Visualizar entrevistas'),
  ('entrevistas', 'write', 'Agendar entrevistas'),
  ('avaliacoes', 'read', 'Visualizar avaliações'),
  ('avaliacoes', 'write', 'Criar avaliações'),
  ('relatorios', 'read', 'Visualizar relatórios'),
  ('configuracoes', 'read', 'Visualizar configurações'),
  ('configuracoes', 'write', 'Alterar configurações'),
  ('usuarios', 'read', 'Visualizar usuários'),
  ('usuarios', 'write', 'Gerenciar usuários'),
  ('usuarios', 'admin', 'Administrar usuários')
ON CONFLICT (resource, action) DO NOTHING;

-- Default roles
INSERT INTO public.roles (name, description, is_system) VALUES
  ('admin', 'Administrador com acesso total', true),
  ('recrutador', 'Recrutador com acesso padrão', true),
  ('visualizador', 'Apenas visualização', true)
ON CONFLICT DO NOTHING;

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Users view permissions" ON public.permissions FOR SELECT USING (true);
CREATE POLICY "Users view role_permissions" ON public.role_permissions FOR SELECT USING (true);
CREATE POLICY "Users view user_roles" ON public.user_roles FOR SELECT USING (true);
