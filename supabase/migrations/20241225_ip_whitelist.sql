-- ============================================================================
-- Migration: IP Whitelist Tables
-- Description: Tabelas para gerenciamento de IPs permitidos
-- Author: System
-- Date: 2024-12-25
-- ============================================================================

-- Tabela de IPs permitidos
CREATE TABLE IF NOT EXISTS public.allowed_ips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip VARCHAR(45) NOT NULL UNIQUE, -- IPv4 ou IPv6
    description TEXT NOT NULL,
    added_by VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NULL, -- NULL = nunca expira
    
    CONSTRAINT valid_ip CHECK (
        ip ~* '^(\d{1,3}\.){3}\d{1,3}$' OR -- IPv4
        ip ~* '^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$' OR -- IPv6
        ip = 'localhost' OR
        ip = '::1'
    )
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_allowed_ips_ip ON public.allowed_ips(ip);
CREATE INDEX IF NOT EXISTS idx_allowed_ips_active ON public.allowed_ips(is_active);
CREATE INDEX IF NOT EXISTS idx_allowed_ips_expires ON public.allowed_ips(expires_at);

-- Tabela de logs de acesso
CREATE TABLE IF NOT EXISTS public.ip_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip VARCHAR(45) NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('ALLOWED', 'BLOCKED', 'EXPIRED')),
    reason TEXT,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Índice para consultas por IP e data
CREATE INDEX IF NOT EXISTS idx_ip_logs_ip ON public.ip_access_logs(ip);
CREATE INDEX IF NOT EXISTS idx_ip_logs_timestamp ON public.ip_access_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ip_logs_action ON public.ip_access_logs(action);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_allowed_ips_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_allowed_ips_timestamp ON public.allowed_ips;
CREATE TRIGGER trigger_update_allowed_ips_timestamp
    BEFORE UPDATE ON public.allowed_ips
    FOR EACH ROW
    EXECUTE FUNCTION update_allowed_ips_timestamp();

-- RLS Policies
ALTER TABLE public.allowed_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_access_logs ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem gerenciar IPs
CREATE POLICY "Admins can manage allowed IPs" ON public.allowed_ips
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Todos autenticados podem ler IPs ativos (para verificação)
CREATE POLICY "Authenticated users can read active IPs" ON public.allowed_ips
    FOR SELECT
    USING (is_active = true);

-- Apenas admins podem ver logs
CREATE POLICY "Admins can view access logs" ON public.ip_access_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Sistema pode inserir logs
CREATE POLICY "System can insert access logs" ON public.ip_access_logs
    FOR INSERT
    WITH CHECK (true);

-- Inserir IPs padrão
INSERT INTO public.allowed_ips (ip, description, added_by) VALUES
    ('127.0.0.1', 'Localhost IPv4 - Desenvolvimento', 'system'),
    ('::1', 'Localhost IPv6 - Desenvolvimento', 'system')
ON CONFLICT (ip) DO NOTHING;

-- Comentários nas tabelas
COMMENT ON TABLE public.allowed_ips IS 'Lista de IPs permitidos para acesso ao sistema';
COMMENT ON TABLE public.ip_access_logs IS 'Log de tentativas de acesso por IP';
COMMENT ON COLUMN public.allowed_ips.ip IS 'Endereço IP (IPv4, IPv6 ou localhost)';
COMMENT ON COLUMN public.allowed_ips.expires_at IS 'Data de expiração do acesso (NULL = permanente)';
