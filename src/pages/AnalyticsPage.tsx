import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Clock, Users, Target, Briefcase, 
  Calendar, Award, BarChart3, PieChartIcon, Activity, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for analytics
const timeToHireData = [
  { month: 'Jan', dias: 28, meta: 25 },
  { month: 'Fev', dias: 32, meta: 25 },
  { month: 'Mar', dias: 24, meta: 25 },
  { month: 'Abr', dias: 22, meta: 25 },
  { month: 'Mai', dias: 26, meta: 25 },
  { month: 'Jun', dias: 21, meta: 25 },
];

const funnelData = [
  { name: 'Candidaturas', value: 450, fill: '#6366F1' },
  { name: 'Triagem', value: 280, fill: '#8B5CF6' },
  { name: 'Entrevista RH', value: 120, fill: '#A855F7' },
  { name: 'Testes', value: 85, fill: '#D946EF' },
  { name: 'Entrevista Final', value: 45, fill: '#EC4899' },
  { name: 'Proposta', value: 28, fill: '#F43F5E' },
  { name: 'Contratados', value: 18, fill: '#22C55E' },
];

const sourcePerformanceData = [
  { source: 'LinkedIn', candidatos: 180, contratados: 8, taxa: 4.4, custo: 450 },
  { source: 'Indeed', candidatos: 120, contratados: 4, taxa: 3.3, custo: 280 },
  { source: 'Indicação', candidatos: 65, contratados: 5, taxa: 7.7, custo: 0 },
  { source: 'Site Próprio', candidatos: 55, contratados: 2, taxa: 3.6, custo: 100 },
  { source: 'Banco Talentos', candidatos: 30, contratados: 3, taxa: 10.0, custo: 0 },
];

const departmentData = [
  { dept: 'Tecnologia', vagas: 12, preenchidas: 8, abertas: 4, tth: 28 },
  { dept: 'Comercial', vagas: 8, preenchidas: 6, abertas: 2, tth: 22 },
  { dept: 'Marketing', vagas: 5, preenchidas: 4, abertas: 1, tth: 25 },
  { dept: 'RH', vagas: 3, preenchidas: 3, abertas: 0, tth: 18 },
  { dept: 'Financeiro', vagas: 4, preenchidas: 2, abertas: 2, tth: 32 },
];

const monthlyHiresData = [
  { month: 'Jan', contratacoes: 3, meta: 4 },
  { month: 'Fev', contratacoes: 5, meta: 4 },
  { month: 'Mar', contratacoes: 4, meta: 4 },
  { month: 'Abr', contratacoes: 6, meta: 5 },
  { month: 'Mai', contratacoes: 4, meta: 5 },
  { month: 'Jun', contratacoes: 7, meta: 5 },
];

const COLORS = ['#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#22C55E'];

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  icon: React.ElementType;
  color?: string;
}

