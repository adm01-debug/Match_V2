-- RBAC System
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('read', 'write', 'delete', 'admin')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- Indexes
CREATE INDEX idx_role_permissions_role ON public.role_permissions(role_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);

-- RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Anyone can view permissions" ON public.permissions FOR SELECT USING (true);
CREATE POLICY "Anyone can view role_permissions" ON public.role_permissions FOR SELECT USING (true);
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Insert default roles
INSERT INTO public.roles (name, description, is_system) VALUES
  ('admin', 'Administrador com acesso total', true),
  ('recrutador', 'Recrutador com acesso de leitura e escrita', true),
  ('visualizador', 'Apenas visualização', true)
ON CONFLICT (name) DO NOTHING;

-- Insert permissions
INSERT INTO public.permissions (resource, action, description) VALUES
  ('candidatos', 'read', 'Visualizar candidatos'),
  ('candidatos', 'write', 'Criar e editar candidatos'),
  ('candidatos', 'delete', 'Excluir candidatos'),
  ('vagas', 'read', 'Visualizar vagas'),
  ('vagas', 'write', 'Criar e editar vagas'),
  ('vagas', 'delete', 'Excluir vagas'),
  ('entrevistas', 'read', 'Visualizar entrevistas'),
  ('entrevistas', 'write', 'Agendar entrevistas'),
  ('relatorios', 'read', 'Visualizar relatórios'),
  ('configuracoes', 'admin', 'Gerenciar configurações'),
  ('usuarios', 'admin', 'Gerenciar usuários')
ON CONFLICT (resource, action) DO NOTHING;
