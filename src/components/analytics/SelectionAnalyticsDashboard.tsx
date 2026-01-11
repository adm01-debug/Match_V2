/**
 * @component SelectionAnalyticsDashboard
 * @description Dashboard de analytics do processo de seleção
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  Award,
  Brain,
  Heart,
  BarChart3
} from 'lucide-react';

// Mock data - in production, this would come from hooks
const funilData = [
  { etapa: 'Candidaturas', total: 500, conversao: 100 },
  { etapa: 'Triagem', total: 350, conversao: 70 },
  { etapa: 'Provas', total: 200, conversao: 57 },
  { etapa: 'Entrevista RH', total: 100, conversao: 50 },
  { etapa: 'Entrevista Técnica', total: 50, conversao: 50 },
  { etapa: 'Oferta', total: 20, conversao: 40 },
  { etapa: 'Contratados', total: 15, conversao: 75 },
];

const scoreDistribution = [
  { range: '0-20', count: 5, color: '#ef4444' },
  { range: '21-40', count: 15, color: '#f97316' },
  { range: '41-60', count: 35, color: '#eab308' },
  { range: '61-80', count: 85, color: '#22c55e' },
  { range: '81-100', count: 60, color: '#10b981' },
];

const competenciaData = [
  { competencia: 'Comunicação', media: 78 },
  { competencia: 'Liderança', media: 65 },
  { competencia: 'Resolução', media: 82 },
  { competencia: 'Trabalho em Equipe', media: 75 },
  { competencia: 'Adaptabilidade', media: 70 },
  { competencia: 'Proatividade', media: 85 },
];

const tendenciaData = [
  { mes: 'Jan', tecnico: 72, comportamental: 68, cultural: 75 },
  { mes: 'Fev', tecnico: 75, comportamental: 70, cultural: 78 },
  { mes: 'Mar', tecnico: 78, comportamental: 72, cultural: 80 },
  { mes: 'Abr', tecnico: 74, comportamental: 75, cultural: 82 },
  { mes: 'Mai', tecnico: 80, comportamental: 78, cultural: 85 },
  { mes: 'Jun', tecnico: 82, comportamental: 80, cultural: 88 },
];

const perfilData = [
  { subject: 'Dominância', A: 75, B: 65, fullMark: 100 },
  { subject: 'Influência', A: 68, B: 80, fullMark: 100 },
  { subject: 'Estabilidade', A: 82, B: 70, fullMark: 100 },
  { subject: 'Conformidade', A: 70, B: 75, fullMark: 100 },
];



export function SelectionAnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score Médio</p>
                <p className="text-2xl font-bold">78.5</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+5.2% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                <p className="text-2xl font-bold">3%</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Award className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <Progress value={3} max={10} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold">18 dias</p>
              </div>
              <div className="p-3 rounded-full bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-muted-foreground">Da candidatura à contratação</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fit Cultural</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+8% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Funil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Funil de Conversão
            </CardTitle>
            <CardDescription>
              Taxa de conversão por etapa do processo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funilData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="etapa" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'total' ? `${value} candidatos` : `${value}%`,
                    name === 'total' ? 'Total' : 'Conversão'
                  ]}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Distribuição de Scores
            </CardTitle>
            <CardDescription>
              Distribuição dos scores finais dos candidatos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                  label={({ range, count }) => `${range}: ${count}`}
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Competências */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Média por Competência
            </CardTitle>
            <CardDescription>
              Desempenho médio dos candidatos por competência
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competenciaData.map((item) => (
                <div key={item.competencia} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.competencia}</span>
                    <span className="font-medium">{item.media}%</span>
                  </div>
                  <Progress 
                    value={item.media} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tendência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendência de Scores
            </CardTitle>
            <CardDescription>
              Evolução dos scores por dimensão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={tendenciaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="tecnico" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Técnico"
                />
                <Line 
                  type="monotone" 
                  dataKey="comportamental" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Comportamental"
                />
                <Line 
                  type="monotone" 
                  dataKey="cultural" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Cultural"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* DISC Profile Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Perfil DISC - Média vs Ideal
          </CardTitle>
          <CardDescription>
            Comparação entre perfil médio dos candidatos e perfil ideal do cargo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm">Média Candidatos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Perfil Ideal</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={perfilData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Média Candidatos"
                dataKey="A"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
              <Radar
                name="Perfil Ideal"
                dataKey="B"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
