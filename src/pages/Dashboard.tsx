import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Layout } from "@/components/layout/Layout";
import { KPICard } from "@/components/dashboard/KPICard";
import { FunilChart } from "@/components/dashboard/FunilChart";
import { VagasUrgentes } from "@/components/dashboard/VagasUrgentes";
import { AcoesPendentes } from "@/components/dashboard/AcoesPendentes";
import { AgendaHoje } from "@/components/dashboard/AgendaHoje";
import { AcoesRapidas } from "@/components/dashboard/AcoesRapidas";
import { SmartInsights } from "@/components/dashboard/SmartInsights";
import { AlertasInteligentes } from "@/components/dashboard/AlertasInteligentes";
import { TopCandidatos } from "@/components/dashboard/TopCandidatos";
import { EntrevistasStats } from "@/components/dashboard/EntrevistasStats";
import { EntrevistasChart } from "@/components/dashboard/EntrevistasChart";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { ErrorBoundary } from 'react-error-boundary';
import { 
  Briefcase, 
  Users, 
  Target, 
  UserCheck, 
  AlertCircle, 
  RefreshCw,
  Sparkles,
  Calendar,
  Activity,
  LayoutDashboard,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function DashboardErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <Layout title="Dashboard">
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <Card variant="glass" className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Erro ao carregar Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Ocorreu um erro ao carregar os dados do dashboard. Tente recarregar.
            </p>
            <details className="text-xs bg-muted/50 p-3 rounded-lg">
              <summary className="cursor-pointer font-medium">Detalhes técnicos</summary>
              <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-32 text-destructive">
                {error.message}
              </pre>
            </details>
            <div className="flex gap-2 justify-center">
              <Button onClick={resetErrorBoundary} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function DashboardContent() {
  usePageTitle('Dashboard');
  const { resetTour } = useOnboarding();
  const { 
    kpiData, 
    funilData, 
    vagasUrgentes, 
    acoesPendentes, 
    agendaDia,
    processos,
    isLoading 
  } = useDashboardData();

  if (isLoading) {
    return (
      <Layout title="Dashboard">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  const kpis = kpiData || {
    vagasAbertas: 0,
    vagasNovas: 0,
    candidatosTotal: 0,
    candidatosNovos: 0,
    emProcesso: 0,
    vagasEmProcesso: 0,
    contratadosMes: 0,
    metaContratacao: 5,
    tempoMedio: 0,
    metaTempo: 25,
  };

  return (
    <Layout title="Dashboard">
      <div className="relative min-h-screen">
        {/* Premium animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)" }}
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.12) 0%, transparent 70%)" }}
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, 30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] rounded-full blur-[80px]"
            style={{ background: "radial-gradient(circle, hsl(var(--success) / 0.1) 0%, transparent 70%)" }}
            animate={{ 
              scale: [1, 1.3, 1],
              y: [0, -40, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        <motion.div 
          className="relative p-6 space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Premium Glassmorphism Header */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, stiffness: 200, damping: 20 }}
            className="relative"
          >
            {/* Header glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 blur-3xl opacity-40 -z-10" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/30 shadow-2xl">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-4 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent shadow-lg shadow-primary/25"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <LayoutDashboard className="h-7 w-7 text-white" />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text">
                        Dashboard
                      </h1>
                      <Badge className="bg-gradient-to-r from-primary/90 to-accent/90 text-white border-0 shadow-lg shadow-primary/20 gap-1.5 px-3 py-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        IA Ativa
                      </Badge>
                    </div>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Activity className="h-4 w-4 text-primary animate-pulse" />
                      Visão geral do recrutamento • Atualizado em tempo real
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Period selector with glassmorphism */}
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-background/50 backdrop-blur-md border border-border/40">
                  <Calendar className="h-4 w-4 text-muted-foreground ml-2" />
                  <Select defaultValue="30">
                    <SelectTrigger className="w-40 border-0 bg-transparent focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
                      <SelectItem value="7">Últimos 7 dias</SelectItem>
                      <SelectItem value="30">Últimos 30 dias</SelectItem>
                      <SelectItem value="90">Últimos 90 dias</SelectItem>
                      <SelectItem value="365">Este ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={resetTour}
                        className="h-11 w-11 bg-background/50 backdrop-blur-md border-border/40 hover:bg-primary/10 hover:border-primary/40 transition-all"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ver tour do sistema</p>
                  </TooltipContent>
                </Tooltip>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-11 w-11 bg-background/50 backdrop-blur-md border-border/40 hover:bg-primary/10 hover:border-primary/40 transition-all"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Premium KPIs Grid with Glass Effect & Data Visualization */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: 'spring' as const, stiffness: 200, damping: 20 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            <Suspense fallback={<Skeleton className="h-44 rounded-2xl" />}>
              <KPICard
                title="Vagas Abertas"
                value={kpis.vagasAbertas}
                subtitle={`+${kpis.vagasNovas} novas este mês`}
                icon={Briefcase}
                variant="primary"
                trend={kpis.vagasNovas > 0 ? { value: `+${kpis.vagasNovas}`, positive: true } : undefined}
                index={0}
                sparklineData={[12, 15, 18, 14, 22, 19, kpis.vagasAbertas]}
                previousValue={Math.max(1, kpis.vagasAbertas - kpis.vagasNovas)}
              />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-44 rounded-2xl" />}>
              <KPICard
                title="Candidatos"
                value={kpis.candidatosTotal}
                subtitle={`+${kpis.candidatosNovos} novos este mês`}
                icon={Users}
                variant="primary"
                trend={kpis.candidatosNovos > 0 ? { value: `+${kpis.candidatosNovos}`, positive: true } : undefined}
                index={1}
                sparklineData={[45, 52, 48, 61, 58, 72, kpis.candidatosTotal]}
                previousValue={Math.max(1, kpis.candidatosTotal - kpis.candidatosNovos)}
              />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-44 rounded-2xl" />}>
              <KPICard
                title="Em Processo"
                value={kpis.emProcesso}
                subtitle={`${kpis.vagasEmProcesso} vagas em seleção`}
                icon={Target}
                variant="warning"
                index={2}
                sparklineData={[28, 32, 35, 30, 38, 42, kpis.emProcesso]}
              />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-44 rounded-2xl" />}>
              <KPICard
                title="Contratados"
                value={kpis.contratadosMes}
                subtitle={`${Math.round((kpis.contratadosMes / Math.max(kpis.metaContratacao, 1)) * 100)}% da meta`}
                icon={UserCheck}
                variant="success"
                trend={{ value: `${Math.round((kpis.contratadosMes / Math.max(kpis.metaContratacao, 1)) * 100)}%`, positive: true }}
                index={3}
                goalProgress={Math.round((kpis.contratadosMes / Math.max(kpis.metaContratacao, 1)) * 100)}
                sparklineData={[1, 2, 2, 3, 4, 3, kpis.contratadosMes]}
                previousValue={Math.max(1, kpis.contratadosMes - 1)}
              />
            </Suspense>
          </motion.div>

          {/* Main Content Grid with Enhanced Cards */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, type: 'spring' as const, stiffness: 200, damping: 20 }}
              className="xl:col-span-2 space-y-6"
            >
              <Suspense fallback={<Skeleton className="h-[400px] rounded-2xl" />}>
                <FunilChart data={funilData} />
              </Suspense>
              
              <Suspense fallback={<Skeleton className="h-[350px] rounded-2xl" />}>
                <EntrevistasChart />
              </Suspense>
            </motion.div>

            {/* Right Column - 1/3 width */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, type: 'spring' as const, stiffness: 200, damping: 20 }}
              className="space-y-6"
            >
              <Suspense fallback={<Skeleton className="h-48 rounded-2xl" />}>
                <AcoesRapidas />
              </Suspense>
              
              <Suspense fallback={<Skeleton className="h-64 rounded-2xl" />}>
                <VagasUrgentes vagas={vagasUrgentes} />
              </Suspense>
              
              <Suspense fallback={<Skeleton className="h-48 rounded-2xl" />}>
                <AcoesPendentes acoes={acoesPendentes} />
              </Suspense>
            </motion.div>
          </div>

          {/* Bottom Section - Insights & Alerts with Glass Effect */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, type: 'spring' as const, stiffness: 200, damping: 20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <Suspense fallback={<Skeleton className="h-72 rounded-2xl" />}>
              <AgendaHoje agenda={agendaDia} />
            </Suspense>
            
            <Suspense fallback={<Skeleton className="h-72 rounded-2xl" />}>
              <SmartInsights kpiData={kpis} funilData={funilData} />
            </Suspense>
            
            <Suspense fallback={<Skeleton className="h-72 rounded-2xl" />}>
              <AlertasInteligentes acoesPendentes={acoesPendentes} vagasUrgentes={vagasUrgentes} />
            </Suspense>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, type: 'spring' as const, stiffness: 200, damping: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
              <TopCandidatos processos={processos} />
            </Suspense>
            
            <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
              <EntrevistasStats />
            </Suspense>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}

export default function Dashboard() {
  return (
    <ErrorBoundary FallbackComponent={DashboardErrorFallback}>
      <DashboardContent />
    </ErrorBoundary>
  );
}
