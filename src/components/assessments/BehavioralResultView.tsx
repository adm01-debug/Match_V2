/**
 * @module BehavioralResultView
 * @description Visualização dos resultados de qualquer ferramenta comportamental
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Eye, Lightbulb, Zap, MessageSquare, Heart, 
  Target, Sparkles, AlertTriangle, Users, CheckCircle2,
  TrendingUp, Clock
} from 'lucide-react';
import type { BehavioralResult, BehavioralTool } from '@/types/behavioral';
import { BEHAVIORAL_TOOLS } from '@/types/behavioral';

interface BehavioralResultViewProps {
  result: BehavioralResult;
  candidatoNome?: string;
  showDetails?: boolean;
}

const TOOL_ICONS: Record<string, React.ReactNode> = {
  disc: <Brain className="h-6 w-6" />,
  vakd: <Eye className="h-6 w-6" />,
  metaprograms: <Lightbulb className="h-6 w-6" />,
  mental_triggers: <Zap className="h-6 w-6" />,
  sleight_of_mouth: <MessageSquare className="h-6 w-6" />,
  emotional_states: <Heart className="h-6 w-6" />,
  values: <Target className="h-6 w-6" />,
  emotional_intelligence: <Sparkles className="h-6 w-6" />,
  cognitive_biases: <AlertTriangle className="h-6 w-6" />,
  rapport: <Users className="h-6 w-6" />,
};

const DIMENSION_LABELS: Record<string, Record<string, string>> = {
  disc: {
    D: 'Dominância',
    I: 'Influência',
    S: 'Estabilidade',
    C: 'Conformidade',
  },
  vakd: {
    V: 'Visual',
    A: 'Auditivo',
    K: 'Cinestésico',
    D: 'Digital',
  },
  metaprograms: {
    approach: 'Aproximação/Afastamento',
    reference: 'Interno/Externo',
    options: 'Opções/Procedimentos',
    scope: 'Geral/Específico',
    change: 'Semelhança/Diferença',
    initiative: 'Proativo/Reativo',
    affiliation: 'Independente/Cooperativo',
    comparison: 'Semelhança/Diferença',
  },
  mental_triggers: {
    scarcity: 'Escassez',
    authority: 'Autoridade',
    social_proof: 'Prova Social',
    reciprocity: 'Reciprocidade',
    commitment: 'Compromisso',
    liking: 'Afinidade',
  },
  emotional_intelligence: {
    self_awareness: 'Autoconsciência',
    self_regulation: 'Autorregulação',
    motivation: 'Motivação',
    empathy: 'Empatia',
    social_skills: 'Habilidades Sociais',
  },
  emotional_states: {
    self_awareness: 'Autoconsciência',
    state_management: 'Gestão de Estados',
    empathy: 'Empatia',
    anchoring: 'Ancoragem',
    recovery: 'Recuperação',
    influence: 'Influência',
  },
  cognitive_biases: {
    sunk_cost: 'Custo Afundado',
    confirmation: 'Confirmação',
    hindsight: 'Retrospectiva',
    attribution: 'Atribuição',
    planning: 'Planejamento',
    anchoring: 'Ancoragem',
    availability: 'Disponibilidade',
    overconfidence: 'Excesso de Confiança',
  },
  rapport: {
    voice_matching: 'Espelhamento de Voz',
    body_matching: 'Espelhamento Corporal',
    connection: 'Conexão',
    language_matching: 'Espelhamento Linguístico',
    awareness: 'Consciência',
    adjustment: 'Ajuste',
  },
  values: {
    autonomy: 'Autonomia',
    recognition: 'Reconhecimento',
    security: 'Segurança',
    growth: 'Crescimento',
    purpose: 'Propósito',
    financial: 'Financeiro',
    challenge: 'Desafio',
    culture: 'Cultura',
    balance: 'Equilíbrio',
  },
  sleight_of_mouth: {
    reframe: 'Reframe',
    consequence: 'Consequência',
    counter_example: 'Contra-exemplo',
    redefine: 'Redefinição',
    meta_frame: 'Meta-Frame',
    chunk_down: 'Chunk Down',
    intention: 'Intenção',
    another_outcome: 'Outro Resultado',
    natural_pattern: 'Padrão Natural',
  },
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

const getScoreTextColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

export function BehavioralResultView({ 
  result, 
  candidatoNome, 
  showDetails = true 
}: BehavioralResultViewProps) {
  const tool = BEHAVIORAL_TOOLS.find((t: BehavioralTool) => t.id === result.toolId);
  
  if (!tool) return null;

  const sortedScores = Object.entries(result.scores)
    .sort(([, a], [, b]) => (b as number) - (a as number)) as [string, number][];

  const getDimensionLabel = (dimension: string) => {
    return DIMENSION_LABELS[result.toolId]?.[dimension] || dimension.replace(/_/g, ' ');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const scoresArray = Object.values(result.scores) as number[];
  const averageScore = scoresArray.length > 0
    ? Math.round(scoresArray.reduce((a, b) => a + b, 0) / scoresArray.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2" style={{ borderColor: tool.color }}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="p-3 rounded-xl text-white"
                style={{ backgroundColor: tool.color }}
              >
                {TOOL_ICONS[result.toolId]}
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {tool.name}
                  {candidatoNome && (
                    <span className="text-muted-foreground font-normal">- {candidatoNome}</span>
                  )}
                </CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreTextColor(averageScore)}`}>
                {averageScore}%
              </div>
              <span className="text-sm text-muted-foreground">Score Médio</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary & Secondary Profile */}
          <div className="flex flex-wrap gap-3">
            <Badge 
              className="text-white text-base px-4 py-2"
              style={{ backgroundColor: tool.color }}
            >
              {getDimensionLabel(result.primaryProfile)}
              <span className="ml-2 opacity-75">(Primário)</span>
            </Badge>
            {result.secondaryProfile && (
              <Badge 
                variant="outline" 
                className="text-base px-4 py-2 border-2"
                style={{ borderColor: tool.color, color: tool.color }}
              >
                {getDimensionLabel(result.secondaryProfile)}
                <span className="ml-2 opacity-50">(Secundário)</span>
              </Badge>
            )}
          </div>

          {/* Time Spent */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Tempo: {formatTime(result.timeSpent)}
          </div>
        </CardContent>
      </Card>

      {/* Scores by Dimension */}
      {showDetails && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" style={{ color: tool.color }} />
              Scores por Dimensão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedScores.map(([dimension, score]) => (
              <div key={dimension} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium capitalize">
                    {getDimensionLabel(dimension)}
                  </span>
                  <span className={`font-bold ${getScoreTextColor(score)}`}>
                    {score}%
                  </span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 ${getScoreColor(score)} rounded-full transition-all duration-500`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      {showDetails && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Strengths */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Pontos Fortes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {sortedScores
                  .filter(([, score]) => score >= 70)
                  .slice(0, 4)
                  .map(([dimension, score]) => (
                    <li key={dimension} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="capitalize">{getDimensionLabel(dimension)}</span>
                      </div>
                      <span className="font-semibold text-green-600">{score}%</span>
                    </li>
                  ))}
                {sortedScores.filter(([, score]) => score >= 70).length === 0 && (
                  <li className="text-sm text-muted-foreground text-center py-4">
                    Continue praticando para desenvolver seus pontos fortes
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Development Areas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Áreas de Desenvolvimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {sortedScores
                  .filter(([, score]) => score < 60)
                  .reverse()
                  .slice(0, 4)
                  .map(([dimension, score]) => (
                    <li key={dimension} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="capitalize">{getDimensionLabel(dimension)}</span>
                      </div>
                      <span className="font-semibold text-blue-600">{score}%</span>
                    </li>
                  ))}
                {sortedScores.filter(([, score]) => score < 60).length === 0 && (
                  <li className="text-sm text-muted-foreground text-center py-4">
                    Excelente! Todas as áreas estão bem desenvolvidas ✨
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
