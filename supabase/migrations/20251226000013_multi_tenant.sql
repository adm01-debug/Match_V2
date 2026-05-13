-- Multi-tenant Architecture Migration
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
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

CREATE TABLE IF NOT EXISTS public.tenant_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tenant_members_tenant ON public.tenant_members(tenant_id);
CREATE INDEX idx_tenant_members_user ON public.tenant_members(user_id);
CREATE INDEX idx_tenants_slug ON public.tenants(slug);

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own tenants" ON public.tenants FOR SELECT USING (
  id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())
);

CREATE POLICY "Members view tenant members" ON public.tenant_members FOR SELECT USING (
  tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())
);

CREATE POLICY "Admins manage members" ON public.tenant_members FOR ALL USING (
  tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
);

CREATE OR REPLACE FUNCTION create_default_tenant() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.tenants (name, slug) VALUES (NEW.email, REPLACE(SPLIT_PART(NEW.email, '@', 1), '.', '-') || '-' || SUBSTR(NEW.id::text, 1, 8));
  INSERT INTO public.tenant_members (tenant_id, user_id, role) VALUES ((SELECT id FROM public.tenants ORDER BY created_at DESC LIMIT 1), NEW.id, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
