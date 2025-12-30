import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ReportChart } from '@/components/reports/ReportChart';
import { Users, Target, TrendingUp, Shield } from 'lucide-react';

interface DiversityMetric { label: string; current: number; target: number; benchmark?: number; }
interface GenderData { label: string; value: number; }

interface DiversityDashboardProps {
  genderDistribution: GenderData[];
  metrics: DiversityMetric[];
  diversityIndex: number;
  industryBenchmark: number;
}

export function DiversityDashboard({ genderDistribution, metrics, diversityIndex, industryBenchmark }: DiversityDashboardProps) {
  const indexDiff = diversityIndex - industryBenchmark;
  const isAboveBenchmark = indexDiff >= 0;

  return (
    <div className="space-y-6">
      {/* LGPD Notice */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Dados Anonimizados:</strong> Este dashboard exibe apenas dados agregados e anonimizados, em conformidade com a LGPD.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Índice de Diversidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{(diversityIndex * 100).toFixed(0)}%</div>
            <div className={`flex items-center gap-1 text-sm ${isAboveBenchmark ? 'text-green-600' : 'text-yellow-600'}`}>
              <TrendingUp className="h-4 w-4" />
              {isAboveBenchmark ? '+' : ''}{(indexDiff * 100).toFixed(0)}% vs mercado
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Benchmark do Setor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-muted-foreground">{(industryBenchmark * 100).toFixed(0)}%</div>
            <p className="text-sm text-muted-foreground">Média da indústria</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Status Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={isAboveBenchmark ? 'default' : 'secondary'} className="text-lg py-2 px-4">
              {isAboveBenchmark ? 'Acima da média' : 'Em desenvolvimento'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Distribuição por Gênero
            </CardTitle>
            <CardDescription>Autodeclaração dos candidatos</CardDescription>
          </CardHeader>
          <CardContent>
            <ReportChart type="pie" data={genderDistribution} dataKey="value" nameKey="label" height={250} />
          </CardContent>
        </Card>

        {/* Metrics Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metas de D&I</CardTitle>
            <CardDescription>Progresso em relação às metas definidas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.map((metric, i) => {
              const progress = (metric.current / metric.target) * 100;
              const meetsTarget = metric.current >= metric.target;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{metric.label}</span>
                    <span className={meetsTarget ? 'text-green-600' : 'text-muted-foreground'}>
                      {metric.current}% / {metric.target}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                    {metric.benchmark && (
                      <div
                        className="absolute top-0 w-0.5 h-2 bg-gray-400"
                        style={{ left: `${(metric.benchmark / metric.target) * 100}%` }}
                        title={`Benchmark: ${metric.benchmark}%`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
