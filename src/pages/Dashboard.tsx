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
import { Briefcase, Users, Target, UserCheck, Clock, Loader2, AlertCircle, RefreshCw } from "lucide-react";
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
    <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-64" /></div>}>
      <Layout title="Dashboard">
        <div className="p-6 space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Visão Geral</h2>
              <p className="text-muted-foreground">
                Acompanhe o processo de recrutamento em tempo real
              </p>
            </div>
            <Select defaultValue="dez">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dez">Dezembro 2025</SelectItem>
                <SelectItem value="nov">Novembro 2025</SelectItem>
                <SelectItem value="out">Outubro 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-lg" />
              ))
            ) : (
              <>
                <KPICard
                  title="Vagas Abertas"
                  value={kpis.vagasAbertas}
                  subtitle={`+${kpis.vagasNovas} novas`}
                  icon={Briefcase}
                  variant="primary"
                />
                <KPICard
                  title="Candidatos Total"
                  value={kpis.candidatosTotal}
                  subtitle={`+${kpis.candidatosNovos} este mês`}
                  icon={Users}
                  trend={{ value: `+${kpis.candidatosNovos}`, positive: true }}
                  variant="default"
                />
                <KPICard
                  title="Em Processo"
                  value={kpis.emProcesso}
                  subtitle={`em ${kpis.vagasEmProcesso} vagas`}
                  icon={Target}
                  variant="warning"
                />
                <KPICard
                  title="Contratados no Mês"
                  value={kpis.contratadosMes}
                  subtitle={`meta: ${kpis.metaContratacao}`}
                  icon={UserCheck}
                  variant="success"
                />
                <KPICard
                  title="Tempo Médio"
                  value={kpis.tempoMedio > 0 ? `${kpis.tempoMedio} dias` : '-'}
                  subtitle={`meta: ${kpis.metaTempo}`}
                  icon={Clock}
                  variant={kpis.tempoMedio > kpis.metaTempo ? "danger" : "success"}
                />
              </>
            )}
          </div>

          {/* Insights e Alertas Inteligentes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SmartInsights kpiData={kpis} funilData={funilData} />
            <AlertasInteligentes acoesPendentes={acoesPendentes} vagasUrgentes={vagasUrgentes} />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FunilChart data={funilData} />
            </div>
            <div>
              <TopCandidatos processos={processos} />
            </div>
          </div>

          {/* Entrevistas Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EntrevistasChart />
            </div>
            <div>
              <EntrevistasStats />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VagasUrgentes vagas={vagasUrgentes} />
            </div>
            <div>
              <AgendaHoje agenda={agendaDia} />
            </div>
          </div>

          {/* Ações Pendentes Row */}
          <div className="grid grid-cols-1 gap-6">
            <AcoesPendentes acoes={acoesPendentes} />
          </div>

          {/* Ações Rápidas */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Ações Rápidas</h3>
            <AcoesRapidas />
          </div>
        </div>
      </Layout>
    </Suspense>
  );
}

export default function Dashboard() {
  return (
    <ErrorBoundary FallbackComponent={DashboardErrorFallback}>
      <DashboardContent />
    </ErrorBoundary>
  );
}

