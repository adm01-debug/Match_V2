import { Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Layout } from "@/components/layout/Layout";
import { FunilChart } from "@/components/dashboard/FunilChart";
import { VagasUrgentes } from "@/components/dashboard/VagasUrgentes";
import { AcoesPendentes } from "@/components/dashboard/AcoesPendentes";
import { AgendaHoje } from "@/components/dashboard/AgendaHoje";
import { AcoesRapidas } from "@/components/dashboard/AcoesRapidas";
import { SmartInsights } from "@/components/dashboard/SmartInsights";
import { AlertasInteligentes } from "@/components/dashboard/AlertasInteligentes";
import { EntrevistasChart } from "@/components/dashboard/EntrevistasChart";
import { GamificationWidget } from "@/components/gamification/GamificationWidget";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { useGamification } from "@/hooks/useGamification";
import { ErrorBoundary } from 'react-error-boundary';
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from '@/components/dashboard/sections/DashboardHeader';
import { DashboardKPIs } from '@/components/dashboard/sections/DashboardKPIs';

function DashboardErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <Layout title="Dashboard">
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-destructive/10"><AlertCircle className="h-8 w-8 text-destructive" /></div>
            <CardTitle>Erro ao carregar Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <Button onClick={resetErrorBoundary}><RefreshCw className="h-4 w-4 mr-2" />Tentar novamente</Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function DashboardContent() {
  usePageTitle('Dashboard');
  const { resetTour } = useOnboarding();
  const { updateStreak, rewardAction } = useGamification();
  const { kpiData, funilData, vagasUrgentes, acoesPendentes, agendaDia, isLoading } = useDashboardData();

  useEffect(() => { updateStreak(); rewardAction('loginDiario'); }, [updateStreak, rewardAction]);

  if (isLoading) return <Layout title="Dashboard"><div className="p-6 space-y-6"><Skeleton className="h-36 rounded-xl" /><Skeleton className="h-80 rounded-xl" /></div></Layout>;

  const kpis = kpiData || { vagasAbertas: 0, vagasNovas: 0, candidatosTotal: 0, candidatosNovos: 0, emProcesso: 0, vagasEmProcesso: 0, contratadosMes: 0, metaContratacao: 5, tempoMedio: 0, metaTempo: 25 };

  return (
    <Layout title="Dashboard">
      <div className="relative p-6 space-y-8">
        <DashboardHeader resetTour={resetTour} />
        <DashboardKPIs kpis={kpis} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8"><Suspense fallback={<Skeleton className="h-[420px]" />}><FunilChart data={funilData} /></Suspense></div>
          <div className="lg:col-span-4"><Suspense fallback={<Skeleton className="h-[420px]" />}><GamificationWidget /></Suspense></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7"><Suspense fallback={<Skeleton className="h-[380px]" />}><EntrevistasChart /></Suspense></div>
          <div className="lg:col-span-5 space-y-6">
            <Suspense fallback={<Skeleton className="h-44" />}><AcoesRapidas /></Suspense>
            <Suspense fallback={<Skeleton className="h-[200px]" />}><VagasUrgentes vagas={vagasUrgentes} /></Suspense>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Suspense fallback={<Skeleton className="h-80" />}><AgendaHoje agenda={agendaDia} /></Suspense>
          <Suspense fallback={<Skeleton className="h-80" />}><SmartInsights kpiData={kpis} funilData={funilData} /></Suspense>
          <Suspense fallback={<Skeleton className="h-80" />}><AcoesPendentes acoes={acoesPendentes} /></Suspense>
          <Suspense fallback={<Skeleton className="h-80" />}><AlertasInteligentes acoesPendentes={acoesPendentes} vagasUrgentes={vagasUrgentes} /></Suspense>
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