function KPICard({ title, value, subtitle, trend, icon: Icon, color = 'primary' }: KPICardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={cn(
            "p-3 rounded-lg",
            color === 'primary' && "bg-primary/10 text-primary",
            color === 'green' && "bg-green-500/10 text-green-500",
            color === 'orange' && "bg-orange-500/10 text-orange-500",
            color === 'purple' && "bg-purple-500/10 text-purple-500"
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 mt-3 text-sm",
            trend >= 0 ? "text-green-500" : "text-red-500"
          )}>
            {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{Math.abs(trend)}% vs mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('6m');
  const [candidatosCount, setCandidatosCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { count } = await supabase.from('candidatos').select('*', { count: 'exact', head: true });
      setCandidatosCount(count || 0);
    };
    fetchStats();
  }, []);

  const conversionRates = funnelData.map((stage, index) => {
    if (index === 0) return { ...stage, rate: 100 };
    const prevValue = funnelData[index - 1].value;
    const rate = ((stage.value / prevValue) * 100).toFixed(1);
    return { ...stage, rate: parseFloat(rate) };
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics de Recrutamento</h1>
            <p className="text-muted-foreground mt-1">
              Métricas e insights do processo seletivo
            </p>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Último mês</SelectItem>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Time-to-Hire Médio"
            value="24 dias"
            subtitle="Meta: 25 dias"
            trend={-8}
            icon={Clock}
            color="green"
          />
          <KPICard
            title="Taxa de Conversão"
            value="4.0%"
            subtitle="Candidatura → Contratação"
            trend={12}
            icon={Target}
            color="primary"
          />
          <KPICard
            title="Candidatos no BD"
            value={candidatosCount}
            subtitle="Via Parser IA"
            icon={Users}
            color="purple"
          />
          <KPICard
            title="Contratações no Mês"
            value="7"
            subtitle="Meta: 5"
            trend={40}
            icon={Award}
            color="green"
          />
        </div>

        {/* Charts */}
        <Tabs defaultValue="funil" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="funil" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Funil
            </TabsTrigger>
            <TabsTrigger value="tth" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time-to-Hire
            </TabsTrigger>
            <TabsTrigger value="fontes" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Fontes
            </TabsTrigger>
            <TabsTrigger value="departamentos" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Departamentos
            </TabsTrigger>
          </TabsList>

          {/* Funil de Conversão */}
          <TabsContent value="funil" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Funil de Recrutamento</CardTitle>
                  <CardDescription>Candidatos em cada etapa do processo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <FunnelChart>
                      <Tooltip 
                        formatter={(value: number) => [`${value} candidatos`, 'Total']}
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      />
                      <Funnel
                        dataKey="value"
                        data={funnelData}
                        isAnimationActive
                      >
                        <LabelList position="center" fill="#fff" stroke="none" dataKey="name" />
                        {funnelData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Conversão por Etapa</CardTitle>
                  <CardDescription>Percentual de candidatos que avançam</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conversionRates.map((stage, index) => (
                      <div key={stage.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: stage.fill }}
                            />
                            <span className="text-sm font-medium">{stage.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">{stage.value}</span>
                            {index > 0 && (
                              <Badge variant={stage.rate >= 50 ? "default" : "secondary"}>
                                {stage.rate}%
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all" 
                            style={{ 
                              width: `${(stage.value / funnelData[0].value) * 100}%`,
                              backgroundColor: stage.fill 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Time-to-Hire */}
          <TabsContent value="tth" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução do Time-to-Hire</CardTitle>
                  <CardDescription>Dias médios para contratação vs meta</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timeToHireData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                        formatter={(value: number, name: string) => [
                          `${value} dias`, 
                          name === 'dias' ? 'Time-to-Hire' : 'Meta'
                        ]}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="dias" 
                        stroke="#6366F1" 
                        fill="#6366F1" 
                        fillOpacity={0.3}
                        name="Time-to-Hire"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="meta" 
                        stroke="#22C55E" 
                        strokeDasharray="5 5"
                        name="Meta"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contratações Mensais</CardTitle>
                  <CardDescription>Número de contratações vs meta</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyHiresData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      />
                      <Legend />
                      <Bar dataKey="contratacoes" fill="#6366F1" name="Contratações" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="meta" fill="#E5E7EB" name="Meta" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fontes de Candidatos */}
          <TabsContent value="fontes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Candidatos por Fonte</CardTitle>
                  <CardDescription>Distribuição de candidatos por origem</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sourcePerformanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="candidatos"
                        nameKey="source"
                        label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sourcePerformanceData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                        formatter={(value: number) => [`${value} candidatos`, 'Total']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance por Fonte</CardTitle>
                  <CardDescription>Taxa de conversão e custo por contratação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sourcePerformanceData
                      .sort((a, b) => b.taxa - a.taxa)
                      .map((source, index) => (
                        <div key={source.source} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <div>
                              <p className="font-medium text-sm">{source.source}</p>
                              <p className="text-xs text-muted-foreground">
                                {source.candidatos} candidatos • {source.contratados} contratados
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={source.taxa >= 5 ? "default" : "secondary"}>
                              {source.taxa}% conv.
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {source.custo > 0 ? `R$ ${source.custo}/cont.` : 'Sem custo'}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Por Departamento */}
          <TabsContent value="departamentos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vagas por Departamento</CardTitle>
                  <CardDescription>Status das vagas em cada área</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="dept" type="category" className="text-xs" width={80} />
                      <Tooltip 
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      />
                      <Legend />
                      <Bar dataKey="preenchidas" stackId="a" fill="#22C55E" name="Preenchidas" />
                      <Bar dataKey="abertas" stackId="a" fill="#EAB308" name="Em aberto" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time-to-Hire por Departamento</CardTitle>
                  <CardDescription>Dias médios para preenchimento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentData
                      .sort((a, b) => a.tth - b.tth)
                      .map((dept) => (
                        <div key={dept.dept} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{dept.dept}</span>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className={cn(
                                "font-bold",
                                dept.tth <= 25 ? "text-green-500" : "text-orange-500"
                              )}>
                                {dept.tth} dias
                              </span>
                            </div>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full transition-all rounded-full",
                                dept.tth <= 25 ? "bg-green-500" : "bg-orange-500"
                              )}
                              style={{ width: `${Math.min((dept.tth / 40) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Insights Automáticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  🎯 Indicações têm a maior taxa de conversão (7.7%)
                </p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                  Considere expandir o programa de indicação
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  ⏱️ Time-to-Hire melhorou 8% este mês
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                  Média atual de 24 dias (abaixo da meta de 25)
                </p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                  ⚠️ Financeiro tem o maior TTH (32 dias)
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-500 mt-1">
                  Revisar processo seletivo do departamento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
