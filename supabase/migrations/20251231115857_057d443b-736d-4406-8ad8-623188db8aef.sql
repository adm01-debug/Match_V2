-- Tabela para 2FA
CREATE TABLE IF NOT EXISTS public.user_2fa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  secret TEXT NOT NULL,
  backup_codes TEXT[] NOT NULL DEFAULT '{}',
  enabled BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para logs de 2FA
CREATE TABLE IF NOT EXISTS public.user_2fa_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para rate limit
CREATE TABLE IF NOT EXISTS public.rate_limit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para IPs bloqueados
CREATE TABLE IF NOT EXISTS public.blocked_ips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL UNIQUE,
  reason TEXT,
  blocked_by UUID,
  blocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_permanent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para IPs permitidos (whitelist)
CREATE TABLE IF NOT EXISTS public.allowed_ips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL UNIQUE,
  description TEXT,
  added_by UUID,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para logs de acesso IP
CREATE TABLE IF NOT EXISTS public.ip_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  user_id UUID,
  action TEXT NOT NULL,
  allowed BOOLEAN NOT NULL,
  endpoint TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para permissões customizadas
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para role_permissions (relacionamento)
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(role, permission_id)
);

-- Tabela para tokens de reset de senha
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para sessões de dispositivos confiáveis
CREATE TABLE IF NOT EXISTS public.trusted_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  device_hash TEXT NOT NULL,
  device_name TEXT,
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, device_hash)
);

-- Enable RLS on all tables
ALTER TABLE public.user_2fa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_2fa_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allowed_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_2fa
CREATE POLICY "Users can view own 2FA" ON public.user_2fa FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own 2FA" ON public.user_2fa FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own 2FA" ON public.user_2fa FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_2fa_logs
CREATE POLICY "Users can view own 2FA logs" ON public.user_2fa_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own 2FA logs" ON public.user_2fa_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for rate_limit_logs (admin only)
CREATE POLICY "Admins can view rate limit logs" ON public.rate_limit_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert rate limit logs" ON public.rate_limit_logs FOR INSERT WITH CHECK (true);

-- RLS Policies for blocked_ips (admin only)
CREATE POLICY "Admins can manage blocked IPs" ON public.blocked_ips FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for allowed_ips (admin only)
CREATE POLICY "Admins can manage allowed IPs" ON public.allowed_ips FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can view allowed IPs" ON public.allowed_ips FOR SELECT USING (auth.uid() IS NOT NULL);

-- RLS Policies for ip_access_logs (admin only)
CREATE POLICY "Admins can view IP access logs" ON public.ip_access_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert IP access logs" ON public.ip_access_logs FOR INSERT WITH CHECK (true);

-- RLS Policies for permissions (admin + view all)
CREATE POLICY "Everyone can view permissions" ON public.permissions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage permissions" ON public.permissions FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for role_permissions (admin + view all)
CREATE POLICY "Everyone can view role permissions" ON public.role_permissions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage role permissions" ON public.role_permissions FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for password_reset_tokens
CREATE POLICY "Users can view own reset tokens" ON public.password_reset_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage reset tokens" ON public.password_reset_tokens FOR ALL USING (true);

-- RLS Policies for trusted_devices
CREATE POLICY "Users can view own trusted devices" ON public.trusted_devices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own trusted devices" ON public.trusted_devices FOR ALL USING (auth.uid() = user_id);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_rate_limit_logs_ip ON public.rate_limit_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limit_logs_created ON public.rate_limit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_address ON public.blocked_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_access_logs_ip ON public.ip_access_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_access_logs_created ON public.ip_access_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_2fa_user ON public.user_2fa(user_id);

-- Function para limpar logs antigos
CREATE OR REPLACE FUNCTION public.cleanup_old_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Limpa rate limit logs com mais de 30 dias
  DELETE FROM public.rate_limit_logs WHERE created_at < now() - interval '30 days';
  
  -- Limpa IP access logs com mais de 90 dias
  DELETE FROM public.ip_access_logs WHERE created_at < now() - interval '90 days';
  
  -- Limpa 2FA logs com mais de 90 dias
  DELETE FROM public.user_2fa_logs WHERE created_at < now() - interval '90 days';
  
  -- Remove IPs bloqueados expirados
  DELETE FROM public.blocked_ips WHERE expires_at < now() AND is_permanent = false;
  
  -- Remove tokens de reset expirados
  DELETE FROM public.password_reset_tokens WHERE expires_at < now();
  
  -- Remove dispositivos confiáveis expirados
  DELETE FROM public.trusted_devices WHERE expires_at < now();
END;
$$;

-- Insert default permissions
INSERT INTO public.permissions (name, description, module, action) VALUES
  ('vagas.create', 'Criar vagas', 'vagas', 'create'),
  ('vagas.read', 'Visualizar vagas', 'vagas', 'read'),
  ('vagas.update', 'Editar vagas', 'vagas', 'update'),
  ('vagas.delete', 'Excluir vagas', 'vagas', 'delete'),
  ('candidatos.create', 'Adicionar candidatos', 'candidatos', 'create'),
  ('candidatos.read', 'Visualizar candidatos', 'candidatos', 'read'),
  ('candidatos.update', 'Editar candidatos', 'candidatos', 'update'),
  ('candidatos.delete', 'Excluir candidatos', 'candidatos', 'delete'),
  ('pipeline.read', 'Visualizar pipeline', 'pipeline', 'read'),
  ('pipeline.update', 'Mover candidatos no pipeline', 'pipeline', 'update'),
  ('relatorios.read', 'Visualizar relatórios', 'relatorios', 'read'),
  ('relatorios.export', 'Exportar relatórios', 'relatorios', 'export'),
  ('admin.access', 'Acessar área administrativa', 'admin', 'access'),
  ('admin.users', 'Gerenciar usuários', 'admin', 'users'),
  ('admin.roles', 'Gerenciar roles', 'admin', 'roles'),
  ('admin.security', 'Gerenciar segurança', 'admin', 'security')
ON CONFLICT (name) DO NOTHING;

-- Insert default role permissions
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin', id FROM public.permissions
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'rh', id FROM public.permissions WHERE module IN ('vagas', 'candidatos', 'pipeline', 'relatorios')
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'gestor', id FROM public.permissions WHERE action = 'read' OR name IN ('pipeline.update', 'relatorios.read')
ON CONFLICT DO NOTHING;