-- Migration: LGPD Compliance Tables
-- Creates tables for consent management, data deletion requests, and access logs

-- User Consents Table
CREATE TABLE IF NOT EXISTS public.user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    marketing BOOLEAN DEFAULT false,
    analytics BOOLEAN DEFAULT false,
    third_party BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Data Deletion Requests
CREATE TABLE IF NOT EXISTS public.data_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    processed_by UUID REFERENCES auth.users(id)
);

-- Data Access Logs (for audit)
CREATE TABLE IF NOT EXISTS public.data_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    access_type TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_consents_user ON public.user_consents(user_id);
CREATE INDEX idx_deletion_requests_user ON public.data_deletion_requests(user_id);
CREATE INDEX idx_deletion_requests_status ON public.data_deletion_requests(status);
CREATE INDEX idx_data_access_logs_user ON public.data_access_logs(user_id);
CREATE INDEX idx_data_access_logs_date ON public.data_access_logs(accessed_at);

-- RLS
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own consents" ON public.user_consents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own deletion requests" ON public.data_deletion_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create deletion requests" ON public.data_deletion_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own access logs" ON public.data_access_logs FOR SELECT USING (auth.uid() = user_id);

-- Add deleted_at to profiles for soft delete
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

GRANT ALL ON public.user_consents TO authenticated;
GRANT ALL ON public.data_deletion_requests TO authenticated;
GRANT SELECT, INSERT ON public.data_access_logs TO authenticated;
