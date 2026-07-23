
CREATE TABLE public.empresa_branding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  tagline TEXT,
  logo_url TEXT,
  hero_image_url TEXT,
  cor_primaria TEXT DEFAULT '#6366f1',
  cor_secundaria TEXT DEFAULT '#8b5cf6',
  sobre TEXT,
  website TEXT,
  linkedin TEXT,
  instagram TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_empresa_branding_slug ON public.empresa_branding(slug) WHERE ativo = true;

GRANT SELECT ON public.empresa_branding TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.empresa_branding TO authenticated;
GRANT ALL ON public.empresa_branding TO service_role;

ALTER TABLE public.empresa_branding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Branding público visível para todos"
  ON public.empresa_branding FOR SELECT
  USING (ativo = true);

CREATE POLICY "Admins gerenciam branding"
  ON public.empresa_branding FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_empresa_branding_updated_at
  BEFORE UPDATE ON public.empresa_branding
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed padrão
INSERT INTO public.empresa_branding (slug, nome, tagline, sobre, seo_title, seo_description)
VALUES (
  'people-lovers',
  'People Lovers',
  'Onde os melhores talentos encontram grandes oportunidades',
  'Somos apaixonados por conectar pessoas às empresas certas. Nossa missão é transformar recrutamento em uma experiência memorável para candidatos e recrutadores.',
  'Vagas Abertas | People Lovers - Carreiras',
  'Explore vagas em aberto na People Lovers. Encontre a oportunidade certa para acelerar sua carreira.'
);
