-- Talent Pool Tables Migration
CREATE TABLE IF NOT EXISTS public.talent_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  criteria JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.talent_pool_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID NOT NULL REFERENCES public.talent_pools(id) ON DELETE CASCADE,
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pool_id, candidato_id)
);

CREATE TABLE IF NOT EXISTS public.candidate_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, name)
);

CREATE TABLE IF NOT EXISTS public.candidate_tag_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.candidate_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidato_id, tag_id)
);

ALTER TABLE public.candidatos ADD COLUMN IF NOT EXISTS in_talent_pool BOOLEAN DEFAULT false;
ALTER TABLE public.candidatos ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

CREATE INDEX idx_talent_pool_members_pool ON public.talent_pool_members(pool_id);
CREATE INDEX idx_talent_pool_members_candidato ON public.talent_pool_members(candidato_id);
CREATE INDEX idx_candidate_tags_tenant ON public.candidate_tags(tenant_id);

ALTER TABLE public.talent_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_pool_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_tag_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view pools" ON public.talent_pools FOR SELECT USING (true);
CREATE POLICY "Users manage pools" ON public.talent_pools FOR ALL USING (true);
CREATE POLICY "Users view pool members" ON public.talent_pool_members FOR SELECT USING (true);
CREATE POLICY "Users manage pool members" ON public.talent_pool_members FOR ALL USING (true);
CREATE POLICY "Users view tags" ON public.candidate_tags FOR SELECT USING (true);
CREATE POLICY "Users manage tags" ON public.candidate_tags FOR ALL USING (true);
CREATE POLICY "Users view tag assignments" ON public.candidate_tag_assignments FOR SELECT USING (true);
CREATE POLICY "Users manage tag assignments" ON public.candidate_tag_assignments FOR ALL USING (true);
