import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportBuilder } from '@/components/reports/ReportBuilder';
import { BarChart3, Users, Briefcase, Clock, TrendingUp } from 'lucide-react';

const QUICK_STATS = [
  { title: 'Candidatos Ativos', value: '234', change: '+12%', icon: Users },
  { title: 'Vagas Abertas', value: '18', change: '+3', icon: Briefcase },
  { title: 'Tempo Médio Contratação', value: '23 dias', change: '-5 dias', icon: Clock },
  { title: 'Taxa de Conversão', value: '24%', change: '+2%', icon: TrendingUp },
];

export default function ReportsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Relatórios e Analytics</h1>
          <p className="text-muted-foreground">Analise métricas e gere relatórios personalizados</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {QUICK_STATS.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600">{stat.change} vs mês anterior</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="builder">
          <TabsList>
            <TabsTrigger value="builder"><BarChart3 className="h-4 w-4 mr-2" />Construtor</TabsTrigger>
            <TabsTrigger value="saved">Salvos</TabsTrigger>
            <TabsTrigger value="scheduled">Agendados</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="mt-4">
            <ReportBuilder onExport={() => { /* Export handler */ }} />
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum relatório salvo ainda.</p>
                <p className="text-sm">Crie um relatório no Construtor e salve para acesso rápido.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="mt-4">
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum relatório agendado.</p>
                <p className="text-sm">Agende relatórios para receber por email periodicamente.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

