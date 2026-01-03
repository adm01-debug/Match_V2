import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Briefcase, 
  BarChart3, 
  Zap, 
  ArrowRight,
  Target,
  Clock,
  Shield,
  Sparkles
} from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

const features = [
  {
    icon: Users,
    title: 'Gestão de Candidatos',
    description: 'Organize e acompanhe todos os candidatos em um pipeline visual intuitivo.'
  },
  {
    icon: Briefcase,
    title: 'Vagas Centralizadas',
    description: 'Crie, publique e gerencie vagas com requisitos detalhados e triagem automática.'
  },
  {
    icon: BarChart3,
    title: 'Analytics Avançado',
    description: 'Dashboards em tempo real com métricas de conversão e performance.'
  },
  {
    icon: Zap,
    title: 'Match Inteligente',
    description: 'IA que analisa currículos e sugere os melhores candidatos para cada vaga.'
  }
];

const benefits = [
  { icon: Clock, text: 'Reduza o tempo de contratação em até 60%' },
  { icon: Target, text: 'Aumente a qualidade das contratações' },
  { icon: Shield, text: 'Dados protegidos com segurança enterprise' },
  { icon: Sparkles, text: 'Interface moderna e fácil de usar' }
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">{APP_NAME}</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Benefícios
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="sm" className="gradient-primary">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Plataforma completa de recrutamento</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Recrute os
              <span className="text-gradient"> melhores talentos</span>
              <br />com inteligência
            </h1>
            
            <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground md:text-xl">
              O sistema ATS que transforma seu processo seletivo. 
              Pipeline visual, match inteligente e analytics em tempo real.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="gradient-primary gap-2 px-8 text-base">
                  Começar Agora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="px-8 text-base">
                  Já tenho conta
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: '500+', label: 'Empresas' },
                { value: '50k+', label: 'Candidatos' },
                { value: '95%', label: 'Satisfação' },
                { value: '60%', label: 'Mais Rápido' }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-gradient md:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border bg-card/50 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Tudo que você precisa para
              <span className="text-gradient"> recrutar melhor</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Ferramentas poderosas para cada etapa do seu processo seletivo
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Por que escolher o
                <span className="text-gradient"> {APP_NAME}</span>?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Simplifique seu processo de recrutamento e contrate os melhores 
                profissionais com mais agilidade e assertividade.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit.text} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                      <benefit.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="gradient-primary gap-2">
                    Experimente Grátis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual representation */}
            <div className="relative">
              <div className="aspect-square rounded-2xl border border-border bg-card p-8 shadow-soft">
                <div className="grid h-full grid-cols-2 gap-4">
                  {[
                    { label: 'Novos', value: '24', color: 'bg-stage-novo' },
                    { label: 'Em Triagem', value: '18', color: 'bg-stage-triagem' },
                    { label: 'Entrevista', value: '12', color: 'bg-stage-entrevista' },
                    { label: 'Aprovados', value: '8', color: 'bg-stage-aprovado' }
                  ].map((item) => (
                    <div 
                      key={item.label}
                      className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-4"
                    >
                      <div className={`mb-2 h-3 w-3 rounded-full ${item.color}`} />
                      <div className="text-2xl font-bold">{item.value}</div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-xl bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-xl bg-accent/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Pronto para transformar seu
              <span className="text-gradient"> recrutamento</span>?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Comece agora mesmo e veja a diferença que um ATS moderno pode fazer.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gradient-primary gap-2 px-8 text-base">
                Criar Conta Grátis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md gradient-primary">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">{APP_NAME}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
