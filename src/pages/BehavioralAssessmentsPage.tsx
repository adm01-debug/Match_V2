/**
 * @module BehavioralAssessmentsPage
 * @description Página principal das 10 ferramentas comportamentais
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Eye, Lightbulb, Zap, MessageSquare, Heart, 
  Target, Sparkles, AlertTriangle, Users, Play,
  Trophy, Clock, CheckCircle2, ArrowRight, BarChart3
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { BEHAVIORAL_TOOLS } from '@/types/behavioral';
import type { BehavioralResult, BehavioralTool } from '@/types/behavioral';
import { BehavioralAssessmentPlayer } from '@/components/assessments/BehavioralAssessmentPlayer';
import { BehavioralResultView } from '@/components/assessments/BehavioralResultView';
import { useSaveBehavioralResult } from '@/hooks/useBehavioralAssessments';
import { toast } from 'sonner';

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

export default function BehavioralAssessmentsPage() {
  usePageTitle('Ferramentas Comportamentais');
  const [searchParams] = useSearchParams();
  const saveResult = useSaveBehavioralResult();
  
  const [activeTab, setActiveTab] = useState('tools');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedResults, setCompletedResults] = useState<BehavioralResult[]>([]);
  const [viewingResult, setViewingResult] = useState<BehavioralResult | null>(null);

  // Handle URL parameter to start specific tool
  useEffect(() => {
    const toolParam = searchParams.get('tool');
    if (toolParam && BEHAVIORAL_TOOLS.some(t => t.id === toolParam)) {
      handleStartAssessment(toolParam);
    }
  }, [searchParams]);

  const handleStartAssessment = (toolId: string) => {
    setSelectedTool(toolId);
    setIsPlaying(true);
  };

  const handleCompleteAssessment = async (result: BehavioralResult) => {
    const tool = BEHAVIORAL_TOOLS.find(t => t.id === result.toolId);
    
    // Save to database
    try {
      await saveResult.mutateAsync({
        toolId: result.toolId,
        toolName: tool?.name || result.toolId,
        answers: result.rawAnswers,
        results: result,
        timeSpent: result.timeSpent,
      });
      toast.success('Resultado salvo com sucesso!');
    } catch (error) {
      console.error('Error saving result:', error);
      // Still allow viewing results even if save fails
    }

    setCompletedResults(prev => [...prev, result]);
    setIsPlaying(false);
    setSelectedTool(null);
    setViewingResult(result);
    setActiveTab('results');
  };

  const handleCancelAssessment = () => {
    setIsPlaying(false);
    setSelectedTool(null);
  };

  const completedToolIds = completedResults.map(r => r.toolId);
  const progressPercentage = (completedToolIds.length / BEHAVIORAL_TOOLS.length) * 100;

  // If playing, show the player
  if (isPlaying && selectedTool) {
    return (
      <Layout title="Assessment em Andamento">
        <div className="max-w-4xl mx-auto">
          <BehavioralAssessmentPlayer
            toolId={selectedTool}
            onComplete={handleCompleteAssessment}
            onCancel={handleCancelAssessment}
          />
        </div>
      </Layout>
    );
  }

  // If viewing result, show the result view
  if (viewingResult) {
    return (
      <Layout title="Resultado do Assessment">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button 
            variant="outline" 
            onClick={() => setViewingResult(null)}
            className="gap-2"
          >
            ← Voltar às Ferramentas
          </Button>
          <BehavioralResultView result={viewingResult} showDetails />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Ferramentas Comportamentais">
      <div className="space-y-6">
        {/* Header with Progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8"
        >
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-primary text-primary-foreground">
                <Brain className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">10 Ferramentas de Comportamento Humano</h1>
                <p className="text-muted-foreground mt-1">
                  Sistema completo de avaliação comportamental para recrutamento
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="bg-background/80 backdrop-blur">
                <CardContent className="p-4 flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">{completedToolIds.length}/10</div>
                    <div className="text-sm text-muted-foreground">Concluídos</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/80 backdrop-blur">
                <CardContent className="p-4 flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
                    <div className="text-sm text-muted-foreground">Progresso</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/80 backdrop-blur">
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">~{10 - completedToolIds.length * 5}min</div>
                    <div className="text-sm text-muted-foreground">Restantes</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4">
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tools" className="gap-2">
              <Brain className="h-4 w-4" />
              Ferramentas
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Resultados ({completedResults.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {BEHAVIORAL_TOOLS.map((tool: BehavioralTool, index: number) => {
                  const isCompleted = completedToolIds.includes(tool.id);
                  
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className={`h-full transition-all hover:shadow-lg cursor-pointer group ${
                          isCompleted ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' : ''
                        }`}
                        style={{ borderColor: isCompleted ? undefined : `${tool.color}30` }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div 
                              className="p-3 rounded-xl text-white transition-transform group-hover:scale-110"
                              style={{ backgroundColor: tool.color }}
                            >
                              {TOOL_ICONS[tool.id]}
                            </div>
                            {isCompleted ? (
                              <Badge className="bg-green-500 text-white">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Concluído
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1">
                                <Clock className="h-3 w-3" />
                                ~{tool.estimatedTime}min
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg mt-3">{tool.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {tool.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Dimensions */}
                          <div className="flex flex-wrap gap-1">
                            {tool.dimensions.slice(0, 4).map((dim: string, i: number) => (
                              <Badge 
                                key={i} 
                                variant="secondary" 
                                className="text-xs"
                              >
                                {dim}
                              </Badge>
                            ))}
                            {tool.dimensions.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{tool.dimensions.length - 4}
                              </Badge>
                            )}
                          </div>

                          {/* Action Button */}
                          {isCompleted ? (
                            <Button 
                              variant="outline" 
                              className="w-full gap-2"
                              onClick={() => {
                                const result = completedResults.find(r => r.toolId === tool.id);
                                if (result) setViewingResult(result);
                              }}
                            >
                              Ver Resultado
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              className="w-full gap-2 text-white"
                              style={{ backgroundColor: tool.color }}
                              onClick={() => handleStartAssessment(tool.id)}
                            >
                              <Play className="h-4 w-4" />
                              Iniciar Assessment
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            {completedResults.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum resultado ainda</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete os assessments para ver seus resultados aqui
                  </p>
                  <Button onClick={() => setActiveTab('tools')}>
                    Ver Ferramentas
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {completedResults.map((result, index) => {
                  const tool = BEHAVIORAL_TOOLS.find((t: BehavioralTool) => t.id === result.toolId);
                  if (!tool) return null;
                  
                  const scoresArray = Object.values(result.scores) as number[];
                  const avgScore = scoresArray.length > 0
                    ? Math.round(scoresArray.reduce((a, b) => a + b, 0) / scoresArray.length)
                    : 0;

                  return (
                    <motion.div
                      key={`${result.toolId}-${index}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className="cursor-pointer hover:shadow-lg transition-all"
                        onClick={() => setViewingResult(result)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="p-2 rounded-lg text-white"
                              style={{ backgroundColor: tool.color }}
                            >
                              {TOOL_ICONS[tool.id]}
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base">{tool.name}</CardTitle>
                              <CardDescription className="text-xs">
                                Perfil: {result.primaryProfile}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold" style={{ color: tool.color }}>
                                {avgScore}%
                              </div>
                              <div className="text-xs text-muted-foreground">Score</div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${avgScore}%`,
                                backgroundColor: tool.color 
                              }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
