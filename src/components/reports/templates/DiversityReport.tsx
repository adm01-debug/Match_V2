import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReportChart } from './ReportChart';
import { Users, MapPin, Calendar, TrendingUp, Shield } from 'lucide-react';

interface DiversityData {
  gender: { label: string; value: number; color: string }[];
  ageGroups: { label: string; value: number }[];
  regions: { label: string; value: number }[];
  trends: { month: string; diversity_index: number }[];
  summary: {
    total_candidates: number;
    diversity_index: number;
    gender_balance: number;
    geographic_spread: number;
  };
}

interface DiversityReportProps {
  data: DiversityData;
  dateRange?: { from: Date; to: Date };
}

export function DiversityReport({ data, dateRange }: DiversityReportProps) {
  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Aviso LGPD */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-200">Dados Anonimizados (LGPD)</p>
              <p className="text-blue-700 dark:text-blue-300 mt-1">
                Este relatório apresenta dados agregados e anonimizados em conformidade com a Lei Geral de Proteção de Dados.
                Nenhuma informação individual pode ser identificada.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Candidatos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.total_candidates.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">Base analisada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Índice de Diversidade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(data.summary.diversity_index)}</div>
            <Badge variant={data.summary.diversity_index >= 0.7 ? 'default' : 'secondary'}>
              {data.summary.diversity_index >= 0.7 ? 'Excelente' : data.summary.diversity_index >= 0.5 ? 'Bom' : 'Em desenvolvimento'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Equilíbrio de Gênero</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(data.summary.gender_balance)}</div>
            <p className="text-xs text-muted-foreground">Proporção equilibrada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Abrangência Geográfica</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.regions.length}</div>
            <p className="text-xs text-muted-foreground">Regiões representadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Gênero</CardTitle>
            <CardDescription>Proporção declarada pelos candidatos</CardDescription>
          </CardHeader>
          <CardContent>
            <ReportChart
              type="pie"
              data={data.gender}
              dataKey="value"
              nameKey="label"
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faixas Etárias</CardTitle>
            <CardDescription>Distribuição por idade</CardDescription>
          </CardHeader>
          <CardContent>
            <ReportChart
              type="bar"
              data={data.ageGroups}
              dataKey="value"
              nameKey="label"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição Geográfica</CardTitle>
            <CardDescription>Candidatos por região</CardDescription>
          </CardHeader>
          <CardContent>
            <ReportChart
              type="bar"
              data={data.regions}
              dataKey="value"
              nameKey="label"
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução do Índice de Diversidade</CardTitle>
            <CardDescription>Tendência nos últimos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ReportChart
              type="line"
              data={data.trends}
              dataKey="diversity_index"
              nameKey="month"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Período */}
      {dateRange && (
        <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Período: {dateRange.from.toLocaleDateString('pt-BR')} - {dateRange.to.toLocaleDateString('pt-BR')}
          </span>
        </div>
      )}
    </div>
  );
}
