/**
 * @module PersonalityResultsView
 * @description Visualização completa dos resultados de testes de personalidade
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Users, 
  Compass, 
  TrendingUp,
  Target,
  Lightbulb,
  Heart,
  Shield,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import type { PersonalityAssessment, BigFiveResult, MBTIResult, EnneagramResult } from '@/types/personality';

interface PersonalityResultsViewProps {
  results: PersonalityAssessment;
  onClose?: () => void;
}

export function PersonalityResultsView({ results, onClose }: PersonalityResultsViewProps) {
  const { frameworks } = results;
  const hasBigFive = !!frameworks.bigFive;
  const hasMBTI = !!frameworks.mbti;
  const hasEnneagram = !!frameworks.enneagram;

  const defaultTab = hasBigFive ? 'bigfive' : hasMBTI ? 'mbti' : 'enneagram';

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Resultados do Teste de Personalidade
              </CardTitle>
              <CardDescription>
                Análise completa do seu perfil psicológico
              </CardDescription>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Resumo Rápido */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {hasMBTI && frameworks.mbti && (
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Tipo MBTI</span>
                </div>
                <p className="text-2xl font-bold mt-1">{frameworks.mbti.type}</p>
                <p className="text-sm text-muted-foreground">{frameworks.mbti.typeName}</p>
              </div>
            )}

            {hasEnneagram && frameworks.enneagram && (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Compass className="h-4 w-4" />
                  <span className="text-sm font-medium">Eneagrama</span>
                </div>
                <p className="text-2xl font-bold mt-1">Tipo {frameworks.enneagram.coreType}</p>
                <p className="text-sm text-muted-foreground">{frameworks.enneagram.typeName}</p>
              </div>
            )}

            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Consistência</span>
              </div>
              <p className="text-2xl font-bold mt-1">{results.overallConsistency}%</p>
              <p className="text-sm text-muted-foreground">Confiabilidade das respostas</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs de Resultados */}
      <Tabs defaultValue={defaultTab}>
        <TabsList className="grid w-full grid-cols-3">
          {hasBigFive && (
            <TabsTrigger value="bigfive" className="gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Big Five</span>
            </TabsTrigger>
          )}
          {hasMBTI && (
            <TabsTrigger value="mbti" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">MBTI</span>
            </TabsTrigger>
          )}
          {hasEnneagram && (
            <TabsTrigger value="enneagram" className="gap-2">
              <Compass className="h-4 w-4" />
              <span className="hidden sm:inline">Eneagrama</span>
            </TabsTrigger>
          )}
        </TabsList>

        {hasBigFive && frameworks.bigFive && (
          <TabsContent value="bigfive">
            <BigFiveResults result={frameworks.bigFive} />
          </TabsContent>
        )}

        {hasMBTI && frameworks.mbti && (
          <TabsContent value="mbti">
            <MBTIResults result={frameworks.mbti} />
          </TabsContent>
        )}

        {hasEnneagram && frameworks.enneagram && (
          <TabsContent value="enneagram">
            <EnneagramResults result={frameworks.enneagram} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

// ================================
// BIG FIVE RESULTS
// ================================

function BigFiveResults({ result }: { result: BigFiveResult }) {
  return (
    <div className="space-y-6">
      {/* Dimensões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Dimensões OCEAN
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {result.dimensions.map((dim) => (
            <div key={dim.dimension} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{dim.label}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    Percentil {dim.percentile}
                  </Badge>
                </div>
                <span className="text-2xl font-bold">{dim.score}%</span>
              </div>
              <Progress 
                value={dim.score} 
                className="h-3"
              />
              <div className="flex flex-wrap gap-1 mt-1">
                {dim.strengths.slice(0, 3).map((s, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Estilo de Trabalho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{result.workStyle}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Comunicação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{result.communicationStyle}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Papel na Equipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{result.teamRole}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              {result.developmentAreas.slice(0, 3).map((area, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 mt-1 shrink-0" />
                  {area}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ================================
// MBTI RESULTS
// ================================

function MBTIResults({ result }: { result: MBTIResult }) {
  return (
    <div className="space-y-6">
      {/* Tipo Principal */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-2">{result.type}</div>
            <p className="text-xl font-medium">{result.typeName}</p>
            <p className="text-muted-foreground">{result.typeNickname}</p>
            <p className="mt-4 max-w-xl mx-auto text-sm">{result.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Dicotomias */}
      <Card>
        <CardHeader>
          <CardTitle>Preferências Cognitivas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {result.dichotomies.map((dic) => (
            <div key={dic.dimension} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={dic.leftScore < 50 ? 'font-bold text-primary' : 'text-muted-foreground'}>
                  {dic.leftLabel}
                </span>
                <span className={dic.leftScore >= 50 ? 'font-bold text-primary' : 'text-muted-foreground'}>
                  {dic.rightLabel}
                </span>
              </div>
              <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-primary/30 rounded-full"
                  style={{ width: `${100 - dic.leftScore}%` }}
                />
                <div 
                  className="absolute inset-y-0 right-0 bg-primary/30 rounded-full"
                  style={{ width: `${dic.leftScore}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg"
                  style={{ left: `calc(${dic.leftScore}% - 8px)` }}
                />
              </div>
              <div className="text-xs text-center text-muted-foreground">
                Clareza: {dic.clarity}%
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Funções Cognitivas */}
      <Card>
        <CardHeader>
          <CardTitle>Funções Cognitivas</CardTitle>
          <CardDescription>Stack cognitivo do seu tipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.cognitiveFunctions.map((func) => (
              <div key={func.function} className="flex items-center gap-4">
                <div className="w-16 text-center">
                  <div className="text-lg font-mono font-bold">{func.function}</div>
                  <div className="text-xs text-muted-foreground capitalize">{func.role}</div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{func.label}</span>
                    <span>{func.strength}%</span>
                  </div>
                  <Progress value={func.strength} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pontos Fortes e Fracos */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-green-600">Pontos Fortes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {result.strengths.map((s, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-amber-600">Áreas de Crescimento</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {result.growthAreas.map((a, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-amber-500">→</span>
                  {a}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ================================
// ENNEAGRAM RESULTS
// ================================

function EnneagramResults({ result }: { result: EnneagramResult }) {
  return (
    <div className="space-y-6">
      {/* Tipo Principal */}
      <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-2">Tipo {result.coreType}</div>
            <p className="text-xl font-medium">{result.typeName}</p>
            <Badge className="mt-2">{result.wing}</Badge>
            <p className="mt-4 max-w-xl mx-auto text-sm">{result.typeDescription}</p>
          </div>
        </CardContent>
      </Card>

      {/* Scores por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição dos Tipos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {result.typeScores
              .sort((a, b) => b.score - a.score)
              .map((type) => (
                <div 
                  key={type.type} 
                  className={`p-3 rounded-lg border ${
                    type.isCore ? 'border-primary bg-primary/5' : 
                    type.isWing ? 'border-amber-500/50 bg-amber-500/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">Tipo {type.type}</span>
                    <span className="text-lg font-bold">{type.score}%</span>
                  </div>
                  <Progress value={type.score} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{type.name}</p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivações e Medos */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-green-500" />
              Motivação Central
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{result.coreMotivation}</p>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">
              <strong>Desejo básico:</strong> {result.coreDesire}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              Medo Central
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{result.coreFear}</p>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">
              <strong>Vício básico:</strong> {result.basicVice}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Integração e Desintegração */}
      <Card>
        <CardHeader>
          <CardTitle>Padrões de Integração</CardTitle>
          <CardDescription>Como você se comporta sob stress e em crescimento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-red-600 mb-2">
                Sob Stress → Tipo {result.integration.stressDirection}
              </h4>
              <ul className="space-y-1">
                {result.integration.stressBehaviors.map((b, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-red-400">↓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-600 mb-2">
                Em Crescimento → Tipo {result.integration.growthDirection}
              </h4>
              <ul className="space-y-1">
                {result.integration.growthBehaviors.map((b, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-400">↑</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instintos */}
      <Card>
        <CardHeader>
          <CardTitle>Stack de Instintos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {result.instinctStack.map((instinct, idx) => (
              <Badge 
                key={instinct} 
                variant={idx === 0 ? 'default' : 'secondary'}
                className="capitalize"
              >
                {idx + 1}. {instinct.replace('autopreservacao', 'Auto-preservação')}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
