import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, AlertTriangle, CheckCircle2, XCircle, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface SLAMetric {
  name: string;
  target: number;
  current: number;
  unit: string;
  status: 'on_track' | 'at_risk' | 'violated';
  trend: 'up' | 'down' | 'stable';
}

interface SLAViolation {
  id: string;
  process: string;
  stage: string;
  candidate: string;
  expectedTime: number;
  actualTime: number;
  violatedAt: Date;
}

interface SLADashboardProps {
  metrics: SLAMetric[];
  violations: SLAViolation[];
  overallCompliance: number;
}

export function SLADashboard({ metrics, violations, overallCompliance }: SLADashboardProps) {
  const getStatusColor = (status: SLAMetric['status']) => {
    switch (status) {
      case 'on_track': return 'text-green-600';
      case 'at_risk': return 'text-yellow-600';
      case 'violated': return 'text-red-600';
    }
  };

  const getStatusBadge = (status: SLAMetric['status']) => {
    switch (status) {
      case 'on_track': return <Badge variant="default" className="gap-1"><CheckCircle2 className="h-3 w-3" />No prazo</Badge>;
      case 'at_risk': return <Badge variant="secondary" className="gap-1 bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3" />Em risco</Badge>;
      case 'violated': return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Violado</Badge>;
    }
  };

  const getTrendIcon = (trend: SLAMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <span className="text-gray-400">—</span>;
    }
  };

  const complianceColor = overallCompliance >= 90 ? 'text-green-600' : overallCompliance >= 70 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Compliance Geral de SLA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <span className={`text-5xl font-bold ${complianceColor}`}>{overallCompliance}%</span>
              <div className="flex-1">
                <Progress value={overallCompliance} className="h-3" />
                <p className="text-sm text-muted-foreground mt-1">Meta: 95%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Violações Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600">{violations.length}</div>
            <p className="text-sm text-muted-foreground">Processos em atraso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Em Risco</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-600">
              {metrics.filter(m => m.status === 'at_risk').length}
            </div>
            <p className="text-sm text-muted-foreground">Próximos do limite</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics">
        <TabsList>
          <TabsTrigger value="metrics">Métricas por Etapa</TabsTrigger>
          <TabsTrigger value="violations">Violações ({violations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          {metrics.map((metric, i) => (
            <Card key={i}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{metric.name}</h4>
                      {getStatusBadge(metric.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">Meta: {metric.target} {metric.unit}</span>
                      <span className={getStatusColor(metric.status)}>Atual: {metric.current} {metric.unit}</span>
                      <span className="flex items-center gap-1">Tendência: {getTrendIcon(metric.trend)}</span>
                    </div>
                  </div>
                  <div className="w-32">
                    <Progress value={Math.min((metric.current / metric.target) * 100, 100)} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          {violations.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                <p className="font-medium">Nenhuma violação ativa</p>
                <p className="text-sm text-muted-foreground">Todos os processos estão dentro do SLA</p>
              </CardContent>
            </Card>
          ) : (
            violations.map((violation) => (
              <Card key={violation.id} className="border-red-200">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="font-medium">{violation.process}</span>
                        <Badge variant="outline">{violation.stage}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Candidato: {violation.candidate}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span><Clock className="h-3 w-3 inline mr-1" />Esperado: {violation.expectedTime}h</span>
                        <span className="text-red-600">Atual: {violation.actualTime}h (+{violation.actualTime - violation.expectedTime}h)</span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      Violado em<br />{violation.violatedAt.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
