import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FunnelData {
  etapa: string;
  quantidade: number;
  conversao: number;
}

interface AnalyticsFunnelTabProps {
  data: FunnelData[];
}

export function AnalyticsFunnelTab({ data }: AnalyticsFunnelTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Funil de Conversão</CardTitle>
          <CardDescription>Conversão em cada etapa do processo seletivo</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" /><YAxis dataKey="etapa" type="category" width={120} /><Tooltip /><Legend />
              <Bar dataKey="quantidade" fill="#6366F1" name="Quantidade" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {data.map((etapa, index) => (
          <Card key={etapa.etapa} className={cn(index === data.length - 1 && "border-success bg-success dark:bg-success/20")}>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold">{etapa.quantidade}</p>
              <p className="text-xs text-muted-foreground truncate">{etapa.etapa}</p>
              {index > 0 && (
                <Badge variant="secondary" className={cn("mt-2 text-xs", etapa.conversao >= 60 ? "bg-success text-success" : "bg-warning text-warning")}>{etapa.conversao}%</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
