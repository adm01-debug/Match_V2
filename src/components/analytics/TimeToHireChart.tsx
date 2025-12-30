import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportChart } from '@/components/reports/ReportChart';
import { Clock, TrendingDown, TrendingUp, Target } from 'lucide-react';
import { useState } from 'react';

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
}

export function TimeToHireChart({ data, byDepartment, currentAvg, previousAvg, target }: TimeToHireChartProps) {
  const [view, setView] = useState<'trend' | 'department'>('trend');
  
  const change = ((currentAvg - previousAvg) / previousAvg) * 100;
  const isImproving = change < 0;
  const meetsTarget = currentAvg <= target;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tempo de Contratação
            </CardTitle>
            <CardDescription>Média de dias do início ao aceite</CardDescription>
          </div>
          <Select value={view} onValueChange={(v: 'trend' | 'department') => setView(v)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="trend">Tendência</SelectItem>
              <SelectItem value="department">Por Área</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Média Atual</div>
            <div className="text-3xl font-bold">{currentAvg} dias</div>
            <div className={`flex items-center gap-1 text-sm ${isImproving ? 'text-green-600' : 'text-red-600'}`}>
              {isImproving ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
              {Math.abs(change).toFixed(1)}% vs período anterior
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Meta</div>
            <div className="text-3xl font-bold flex items-center gap-2">
              <Target className="h-6 w-6 text-muted-foreground" />
              {target} dias
            </div>
            <Badge variant={meetsTarget ? 'default' : 'destructive'}>
              {meetsTarget ? 'Dentro da meta' : 'Acima da meta'}
            </Badge>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Melhor Área</div>
            <div className="text-xl font-bold">
              {byDepartment.sort((a, b) => a.avgDays - b.avgDays)[0]?.department || '-'}
            </div>
            <div className="text-sm text-muted-foreground">
              {byDepartment.sort((a, b) => a.avgDays - b.avgDays)[0]?.avgDays || 0} dias em média
            </div>
          </div>
        </div>

        {/* Chart */}
        {view === 'trend' ? (
          <ReportChart
            type="line"
            data={data}
            dataKey="days"
            nameKey="period"
            height={300}
          />
        ) : (
          <ReportChart
            type="bar"
            data={byDepartment.map(d => ({ label: d.department, value: d.avgDays }))}
            dataKey="value"
            nameKey="label"
            height={300}
          />
        )}
      </CardContent>
    </Card>
  );
}
