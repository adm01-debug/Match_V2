import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface RadarDatum {
  pilar: string;
  fullName: string;
  score: number;
  empresa?: number;
}

interface Props {
  data: RadarDatum[];
  hasCompanyProfile: boolean;
}

export function BehavioralRadarChart({ data, hasCompanyProfile }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Perfil Comportamental</CardTitle>
        <CardDescription>Visualização dos 10 pilares comportamentais</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.3} />
            <PolarAngleAxis
              dataKey="pilar"
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            />
            <Radar
              name="Candidato"
              dataKey="score"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            {hasCompanyProfile && (
              <Radar
                name="Empresa (ideal)"
                dataKey="empresa"
                stroke="hsl(var(--destructive))"
                fill="hsl(var(--destructive))"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            )}
            <Legend />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => [`${value.toFixed(0)}%`, name]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
