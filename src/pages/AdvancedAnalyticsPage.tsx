/**
 * @fileoverview Advanced Analytics Dashboard
 * @module AdvancedAnalyticsPage
 */

import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, DollarSign, Users, Target, TrendingUp, TrendingDown, Calendar, Download, BarChart3, Activity, Award, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalyticsPerformanceTab } from '@/components/analytics/AnalyticsPerformanceTab';
import { AnalyticsSourcesTab } from '@/components/analytics/AnalyticsSourcesTab';
import { AnalyticsFunnelTab } from '@/components/analytics/AnalyticsFunnelTab';
import { AnalyticsQualityTab } from '@/components/analytics/AnalyticsQualityTab';

// Mock data
const timeToHireData = [
  { mes: 'Jul', tempo: 32, meta: 25 }, { mes: 'Ago', tempo: 28, meta: 25 },
  { mes: 'Set', tempo: 26, meta: 25 }, { mes: 'Out', tempo: 24, meta: 25 },
  { mes: 'Nov', tempo: 22, meta: 25 }, { mes: 'Dez', tempo: 20, meta: 25 },
];
const costPerHireData = [
  { mes: 'Jul', custo: 4500, vagas: 3 }, { mes: 'Ago', custo: 4200, vagas: 4 },
  { mes: 'Set', custo: 3800, vagas: 5 }, { mes: 'Out', custo: 3500, vagas: 4 },
  { mes: 'Nov', custo: 3200, vagas: 6 }, { mes: 'Dez', custo: 2900, vagas: 5 },
];
const sourceEffectivenessData = [
  { source: 'LinkedIn', candidatos: 450, contratados: 25, custo: 15000, taxaConversao: 5.5 },
  { source: 'Indeed', candidatos: 380, contratados: 18, custo: 8000, taxaConversao: 4.7 },
  { source: 'Indicações', candidatos: 120, contratados: 22, custo: 3000, taxaConversao: 18.3 },
  { source: 'Site Carreiras', candidatos: 280, contratados: 12, custo: 2000, taxaConversao: 4.3 },
  { source: 'Catho', candidatos: 150, contratados: 8, custo: 6000, taxaConversao: 5.3 },
  { source: 'Eventos', candidatos: 80, contratados: 10, custo: 12000, taxaConversao: 12.5 },
];
const conversionFunnelData = [
  { etapa: 'Candidaturas', quantidade: 1000, conversao: 100 },
  { etapa: 'Triagem', quantidade: 650, conversao: 65 },
  { etapa: 'Entrevista RH', quantidade: 280, conversao: 43 },
  { etapa: 'Teste Técnico', quantidade: 180, conversao: 64 },
  { etapa: 'Entrevista Gestor', quantidade: 120, conversao: 67 },
  { etapa: 'Proposta', quantidade: 80, conversao: 67 },
  { etapa: 'Contratado', quantidade: 65, conversao: 81 },
];
const departmentPerformanceData = [
  { departamento: 'Tecnologia', vagas: 15, preenchidas: 12, tempoMedio: 22, custoMedio: 3200 },
  { departamento: 'Produto', vagas: 5, preenchidas: 4, tempoMedio: 28, custoMedio: 4100 },
  { departamento: 'Vendas', vagas: 8, preenchidas: 6, tempoMedio: 18, custoMedio: 2800 },
  { departamento: 'Marketing', vagas: 4, preenchidas: 3, tempoMedio: 25, custoMedio: 3500 },
  { departamento: 'Financeiro', vagas: 3, preenchidas: 3, tempoMedio: 30, custoMedio: 4500 },
];
const qualityOfHireData = [
  { metrica: 'Performance', valor: 85, benchmark: 75 },
  { metrica: 'Retenção 6m', valor: 92, benchmark: 85 },
  { metrica: 'Retenção 1a', valor: 78, benchmark: 70 },
  { metrica: 'Engajamento', valor: 88, benchmark: 80 },
  { metrica: 'Fit Cultural', valor: 90, benchmark: 82 },
];

export default function AdvancedAnalyticsPage() {
  usePageTitle('Analytics Avançado');
  const [periodo, setPeriodo] = useState('6m');

  const kpis = useMemo(() => ({
    timeToHire: { value: 20, change: -15, trend: 'down' as const },
    costPerHire: { value: 2900, change: -12, trend: 'down' as const },
    offerAcceptance: { value: 85, change: 5, trend: 'up' as const },
    qualityOfHire: { value: 88, change: 3, trend: 'up' as const },
    sourceROI: { value: 320, change: 18, trend: 'up' as const },
    retention6m: { value: 92, change: 2, trend: 'up' as const },
  }), []);

  const kpiItems = [
    { icon: Clock, color: 'text-info', label: 'Time to Hire', value: `${kpis.timeToHire.value} dias`, change: kpis.timeToHire.change, good: 'down' },
    { icon: DollarSign, color: 'text-success', label: 'Cost per Hire', value: `R$ ${kpis.costPerHire.value.toLocaleString()}`, change: kpis.costPerHire.change, good: 'down' },
    { icon: Target, color: 'text-accent', label: 'Offer Acceptance', value: `${kpis.offerAcceptance.value}%`, change: kpis.offerAcceptance.change, good: 'up' },
    { icon: Award, color: 'text-warning', label: 'Quality of Hire', value: `${kpis.qualityOfHire.value}%`, change: kpis.qualityOfHire.change, good: 'up' },
    { icon: Globe, color: 'text-info', label: 'Source ROI', value: `${kpis.sourceROI.value}%`, change: kpis.sourceROI.change, good: 'up' },
    { icon: Users, color: 'text-accent', label: 'Retenção 6 meses', value: `${kpis.retention6m.value}%`, change: kpis.retention6m.change, good: 'up' },
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
            <Select value={periodo} onValueChange={setPeriodo}>
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
          {kpiItems.map((kpi) => {
            const isPositive = (kpi.good === 'down' && kpi.change < 0) || (kpi.good === 'up' && kpi.change > 0);
            return (
              <Card key={kpi.label}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <kpi.icon className={cn("h-5 w-5", kpi.color)} />
                    <Badge variant="secondary" className={cn("text-xs", isPositive ? "bg-success text-success" : "bg-destructive text-destructive")}>
                      {kpi.change < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                      {kpi.change}%
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="performance">
          <TabsList className="mb-4">
            <TabsTrigger value="performance"><Activity className="h-4 w-4 mr-2" />Performance</TabsTrigger>
            <TabsTrigger value="sources"><Globe className="h-4 w-4 mr-2" />Fontes</TabsTrigger>
            <TabsTrigger value="funnel"><Target className="h-4 w-4 mr-2" />Funil</TabsTrigger>
            <TabsTrigger value="quality"><Award className="h-4 w-4 mr-2" />Qualidade</TabsTrigger>
          </TabsList>
          <TabsContent value="performance"><AnalyticsPerformanceTab timeToHireData={timeToHireData} costPerHireData={costPerHireData} departmentData={departmentPerformanceData} /></TabsContent>
          <TabsContent value="sources"><AnalyticsSourcesTab data={sourceEffectivenessData} /></TabsContent>
          <TabsContent value="funnel"><AnalyticsFunnelTab data={conversionFunnelData} /></TabsContent>
          <TabsContent value="quality"><AnalyticsQualityTab data={qualityOfHireData} /></TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
