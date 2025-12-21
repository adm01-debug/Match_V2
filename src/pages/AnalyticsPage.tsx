import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Clock, Users, Target, Briefcase, 
  Calendar, Award, BarChart3, PieChartIcon, Activity, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subMonths, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#22C55E'];
const etapasOrdem = ['novo', 'em_triagem', 'pre_selecao', 'entrevista_rh', 'teste_tecnico', 'entrevista_gestor', 'entrevista_final', 'aprovado', 'contratado'];
const etapasLabels: Record<string, string> = {
  novo: 'Candidaturas', em_triagem: 'Triagem', pre_selecao: 'Pré-seleção',
  entrevista_rh: 'Entrevista RH', teste_tecnico: 'Testes', entrevista_gestor: 'Ent. Gestor',
  entrevista_final: 'Ent. Final', aprovado: 'Aprovados', contratado: 'Contratados'
};

export default function AnalyticsPage() {
  usePageTitle('Analytics');

  const [periodo, setPeriodo] = useState('6m');

  // Buscar processos seletivos para funil
  const { data: processos = [], isLoading: loadingProcessos } = useQuery({
    queryKey: ['analytics-processos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('processos_seletivos')
        .select('id, etapa_atual, status, created_at, data_ultima_movimentacao, candidato_id, vaga_id');
      if (error) throw error;
      return data;
    }
  });

  // Buscar vagas para análise por departamento
  const { data: vagas = [], isLoading: loadingVagas } = useQuery({
    queryKey: ['analytics-vagas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vagas')
        .select('id, titulo, departamento, status, created_at');
      if (error) throw error;
      return data;
    }
  });

  // Buscar candidatos para análise por fonte
  const { data: candidatos = [], isLoading: loadingCandidatos } = useQuery({
    queryKey: ['analytics-candidatos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candidatos')
        .select('id, fonte, created_at');
      if (error) throw error;
      return data;
    }
  });

  // Calcular dados do funil
  const funnelData = useMemo(() => {
    const counts: Record<string, number> = {};
    processos.forEach(p => {
      const etapa = p.etapa_atual || 'novo';
      counts[etapa] = (counts[etapa] || 0) + 1;
    });
    
    let acumulado = processos.length;
    return etapasOrdem.map((etapa, i) => {
      const value = counts[etapa] || 0;
      return { name: etapasLabels[etapa] || etapa, value: acumulado, fill: COLORS[i % COLORS.length] };
    }).filter(d => d.value > 0);
  }, [processos]);

  // Calcular contratações por mês
  const monthlyHiresData = useMemo(() => {
    const meses: { month: string; contratacoes: number; meta: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const mesData = subMonths(new Date(), i);
      const inicio = startOfMonth(mesData);
      const fim = endOfMonth(mesData);
      const contratados = processos.filter(p => 
        p.status === 'contratado' && 
        p.data_ultima_movimentacao &&
        new Date(p.data_ultima_movimentacao) >= inicio &&
        new Date(p.data_ultima_movimentacao) <= fim
      ).length;
      meses.push({
        month: format(mesData, 'MMM', { locale: ptBR }),
        contratacoes: contratados,
        meta: 5
      });
    }
    return meses;
  }, [processos]);

  // Calcular performance por fonte
  const sourcePerformanceData = useMemo(() => {
    const fontes: Record<string, { candidatos: number; contratados: number }> = {};
    candidatos.forEach(c => {
      const fonte = c.fonte || 'Outros';
      if (!fontes[fonte]) fontes[fonte] = { candidatos: 0, contratados: 0 };
      fontes[fonte].candidatos++;
    });
    const contratadosIds = new Set(processos.filter(p => p.status === 'contratado').map(p => p.candidato_id));
    candidatos.forEach(c => {
      if (contratadosIds.has(c.id)) {
        const fonte = c.fonte || 'Outros';
        fontes[fonte].contratados++;
      }
    });
    return Object.entries(fontes).map(([source, data]) => ({
      source, ...data,
      taxa: data.candidatos > 0 ? ((data.contratados / data.candidatos) * 100).toFixed(1) : '0'
    })).sort((a, b) => b.candidatos - a.candidatos);
  }, [candidatos, processos]);

  // Calcular dados por departamento
  const departmentData = useMemo(() => {
    const depts: Record<string, { vagas: number; preenchidas: number; abertas: number }> = {};
    vagas.forEach(v => {
      const dept = v.departamento || 'Outros';
      if (!depts[dept]) depts[dept] = { vagas: 0, preenchidas: 0, abertas: 0 };
      depts[dept].vagas++;
      if (v.status === 'fechada') depts[dept].preenchidas++;
      else if (v.status === 'publicada' || v.status === 'aberta') depts[dept].abertas++;
    });
    return Object.entries(depts).map(([dept, data]) => ({ dept, ...data }));
  }, [vagas]);

  // KPIs calculados
  const kpis = useMemo(() => {
    const totalProcessos = processos.length;
    const contratados = processos.filter(p => p.status === 'contratado').length;
    const emAndamento = processos.filter(p => p.status === 'em_andamento').length;
    const taxaConversao = totalProcessos > 0 ? ((contratados / totalProcessos) * 100).toFixed(1) : '0';
    
    // Tempo médio de contratação
    const temposContratacao = processos
      .filter(p => p.status === 'contratado' && p.created_at && p.data_ultima_movimentacao)
      .map(p => differenceInDays(new Date(p.data_ultima_movimentacao!), new Date(p.created_at)));
    const tempoMedio = temposContratacao.length > 0 
      ? Math.round(temposContratacao.reduce((a, b) => a + b, 0) / temposContratacao.length)
      : 0;

    return { totalProcessos, contratados, emAndamento, taxaConversao, tempoMedio };
  }, [processos]);

  const isLoading = loadingProcessos || loadingVagas || loadingCandidatos;

  if (isLoading) {
    return (
      <Layout title="Analytics"><div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}</div>
        <Skeleton className="h-80 w-full" />
      </div></Layout>
    );
  }

  return (
    <Layout title="Analytics">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Métricas e insights do recrutamento</p>
          </div>
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900"><Users className="h-5 w-5 text-blue-600" /></div>
              <div><p className="text-sm text-muted-foreground">Total Processos</p><p className="text-2xl font-bold">{kpis.totalProcessos}</p></div>
            </div>
          </CardContent></Card>
          <Card><CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900"><Award className="h-5 w-5 text-green-600" /></div>
              <div><p className="text-sm text-muted-foreground">Contratados</p><p className="text-2xl font-bold">{kpis.contratados}</p></div>
            </div>
          </CardContent></Card>
          <Card><CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900"><Target className="h-5 w-5 text-purple-600" /></div>
              <div><p className="text-sm text-muted-foreground">Taxa Conversão</p><p className="text-2xl font-bold">{kpis.taxaConversao}%</p></div>
            </div>
          </CardContent></Card>
          <Card><CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900"><Clock className="h-5 w-5 text-orange-600" /></div>
              <div><p className="text-sm text-muted-foreground">Tempo Médio</p><p className="text-2xl font-bold">{kpis.tempoMedio} dias</p></div>
            </div>
          </CardContent></Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="funil">
          <TabsList>
            <TabsTrigger value="funil"><Activity className="h-4 w-4 mr-1" />Funil</TabsTrigger>
            <TabsTrigger value="contratacoes"><BarChart3 className="h-4 w-4 mr-1" />Contratações</TabsTrigger>
            <TabsTrigger value="fontes"><PieChartIcon className="h-4 w-4 mr-1" />Fontes</TabsTrigger>
            <TabsTrigger value="departamentos"><Briefcase className="h-4 w-4 mr-1" />Departamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="funil" className="mt-4">
            <Card><CardHeader><CardTitle>Funil de Recrutamento</CardTitle><CardDescription>Candidatos em cada etapa</CardDescription></CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]}>
                      {funnelData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contratacoes" className="mt-4">
            <Card><CardHeader><CardTitle>Contratações por Mês</CardTitle></CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyHiresData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="contratacoes" stroke="#22C55E" fill="#22C55E" fillOpacity={0.3} name="Contratações" />
                    <Line type="monotone" dataKey="meta" stroke="#6366F1" strokeDasharray="5 5" name="Meta" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fontes" className="mt-4">
            <Card><CardHeader><CardTitle>Performance por Fonte</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sourcePerformanceData.map((fonte, i) => (
                    <div key={fonte.source} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="font-medium">{fonte.source}</span>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <span>{fonte.candidatos} candidatos</span>
                        <span>{fonte.contratados} contratados</span>
                        <Badge variant="outline">{fonte.taxa}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departamentos" className="mt-4">
            <Card><CardHeader><CardTitle>Vagas por Departamento</CardTitle></CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dept" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="preenchidas" fill="#22C55E" name="Preenchidas" />
                    <Bar dataKey="abertas" fill="#6366F1" name="Abertas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
