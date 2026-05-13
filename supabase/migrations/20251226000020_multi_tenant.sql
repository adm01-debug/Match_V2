-- Multi-tenant System
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
  owner_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.tenant_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add tenant_id to main tables (to be applied gradually)
-- ALTER TABLE public.candidatos ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
-- ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);

CREATE INDEX idx_tenant_members_tenant ON public.tenant_members(tenant_id);
CREATE INDEX idx_tenant_members_user ON public.tenant_members(user_id);
CREATE INDEX idx_tenant_invitations_tenant ON public.tenant_invitations(tenant_id);
CREATE INDEX idx_tenant_invitations_email ON public.tenant_invitations(email);

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tenants" ON public.tenants FOR SELECT 
  USING (id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()));

CREATE POLICY "Owners can update tenants" ON public.tenants FOR UPDATE 
  USING (owner_id = auth.uid());

CREATE POLICY "Users can view own memberships" ON public.tenant_members FOR SELECT 
  USING (user_id = auth.uid() OR tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')));

CREATE POLICY "Admins can manage members" ON public.tenant_members FOR ALL 
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')));

CREATE POLICY "View invitations" ON public.tenant_invitations FOR SELECT 
  USING (tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')));
