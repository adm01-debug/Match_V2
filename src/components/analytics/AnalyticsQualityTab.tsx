import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QualityData {
  metrica: string;
  valor: number;
  benchmark: number;
}

interface AnalyticsQualityTabProps {
  data: QualityData[];
}

export function AnalyticsQualityTab({ data }: AnalyticsQualityTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Quality of Hire</CardTitle>
          <CardDescription>Métricas de qualidade das contratações</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid /><PolarAngleAxis dataKey="metrica" /><PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Realizado" dataKey="valor" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
              <Radar name="Benchmark" dataKey="benchmark" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.2} />
              <Legend /><Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Métricas de Qualidade</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {data.map((metrica, index) => (
            <motion.div key={metrica.metrica} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{metrica.metrica}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{metrica.valor}%</span>
                  <Badge variant="secondary" className={cn("text-xs", metrica.valor >= metrica.benchmark ? "bg-success text-success" : "bg-warning text-warning")}>
                    {metrica.valor >= metrica.benchmark ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    vs {metrica.benchmark}%
                  </Badge>
                </div>
              </div>
              <div className="relative">
                <Progress value={metrica.valor} className="h-2" />
                <div className="absolute top-0 h-2 w-0.5 bg-success" style={{ left: `${metrica.benchmark}%` }} />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
