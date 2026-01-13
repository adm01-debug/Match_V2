/**
 * @module BehavioralAssessmentsPage
 * @description Página principal das 10 ferramentas comportamentais com gamificação
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
  Trophy, Clock, CheckCircle2, ArrowRight, BarChart3,
  Gamepad2, Star, Flame
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { BEHAVIORAL_TOOLS } from '@/types/behavioral';
import type { BehavioralResult, BehavioralTool } from '@/types/behavioral';
import { BehavioralAssessmentPlayer } from '@/components/assessments/BehavioralAssessmentPlayer';
import { BehavioralResultView } from '@/components/assessments/BehavioralResultView';
import { useSaveBehavioralResult } from '@/hooks/useBehavioralAssessments';
import { toast } from 'sonner';
import { 
  GamifiedAssessmentEngine,
  SwipeValuesCard,
  PersonalityMiniGame,
  PhaseChallenge,
  type PhaseResult
} from '@/components/assessments/gamified';
import { 
  Leaderboard,
  AchievementGrid,
  type LeaderboardUser,
  type Achievement,
} from '@/components/gamification';
import { 
  GAMIFIED_QUESTIONS, 
  VALUE_CARDS, 
  PERSONALITY_MINI_GAMES 
} from '@/data/gamifiedAssessmentData';
import { CHALLENGE_PHASES } from '@/data/phaseChallengeData';
import { Award, Crown } from 'lucide-react';

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
  
  const [activeTab, setActiveTab] = useState('gamified');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedResults, setCompletedResults] = useState<BehavioralResult[]>([]);
  const [viewingResult, setViewingResult] = useState<BehavioralResult | null>(null);
  
  // Gamification states
  const [gamifiedMode, setGamifiedMode] = useState<'quiz' | 'swipe' | 'minigame' | 'phases' | null>(null);
  const [totalXP, setTotalXP] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);

  // Demo leaderboard data
  const leaderboardUsers: LeaderboardUser[] = [
    { id: '1', name: 'Ana Silva', score: 2450, streak: 7, achievements: 12 },
    { id: '2', name: 'Carlos Mendes', score: 2100, streak: 5, achievements: 10 },
    { id: '3', name: 'Beatriz Santos', score: 1850, streak: 3, achievements: 8 },
    { id: '4', name: 'Diego Oliveira', score: 1600, streak: 4, achievements: 7 },
    { id: '5', name: 'Elena Costa', score: 1450, streak: 2, achievements: 6 },
    { id: 'current', name: 'Você', score: totalXP, streak, achievements: earnedBadges.length },
  ];

  // Demo achievements
  const demoAchievements: Achievement[] = [
    { id: 'first-quiz', title: 'Primeiro Quiz', description: 'Complete seu primeiro quiz', icon: Award, tier: 'bronze', category: 'milestone', unlockedAt: totalXP > 0 ? new Date() : undefined },
    { id: 'value-master', title: 'Mestre dos Valores', description: 'Complete o swipe de valores', icon: Heart, tier: 'silver', category: 'milestone', unlockedAt: earnedBadges.includes('Mestre dos Valores') ? new Date() : undefined, progress: totalXP > 50 ? 100 : 50, maxProgress: 100 },
    { id: 'speed-demon', title: 'Velocista', description: 'Responda 5 perguntas em menos de 3 segundos', icon: Zap, tier: 'gold', category: 'speed', progress: Math.min(streak, 5), maxProgress: 5 },
    { id: 'perfectionist', title: 'Perfeccionista', description: 'Complete todas as fases com 100%', icon: Crown, tier: 'platinum', category: 'quality' },
    { id: 'all-rounder', title: 'Completo', description: 'Complete todos os tipos de assessment', icon: Target, tier: 'diamond', category: 'milestone', progress: gamifiedMode ? 1 : 0, maxProgress: 4 },
  ];

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

  // Gamification handlers
  const handleGamifiedComplete = (_answers: Record<string, unknown>, stats: { totalXP: number; badges: string[]; comboMax: number; fastAnswers: number; timeElapsed: number; accuracy: number }) => {
    setTotalXP(prev => prev + stats.totalXP);
    setEarnedBadges(prev => [...new Set([...prev, ...stats.badges])]);
    setStreak(prev => Math.max(prev, stats.comboMax));
    setGamifiedMode(null);
    toast.success(`+${stats.totalXP} XP ganhos!`, {
      description: stats.badges.length > 0 ? `Novas conquistas: ${stats.badges.join(', ')}` : undefined
    });
  };

  const handleSwipeComplete = (liked: string[], _passed: string[], superLiked: string[]) => {
    const xpEarned = liked.length * 10 + superLiked.length * 25;
    setTotalXP(prev => prev + xpEarned);
    setGamifiedMode(null);
    toast.success(`Valores mapeados! +${xpEarned} XP`);
  };

  const handleMiniGameComplete = (_results: Array<{ gameId: string; selectedOption: string; responseTime: number; earnedXP: number; trait?: string }>, xp: number) => {
    setTotalXP(prev => prev + xp);
    setStreak(prev => prev + 1);
    setGamifiedMode(null);
    toast.success(`Mini-game completo! +${xp} XP`);
  };

  const handlePhaseComplete = (results: PhaseResult[]) => {
    const xpEarned = results.reduce((sum, r) => sum + r.xpEarned, 0);
    setTotalXP(prev => prev + xpEarned);
    setEarnedBadges(prev => [...new Set([...prev, 'Desafiador'])]);
    setGamifiedMode(null);
    toast.success(`Desafios completos! +${xpEarned} XP`);
  };

  // If playing gamified mode
  if (gamifiedMode === 'quiz') {
    return (
      <Layout title="Quiz Interativo">
        <div className="max-w-4xl mx-auto">
          <GamifiedAssessmentEngine 
            questions={GAMIFIED_QUESTIONS}
            onComplete={handleGamifiedComplete}
            onExit={() => setGamifiedMode(null)}
            title="Quiz de Personalidade"
            subtitle="Descubra seus traços dominantes"
          />
        </div>
      </Layout>
    );
  }

  if (gamifiedMode === 'swipe') {
    return (
      <Layout title="Swipe de Valores">
        <div className="max-w-lg mx-auto">
          <SwipeValuesCard 
            cards={VALUE_CARDS}
            onComplete={handleSwipeComplete}
            title="Quais valores combinam com você?"
          />
        </div>
      </Layout>
    );
  }

  if (gamifiedMode === 'minigame') {
    return (
      <Layout title="Mini-Game Personalidade">
        <div className="max-w-2xl mx-auto">
          <PersonalityMiniGame 
            games={PERSONALITY_MINI_GAMES}
            onComplete={handleMiniGameComplete}
            onExit={() => setGamifiedMode(null)}
          />
        </div>
      </Layout>
    );
  }

  if (gamifiedMode === 'phases') {
    return (
      <Layout title="Desafio por Fases">
        <div className="max-w-2xl mx-auto">
          <PhaseChallenge 
            phases={CHALLENGE_PHASES}
            onComplete={handlePhaseComplete}
            onExit={() => setGamifiedMode(null)}
          />
        </div>
      </Layout>
    );
  }

  // If playing traditional assessment, show the player
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card className="bg-background/80 backdrop-blur">
                <CardContent className="p-4 flex items-center gap-3">
                  <Star className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">{totalXP}</div>
                    <div className="text-sm text-muted-foreground">XP Total</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/80 backdrop-blur">
                <CardContent className="p-4 flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">{earnedBadges.length}</div>
                    <div className="text-sm text-muted-foreground">Conquistas</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/80 backdrop-blur">
                <CardContent className="p-4 flex items-center gap-3">
                  <Flame className="h-8 w-8 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">{streak}x</div>
                    <div className="text-sm text-muted-foreground">Combo</div>
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
            </div>

            <div className="mt-4">
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="gamified" className="gap-2">
              <Gamepad2 className="h-4 w-4" />
              Experiência Gamificada
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-2">
              <Brain className="h-4 w-4" />
              Ferramentas
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Resultados ({completedResults.length})
            </TabsTrigger>
          </TabsList>

          {/* GAMIFIED TAB */}
          <TabsContent value="gamified" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Quiz Interativo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all cursor-pointer group border-2 border-primary/20 hover:border-primary/50">
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-white mb-2 group-hover:scale-110 transition-transform">
                      <Brain className="h-10 w-10" />
                    </div>
                    <CardTitle className="text-xl">Quiz Interativo</CardTitle>
                    <CardDescription>
                      Responda perguntas de forma dinâmica com XP, combos e conquistas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="secondary" className="gap-1">
                        <Star className="h-3 w-3" /> XP & Níveis
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Trophy className="h-3 w-3" /> Conquistas
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Flame className="h-3 w-3" /> Combos
                      </Badge>
                    </div>
                    <Button 
                      className="w-full gap-2" 
                      size="lg"
                      onClick={() => setGamifiedMode('quiz')}
                    >
                      <Play className="h-5 w-5" />
                      Começar Quiz
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Swipe Values */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full hover:shadow-xl transition-all cursor-pointer group border-2 border-pink-500/20 hover:border-pink-500/50">
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white mb-2 group-hover:scale-110 transition-transform">
                      <Heart className="h-10 w-10" />
                    </div>
                    <CardTitle className="text-xl">Swipe de Valores</CardTitle>
                    <CardDescription>
                      Deslize para a direita nos valores que combinam com você
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="secondary" className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                        ❤️ Like
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        ❌ Pass
                      </Badge>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                        ⭐ Super Like
                      </Badge>
                    </div>
                    <Button 
                      className="w-full gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600" 
                      size="lg"
                      onClick={() => setGamifiedMode('swipe')}
                    >
                      <Heart className="h-5 w-5" />
                      Iniciar Swipe
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Mini-Games */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="h-full hover:shadow-xl transition-all cursor-pointer group border-2 border-amber-500/20 hover:border-amber-500/50">
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white mb-2 group-hover:scale-110 transition-transform">
                      <Gamepad2 className="h-10 w-10" />
                    </div>
                    <CardTitle className="text-xl">Mini-Games</CardTitle>
                    <CardDescription>
                      Jogos rápidos que revelam traços de personalidade
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                        ⚡ Rápido
                      </Badge>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                        🎯 Preciso
                      </Badge>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                        🧠 Intuitivo
                      </Badge>
                    </div>
                    <Button 
                      className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" 
                      size="lg"
                      onClick={() => setGamifiedMode('minigame')}
                    >
                      <Zap className="h-5 w-5" />
                      Jogar Agora
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Desafio por Fases */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="h-full hover:shadow-xl transition-all cursor-pointer group border-2 border-purple-500/20 hover:border-purple-500/50">
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 text-white mb-2 group-hover:scale-110 transition-transform">
                      <Award className="h-10 w-10" />
                    </div>
                    <CardTitle className="text-xl">Desafio por Fases</CardTitle>
                    <CardDescription>
                      Complete desafios progressivos para provar suas habilidades
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                        🎯 5 Fases
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                        ⭐ +620 XP
                      </Badge>
                    </div>
                    <Button 
                      className="w-full gap-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700" 
                      size="lg"
                      onClick={() => setGamifiedMode('phases')}
                    >
                      <Award className="h-5 w-5" />
                      Iniciar Jornada
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Leaderboard & Achievements */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <Leaderboard 
                users={leaderboardUsers}
                currentUserId="current"
                title="Ranking da Semana"
                maxDisplay={5}
              />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Conquistas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AchievementGrid 
                    achievements={demoAchievements}
                    size="md"
                    columns={5}
                  />
                </CardContent>
              </Card>
            </div>

            {/* XP Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                        <Star className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold">Nível {Math.floor(totalXP / 500) + 1}</h3>
                        <p className="text-sm text-muted-foreground">
                          {totalXP % 500}/500 XP para o próximo nível
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{totalXP} XP</div>
                      <p className="text-sm text-muted-foreground">Total acumulado</p>
                    </div>
                  </div>
                  <Progress value={(totalXP % 500) / 5} className="h-3" />
                  
                  {earnedBadges.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {earnedBadges.map((badge, i) => (
                        <Badge key={i} variant="outline" className="gap-1">
                          <Trophy className="h-3 w-3 text-yellow-500" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

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
