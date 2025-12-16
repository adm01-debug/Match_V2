import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FunilEtapa } from "@/types/recruitment";

interface FunilChartProps {
  data: FunilEtapa[];
}

export function FunilChart({ data }: FunilChartProps) {
  const maxQuantidade = Math.max(...data.map((d) => d.quantidade));

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Funil de Recrutamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((item, index) => (
          <div key={item.etapa} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.etapa}</span>
              <span className="font-medium">
                {item.quantidade}{" "}
                <span className="text-muted-foreground text-xs">({item.percentual}%)</span>
              </span>
            </div>
            <div className="h-7 bg-muted rounded-md overflow-hidden">
              <div
                className="h-full rounded-md transition-all duration-500 ease-out flex items-center justify-end pr-2"
                style={{
                  width: `${(item.quantidade / maxQuantidade) * 100}%`,
                  backgroundColor: item.cor,
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {item.percentual >= 20 && (
                  <span className="text-xs font-medium text-white">{item.quantidade}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
