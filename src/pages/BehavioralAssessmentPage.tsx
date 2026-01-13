/**
 * @fileoverview Página de Avaliação Comportamental Imersiva
 * Sistema completo de avaliação baseado nos 10 pilares do comportamento
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ImmersiveScenarioPlayer,
  type ScenarioResponse 
} from '@/components/assessments/ImmersiveScenarioPlayer';
import { CompanyProfileBuilder } from '@/components/assessments/CompanyProfileBuilder';
import { BehavioralResultsDashboard } from '@/components/assessments/BehavioralResultsDashboard';
import { 
  BEHAVIORAL_PILLARS, 
  IMMERSIVE_SCENARIOS,
  type CompanyProfile,
  type PredictiveFitAnalysis,
  type AuthenticityMetrics
} from '@/config/behavioralPillars';
import { useBehavioralAssessment } from '@/hooks/useBehavioralAssessmentResults';
import { 
  Brain, 
  Play, 
  Target, 
  Building2, 
  BarChart3,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Clock,
  Zap,
  Shield,
  Scale,
  Crown,
  Shuffle,
  Rocket,
  MessageCircle,
  Heart,
  Users,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

type AssessmentPhase = 'intro' | 'assessment' | 'results';

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

export default function BehavioralAssessmentPage() {
  usePageTitle('Avaliação Comportamental');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('avaliar');
  
  // Hook para salvar no banco de dados
  const { 
    isLoading: isSaving, 
    completeAssessment,
  } = useBehavioralAssessment();
  
  // Estado da avaliação
  const [phase, setPhase] = useState<AssessmentPhase>('intro');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [responses, setResponses] = useState<ScenarioResponse[]>([]);
  const [skippedCount, setSkippedCount] = useState(0);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [hasSavedResults, setHasSavedResults] = useState(false);
  
  // Cenários selecionados (podemos randomizar ou filtrar)
  const scenarios = useMemo(() => {
    // Importa cenários expandidos se disponíveis, senão usa os originais
    try {
      const { selectBalancedScenarios } = require('@/data/immersiveScenariosData');
      return selectBalancedScenarios(10, true);
    } catch {
      return IMMERSIVE_SCENARIOS.slice(0, 5);
    }
  }, []);

  // Calcular scores baseados nas respostas
  const calculatedScores = useMemo(() => {
    if (responses.length === 0) {
      // Mock data para demo
      return {
        resiliencia: 78,
        integridade: 92,
        colaboracao: 85,
        lideranca: 72,
        adaptabilidade: 88,
        proatividade: 76,
        comunicacao: 81,
        pensamento_critico: 89,
        inteligencia_emocional: 74,
        orientacao_resultados: 83,
      };
    }

    const scores: Record<string, number[]> = {};
    BEHAVIORAL_PILLARS.forEach(p => { scores[p.id] = []; });

    responses.forEach(response => {
      const scenario = IMMERSIVE_SCENARIOS.find(s => s.id === response.scenarioId);
      if (!scenario) return;

      const option = scenario.opcoes.find(o => o.id === response.selectedOption);
      if (!option) return;

      Object.entries(option.impacto).forEach(([pilarId, impact]) => {
        // Normaliza impacto de -3 a +3 para 0-100
        const normalizedScore = ((impact + 3) / 6) * 100;
        if (scores[pilarId]) scores[pilarId].push(normalizedScore);
      });
    });

    const finalScores: Record<string, number> = {};
    Object.entries(scores).forEach(([pilarId, values]) => {
      if (values.length > 0) {
        finalScores[pilarId] = values.reduce((a, b) => a + b, 0) / values.length;
      } else {
        finalScores[pilarId] = 50; // Default neutro
      }
    });

    return finalScores;
  }, [responses]);

  // Métricas de autenticidade
  const authenticityMetrics = useMemo((): AuthenticityMetrics | undefined => {
    if (responses.length === 0) return undefined;

    const times = responses.map(r => r.timeToRespond);
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const variance = times.reduce((acc, t) => acc + Math.pow(t - avgTime, 2), 0) / times.length;

    // Conta respostas "socialmente desejáveis"
    let sociallyDesirable = 0;
    responses.forEach(response => {
      const scenario = IMMERSIVE_SCENARIOS.find(s => s.id === response.scenarioId);
      const option = scenario?.opcoes.find(o => o.id === response.selectedOption);
      if (option?.socialmenteDesejavel) sociallyDesirable++;
    });

    return {
      tempoMedioResposta: avgTime,
      variacaoTempo: Math.sqrt(variance),
      respostasSocialmenteDesejaveis: sociallyDesirable,
      consistenciaInterna: 0.85, // Simplificado
      complexidadeResposta: 0.7,
      contradicoes: [],
    };
  }, [responses]);

  // Análise preditiva de fit
  const predictiveFit = useMemo((): PredictiveFitAnalysis | undefined => {
    if (!companyProfile) return undefined;

    const fitPorPilar: Record<string, { empresa: number; candidato: number; gap: number }> = {};
    let totalGap = 0;
    
    BEHAVIORAL_PILLARS.forEach(pilar => {
      const empresaPeso = (companyProfile.pilaresValorizados[pilar.id] || 5) * 10;
      const candidatoScore = calculatedScores[pilar.id] || 50;
      const gap = Math.abs(candidatoScore - empresaPeso);
      
      fitPorPilar[pilar.id] = { empresa: empresaPeso, candidato: candidatoScore, gap };
      totalGap += gap * (companyProfile.pilaresValorizados[pilar.id] || 5) / 10; // Ponderado
    });

    const fitGeral = Math.max(0, 100 - (totalGap / 10));

    // Identificar riscos e potencializadores
    const riscos: PredictiveFitAnalysis['riscos'] = [];
    const potencializadores: PredictiveFitAnalysis['potencializadores'] = [];

    Object.entries(fitPorPilar).forEach(([pilarId, data]) => {
      const pilar = BEHAVIORAL_PILLARS.find(p => p.id === pilarId);
      if (!pilar) return;

      if (data.candidato > data.empresa + 20) {
        potencializadores.push({
          pilar: pilar.nome,
          descricao: `Excede expectativa em ${(data.candidato - data.empresa).toFixed(0)} pontos`,
        });
      } else if (data.candidato < data.empresa - 20) {
        const severidade = data.gap > 40 ? 'alto' : data.gap > 25 ? 'medio' : 'baixo';
        riscos.push({
          pilar: pilar.nome,
          severidade,
          descricao: `Gap de ${data.gap.toFixed(0)} pontos em relação à expectativa`,
        });
      }
    });

    const recomendacao: PredictiveFitAnalysis['recomendacao'] = 
      fitGeral >= 80 ? 'fortemente_recomendado' :
      fitGeral >= 65 ? 'recomendado' :
      fitGeral >= 50 ? 'neutro' :
      fitGeral >= 35 ? 'cautela' : 'nao_recomendado';

    return {
      fitGeral,
      fitPorPilar,
      riscos,
      potencializadores,
      recomendacao,
      justificativa: generateJustificativa(fitGeral, riscos.length, potencializadores.length),
    };
  }, [companyProfile, calculatedScores]);

  // Gerar justificativa
  function generateJustificativa(fit: number, riscos: number, pontos: number): string {
    if (fit >= 80) {
      return `Excelente alinhamento comportamental com a cultura da empresa. ${pontos} áreas onde o candidato supera expectativas.`;
    } else if (fit >= 65) {
      return `Bom alinhamento geral com alguns pontos de atenção. ${riscos} área(s) podem requerer desenvolvimento.`;
    } else if (fit >= 50) {
      return `Alinhamento moderado. Recomenda-se análise detalhada das ${riscos} áreas de gap identificadas.`;
    } else {
      return `Alinhamento abaixo do esperado. ${riscos} áreas críticas de divergência com a cultura organizacional.`;
    }
  }

  // Handlers
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

  const handleSaveCompanyProfile = (profile: CompanyProfile) => {
    setCompanyProfile(profile);
  };
  
  // Salvar resultados quando a avaliação for concluída
  useEffect(() => {
    if (phase === 'results' && responses.length > 0 && !hasSavedResults) {
      const saveResults = async () => {
        try {
          await completeAssessment(
            calculatedScores,
            responses,
            authenticityMetrics,
            predictiveFit,
            responses.length,
            skippedCount
          );
          setHasSavedResults(true);
        } catch (error) {
          console.error('Erro ao salvar resultados:', error);
        }
      };
      saveResults();
    }
  }, [phase, responses, calculatedScores, authenticityMetrics, predictiveFit, skippedCount, hasSavedResults, completeAssessment]);

  // Render assessment phase
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

  // Render results
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
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Resultados salvos com sucesso!</span>
            </div>
          )}
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setPhase('intro')}>
              Nova Avaliação
            </Button>
            <Button onClick={() => navigate('/talentos')}>
              Voltar para Talentos
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Render intro/hub
  return (
    <Layout title="Avaliação Comportamental">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">10</p>
                  <p className="text-xs text-muted-foreground">Pilares</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <Zap className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{IMMERSIVE_SCENARIOS.length}</p>
                  <p className="text-xs text-muted-foreground">Cenários</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">15-20</p>
                  <p className="text-xs text-muted-foreground">Minutos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">IA</p>
                  <p className="text-xs text-muted-foreground">Análise Preditiva</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="avaliar" className="gap-2">
              <Play className="h-4 w-4" />
              Avaliar
            </TabsTrigger>
            <TabsTrigger value="pilares" className="gap-2">
              <Target className="h-4 w-4" />
              Pilares
            </TabsTrigger>
            <TabsTrigger value="empresa" className="gap-2">
              <Building2 className="h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="resultados" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Resultados
            </TabsTrigger>
          </TabsList>

          {/* TAB: Iniciar Avaliação */}
          <TabsContent value="avaliar" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Card Principal */}
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Avaliação Imersiva
                  </CardTitle>
                  <CardDescription>
                    Cenários situacionais que revelam comportamentos reais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <span>Dilemas éticos sem resposta "certa"</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <span>Situações de pressão com tempo limitado</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <span>Análise de padrões de hesitação</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <span>Detecção de respostas "socialmente desejáveis"</span>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full gap-2 mt-4"
                    onClick={handleStartAssessment}
                  >
                    Iniciar Avaliação Demo
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Tipos de Cenários */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tipos de Cenários</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Dilemas Éticos', count: 2, color: 'bg-amber-500' },
                    { label: 'Sob Pressão', count: 1, color: 'bg-red-500' },
                    { label: 'Conflitos', count: 1, color: 'bg-violet-500' },
                    { label: 'Gestão de Crise', count: 1, color: 'bg-red-600' },
                    { label: 'Inovação', count: 1, color: 'bg-emerald-500' },
                    { label: 'Decisão Estratégica', count: 0, color: 'bg-blue-500' },
                  ].map((tipo) => (
                    <div 
                      key={tipo.label}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", tipo.color)} />
                        <span className="text-sm">{tipo.label}</span>
                      </div>
                      <Badge variant="secondary">{tipo.count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB: Pilares */}
          <TabsContent value="pilares" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BEHAVIORAL_PILLARS.map((pilar) => {
                const Icon = pilarIcons[pilar.id] || Target;
                return (
                  <motion.div
                    key={pilar.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", pilar.cor)}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <CardTitle className="text-base">{pilar.nome}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {pilar.descricao}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {pilar.dimensoes.slice(0, 3).map((dim) => (
                            <Badge key={dim} variant="outline" className="text-xs">
                              {dim}
                            </Badge>
                          ))}
                          {pilar.dimensoes.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{pilar.dimensoes.length - 3}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* TAB: Perfil Empresa */}
          <TabsContent value="empresa" className="mt-6">
            <CompanyProfileBuilder
              initialProfile={companyProfile || undefined}
              onSave={handleSaveCompanyProfile}
            />
          </TabsContent>

          {/* TAB: Resultados Demo */}
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
