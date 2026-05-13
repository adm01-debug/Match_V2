-- Migration: Add 2FA Support
-- Date: 2025-12-26
-- Description: Creates table for storing 2FA secrets and backup codes

-- Create user_2fa table
CREATE TABLE IF NOT EXISTS public.user_2fa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    secret TEXT NOT NULL,
    backup_codes TEXT[] DEFAULT '{}',
    enabled BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_2fa_user_id ON public.user_2fa(user_id);
CREATE INDEX IF NOT EXISTS idx_user_2fa_enabled ON public.user_2fa(enabled);

-- Enable RLS
ALTER TABLE public.user_2fa ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own 2FA settings"
    ON public.user_2fa
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own 2FA settings"
    ON public.user_2fa
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own 2FA settings"
    ON public.user_2fa
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own 2FA settings"
    ON public.user_2fa
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create 2FA verification logs table
CREATE TABLE IF NOT EXISTS public.user_2fa_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('setup', 'verify', 'disable', 'backup_used')),
    ip_address TEXT,
    user_agent TEXT,
    success BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for logs
CREATE INDEX IF NOT EXISTS idx_user_2fa_logs_user_id ON public.user_2fa_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_2fa_logs_created_at ON public.user_2fa_logs(created_at);

-- Enable RLS for logs
ALTER TABLE public.user_2fa_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for logs
CREATE POLICY "Users can view own 2FA logs"
    ON public.user_2fa_logs
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert 2FA logs"
    ON public.user_2fa_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_user_2fa_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_2fa_updated_at
    BEFORE UPDATE ON public.user_2fa
    FOR EACH ROW
    EXECUTE FUNCTION update_user_2fa_updated_at();

-- Grant permissions
GRANT ALL ON public.user_2fa TO authenticated;
GRANT ALL ON public.user_2fa_logs TO authenticated;

COMMENT ON TABLE public.user_2fa IS 'Stores 2FA secrets and backup codes for users';
COMMENT ON TABLE public.user_2fa_logs IS 'Audit log for 2FA-related actions';
