import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ReportChart } from '@/components/reports/ReportChart';
import { Share2, TrendingUp, Users, DollarSign, Target, AlertCircle } from 'lucide-react';

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
  isLoading?: boolean;
}

export function SourceAnalytics({ 
  data, 
  totalCandidates, 
  totalHires, 
  totalCost,
  isLoading = false 
}: SourceAnalyticsProps) {
  // Memoize sorted data
  const sortedByROI = useMemo(() => {
    if (!data?.length) return [];
    return [...data].sort((a, b) => (b.roi ?? 0) - (a.roi ?? 0));
  }, [data]);

  const topSource = sortedByROI[0];

  // Safe average calculation - avoid division by zero
  const avgConversion = useMemo(() => {
    if (!data?.length) return 0;
    const sum = data.reduce((acc, d) => acc + (d.conversionRate ?? 0), 0);
    return sum / data.length;
  }, [data]);

  // Memoize chart data
  const chartData = useMemo(() => {
    if (!data?.length) return [];
    return data.map(d => ({ 
      label: d.source, 
      value: d.candidates,
      hires: d.hires 
    }));
  }, [data]);

  // Safe cost per hire calculation
  const getCostPerHire = (cost: number | undefined, hires: number): string => {
    if (!cost || hires <= 0) return 'N/A';
    return `R$ ${Math.round(cost / hires).toLocaleString('pt-BR')}`;
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return `R$ ${value.toLocaleString('pt-BR')}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" aria-hidden="true" />
            Analytics por Fonte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Carregando dados...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = data?.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" aria-hidden="true" />
          Analytics por Fonte
        </CardTitle>
        <CardDescription>Performance de cada canal de captação</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* KPIs */}
        <div 
          className="grid gap-4 md:grid-cols-4" 
          role="group" 
          aria-label="Métricas principais"
        >
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" aria-hidden="true" />
              Total Candidatos
            </div>
            <div className="text-2xl font-bold" aria-label={`${totalCandidates} candidatos`}>
              {totalCandidates.toLocaleString('pt-BR')}
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" aria-hidden="true" />
              Total Contratados
            </div>
            <div className="text-2xl font-bold" aria-label={`${totalHires} contratados`}>
              {totalHires.toLocaleString('pt-BR')}
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              Conversão Média
            </div>
            <div className="text-2xl font-bold" aria-label={`${avgConversion.toFixed(1)} por cento`}>
              {avgConversion.toFixed(1)}%
            </div>
          </div>
          {totalCost !== undefined && totalCost > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" aria-hidden="true" />
                Custo Total
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(totalCost)}
              </div>
            </div>
          )}
        </div>

        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mb-2" aria-hidden="true" />
            <p>Nenhum dado de fonte disponível</p>
          </div>
        ) : (
          <>
            {/* Best Source */}
            {topSource && (
              <div 
                className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20"
                role="region"
                aria-label="Melhor fonte de recrutamento"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Melhor ROI:
                    </span>
                    <div className="text-lg font-bold text-green-800 dark:text-green-200">
                      {topSource.source}
                    </div>
                  </div>
                  <Badge variant="default">
                    {topSource.conversionRate.toFixed(1)}% conversão
                  </Badge>
                </div>
              </div>
            )}

            {/* Chart */}
            <div role="img" aria-label="Gráfico de candidatos por fonte">
              {chartData.length > 0 && (
                <ReportChart
                  type="bar"
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  height={250}
                />
              )}
            </div>

            {/* Detailed Table */}
            <div 
              className="space-y-3" 
              role="list" 
              aria-label="Detalhamento por fonte"
            >
              {data.map((source, index) => (
                <div 
                  key={`${source.source}-${index}`} 
                  className="flex items-center gap-4 p-3 border rounded-lg"
                  role="listitem"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate" title={source.source}>
                      {source.source}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {source.candidates.toLocaleString('pt-BR')} candidatos → {source.hires} contratações
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="text-sm text-right mb-1">
                      {source.conversionRate.toFixed(1)}%
                    </div>
                    <Progress 
                      value={Math.min(source.conversionRate, 100)} 
                      className="h-2"
                      aria-label={`Taxa de conversão: ${source.conversionRate.toFixed(1)}%`}
                    />
                  </div>
                  {source.cost !== undefined && (
                    <div className="text-right w-24">
                      <div className="text-sm text-muted-foreground">Custo/hire</div>
                      <div className="font-medium">
                        {getCostPerHire(source.cost, source.hires)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
