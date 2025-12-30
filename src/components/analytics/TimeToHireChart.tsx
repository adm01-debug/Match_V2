import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportChart } from '@/components/reports/ReportChart';
import { Clock, TrendingDown, TrendingUp, Target, Minus } from 'lucide-react';

interface TimeToHireData {
  period: string;
  days: number;
  target: number;
}

interface DepartmentData {
  department: string;
  avgDays: number;
  hires: number;
}

interface TimeToHireChartProps {
  data: TimeToHireData[];
  byDepartment: DepartmentData[];
  currentAvg: number;
  previousAvg: number;
  target: number;
  isLoading?: boolean;
}

export function TimeToHireChart({ 
  data, 
  byDepartment, 
  currentAvg, 
  previousAvg, 
  target,
  isLoading = false 
}: TimeToHireChartProps) {
  const [view, setView] = useState<'trend' | 'department'>('trend');
  
  // Memoize calculations to avoid re-computing on every render
  const { change, isImproving, meetsTarget } = useMemo(() => {
    // Avoid division by zero
    const percentChange = previousAvg > 0 
      ? ((currentAvg - previousAvg) / previousAvg) * 100 
      : 0;
    
    return {
      change: percentChange,
      isImproving: percentChange < 0,
      meetsTarget: currentAvg <= target,
    };
  }, [currentAvg, previousAvg, target]);

  // Memoize sorted departments - don't mutate original array
  const sortedDepartments = useMemo(() => {
    if (!byDepartment?.length) return [];
    return [...byDepartment].sort((a, b) => a.avgDays - b.avgDays);
  }, [byDepartment]);

  const bestDepartment = sortedDepartments[0];

  // Memoize chart data transformation
  const departmentChartData = useMemo(() => {
    return sortedDepartments.map(d => ({ 
      label: d.department, 
      value: d.avgDays,
      hires: d.hires 
    }));
  }, [sortedDepartments]);

  const renderTrendIcon = () => {
    if (previousAvg === 0) {
      return <Minus className="h-4 w-4" aria-hidden="true" />;
    }
    return isImproving 
      ? <TrendingDown className="h-4 w-4" aria-hidden="true" /> 
      : <TrendingUp className="h-4 w-4" aria-hidden="true" />;
  };

  const getTrendColor = () => {
    if (previousAvg === 0) return 'text-muted-foreground';
    return isImproving ? 'text-green-600' : 'text-red-600';
  };

  const getTrendText = () => {
    if (previousAvg === 0) return 'Sem dados anteriores';
    return `${Math.abs(change).toFixed(1)}% vs período anterior`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" aria-hidden="true" />
            Tempo de Contratação
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" aria-hidden="true" />
              Tempo de Contratação
            </CardTitle>
            <CardDescription>Média de dias do início ao aceite</CardDescription>
          </div>
          <Select value={view} onValueChange={(v: 'trend' | 'department') => setView(v)}>
            <SelectTrigger className="w-40" aria-label="Selecionar visualização">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trend">Tendência</SelectItem>
              <SelectItem value="department">Por Área</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-3" role="group" aria-label="Indicadores de tempo de contratação">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Média Atual</div>
            <div className="text-3xl font-bold" aria-label={`${currentAvg} dias em média`}>
              {currentAvg} dias
            </div>
            <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
              {renderTrendIcon()}
              <span>{getTrendText()}</span>
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Meta</div>
            <div className="text-3xl font-bold flex items-center gap-2">
              <Target className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              <span aria-label={`Meta de ${target} dias`}>{target} dias</span>
            </div>
            <Badge 
              variant={meetsTarget ? 'default' : 'destructive'}
              aria-label={meetsTarget ? 'Meta atingida' : 'Meta não atingida'}
            >
              {meetsTarget ? 'Dentro da meta' : 'Acima da meta'}
            </Badge>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Melhor Área</div>
            <div className="text-xl font-bold">
              {bestDepartment?.department ?? 'Sem dados'}
            </div>
            <div className="text-sm text-muted-foreground">
              {bestDepartment 
                ? `${bestDepartment.avgDays} dias em média (${bestDepartment.hires} contratações)`
                : 'Nenhuma contratação registrada'
              }
            </div>
          </div>
        </div>

        {/* Chart */}
        <div role="img" aria-label={`Gráfico de tempo de contratação - ${view === 'trend' ? 'tendência' : 'por área'}`}>
          {view === 'trend' ? (
            data?.length > 0 ? (
              <ReportChart
                type="line"
                data={data}
                dataKey="days"
                nameKey="period"
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sem dados de tendência disponíveis
              </div>
            )
          ) : (
            departmentChartData.length > 0 ? (
              <ReportChart
                type="bar"
                data={departmentChartData}
                dataKey="value"
                nameKey="label"
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sem dados por departamento disponíveis
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
