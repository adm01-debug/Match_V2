/**
 * @module BehavioralAssessmentsPage
 * @description Página principal das 14 ferramentas comportamentais (10 originais + 4 avançadas) com gamificação integrada
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
  Gamepad2, Star, Flame, Award, Crown
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { BEHAVIORAL_TOOLS } from '@/types/behavioral';
import type { BehavioralResult, BehavioralTool } from '@/types/behavioral';
import { BehavioralAssessmentPlayer } from '@/components/assessments/BehavioralAssessmentPlayer';
import { BehavioralResultView } from '@/components/assessments/BehavioralResultView';
import { useSaveBehavioralResult } from '@/hooks/useBehavioralAssessments';
import { useBehavioralGamification } from '@/hooks/useBehavioralGamification';
import { useGamification } from '@/hooks/useGamification';
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

const TOOL_ICONS: Record<string, React.ReactNode> = {
  // Ferramentas originais (10)
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
  // Ferramentas avançadas (4)
  generational: <Users className="h-6 w-6" />,
  stress_profile: <Zap className="h-6 w-6" />,
  triune_brain: <Brain className="h-6 w-6" />,
  disc_compatibility: <Users className="h-6 w-6" />,
};

export default function BehavioralAssessmentsPage() {
  usePageTitle('Ferramentas Comportamentais');
  const [searchParams] = useSearchParams();
  const saveResult = useSaveBehavioralResult();
  
  // Gamification hooks - integração com o sistema real
  const {
    completedToolIds,
    completedCount,
    totalTools,
    totalBehavioralXP,
    dailyCombo,
    behavioralLevel,
    nextBehavioralLevel,
    levelProgress,
    achievementsWithStatus,
    unlockedCount,
    totalAchievements,
    completeAssessment: gamificationComplete,
  } = useBehavioralGamification();

  const {
    xp: globalXP,
    streak,
  } = useGamification();
  
  const [activeTab, setActiveTab] = useState('gamified');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedResults, setCompletedResults] = useState<BehavioralResult[]>([]);
  const [viewingResult, setViewingResult] = useState<BehavioralResult | null>(null);
  
  // Gamification states - agora integrados com o hook
  const [gamifiedMode, setGamifiedMode] = useState<'quiz' | 'swipe' | 'minigame' | 'phases' | null>(null);

  // Demo leaderboard data - usando dados reais onde possível
  const leaderboardUsers: LeaderboardUser[] = [
    { id: '1', name: 'Ana Silva', score: 2450, streak: 7, achievements: 12 },
    { id: '2', name: 'Carlos Mendes', score: 2100, streak: 5, achievements: 10 },
    { id: '3', name: 'Beatriz Santos', score: 1850, streak: 3, achievements: 8 },
    { id: '4', name: 'Diego Oliveira', score: 1600, streak: 4, achievements: 7 },
    { id: '5', name: 'Elena Costa', score: 1450, streak: 2, achievements: 6 },
    { id: 'current', name: 'Você', score: globalXP, streak, achievements: unlockedCount },
  ];

  // Achievements integrados com o sistema real
  const demoAchievements: Achievement[] = achievementsWithStatus.slice(0, 5).map(a => ({
    id: a.id,
    title: a.title,
    description: a.description,
    icon: a.tier === 'diamond' ? Crown : a.tier === 'gold' ? Star : Award,
    tier: a.tier,
    category: 'milestone' as const,
    unlockedAt: a.isUnlocked ? new Date() : undefined,
    progress: a.isUnlocked ? 100 : 0,
    maxProgress: 100,
  }));

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
    
    // Integração com gamificação - calcular e dar XP
    await gamificationComplete(result.toolId, result.timeSpent, result.scores);
    
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

  // Usar dados do hook de gamificação para progresso
  const progressPercentage = (completedCount / totalTools) * 100;

  // Gamification handlers - agora integrados com useGamification
  const { addXP, unlockAchievement } = useGamification();
  
  const handleGamifiedComplete = (_answers: Record<string, unknown>, stats: { totalXP: number; badges: string[]; comboMax: number; fastAnswers: number; timeElapsed: number; accuracy: number }) => {
    addXP(stats.totalXP, 'gamified_quiz');
    setGamifiedMode(null);
    toast.success(`+${stats.totalXP} XP ganhos!`, {
      description: stats.badges.length > 0 ? `Novas conquistas: ${stats.badges.join(', ')}` : undefined
    });
  };

  const handleSwipeComplete = (liked: string[], _passed: string[], superLiked: string[]) => {
    const xpEarned = liked.length * 10 + superLiked.length * 25;
    addXP(xpEarned, 'swipe_values');
    setGamifiedMode(null);
    toast.success(`Valores mapeados! +${xpEarned} XP`);
  };

  const handleMiniGameComplete = (_results: Array<{ gameId: string; selectedOption: string; responseTime: number; earnedXP: number; trait?: string }>, xp: number) => {
    addXP(xp, 'mini_game');
    setGamifiedMode(null);
    toast.success(`Mini-game completo! +${xp} XP`);
  };

  const handlePhaseComplete = (results: PhaseResult[]) => {
    const xpEarned = results.reduce((sum, r) => sum + r.xpEarned, 0);
    addXP(xpEarned, 'phase_challenge');
    unlockAchievement('phase_challenger');
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
                    <div className="text-2xl font-bold">{totalBehavioralXP}</div>
                    <div className="text-sm text-muted-foreground">XP Total</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/80 backdrop-blur">
                <CardContent className="p-4 flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">{unlockedCount}</div>
                    <div className="text-sm text-muted-foreground">Conquistas</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/80 backdrop-blur">
                <CardContent className="p-4 flex items-center gap-3">
                  <Flame className="h-8 w-8 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">{dailyCombo}x</div>
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
                    <div className="mx-auto p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground mb-2 group-hover:scale-110 transition-transform">
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

            {/* XP Progress & Level Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-purple-500/10 overflow-hidden">
                <CardContent className="py-6 relative">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg">
                            <Crown className="h-8 w-8" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-background rounded-full px-2 py-0.5 text-xs font-bold border shadow-sm">
                            Lv.{behavioralLevel?.level || 1}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold flex items-center gap-2">
                            <span className="text-2xl">{behavioralLevel?.icon}</span> 
                            {behavioralLevel?.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {completedCount}/{totalTools} ferramentas completas
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                          {totalBehavioralXP} XP
                        </div>
                        <p className="text-sm text-muted-foreground">Total acumulado</p>
                      </div>
                    </div>
                    
                    {/* Progress to next level */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progresso para próximo nível</span>
                        {nextBehavioralLevel ? (
                          <span className="font-medium">
                            {nextBehavioralLevel.icon} {nextBehavioralLevel.title} 
                            <span className="text-muted-foreground ml-1">
                              ({nextBehavioralLevel.minAssessments - completedCount} restantes)
                            </span>
                          </span>
                        ) : (
                          <span className="font-medium text-yellow-500">Nível Máximo! 🎉</span>
                        )}
                      </div>
                      <div className="relative">
                        <Progress value={levelProgress} className="h-4" />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                          {Math.round(levelProgress)}%
                        </div>
                      </div>
                    </div>
                    
                    {/* Unlocked Achievements */}
                    {unlockedCount > 0 && (
                      <div className="mt-6 pt-4 border-t">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            Conquistas Desbloqueadas ({unlockedCount}/{totalAchievements})
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {achievementsWithStatus.filter(a => a.isUnlocked).map((achievement) => (
                            <motion.div
                              key={achievement.id}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                              <Badge 
                                className={`gap-1.5 py-1.5 px-3 ${
                                  achievement.tier === 'diamond' 
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0' 
                                    : achievement.tier === 'gold'
                                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0'
                                    : achievement.tier === 'silver'
                                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0'
                                    : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0'
                                }`}
                              >
                                {achievement.tier === 'diamond' ? <Crown className="h-3.5 w-3.5" /> :
                                 achievement.tier === 'gold' ? <Star className="h-3.5 w-3.5" /> :
                                 <Award className="h-3.5 w-3.5" />}
                                {achievement.title}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Locked achievements teaser */}
                    {unlockedCount < totalAchievements && (
                      <div className="mt-4 p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <Trophy className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {totalAchievements - unlockedCount} conquistas bloqueadas
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Complete mais assessments para desbloquear!
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
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
