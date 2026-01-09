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
import { ErrorBoundary } from 'react-error-boundary';
import { 
  Briefcase, 
  Users, 
  Target, 
  UserCheck, 
  AlertCircle, 
  RefreshCw,
  Sparkles,
  Calendar
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
      <div className="relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-success/5 rounded-full blur-3xl" />
        </div>

        <motion.div 
          className="relative p-6 space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Premium Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
                  Dashboard
                </h1>
                <Badge variant="glass-primary" size="sm" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  IA Ativa
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Visão geral do recrutamento • Atualizado agora
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Select defaultValue="30">
                <SelectTrigger className="w-44 bg-card/50 backdrop-blur-sm border-border/50">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                  <SelectItem value="365">Este ano</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" className="bg-card/50 backdrop-blur-sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* KPIs Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring' as const, stiffness: 300, damping: 24 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Suspense fallback={<Skeleton className="h-36 rounded-xl" />}>
              <KPICard
                title="Vagas Abertas"
                value={kpis.vagasAbertas}
                subtitle={`+${kpis.vagasNovas} novas este mês`}
                icon={Briefcase}
                variant="primary"
                trend={kpis.vagasNovas > 0 ? { value: `+${kpis.vagasNovas}`, positive: true } : undefined}
              />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-36 rounded-xl" />}>
              <KPICard
                title="Candidatos"
                value={kpis.candidatosTotal}
                subtitle={`+${kpis.candidatosNovos} novos este mês`}
                icon={Users}
                variant="primary"
                trend={kpis.candidatosNovos > 0 ? { value: `+${kpis.candidatosNovos}`, positive: true } : undefined}
              />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-36 rounded-xl" />}>
              <KPICard
                title="Em Processo"
                value={kpis.emProcesso}
                subtitle={`${kpis.vagasEmProcesso} vagas em seleção`}
                icon={Target}
                variant="warning"
              />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-36 rounded-xl" />}>
              <KPICard
                title="Contratados"
                value={kpis.contratadosMes}
                subtitle={`${Math.round((kpis.contratadosMes / Math.max(kpis.metaContratacao, 1)) * 100)}% da meta`}
                icon={UserCheck}
                variant="success"
                trend={{ value: `${Math.round((kpis.contratadosMes / Math.max(kpis.metaContratacao, 1)) * 100)}%`, positive: true }}
              />
            </Suspense>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: 'spring' as const, stiffness: 300, damping: 24 }}
              className="xl:col-span-2 space-y-6"
            >
              <Suspense fallback={<Skeleton className="h-[400px] rounded-xl" />}>
                <FunilChart data={funilData} />
              </Suspense>
              
              <Suspense fallback={<Skeleton className="h-[350px] rounded-xl" />}>
                <EntrevistasChart />
              </Suspense>
            </motion.div>

            {/* Right Column - 1/3 width */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, type: 'spring' as const, stiffness: 300, damping: 24 }}
              className="space-y-6"
            >
              <Suspense fallback={<Skeleton className="h-48 rounded-xl" />}>
                <AcoesRapidas />
              </Suspense>
              
              <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
                <VagasUrgentes vagas={vagasUrgentes} />
              </Suspense>
              
              <Suspense fallback={<Skeleton className="h-48 rounded-xl" />}>
                <AcoesPendentes acoes={acoesPendentes} />
              </Suspense>
            </motion.div>
          </div>

          {/* Bottom Section - Insights & Alerts */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: 'spring' as const, stiffness: 300, damping: 24 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <Suspense fallback={<Skeleton className="h-72 rounded-xl" />}>
              <AgendaHoje agenda={agendaDia} />
            </Suspense>
            
            <Suspense fallback={<Skeleton className="h-72 rounded-xl" />}>
              <SmartInsights kpiData={kpis} funilData={funilData} />
            </Suspense>
            
            <Suspense fallback={<Skeleton className="h-72 rounded-xl" />}>
              <AlertasInteligentes acoesPendentes={acoesPendentes} vagasUrgentes={vagasUrgentes} />
            </Suspense>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: 'spring' as const, stiffness: 300, damping: 24 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
              <TopCandidatos processos={processos} />
            </Suspense>
            
            <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
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
