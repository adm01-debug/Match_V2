/**
 * @fileoverview Dashboard de Resultados Comportamentais
 * Visualização rica dos resultados da avaliação comportamental
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { 
  Shield, 
  Scale, 
  Users, 
  Crown, 
  Shuffle, 
  Rocket, 
  MessageCircle, 
  Brain, 
  Heart, 
  Target,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Clock,
  Eye,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BEHAVIORAL_PILLARS, type PredictiveFitAnalysis, type AuthenticityMetrics } from '@/config/behavioralPillars';

interface BehavioralResultsDashboardProps {
  candidatoNome: string;
  vagaTitulo?: string;
  scores: Record<string, number>;
  companyProfile?: Record<string, number>;
  authenticity?: AuthenticityMetrics;
  predictiveFit?: PredictiveFitAnalysis;
  respostas?: Array<{
    scenarioId: string;
    selectedOption: string;
    timeToRespond: number;
    tags: string[];
  }>;
}

const pilarIcons: Record<string, typeof Shield> = {
  resiliencia: Shield,
  integridade: Scale,
  colaboracao: Users,
  lideranca: Crown,
  adaptabilidade: Shuffle,
  proatividade: Rocket,
  comunicacao: MessageCircle,
  pensamento_critico: Brain,
  inteligencia_emocional: Heart,
  orientacao_resultados: Target,
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-blue-500';
  if (score >= 40) return 'text-amber-500';
  return 'text-red-500';
};

const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excepcional';
  if (score >= 60) return 'Forte';
  if (score >= 40) return 'Moderado';
  return 'Em Desenvolvimento';
};

const getFitColor = (fit: number, gap: number): string => {
  if (gap <= 10) return 'bg-emerald-500';
  if (gap <= 25) return 'bg-blue-500';
  if (gap <= 40) return 'bg-amber-500';
  return 'bg-red-500';
};

export function BehavioralResultsDashboard({
  candidatoNome,
  candidatoId,
  vagaTitulo,
  scores,
  companyProfile,
  authenticity,
  predictiveFit,
  respostas,
}: BehavioralResultsDashboardProps) {
  // Calcular score geral
  const overallScore = useMemo(() => {
    const values = Object.values(scores);
    return values.reduce((a, b) => a + b, 0) / values.length;
  }, [scores]);

  // Dados para o radar chart
  const radarData = useMemo(() => {
    return BEHAVIORAL_PILLARS.map((pilar) => ({
      pilar: pilar.nome.split(' ')[0], // Primeira palavra
      fullName: pilar.nome,
      score: scores[pilar.id] || 0,
      empresa: companyProfile ? (companyProfile[pilar.id] || 5) * 10 : undefined,
    }));
  }, [scores, companyProfile]);

  // Dados para o bar chart de comparação
  const comparisonData = useMemo(() => {
    if (!companyProfile) return [];
    
    return BEHAVIORAL_PILLARS.map((pilar) => {
      const candidatoScore = scores[pilar.id] || 0;
      const empresaPeso = (companyProfile[pilar.id] || 5) * 10;
      const gap = Math.abs(candidatoScore - empresaPeso);
      
      return {
        pilar: pilar.nome.split(' ')[0],
        fullName: pilar.nome,
        candidato: candidatoScore,
        empresa: empresaPeso,
        gap,
        cor: pilar.cor,
      };
    }).sort((a, b) => b.gap - a.gap);
  }, [scores, companyProfile]);

  // Top 3 pilares
  const topPilares = useMemo(() => {
    return BEHAVIORAL_PILLARS
      .map((p) => ({ ...p, score: scores[p.id] || 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [scores]);

  // Pilares em desenvolvimento
  const developmentPilares = useMemo(() => {
    return BEHAVIORAL_PILLARS
      .map((p) => ({ ...p, score: scores[p.id] || 0 }))
      .filter((p) => p.score < 50)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  }, [scores]);

  // Tags mais frequentes
  const tagFrequency = useMemo(() => {
    if (!respostas) return [];
    
    const freq: Record<string, number> = {};
    respostas.forEach((r) => {
      r.tags.forEach((tag) => {
        freq[tag] = (freq[tag] || 0) + 1;
      });
    });
    
    return Object.entries(freq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
  }, [respostas]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{candidatoNome}</h2>
          <p className="text-muted-foreground">
            Avaliação Comportamental {vagaTitulo && `• ${vagaTitulo}`}
          </p>
        </div>
        <div className="text-right">
          <div className={cn("text-4xl font-bold", getScoreColor(overallScore))}>
            {overallScore.toFixed(0)}
          </div>
          <Badge variant="outline" className={getScoreColor(overallScore)}>
            {getScoreLabel(overallScore)}
          </Badge>
        </div>
      </div>

      {/* Fit Preditivo (se disponível) */}
      {predictiveFit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={cn(
            "border-2",
            predictiveFit.recomendacao === 'fortemente_recomendado' ? 'border-emerald-500/50 bg-emerald-500/5' :
            predictiveFit.recomendacao === 'recomendado' ? 'border-blue-500/50 bg-blue-500/5' :
            predictiveFit.recomendacao === 'cautela' ? 'border-amber-500/50 bg-amber-500/5' :
            predictiveFit.recomendacao === 'nao_recomendado' ? 'border-red-500/50 bg-red-500/5' :
            'border-border'
          )}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Análise Preditiva de Fit
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{predictiveFit.fitGeral}%</span>
                  <Badge className={cn(
                    predictiveFit.recomendacao === 'fortemente_recomendado' ? 'bg-emerald-500' :
                    predictiveFit.recomendacao === 'recomendado' ? 'bg-blue-500' :
                    predictiveFit.recomendacao === 'cautela' ? 'bg-amber-500' :
                    'bg-red-500'
                  )}>
                    {predictiveFit.recomendacao.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{predictiveFit.justificativa}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Potencializadores */}
                {predictiveFit.potencializadores.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium text-sm flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Pontos Fortes para a Vaga
                    </p>
                    {predictiveFit.potencializadores.map((p, i) => (
                      <div key={i} className="text-sm pl-6">
                        <span className="font-medium">{p.pilar}:</span> {p.descricao}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Riscos */}
                {predictiveFit.riscos.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium text-sm flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      Pontos de Atenção
                    </p>
                    {predictiveFit.riscos.map((r, i) => (
                      <div key={i} className="text-sm pl-6">
                        <Badge variant="outline" className={cn(
                          r.severidade === 'alto' ? 'text-red-500 border-red-500/30' :
                          r.severidade === 'medio' ? 'text-amber-500 border-amber-500/30' :
                          'text-blue-500 border-blue-500/30'
                        )}>
                          {r.pilar}
                        </Badge>
                        <span className="ml-2">{r.descricao}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Grid Principal */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Perfil Comportamental</CardTitle>
            <CardDescription>
              Visualização dos 10 pilares comportamentais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
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
                {companyProfile && (
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
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(0)}%`,
                    name
                  ]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detalhamento por Pilar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalhamento por Pilar</CardTitle>
            <CardDescription>
              Scores individuais e comparação com expectativa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {BEHAVIORAL_PILLARS.map((pilar) => {
              const score = scores[pilar.id] || 0;
              const empresaPeso = companyProfile ? (companyProfile[pilar.id] || 5) * 10 : null;
              const gap = empresaPeso !== null ? score - empresaPeso : null;
              const Icon = pilarIcons[pilar.id] || Target;
              
              return (
                <motion.div
                  key={pilar.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1.5 rounded", pilar.cor)}>
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium">{pilar.nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("font-bold", getScoreColor(score))}>
                        {score.toFixed(0)}%
                      </span>
                      {gap !== null && (
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            gap > 10 ? 'text-emerald-500 border-emerald-500/30' :
                            gap < -10 ? 'text-red-500 border-red-500/30' :
                            'text-muted-foreground'
                          )}
                        >
                          {gap > 0 && '+'}{gap.toFixed(0)}
                          {gap > 10 ? <TrendingUp className="h-3 w-3 ml-1 inline" /> :
                           gap < -10 ? <TrendingDown className="h-3 w-3 ml-1 inline" /> :
                           <Minus className="h-3 w-3 ml-1 inline" />}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className={cn("absolute inset-y-0 left-0 rounded-full", pilar.cor)}
                    />
                    {empresaPeso !== null && (
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-foreground"
                        style={{ left: `${empresaPeso}%` }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Destaques e Desenvolvimento */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Pilares */}
        <Card className="border-emerald-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
              Pontos Fortes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPilares.map((pilar, i) => {
              const Icon = pilarIcons[pilar.id] || Target;
              return (
                <div key={pilar.id} className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", pilar.cor)}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{pilar.nome}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {pilar.descricao}
                    </p>
                  </div>
                  <Badge className="bg-emerald-500">
                    {pilar.score.toFixed(0)}%
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Áreas de Desenvolvimento */}
        <Card className={developmentPilares.length > 0 ? "border-amber-500/30" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-600">
              <TrendingUp className="h-5 w-5" />
              Áreas de Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {developmentPilares.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Não foram identificadas áreas críticas de desenvolvimento.
              </p>
            ) : (
              developmentPilares.map((pilar) => {
                const Icon = pilarIcons[pilar.id] || Target;
                return (
                  <div key={pilar.id} className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg bg-muted")}>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{pilar.nome}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        Sugestão: Desenvolver através de mentoria e feedback estruturado
                      </p>
                    </div>
                    <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                      {pilar.score.toFixed(0)}%
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Índice de Autenticidade (se disponível) */}
      {authenticity && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Índice de Autenticidade
            </CardTitle>
            <CardDescription>
              Análise de padrões de resposta para detectar respostas genuínas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{(authenticity.tempoMedioResposta / 1000).toFixed(1)}s</p>
                <p className="text-xs text-muted-foreground">Tempo médio de resposta</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Zap className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                <p className="text-2xl font-bold">{authenticity.respostasSocialmenteDesejaveis}</p>
                <p className="text-xs text-muted-foreground">Respostas "ideais"</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
                <p className="text-2xl font-bold">{(authenticity.consistenciaInterna * 100).toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Consistência interna</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold">{authenticity.contradicoes.length}</p>
                <p className="text-xs text-muted-foreground">Contradições detectadas</p>
              </div>
            </div>

            {authenticity.contradicoes.length > 0 && (
              <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="font-medium text-amber-600 mb-2">Inconsistências detectadas em:</p>
                <div className="flex flex-wrap gap-2">
                  {authenticity.contradicoes.map((pilar) => (
                    <Badge key={pilar} variant="outline" className="text-amber-600 border-amber-500/30">
                      {BEHAVIORAL_PILLARS.find(p => p.id === pilar)?.nome || pilar}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tags Comportamentais */}
      {tagFrequency.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Padrões Comportamentais Identificados</CardTitle>
            <CardDescription>
              Tags mais frequentes baseadas nas respostas aos cenários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tagFrequency.map(({ tag, count }) => (
                <Badge 
                  key={tag}
                  variant="secondary"
                  className="text-sm px-3 py-1"
                >
                  {tag} 
                  <span className="ml-1 text-xs text-muted-foreground">({count}x)</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BehavioralResultsDashboard;
