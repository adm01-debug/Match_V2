import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportChart } from "./ReportChart";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingDown, TrendingUp } from "lucide-react";

interface TimeMetrics {
  avgTimeToHire: number;
  avgTimePerStage: Record<string, number>;
  timelineData: { date: string; avgDays: number }[];
  byDepartment: { name: string; avgDays: number }[];
}

interface TimeToHireReportProps {
  data: TimeMetrics;
  period: string;
  previousPeriod?: TimeMetrics;
}

export function TimeToHireReport({ data, period, previousPeriod }: TimeToHireReportProps) {
  const trend = previousPeriod 
    ? data.avgTimeToHire - previousPeriod.avgTimeToHire 
    : 0;
  const isImproving = trend < 0;

  const stageData = Object.entries(data.avgTimePerStage).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));

  return (
    <div className="space-y-6">
      {/* KPI Principal */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tempo Médio de Contratação</p>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-bold">{Math.round(data.avgTimeToHire)}</p>
                <span className="text-xl text-muted-foreground">dias</span>
              </div>
              {trend !== 0 && (
                <div className={`flex items-center gap-1 mt-2 ${isImproving ? "text-green-600" : "text-red-600"}`}>
                  {isImproving ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                  <span className="text-sm">{Math.abs(trend).toFixed(1)} dias vs período anterior</span>
                </div>
              )}
            </div>
            <Clock className="h-12 w-12 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportChart
          title="Tempo por Etapa"
          description="Dias médios em cada fase"
          type="bar"
          data={stageData}
          height={300}
        />
        <ReportChart
          title="Evolução Temporal"
          description="Tendência do tempo de contratação"
          type="line"
          data={data.timelineData.map(d => ({ name: d.date, value: d.avgDays }))}
          height={300}
        />
      </div>

      {/* Por Departamento */}
      <Card>
        <CardHeader>
          <CardTitle>Tempo por Departamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.byDepartment.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between">
                <span className="font-medium">{dept.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${Math.min((dept.avgDays / 60) * 100, 100)}%` }}
                    />
                  </div>
                  <Badge variant="secondary">{dept.avgDays} dias</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
