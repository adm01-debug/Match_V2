import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ReportChart } from '@/components/reports/ReportChart';
import { Share2, TrendingUp, Users, DollarSign, Target } from 'lucide-react';

interface SourceData {
  source: string;
  candidates: number;
  hires: number;
  conversionRate: number;
  cost?: number;
  roi?: number;
}

interface SourceAnalyticsProps {
  data: SourceData[];
  totalCandidates: number;
  totalHires: number;
  totalCost?: number;
}

export function SourceAnalytics({ data, totalCandidates, totalHires, totalCost }: SourceAnalyticsProps) {
  const sortedByROI = [...data].sort((a, b) => (b.roi || 0) - (a.roi || 0));
  const topSource = sortedByROI[0];
  const avgConversion = data.reduce((acc, d) => acc + d.conversionRate, 0) / data.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Analytics por Fonte
        </CardTitle>
        <CardDescription>Performance de cada canal de captação</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />Total Candidatos
            </div>
            <div className="text-2xl font-bold">{totalCandidates.toLocaleString('pt-BR')}</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />Total Contratados
            </div>
            <div className="text-2xl font-bold">{totalHires}</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />Conversão Média
            </div>
            <div className="text-2xl font-bold">{avgConversion.toFixed(1)}%</div>
          </div>
          {totalCost && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />Custo Total
              </div>
              <div className="text-2xl font-bold">R$ {totalCost.toLocaleString('pt-BR')}</div>
            </div>
          )}
        </div>

        {/* Best Source */}
        {topSource && (
          <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-green-700 dark:text-green-300">Melhor ROI:</span>
                <div className="text-lg font-bold text-green-800 dark:text-green-200">{topSource.source}</div>
              </div>
              <Badge variant="default">{topSource.conversionRate.toFixed(1)}% conversão</Badge>
            </div>
          </div>
        )}

        {/* Chart */}
        <ReportChart
          type="bar"
          data={data.map(d => ({ label: d.source, value: d.candidates }))}
          dataKey="value"
          nameKey="label"
          height={250}
        />

        {/* Detailed Table */}
        <div className="space-y-3">
          {data.map((source) => (
            <div key={source.source} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{source.source}</div>
                <div className="text-sm text-muted-foreground">
                  {source.candidates} candidatos → {source.hires} contratações
                </div>
              </div>
              <div className="w-32">
                <div className="text-sm text-right mb-1">{source.conversionRate.toFixed(1)}%</div>
                <Progress value={source.conversionRate} className="h-2" />
              </div>
              {source.cost && (
                <div className="text-right w-24">
                  <div className="text-sm text-muted-foreground">Custo/hire</div>
                  <div className="font-medium">R$ {(source.cost / (source.hires || 1)).toFixed(0)}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
