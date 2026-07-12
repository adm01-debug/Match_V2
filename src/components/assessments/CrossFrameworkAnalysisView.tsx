/**
 * @fileoverview Componente de visualização de análise cross-framework
 * @module CrossFrameworkAnalysisView
 * 
 * Mostra análise cruzada entre:
 * - DISC
 * - Inteligência Geracional
 * - Perfil sob Stress
 * - Modelo 3 Cérebros
 */

import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Users, 
  Zap, 
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  Sparkles,
  Target,
  TrendingUp,
  Link
} from 'lucide-react';
import type { BehavioralResult } from '@/types/behavioral';
import type { GenerationType, BrainType, StressResponse } from '@/types/advancedBehavioral';
import { performCrossFrameworkAnalysis } from '@/lib/advancedBehavioralCalculator';
import { GENERATIONS_INFO, DISC_STRESS_INFO, TRIUNE_BRAIN_INFO } from '@/types/advancedBehavioral';
import { DISC_PROFILES_INFO } from '@/types/behavioral';

interface CrossFrameworkAnalysisViewProps {
  results: BehavioralResult[];
  className?: string;
}

export const CrossFrameworkAnalysisView = memo(function CrossFrameworkAnalysisView({
  results,
  className
}: CrossFrameworkAnalysisViewProps) {
  // Extrair perfis de cada ferramenta
  const extractedProfiles = useMemo(() => {
    let discProfile: 'D' | 'I' | 'S' | 'C' | undefined;
    let generationType: GenerationType | undefined;
    let stressResponse: StressResponse | undefined;
    let dominantBrain: BrainType | undefined;

    results.forEach(result => {
      switch (result.toolId) {
        case 'disc':
          const disc = result.primaryProfile?.toUpperCase();
          if (['D', 'I', 'S', 'C'].includes(disc || '')) {
            discProfile = disc as 'D' | 'I' | 'S' | 'C';
          }
          break;
        
        case 'generational':
          if (result.primaryProfile) {
            generationType = result.primaryProfile as GenerationType;
          }
          break;
        
        case 'stress_profile':
          const stressDisc = result.primaryProfile?.toUpperCase();
          if (['D', 'I', 'S', 'C'].includes(stressDisc || '')) {
            const stressInfo = DISC_STRESS_INFO[stressDisc as 'D' | 'I' | 'S' | 'C'];
            stressResponse = stressInfo?.respostaPrimaria;
          }
          break;
        
        case 'triune_brain':
          if (result.primaryProfile) {
            dominantBrain = result.primaryProfile as BrainType;
          }
          break;
      }
    });

    return { discProfile, generationType, stressResponse, dominantBrain };
  }, [results]);

  // Realizar análise cross-framework
  const analysis = useMemo(() => {
    return performCrossFrameworkAnalysis(
      extractedProfiles.discProfile,
      extractedProfiles.generationType,
      extractedProfiles.stressResponse,
      extractedProfiles.dominantBrain
    );
  }, [extractedProfiles]);

  // Verificar quantas ferramentas foram completadas
  const completedCount = Object.values(extractedProfiles).filter(Boolean).length;

  if (completedCount < 2) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Análise Cross-Framework
          </CardTitle>
          <CardDescription>
            Complete pelo menos 2 das 4 ferramentas avançadas para ver a análise cruzada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ProfileBadge 
              icon={<Brain className="h-4 w-4" />}
              label="DISC"
              value={extractedProfiles.discProfile}
              completed={!!extractedProfiles.discProfile}
            />
            <ProfileBadge 
              icon={<Users className="h-4 w-4" />}
              label="Geração"
              value={extractedProfiles.generationType ? 
                GENERATIONS_INFO[extractedProfiles.generationType]?.nome : undefined}
              completed={!!extractedProfiles.generationType}
            />
            <ProfileBadge 
              icon={<Zap className="h-4 w-4" />}
              label="Stress"
              value={extractedProfiles.stressResponse}
              completed={!!extractedProfiles.stressResponse}
            />
            <ProfileBadge 
              icon={<Lightbulb className="h-4 w-4" />}
              label="Cérebro"
              value={extractedProfiles.dominantBrain ? 
                TRIUNE_BRAIN_INFO[extractedProfiles.dominantBrain]?.nome : undefined}
              completed={!!extractedProfiles.dominantBrain}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Análise Cross-Framework
        </CardTitle>
        <CardDescription>
          Integração entre {completedCount} perfis comportamentais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Perfis Identificados */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {extractedProfiles.discProfile && (
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <Brain className="h-6 w-6 mx-auto mb-1 text-info" />
              <div className="text-sm font-medium">DISC</div>
              <Badge className={DISC_PROFILES_INFO[extractedProfiles.discProfile]?.cor}>
                {extractedProfiles.discProfile} - {DISC_PROFILES_INFO[extractedProfiles.discProfile]?.nome}
              </Badge>
            </div>
          )}
          
          {extractedProfiles.generationType && (
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <Users className="h-6 w-6 mx-auto mb-1 text-primary" />
              <div className="text-sm font-medium">Geração</div>
              <Badge className={GENERATIONS_INFO[extractedProfiles.generationType]?.cor}>
                {GENERATIONS_INFO[extractedProfiles.generationType]?.nome}
              </Badge>
            </div>
          )}
          
          {extractedProfiles.stressResponse && (
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <Zap className="h-6 w-6 mx-auto mb-1 text-warning" />
              <div className="text-sm font-medium">Sob Stress</div>
              <Badge variant="outline" className="capitalize">
                {extractedProfiles.stressResponse}
              </Badge>
            </div>
          )}
          
          {extractedProfiles.dominantBrain && (
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <Lightbulb className="h-6 w-6 mx-auto mb-1 text-success" />
              <div className="text-sm font-medium">Cérebro</div>
              <Badge className={TRIUNE_BRAIN_INFO[extractedProfiles.dominantBrain]?.cor}>
                {TRIUNE_BRAIN_INFO[extractedProfiles.dominantBrain]?.nome}
              </Badge>
            </div>
          )}
        </div>

        {/* Consistência Geral */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Consistência do Perfil
            </span>
            <span className={`font-bold ${
              analysis.overallConsistency >= 70 ? 'text-success' :
              analysis.overallConsistency >= 50 ? 'text-warning' :
              'text-warning'
            }`}>
              {analysis.overallConsistency}%
            </span>
          </div>
          <Progress value={analysis.overallConsistency} className="h-3" />
          <p className="text-xs text-muted-foreground">
            {analysis.overallConsistency >= 70 ? 
              'Perfis altamente consistentes - comportamentos previsíveis' :
              analysis.overallConsistency >= 50 ?
              'Perfis moderadamente consistentes - algumas tensões podem existir' :
              'Perfis com tensões - requer atenção em contextos específicos'
            }
          </p>
        </div>

        <Separator />

        {/* Sinergias e Tensões */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sinergias */}
          {analysis.synergies.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Sinergias Identificadas
              </h4>
              <ul className="space-y-2">
                {analysis.synergies.map((synergy, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-success shrink-0">✓</span>
                    {synergy}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tensões */}
          {analysis.tensions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Tensões Potenciais
              </h4>
              <ul className="space-y-2">
                {analysis.tensions.map((tension, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-warning shrink-0">⚠️</span>
                    {tension}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Estratégia de Comunicação */}
        {analysis.communicationStrategy && (
          <div className="space-y-2 pt-2 border-t">
            <h4 className="font-medium flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-info" />
              Estratégia de Comunicação
            </h4>
            <p className="text-sm text-muted-foreground">
              {analysis.communicationStrategy}
            </p>
          </div>
        )}

        {/* Recomendações */}
        {analysis.recommendations.length > 0 && (
          <div className="space-y-3 pt-2 border-t">
            <h4 className="font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Recomendações de Gestão
            </h4>
            <div className="grid md:grid-cols-2 gap-2">
              {analysis.recommendations.slice(0, 6).map((rec, i) => (
                <div 
                  key={i} 
                  className="text-sm p-2 rounded-lg bg-primary/5 border border-primary/10"
                >
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

// Componente auxiliar para badge de perfil
function ProfileBadge({ 
  icon, 
  label, 
  value, 
  completed 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value?: string; 
  completed: boolean;
}) {
  return (
    <div className={`p-3 rounded-lg text-center transition-colors ${
      completed ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30 border border-dashed'
    }`}>
      <div className={`mx-auto mb-1 ${completed ? 'text-primary' : 'text-muted-foreground'}`}>
        {icon}
      </div>
      <div className="text-xs font-medium">{label}</div>
      {completed ? (
        <Badge variant="secondary" className="text-xs mt-1">{value}</Badge>
      ) : (
        <span className="text-xs text-muted-foreground">Pendente</span>
      )}
    </div>
  );
}

export default CrossFrameworkAnalysisView;
