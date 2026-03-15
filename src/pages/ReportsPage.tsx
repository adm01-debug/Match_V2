import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, FileText, PlusCircle, Clock, TrendingUp, Users, Briefcase, Shield, Heart } from 'lucide-react';
import { ReportBuilder } from '@/components/reports/ReportBuilder';
import { ReportChart } from '@/components/reports/ReportChart';
import { ReportTable } from '@/components/reports/ReportTable';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { ReportExport } from '@/components/reports/ReportExport';
import { ReportScheduler } from '@/components/reports/ReportScheduler';
import { fetchReportData, REPORT_TEMPLATES, type ReportConfig, type ReportData, type ReportScheduleConfig } from '@/services/reportingService';
import { useToast } from '@/hooks/use-toast';

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  vagas: <Briefcase className="h-5 w-5" />,
  candidatos: <Users className="h-5 w-5" />,
  funil: <TrendingUp className="h-5 w-5" />,
  entrevistas: <Clock className="h-5 w-5" />,
  sla: <Shield className="h-5 w-5" />,
  diversidade: <Heart className="h-5 w-5" />,
};

export default function ReportsPage() {
  usePageTitle('Relatórios');
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('templates');
  const [isLoading, setIsLoading] = useState(false);
  const [activeReport, setActiveReport] = useState<ReportConfig | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [schedule, setSchedule] = useState<ReportScheduleConfig>({ enabled: false, frequency: 'weekly', recipients: [] });

  const generateReport = async (config: ReportConfig) => {
    setIsLoading(true);
    setActiveReport(config);
    try {
      const data = await fetchReportData(config);
      setReportData(data);
      setActiveTab('result');
      toast({ title: 'Relatório gerado!', description: config.name });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao gerar relatório', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const availableFilterFields = [
    { value: 'departamento', label: 'Departamento' },
    { value: 'status', label: 'Status' },
    { value: 'prioridade', label: 'Prioridade' },
    { value: 'fonte', label: 'Fonte/Origem' },
    { value: 'tipo', label: 'Tipo' },
    { value: 'etapa_atual', label: 'Etapa' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              Relatórios
            </h1>
            <p className="text-muted-foreground mt-1">
              Gere relatórios detalhados sobre vagas, candidatos, funil e mais
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="templates">
              <FileText className="h-4 w-4 mr-1" /> Templates
            </TabsTrigger>
            <TabsTrigger value="builder">
              <PlusCircle className="h-4 w-4 mr-1" /> Criar Relatório
            </TabsTrigger>
            {reportData && (
              <TabsTrigger value="result">
                <BarChart3 className="h-4 w-4 mr-1" /> Resultado
              </TabsTrigger>
            )}
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {REPORT_TEMPLATES.map((template) => (
                <Card key={template.type} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {TEMPLATE_ICONS[template.type]}
                      </div>
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge variant="outline" className="mt-1 text-xs">{template.chartType}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{template.description}</CardDescription>
                    <Button
                      className="w-full"
                      onClick={() => generateReport(template)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Gerando...' : 'Gerar Relatório'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Builder Tab */}
          <TabsContent value="builder" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <ReportBuilder onBuild={generateReport} />
              </div>
              <div className="space-y-4">
                <ReportFilters
                  filters={activeReport?.filters || []}
                  onFiltersChange={(filters) => setActiveReport(prev => prev ? { ...prev, filters } : null)}
                  availableFields={availableFilterFields}
                />
                <ReportScheduler schedule={schedule} onScheduleChange={setSchedule} />
              </div>
            </div>
          </TabsContent>

          {/* Result Tab */}
          <TabsContent value="result" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-[350px]" />
                <Skeleton className="h-[200px]" />
              </div>
            ) : reportData && activeReport ? (
              <>
                {/* Summary Cards */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{activeReport.name}</h2>
                    <p className="text-sm text-muted-foreground">{activeReport.description}</p>
                  </div>
                  <ReportExport data={reportData} reportName={activeReport.name} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(reportData.summary).map(([key, value]) => (
                    <Card key={key}>
                      <CardContent className="pt-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {typeof value === 'number' && key.includes('taxa') ? `${value}%` : value}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Chart */}
                {activeReport.chartType !== 'table' && (
                  <ReportChart
                    data={reportData}
                    chartType={activeReport.chartType}
                    title="Visualização"
                  />
                )}

                {/* Data Table */}
                <ReportTable
                  data={reportData.rawData as Record<string, unknown>[]}
                  title="Dados Detalhados"
                />
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Selecione um template ou crie um relatório para visualizar os resultados.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
