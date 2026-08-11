/**
 * @fileoverview Página de Avaliação Comportamental Imersiva
 * Sistema completo de avaliação baseado nos 10 pilares do comportamento
 */

import { logger } from '@/services/logger';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ImmersiveScenarioPlayer,
  type ScenarioResponse,
} from '@/components/assessments/ImmersiveScenarioPlayer';
import { CompanyProfileBuilder } from '@/components/assessments/CompanyProfileBuilder';
import { BehavioralResultsDashboard } from '@/components/assessments/BehavioralResultsDashboard';
import { BehavioralHeroStats } from '@/components/assessments/behavioral/BehavioralHeroStats';
import { BehavioralIntroTab } from '@/components/assessments/behavioral/BehavioralIntroTab';
import { BehavioralPilaresTab } from '@/components/assessments/behavioral/BehavioralPilaresTab';
import { type CompanyProfile } from '@/config/behavioralPillars';
import { useBehavioralAssessment } from '@/hooks/useBehavioralAssessmentResults';
import { useBehavioralScoreCalculation } from '@/hooks/useBehavioralScoreCalculation';
import { selectBalancedScenarios } from '@/data/immersiveScenariosData';
import { Brain, Play, Target, Building2, BarChart3, CheckCircle2, Loader2 } from 'lucide-react';

type AssessmentPhase = 'intro' | 'assessment' | 'results';

export default function BehavioralAssessmentPage() {
  usePageTitle('Avaliação Comportamental');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('avaliar');

  const { isLoading: isSaving, completeAssessment } = useBehavioralAssessment();

  const [phase, setPhase] = useState<AssessmentPhase>('intro');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [responses, setResponses] = useState<ScenarioResponse[]>([]);
  const [skippedCount, setSkippedCount] = useState(0);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [hasSavedResults, setHasSavedResults] = useState(false);

  const scenarios = useMemo(() => selectBalancedScenarios(10, true), []);
  const { calculatedScores, authenticityMetrics, predictiveFit } =
    useBehavioralScoreCalculation(responses, companyProfile);

  const handleScenarioComplete = useCallback((response: ScenarioResponse) => {
    setResponses(prev => [...prev, response]);
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
    } else {
      setPhase('results');
    }
  }, [currentScenarioIndex, scenarios.length]);

  const handleSkipScenario = useCallback(() => {
    setSkippedCount(prev => prev + 1);
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
    } else {
      setPhase('results');
    }
  }, [currentScenarioIndex, scenarios.length]);

  const handleStartAssessment = () => {
    setPhase('assessment');
    setCurrentScenarioIndex(0);
    setResponses([]);
    setSkippedCount(0);
    setHasSavedResults(false);
  };

  useEffect(() => {
    if (phase === 'results' && responses.length > 0 && !hasSavedResults) {
      (async () => {
        try {
          await completeAssessment(
            calculatedScores,
            responses,
            authenticityMetrics,
            predictiveFit,
            responses.length,
            skippedCount,
          );
          setHasSavedResults(true);
        } catch (error) {
          logger.error('Erro ao salvar resultados:', error);
        }
      })();
    }
  }, [phase, responses, calculatedScores, authenticityMetrics, predictiveFit, skippedCount, hasSavedResults, completeAssessment]);

  if (phase === 'assessment') {
    const currentScenario = scenarios[currentScenarioIndex];
    if (!currentScenario) {
      setPhase('results');
      return null;
    }
    return (
      <ImmersiveScenarioPlayer
        scenario={currentScenario}
        onComplete={handleScenarioComplete}
        onSkip={handleSkipScenario}
        scenarioIndex={currentScenarioIndex}
        totalScenarios={scenarios.length}
      />
    );
  }

  if (phase === 'results') {
    return (
      <Layout title="Resultado da Avaliação">
        <div className="p-6 space-y-6 animate-fade-in">
          <BehavioralResultsDashboard
            candidatoNome="Candidato Avaliado"
            vagaTitulo="Vaga Demo"
            scores={calculatedScores}
            companyProfile={companyProfile?.pilaresValorizados}
            authenticity={authenticityMetrics}
            predictiveFit={predictiveFit}
          />

          {isSaving && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Salvando resultados...</span>
            </div>
          )}

          {hasSavedResults && (
            <div className="flex items-center justify-center gap-2 text-success">
              <CheckCircle2 className="h-4 w-4" />
              <span>Resultados salvos com sucesso!</span>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setPhase('intro')}>
              Nova Avaliação
            </Button>
            <Button onClick={() => navigate('/talentos')}>Voltar para Talentos</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Avaliação Comportamental">
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Sistema de Inteligência Comportamental
            </h1>
            <p className="text-muted-foreground">
              Avaliação profunda baseada nos 10 pilares do comportamento
            </p>
          </div>
        </div>

        <BehavioralHeroStats />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="avaliar" className="gap-2">
              <Play className="h-4 w-4" />Avaliar
            </TabsTrigger>
            <TabsTrigger value="pilares" className="gap-2">
              <Target className="h-4 w-4" />Pilares
            </TabsTrigger>
            <TabsTrigger value="empresa" className="gap-2">
              <Building2 className="h-4 w-4" />Empresa
            </TabsTrigger>
            <TabsTrigger value="resultados" className="gap-2">
              <BarChart3 className="h-4 w-4" />Resultados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="avaliar" className="mt-6">
            <BehavioralIntroTab onStart={handleStartAssessment} />
          </TabsContent>

          <TabsContent value="pilares" className="mt-6">
            <BehavioralPilaresTab />
          </TabsContent>

          <TabsContent value="empresa" className="mt-6">
            <CompanyProfileBuilder
              initialProfile={companyProfile || undefined}
              onSave={setCompanyProfile}
            />
          </TabsContent>

          <TabsContent value="resultados" className="mt-6">
            <BehavioralResultsDashboard
              candidatoNome="Exemplo de Resultado"
              vagaTitulo="Desenvolvedor Sênior"
              scores={calculatedScores}
              companyProfile={companyProfile?.pilaresValorizados}
              predictiveFit={predictiveFit}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
