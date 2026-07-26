/**
 * @fileoverview Advanced Analytics Dashboard
 * @module AdvancedAnalyticsPage
 */

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Users, Target, TrendingUp, Calendar, Download, BarChart3, Activity, Award, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalyticsPerformanceTab } from '@/components/analytics/AnalyticsPerformanceTab';
import { AnalyticsSourcesTab } from '@/components/analytics/AnalyticsSourcesTab';
import { AnalyticsFunnelTab } from '@/components/analytics/AnalyticsFunnelTab';
import { AnalyticsQualityTab } from '@/components/analytics/AnalyticsQualityTab';
import { FunnelSlaTab } from '@/components/analytics/FunnelSlaTab';

import { useAdvancedAnalytics, type AnalyticsPeriodo } from '@/hooks/useAdvancedAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdvancedAnalyticsPage() {
  usePageTitle('Analytics Avançado');
  const [periodo, setPeriodo] = useState<AnalyticsPeriodo>('6m');
  const { data, isLoading } = useAdvancedAnalytics(periodo);

  const kpis = data?.kpis;
  const fmt = (v: number | null | undefined, sufixo = '') =>
    v === null || v === undefined ? 'N/D' : `${v}${sufixo}`;

  const kpiItems = [
    { icon: Clock, color: 'text-info', label: 'Time to Hire', value: fmt(kpis?.timeToHire, ' dias') },
    { icon: Target, color: 'text-accent', label: 'Aceite de Proposta', value: fmt(kpis?.offerAcceptance, '%') },
    { icon: Award, color: 'text-warning', label: 'Quality of Hire', value: fmt(kpis?.qualityOfHire, '%') },
    { icon: TrendingUp, color: 'text-success', label: 'Match Médio', value: fmt(kpis?.matchMedio, '%') },
    { icon: Users, color: 'text-accent', label: 'Taxa de Contratação', value: fmt(kpis?.taxaContratacao, '%') },
    { icon: Globe, color: 'text-info', label: 'Entrevistas Realizadas', value: fmt(kpis?.entrevistasRealizadas) },
  ];

  return (
    <Layout title="Analytics Avançado">
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="h-7 w-7 text-primary" />Analytics Avançado</h1>
            <p className="text-muted-foreground">Métricas estratégicas de recrutamento</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={periodo} onValueChange={(v) => setPeriodo(v as AnalyticsPeriodo)}>
              <SelectTrigger className="w-40"><Calendar className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="3m">Últimos 3 meses</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="1y">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpiItems.map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className={cn("h-5 w-5", kpi.color)} />
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold">{kpi.value}</p>
                )}
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="performance">
          <TabsList className="mb-4">
            <TabsTrigger value="performance"><Activity className="h-4 w-4 mr-2" />Performance</TabsTrigger>
            <TabsTrigger value="sources"><Globe className="h-4 w-4 mr-2" />Fontes</TabsTrigger>
            <TabsTrigger value="funnel"><Target className="h-4 w-4 mr-2" />Funil</TabsTrigger>
            <TabsTrigger value="sla"><Clock className="h-4 w-4 mr-2" />SLA de Resposta</TabsTrigger>
            <TabsTrigger value="quality"><Award className="h-4 w-4 mr-2" />Qualidade</TabsTrigger>
          </TabsList>
          <TabsContent value="performance"><AnalyticsPerformanceTab timeToHireData={data?.timeToHireData ?? []} costPerHireData={data?.costPerHireData ?? []} departmentData={data?.departmentPerformanceData ?? []} /></TabsContent>
          <TabsContent value="sources"><AnalyticsSourcesTab data={data?.sourceEffectivenessData ?? []} /></TabsContent>
          <TabsContent value="funnel"><AnalyticsFunnelTab data={data?.conversionFunnelData ?? []} /></TabsContent>
          <TabsContent value="sla"><FunnelSlaTab /></TabsContent>
          <TabsContent value="quality"><AnalyticsQualityTab data={data?.qualityOfHireData ?? []} /></TabsContent>
        </Tabs>

      </div>
    </Layout>
  );
}
