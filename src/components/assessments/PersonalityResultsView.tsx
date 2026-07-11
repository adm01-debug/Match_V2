/**
 * @module PersonalityResultsView
 * @description Visualização completa dos resultados de testes de personalidade.
 * Orquestra as três abas (Big Five, MBTI, Eneagrama) — cada framework foi
 * extraído para um subcomponente dedicado em `./personality/*`.
 */

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Users, Compass, Shield, Sparkles, X } from 'lucide-react';
import type { PersonalityAssessment } from '@/types/personality';
import { BigFiveResults } from './personality/BigFiveResults';
import { MBTIResults } from './personality/MBTIResults';
import { EnneagramResults } from './personality/EnneagramResults';

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
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Resultados do Teste de Personalidade
              </CardTitle>
              <CardDescription>Análise completa do seu perfil psicológico</CardDescription>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {hasMBTI && frameworks.mbti && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 text-primary">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Tipo MBTI</span>
                </div>
                <p className="text-2xl font-bold mt-1">{frameworks.mbti.type}</p>
                <p className="text-sm text-muted-foreground">{frameworks.mbti.typeName}</p>
              </div>
            )}

            {hasEnneagram && frameworks.enneagram && (
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-center gap-2 text-warning">
                  <Compass className="h-4 w-4" />
                  <span className="text-sm font-medium">Eneagrama</span>
                </div>
                <p className="text-2xl font-bold mt-1">Tipo {frameworks.enneagram.coreType}</p>
                <p className="text-sm text-muted-foreground">{frameworks.enneagram.typeName}</p>
              </div>
            )}

            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 text-success">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Consistência</span>
              </div>
              <p className="text-2xl font-bold mt-1">{results.overallConsistency}%</p>
              <p className="text-sm text-muted-foreground">Confiabilidade das respostas</p>
            </div>
          </div>
        </CardHeader>
      </Card>

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
