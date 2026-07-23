import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MapPin, Briefcase, Building2, ExternalLink, Linkedin, Instagram, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Branding {
  id: string;
  slug: string;
  nome: string;
  tagline: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  cor_primaria: string | null;
  cor_secundaria: string | null;
  sobre: string | null;
  website: string | null;
  linkedin: string | null;
  instagram: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

interface Vaga {
  id: string;
  titulo: string;
  departamento: string | null;
  cidade: string | null;
  estado: string | null;
  modalidade: string | null;
  tipo_contrato: string | null;
  data_publicacao: string | null;
}

export default function CarreirasPage() {
  const { slug = 'people-lovers' } = useParams<{ slug: string }>();

  const { data: branding, isLoading: loadingBrand } = useQuery({
    queryKey: ['empresa-branding', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresa_branding')
        .select('*')
        .eq('slug', slug)
        .eq('ativo', true)
        .maybeSingle();
      if (error) throw error;
      return data as Branding | null;
    },
  });

  const { data: vagas, isLoading: loadingVagas } = useQuery({
    queryKey: ['carreiras-vagas', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vagas')
        .select('id,titulo,departamento,cidade,estado,modalidade,tipo_contrato,data_publicacao')
        .eq('status', 'publicada')
        .is('deleted_at', null)
        .order('data_publicacao', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Vaga[];
    },
  });

  const departamentos = useMemo(() => {
    const set = new Set<string>();
    vagas?.forEach((v) => v.departamento && set.add(v.departamento));
    return Array.from(set);
  }, [vagas]);

  useEffect(() => {
    if (!branding) return;
    document.title = branding.seo_title ?? `Carreiras — ${branding.nome}`;
    const desc = branding.seo_description ?? branding.tagline ?? '';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
  }, [branding]);

  const themeStyle = useMemo(
    () =>
      branding
        ? ({
            '--brand-primary': branding.cor_primaria ?? '#6366f1',
            '--brand-secondary': branding.cor_secundaria ?? '#8b5cf6',
          } as React.CSSProperties)
        : {},
    [branding],
  );

  if (loadingBrand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!branding) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">Página de carreiras não encontrada</h1>
        <p className="text-muted-foreground">O link acessado não existe ou foi desativado.</p>
        <Link to="/"><Button>Ir para o início</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={themeStyle}>
      {/* Hero */}
      <header
        className="relative overflow-hidden border-b"
        style={{
          background: `linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)`,
        }}
      >
        {branding.hero_image_url && (
          <img
            src={branding.hero_image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        )}
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center text-white gap-6 max-w-3xl mx-auto">
            {branding.logo_url && (
              <img src={branding.logo_url} alt={branding.nome} className="h-16 w-auto" />
            )}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{branding.nome}</h1>
            {branding.tagline && (
              <p className="text-lg md:text-xl text-white/90">{branding.tagline}</p>
            )}
            <div className="flex gap-3 pt-2">
              <Button asChild size="lg" variant="secondary">
                <a href="#vagas">Ver vagas abertas</a>
              </Button>
              {branding.website && (
                <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white/40 hover:bg-white/10">
                  <a href={branding.website} target="_blank" rel="noreferrer">
                    Nosso site <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sobre */}
      {branding.sobre && (
        <section className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Sobre nós</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{branding.sobre}</p>
          <div className="flex gap-4 mt-6 text-muted-foreground">
            {branding.website && (
              <a href={branding.website} target="_blank" rel="noreferrer" aria-label="Website">
                <Globe className="h-5 w-5 hover:text-primary transition-colors" />
              </a>
            )}
            {branding.linkedin && (
              <a href={branding.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 hover:text-primary transition-colors" />
              </a>
            )}
            {branding.instagram && (
              <a href={branding.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 hover:text-primary transition-colors" />
              </a>
            )}
          </div>
        </section>
      )}

      {/* Vagas */}
      <section id="vagas" className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold">Vagas abertas</h2>
            <p className="text-muted-foreground mt-1">
              {loadingVagas ? 'Carregando…' : `${vagas?.length ?? 0} oportunidades disponíveis`}
            </p>
          </div>
          {departamentos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {departamentos.slice(0, 6).map((d) => (
                <Badge key={d} variant="secondary">{d}</Badge>
              ))}
            </div>
          )}
        </div>

        {loadingVagas ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : vagas && vagas.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vagas.map((v) => (
              <Card key={v.id} className="hover:shadow-lg transition-shadow group">
                <CardContent className="p-6 flex flex-col gap-3 h-full">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                      {v.titulo}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {v.departamento && (
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-3 w-3" /> {v.departamento}
                      </span>
                    )}
                    {(v.cidade || v.estado) && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {[v.cidade, v.estado].filter(Boolean).join(', ')}
                      </span>
                    )}
                    {v.modalidade && (
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> {v.modalidade}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {v.tipo_contrato && <Badge variant="outline">{v.tipo_contrato}</Badge>}
                  </div>
                  <div className="mt-auto pt-4">
                    <Button asChild className="w-full" style={{ backgroundColor: 'var(--brand-primary)' }}>
                      <Link to={`/portal?vaga=${v.id}`}>Candidatar-se</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              Nenhuma vaga aberta no momento. Volte em breve!
            </CardContent>
          </Card>
        )}
      </section>

      <footer className="border-t mt-16 py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} {branding.nome}. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
