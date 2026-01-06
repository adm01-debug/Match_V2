import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportChart } from "./ReportChart";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface FunnelStage {
  name: string;
  count: number;
  conversionRate?: number;
}

interface HiringFunnelReportProps {
  data: FunnelStage[];
  period: string;
  comparison?: FunnelStage[];
}

export function HiringFunnelReport({ data, period }: HiringFunnelReportProps) {
  const totalCandidates = data[0]?.count || 0;
  const totalHired = data[data.length - 1]?.count || 0;
  const overallConversion = totalCandidates > 0 ? ((totalHired / totalCandidates) * 100).toFixed(1) : 0;

  const chartData = useMemo(() => data.map(stage => ({
    name: stage.name,
    value: stage.count,
  })), [data]);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Candidatos</p>
                <p className="text-3xl font-bold">{totalCandidates}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contratados</p>
                <p className="text-3xl font-bold">{totalHired}</p>
              </div>
              <Badge variant="secondary" className="text-lg">{overallConversion}%</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Período</p>
                <p className="text-lg font-medium">{period}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Chart */}
      <ReportChart
        type="bar"
        data={chartData}
        height={400}
      />

      {/* Conversion Rates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Taxas de Conversão por Etapa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.map((stage, index) => (
              <div key={stage.name} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{index + 1}</Badge>
                  <span className="font-medium">{stage.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">{stage.count} candidatos</span>
                  {stage.conversionRate !== undefined && (
                    <Badge className={stage.conversionRate >= 50 ? "bg-green-500" : stage.conversionRate >= 25 ? "bg-yellow-500" : "bg-red-500"}>
                      {stage.conversionRate.toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
