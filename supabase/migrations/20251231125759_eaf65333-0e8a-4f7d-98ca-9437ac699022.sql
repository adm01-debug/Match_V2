-- Populate default permissions for the ATS system
INSERT INTO public.permissions (module, action, name, description) VALUES
-- Vagas module
('vagas', 'view', 'Visualizar Vagas', 'Permite visualizar lista de vagas'),
('vagas', 'create', 'Criar Vagas', 'Permite criar novas vagas'),
('vagas', 'edit', 'Editar Vagas', 'Permite editar vagas existentes'),
('vagas', 'delete', 'Excluir Vagas', 'Permite excluir vagas'),
('vagas', 'publish', 'Publicar Vagas', 'Permite publicar vagas'),

-- Candidatos module
('candidatos', 'view', 'Visualizar Candidatos', 'Permite visualizar lista de candidatos'),
('candidatos', 'create', 'Criar Candidatos', 'Permite cadastrar novos candidatos'),
('candidatos', 'edit', 'Editar Candidatos', 'Permite editar dados de candidatos'),
('candidatos', 'delete', 'Excluir Candidatos', 'Permite excluir candidatos'),

-- Processos module
('processos', 'view', 'Visualizar Processos', 'Permite visualizar processos seletivos'),
('processos', 'manage', 'Gerenciar Processos', 'Permite mover candidatos entre etapas'),
('processos', 'approve', 'Aprovar Candidatos', 'Permite aprovar ou reprovar candidatos'),

-- Entrevistas module
('entrevistas', 'view', 'Visualizar Entrevistas', 'Permite visualizar agenda de entrevistas'),
('entrevistas', 'create', 'Agendar Entrevistas', 'Permite agendar entrevistas'),
('entrevistas', 'edit', 'Editar Entrevistas', 'Permite editar entrevistas'),
('entrevistas', 'feedback', 'Dar Feedback', 'Permite registrar feedback de entrevistas'),

-- Provas module
('provas', 'view', 'Visualizar Provas', 'Permite visualizar banco de provas'),
('provas', 'create', 'Criar Provas', 'Permite criar novas provas'),
('provas', 'edit', 'Editar Provas', 'Permite editar provas existentes'),
('provas', 'delete', 'Excluir Provas', 'Permite excluir provas'),
('provas', 'results', 'Ver Resultados', 'Permite ver resultados de provas'),

-- Relatórios module
('relatorios', 'view', 'Visualizar Relatórios', 'Permite acessar relatórios'),
('relatorios', 'export', 'Exportar Relatórios', 'Permite exportar dados'),

-- Indicações module
('indicacoes', 'view', 'Visualizar Indicações', 'Permite visualizar indicações'),
('indicacoes', 'manage', 'Gerenciar Indicações', 'Permite aprovar/rejeitar indicações'),

-- Comunicações module
('comunicacoes', 'view', 'Visualizar Comunicações', 'Permite ver histórico de comunicações'),
('comunicacoes', 'send', 'Enviar Comunicações', 'Permite enviar emails a candidatos'),

-- Configurações module
('configuracoes', 'view', 'Visualizar Configurações', 'Permite ver configurações'),
('configuracoes', 'edit', 'Editar Configurações', 'Permite editar configurações do sistema'),

-- Usuários module
('usuarios', 'view', 'Visualizar Usuários', 'Permite ver lista de usuários'),
('usuarios', 'create', 'Criar Usuários', 'Permite criar novos usuários'),
('usuarios', 'edit', 'Editar Usuários', 'Permite editar usuários'),
('usuarios', 'delete', 'Excluir Usuários', 'Permite excluir usuários'),
('usuarios', 'roles', 'Gerenciar Roles', 'Permite atribuir roles a usuários'),

-- Segurança module
('seguranca', 'view', 'Visualizar Segurança', 'Permite ver logs de segurança'),
('seguranca', 'manage', 'Gerenciar Segurança', 'Permite gerenciar configurações de segurança'),
('seguranca', 'ips', 'Gerenciar IPs', 'Permite gerenciar whitelist/blocklist de IPs')
ON CONFLICT DO NOTHING;

-- Assign all permissions to admin role
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin', id FROM public.permissions
ON CONFLICT DO NOTHING;

-- Assign RH permissions
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'rh', id FROM public.permissions 
WHERE module IN ('vagas', 'candidatos', 'processos', 'entrevistas', 'provas', 'comunicacoes', 'indicacoes', 'relatorios')
ON CONFLICT DO NOTHING;

-- Assign Gestor permissions (limited)
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'gestor', id FROM public.permissions 
WHERE (module = 'vagas' AND action = 'view')
   OR (module = 'candidatos' AND action = 'view')
   OR (module = 'processos' AND action IN ('view', 'approve'))
   OR (module = 'entrevistas' AND action IN ('view', 'feedback'))
   OR (module = 'provas' AND action IN ('view', 'results'))
   OR (module = 'relatorios' AND action = 'view')
ON CONFLICT DO NOTHING;

-- Create function to check user permission (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _module text, _action text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role = ur.role
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = _user_id
      AND p.module = _module
      AND p.action = _action
  )
$$;

-- Create function to get all user permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id uuid)
RETURNS TABLE(module text, action text, name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT p.module, p.action, p.name
  FROM public.user_roles ur
  JOIN public.role_permissions rp ON rp.role = ur.role
  JOIN public.permissions p ON p.id = rp.permission_id
  WHERE ur.user_id = _user_id
  ORDER BY p.module, p.action
$$;