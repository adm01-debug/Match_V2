-- Adicionando soft delete (deleted_at)
ALTER TABLE public.candidatos ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.processos_seletivos ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.avaliacoes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.entrevistas ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.candidaturas ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.provas ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Adicionando idempotency_key para evitar duplicidade
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS idempotency_key TEXT UNIQUE;
ALTER TABLE public.comunicacoes ADD COLUMN IF NOT EXISTS idempotency_key TEXT UNIQUE;

-- Adicionando flags de segurança em user_roles
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS requires_2fa BOOLEAN DEFAULT FALSE;

-- Marcar admin como exigindo 2FA por padrão (se o papel existir)
UPDATE public.user_roles SET requires_2fa = TRUE WHERE role = 'admin';

-- Função utilitária para filtrar registros não deletados (pode ser usada em views ou RLS)
CREATE OR REPLACE FUNCTION public.is_not_deleted(deleted_at TIMESTAMP WITH TIME ZONE)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Criar índices para performance em queries com soft delete
CREATE INDEX IF NOT EXISTS idx_candidatos_deleted_at ON public.candidatos(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vagas_deleted_at ON public.vagas(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_processos_seletivos_deleted_at ON public.processos_seletivos(deleted_at) WHERE deleted_at IS NULL;
