import { Suspense } from 'react';
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
import { Briefcase, Users, Target, UserCheck, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-xl">Erro ao carregar Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Ocorreu um erro ao carregar os dados do dashboard. Tente recarregar.
            </p>
            <details className="text-xs bg-muted p-2 rounded">
              <summary className="cursor-pointer font-medium">Detalhes</summary>
              <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-32">
                {error.message}
              </pre>
            </details>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={resetErrorBoundary}>
                <RefreshCw className="h-4 w-4 mr-2" />
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
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
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
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do recrutamento</p>
          </div>
          <Select defaultValue="30">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Suspense fallback={<Skeleton className="h-32" />}>
            <KPICard
              title="Vagas Abertas"
              value={kpis.vagasAbertas}
              subtitle={`${kpis.vagasNovas} novas este mês`}
              icon={Briefcase}
              variant="primary"
            />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-32" />}>
            <KPICard
              title="Candidatos"
              value={kpis.candidatosTotal}
              subtitle={`${kpis.candidatosNovos} novos este mês`}
              icon={Users}
              variant="success"
            />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-32" />}>
            <KPICard
              title="Em Processo"
              value={kpis.emProcesso}
              subtitle={`${kpis.vagasEmProcesso} vagas em seleção`}
              icon={Target}
              variant="warning"
            />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-32" />}>
            <KPICard
              title="Contratados"
              value={kpis.contratadosMes}
              subtitle={`${Math.round((kpis.contratadosMes / Math.max(kpis.metaContratacao, 1)) * 100)}% da meta`}
              icon={UserCheck}
              variant="success"
            />
          </Suspense>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<Skeleton className="h-80" />}>
              <FunilChart data={funilData} />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-64" />}>
              <EntrevistasChart />
            </Suspense>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Suspense fallback={<Skeleton className="h-48" />}>
              <AcoesRapidas />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-64" />}>
              <VagasUrgentes vagas={vagasUrgentes} />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-48" />}>
              <AcoesPendentes acoes={acoesPendentes} />
            </Suspense>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <AgendaHoje agenda={agendaDia} />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-64" />}>
            <SmartInsights kpiData={kpis} funilData={funilData} />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-64" />}>
            <AlertasInteligentes acoesPendentes={acoesPendentes} vagasUrgentes={vagasUrgentes} />
          </Suspense>
        </div>

        {/* More Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<Skeleton className="h-80" />}>
            <TopCandidatos processos={processos} />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-80" />}>
            <EntrevistasStats />
          </Suspense>
        </div>
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
