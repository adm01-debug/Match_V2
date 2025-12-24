import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FunilEtapa } from "@/types/recruitment";

interface FunilChartProps {
  data: FunilEtapa[];
}

export const FunilChart = memo(function FunilChart({ data }: FunilChartProps) {
  const maxQuantidade = useMemo(() => 
    Math.max(...data.map((d) => d.quantidade), 1),
    [data]
  );

  const chartData = useMemo(() => 
    data.map((item, index) => ({
      ...item,
      width: (item.quantidade / maxQuantidade) * 100,
      opacity: 1 - (index * 0.12)
    })),
    [data, maxQuantidade]
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Funil de Recrutamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {chartData.map((item) => (
          <div key={item.etapa} className="space-y-1.5">
            <div data-testid="funil-chart" className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.etapa}</span>
              <span className="font-medium">{item.quantidade}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{
                  width: `${item.width}%`,
                  opacity: item.opacity,
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
});

FunilChart.displayName = "FunilChart";
