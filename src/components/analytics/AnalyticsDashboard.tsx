import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportFilters, type ReportFiltersState } from "./reports/ReportFilters";
import { ReportChart } from "./reports/ReportChart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Briefcase, Clock, Target, BarChart3 } from "lucide-react";
import { subDays } from "date-fns";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  description?: string;
}

function KPICard({ title, value, change, icon: Icon, description }: KPICardProps) {
  const isPositive = change && change >= 0;
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {change !== undefined && (
              <div className={`flex items-center gap-1 mt-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{Math.abs(change)}% vs mês anterior</span>
              </div>
            )}
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsDashboard() {
  const [filters, setFilters] = useState<ReportFiltersState>({
    dateRange: { from: subDays(new Date(), 30), to: new Date() },
    vagas: [],
    recrutadores: [],
    fontes: [],
    etapas: [],
  });

  // Mock data
  const kpis = {
    totalCandidates: 1247,
    candidatesChange: 12,
    openPositions: 23,
    positionsChange: -8,
    avgTimeToHire: 28,
    timeChange: -15,
    hireRate: 8.5,
    hireRateChange: 5,
    interviewsScheduled: 156,
    offerAcceptanceRate: 78,
  };

  const funnelData = [
    { name: "Candidaturas", value: 1247 },
    { name: "Triagem", value: 892 },
    { name: "Entrevista RH", value: 456 },
    { name: "Entrevista Técnica", value: 234 },
    { name: "Proposta", value: 89 },
    { name: "Contratados", value: 67 },
  ];

  const sourceData = [
    { name: "LinkedIn", value: 450 },
    { name: "Indeed", value: 320 },
    { name: "Indicação", value: 180 },
    { name: "Site", value: 150 },
    { name: "Outros", value: 147 },
  ];

  const timelineData = Array.from({ length: 30 }, (_, i) => ({
    name: `${i + 1}`,
    candidatos: Math.floor(Math.random() * 50) + 20,
    contratados: Math.floor(Math.random() * 5) + 1,
  }));

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <ReportFilters filters={filters} onFiltersChange={setFilters} />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total de Candidatos" value={kpis.totalCandidates} change={kpis.candidatesChange} icon={Users} />
        <KPICard title="Vagas Abertas" value={kpis.openPositions} change={kpis.positionsChange} icon={Briefcase} />
        <KPICard title="Tempo Médio (dias)" value={kpis.avgTimeToHire} change={kpis.timeChange} icon={Clock} description="Meta: 25 dias" />
        <KPICard title="Taxa de Contratação" value={`${kpis.hireRate}%`} change={kpis.hireRateChange} icon={Target} />
      </div>

      {/* Métricas Secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Entrevistas Agendadas</p>
              <p className="text-2xl font-bold">{kpis.interviewsScheduled}</p>
            </div>
            <Badge variant="secondary">Este mês</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Aceite de Ofertas</p>
              <p className="text-2xl font-bold">{kpis.offerAcceptanceRate}%</p>
            </div>
            <Badge className="bg-green-500">Acima da meta</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pipeline Velocity</p>
              <p className="text-2xl font-bold">4.2 dias</p>
            </div>
            <Badge variant="outline">Por etapa</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <Tabs defaultValue="funnel">
        <TabsList>
          <TabsTrigger value="funnel">Funil</TabsTrigger>
          <TabsTrigger value="sources">Fontes</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        <TabsContent value="funnel" className="mt-4">
          <ReportChart title="Funil de Contratação" type="funnel" data={funnelData} height={400} />
        </TabsContent>
        <TabsContent value="sources" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportChart title="Candidatos por Fonte" type="pie" data={sourceData} height={300} />
            <ReportChart title="Distribuição por Fonte" type="bar" data={sourceData} height={300} />
          </div>
        </TabsContent>
        <TabsContent value="timeline" className="mt-4">
          <ReportChart 
            title="Evolução Mensal" 
            description="Candidatos e contratações nos últimos 30 dias"
            type="line" 
            data={timelineData} 
            dataKeys={["candidatos", "contratados"]}
            height={350} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
