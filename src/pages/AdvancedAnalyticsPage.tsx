/**
 * @fileoverview Advanced Analytics Dashboard
 * @module AdvancedAnalyticsPage
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Line
} from 'recharts';
import { 
  Clock, DollarSign, Users, Target, TrendingUp, TrendingDown,
  Calendar, Briefcase, Download, BarChart3, Activity, Award, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = ['#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#22C55E', '#14B8A6'];

// Mock data for demonstration
const timeToHireData = [
  { mes: 'Jul', tempo: 32, meta: 25 },
  { mes: 'Ago', tempo: 28, meta: 25 },
  { mes: 'Set', tempo: 26, meta: 25 },
  { mes: 'Out', tempo: 24, meta: 25 },
  { mes: 'Nov', tempo: 22, meta: 25 },
  { mes: 'Dez', tempo: 20, meta: 25 },
];

const costPerHireData = [
  { mes: 'Jul', custo: 4500, vagas: 3 },
  { mes: 'Ago', custo: 4200, vagas: 4 },
  { mes: 'Set', custo: 3800, vagas: 5 },
  { mes: 'Out', custo: 3500, vagas: 4 },
  { mes: 'Nov', custo: 3200, vagas: 6 },
  { mes: 'Dez', custo: 2900, vagas: 5 },
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

  // KPIs principais
  const kpis = useMemo(() => ({
    timeToHire: { value: 20, change: -15, trend: 'down' as const },
    costPerHire: { value: 2900, change: -12, trend: 'down' as const },
    offerAcceptance: { value: 85, change: 5, trend: 'up' as const },
    qualityOfHire: { value: 88, change: 3, trend: 'up' as const },
    sourceROI: { value: 320, change: 18, trend: 'up' as const },
    retention6m: { value: 92, change: 2, trend: 'up' as const },
  }), []);

  return (
    <Layout title="Analytics Avançado">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-7 w-7 text-primary" />
              Analytics Avançado
            </h1>
            <p className="text-muted-foreground">
              Métricas estratégicas de recrutamento
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="3m">Últimos 3 meses</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="1y">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Main KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs",
                    kpis.timeToHire.trend === 'down' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}
                >
                  {kpis.timeToHire.trend === 'down' ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                  {kpis.timeToHire.change}%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{kpis.timeToHire.value} dias</p>
              <p className="text-xs text-muted-foreground">Time to Hire</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-green-100 text-green-700"
                >
                  <TrendingDown className="h-3 w-3 mr-1" />
                  {kpis.costPerHire.change}%
                </Badge>
              </div>
              <p className="text-2xl font-bold">R$ {kpis.costPerHire.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Cost per Hire</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="h-5 w-5 text-purple-500" />
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-green-100 text-green-700"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {kpis.offerAcceptance.change}%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{kpis.offerAcceptance.value}%</p>
              <p className="text-xs text-muted-foreground">Offer Acceptance</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-green-100 text-green-700"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {kpis.qualityOfHire.change}%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{kpis.qualityOfHire.value}%</p>
              <p className="text-xs text-muted-foreground">Quality of Hire</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <Globe className="h-5 w-5 text-cyan-500" />
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-green-100 text-green-700"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {kpis.sourceROI.change}%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{kpis.sourceROI.value}%</p>
              <p className="text-xs text-muted-foreground">Source ROI</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-pink-500" />
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-green-100 text-green-700"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {kpis.retention6m.change}%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{kpis.retention6m.value}%</p>
              <p className="text-xs text-muted-foreground">Retenção 6 meses</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <Tabs defaultValue="performance">
          <TabsList className="mb-4">
            <TabsTrigger value="performance">
              <Activity className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="sources">
              <Globe className="h-4 w-4 mr-2" />
              Fontes
            </TabsTrigger>
            <TabsTrigger value="funnel">
              <Target className="h-4 w-4 mr-2" />
              Funil
            </TabsTrigger>
            <TabsTrigger value="quality">
              <Award className="h-4 w-4 mr-2" />
              Qualidade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Time to Hire Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Time to Hire (dias)
                  </CardTitle>
                  <CardDescription>Tempo médio de contratação por mês</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={timeToHireData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tempo" fill="#6366F1" name="Tempo Real" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="meta" stroke="#22C55E" strokeDasharray="5 5" name="Meta" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Cost per Hire Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Cost per Hire (R$)
                  </CardTitle>
                  <CardDescription>Custo médio por contratação</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={costPerHireData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString()}`} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="custo" 
                        stroke="#8B5CF6" 
                        fill="#8B5CF6" 
                        fillOpacity={0.3}
                        name="Custo"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Performance por Departamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentPerformanceData.map((dept, index) => (
                    <motion.div
                      key={dept.departamento}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{dept.departamento}</h4>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {dept.tempoMedio}d
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            R$ {dept.custoMedio.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress 
                          value={(dept.preenchidas / dept.vagas) * 100} 
                          className="flex-1 h-2"
                        />
                        <span className="text-sm font-medium">
                          {dept.preenchidas}/{dept.vagas} vagas
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Efetividade por Fonte
                </CardTitle>
                <CardDescription>Comparativo de performance das fontes de recrutamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Fonte</th>
                        <th className="text-right py-3 px-4">Candidatos</th>
                        <th className="text-right py-3 px-4">Contratados</th>
                        <th className="text-right py-3 px-4">Taxa Conversão</th>
                        <th className="text-right py-3 px-4">Custo Total</th>
                        <th className="text-right py-3 px-4">Custo/Contratação</th>
                        <th className="text-right py-3 px-4">ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sourceEffectivenessData.map((source, index) => {
                        const custoPorContratacao = source.contratados > 0 
                          ? source.custo / source.contratados 
                          : 0;
                        const roi = ((source.contratados * 5000 - source.custo) / source.custo * 100);
                        
                        return (
                          <motion.tr
                            key={source.source}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="py-3 px-4 font-medium">{source.source}</td>
                            <td className="text-right py-3 px-4">{source.candidatos}</td>
                            <td className="text-right py-3 px-4">{source.contratados}</td>
                            <td className="text-right py-3 px-4">
                              <Badge 
                                variant="secondary"
                                className={cn(
                                  source.taxaConversao >= 10 ? "bg-green-100 text-green-700" :
                                  source.taxaConversao >= 5 ? "bg-yellow-100 text-yellow-700" :
                                  "bg-orange-100 text-orange-700"
                                )}
                              >
                                {source.taxaConversao}%
                              </Badge>
                            </td>
                            <td className="text-right py-3 px-4">
                              R$ {source.custo.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-4">
                              R$ {custoPorContratacao.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-4">
                              <span className={cn(
                                "font-medium",
                                roi >= 100 ? "text-green-600" : "text-yellow-600"
                              )}>
                                {roi.toFixed(0)}%
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Candidatos</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceEffectivenessData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="candidatos"
                        nameKey="source"
                        label={(entry) => entry.source}
                      >
                        {sourceEffectivenessData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Conversão por Fonte</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sourceEffectivenessData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" unit="%" />
                      <YAxis dataKey="source" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="taxaConversao" fill="#6366F1" radius={[0, 4, 4, 0]} name="Conversão" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="funnel" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Funil de Conversão
                </CardTitle>
                <CardDescription>Conversão em cada etapa do processo seletivo</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversionFunnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="etapa" type="category" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#6366F1" name="Quantidade" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {conversionFunnelData.map((etapa, index) => (
                <Card key={etapa.etapa} className={cn(
                  index === conversionFunnelData.length - 1 && "border-green-200 bg-green-50 dark:bg-green-950/20"
                )}>
                  <CardContent className="pt-4 text-center">
                    <p className="text-2xl font-bold">{etapa.quantidade}</p>
                    <p className="text-xs text-muted-foreground truncate">{etapa.etapa}</p>
                    {index > 0 && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "mt-2 text-xs",
                          etapa.conversao >= 60 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        )}
                      >
                        {etapa.conversao}%
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Quality of Hire
                  </CardTitle>
                  <CardDescription>Métricas de qualidade das contratações</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={qualityOfHireData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metrica" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Realizado"
                        dataKey="valor"
                        stroke="#6366F1"
                        fill="#6366F1"
                        fillOpacity={0.5}
                      />
                      <Radar
                        name="Benchmark"
                        dataKey="benchmark"
                        stroke="#22C55E"
                        fill="#22C55E"
                        fillOpacity={0.2}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Qualidade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {qualityOfHireData.map((metrica, index) => (
                    <motion.div
                      key={metrica.metrica}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{metrica.metrica}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{metrica.valor}%</span>
                          <Badge 
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              metrica.valor >= metrica.benchmark 
                                ? "bg-green-100 text-green-700" 
                                : "bg-yellow-100 text-yellow-700"
                            )}
                          >
                            {metrica.valor >= metrica.benchmark ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            vs {metrica.benchmark}%
                          </Badge>
                        </div>
                      </div>
                      <div className="relative">
                        <Progress value={metrica.valor} className="h-2" />
                        <div 
                          className="absolute top-0 h-2 w-0.5 bg-green-500"
                          style={{ left: `${metrica.benchmark}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
