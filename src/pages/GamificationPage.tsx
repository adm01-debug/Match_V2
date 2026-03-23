/**
 * @fileoverview Dedicated Gamification Page
 * Shows achievements, levels, streaks, and leaderboard
 * Now with LevelUpCelebration, XPToast, and Onboarding integration
 */

import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { GamificationDashboard } from "@/components/gamification/GamificationDashboard";
import { LevelUpCelebration } from "@/components/gamification/LevelUpCelebration";
import { XPToast } from "@/components/gamification/XPToast";
import { GamificationOnboarding, useGamificationOnboarding } from "@/components/gamification/GamificationOnboarding";
import { DailyChallenges } from "@/components/gamification/DailyChallenges";
import { WeeklyMissions } from "@/components/gamification/WeeklyMissions";
import { PowerUps, type PowerUpType } from "@/components/gamification/PowerUps";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useGamification } from "@/hooks/useGamification";
import { motion } from "framer-motion";
import { Trophy, Award, Flame, Gamepad2, Brain, Heart, Layers, ArrowLeft, Sparkles, Zap, Star, Target, Calendar, Rocket } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  GamifiedAssessmentEngine,
  SwipeValuesCard,
  PersonalityMiniGame,
  PhaseChallenge
} from "@/components/assessments/gamified";
import { GAMIFIED_QUESTIONS, VALUE_CARDS, PERSONALITY_MINI_GAMES } from "@/data/gamifiedAssessmentData";
import { CHALLENGE_PHASES } from "@/data/phaseChallengeData";
import { toast } from "sonner";

type GamifiedMode = 'quiz' | 'swipe' | 'minigame' | 'phases' | null;

const GAME_CARDS = [
  {
    id: 'quiz' as GamifiedMode,
    title: 'Quiz Interativo',
    description: 'Responda perguntas e ganhe XP com combos',
    icon: Brain,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'violet',
    xp: '150-300 XP'
  },
  {
    id: 'swipe' as GamifiedMode,
    title: 'Swipe de Valores',
    description: 'Deslize para descobrir seus valores culturais',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-600',
    glow: 'pink',
    xp: '100-200 XP'
  },
  {
    id: 'minigame' as GamifiedMode,
    title: 'Mini-Games',
    description: 'Desafios rápidos de personalidade',
    icon: Zap,
    gradient: 'from-amber-500 to-orange-600',
    glow: 'amber',
    xp: '50-150 XP'
  },
  {
    id: 'phases' as GamifiedMode,
    title: 'Desafio por Fases',
    description: 'Avance pelos níveis e desbloqueie recompensas',
    icon: Layers,
    gradient: 'from-cyan-500 to-teal-600',
    glow: 'cyan',
    xp: '200-500 XP'
  }
];

export default function GamificationPage() {
  usePageTitle('Conquistas');
  const [gamifiedMode, setGamifiedMode] = useState<GamifiedMode>(null);
  const { addXP, level, streak, xp, levelUpData, clearLevelUp, updateStreak } = useGamification();
  
  // XP Toast state
  const [xpToast, setXpToast] = useState<{
    isVisible: boolean;
    amount: number;
    action?: string;
    variant?: 'small' | 'medium' | 'large' | 'bonus' | 'streak' | 'levelup';
  }>({ isVisible: false, amount: 0 });

  // Onboarding
  const { isComplete: onboardingComplete, isOpen: onboardingOpen, startOnboarding, completeOnboarding, skipOnboarding } = useGamificationOnboarding();

  // Auto-show onboarding for new users
  useEffect(() => {
    if (!onboardingComplete && xp === 0) {
      const timer = setTimeout(() => startOnboarding(), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [onboardingComplete, xp, startOnboarding]);

  // Update streak on page load
  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  // Show XP Toast
  const showXPToast = useCallback((amount: number, action?: string, variant?: 'small' | 'medium' | 'large' | 'bonus' | 'streak' | 'levelup') => {
    setXpToast({ isVisible: true, amount, action, variant });
    setTimeout(() => setXpToast(prev => ({ ...prev, isVisible: false })), 3000);
  }, []);

  const handleGameComplete = useCallback((xpAmount: number) => {
    addXP(xpAmount, 'game');
    
    // Show XP Toast
    const variant = xpAmount >= 200 ? 'large' : xpAmount >= 100 ? 'medium' : 'small';
    showXPToast(xpAmount, 'Jogo concluído!', variant);
    
    toast.success(`+${xpAmount} XP ganhos!`, {
      description: "Continue jogando para subir de nível!",
      icon: <Sparkles className="h-5 w-5 text-warning" />
    });
    setGamifiedMode(null);
  }, [addXP, showXPToast]);

  const handleOnboardingComplete = useCallback((xpEarned: number) => {
    addXP(xpEarned, 'onboarding');
    showXPToast(xpEarned, 'Tutorial completo!', 'bonus');
    completeOnboarding();
    toast.success('Bem-vindo ao sistema de gamificação!', {
      description: `Você ganhou +${xpEarned} XP de bônus!`,
      icon: <Sparkles className="h-5 w-5 text-warning" />
    });
  }, [addXP, showXPToast, completeOnboarding]);

  // Render active game
  if (gamifiedMode === 'quiz') {
    return (
      <Layout title="Quiz Interativo">
        <div className="p-6">
          <Button 
            variant="ghost" 
            onClick={() => setGamifiedMode(null)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <GamifiedAssessmentEngine
            questions={GAMIFIED_QUESTIONS}
            onComplete={(stats) => handleGameComplete(stats['totalXP'] || 0)}
            onExit={() => setGamifiedMode(null)}
            title="Quiz Comportamental"
            subtitle="Teste seus conhecimentos e ganhe XP!"
            theme="cosmic"
          />
        </div>
      </Layout>
    );
  }

  if (gamifiedMode === 'swipe') {
    return (
      <Layout title="Swipe de Valores">
        <div className="p-6">
          <Button 
            variant="ghost" 
            onClick={() => setGamifiedMode(null)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <SwipeValuesCard
            cards={VALUE_CARDS}
            onComplete={(liked, _passed, superLiked) => {
              const xp = (liked.length * 10) + (superLiked.length * 25);
              handleGameComplete(xp);
            }}
            title="Descubra Seus Valores"
          />
        </div>
      </Layout>
    );
  }

  if (gamifiedMode === 'minigame') {
    return (
      <Layout title="Mini-Games">
        <div className="p-6">
          <Button 
            variant="ghost" 
            onClick={() => setGamifiedMode(null)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <PersonalityMiniGame
            games={PERSONALITY_MINI_GAMES}
            onComplete={(_results, totalXP) => {
              handleGameComplete(totalXP);
            }}
            onExit={() => setGamifiedMode(null)}
          />
        </div>
      </Layout>
    );
  }

  if (gamifiedMode === 'phases') {
    return (
      <Layout title="Desafio por Fases">
        <div className="p-6">
          <Button 
            variant="ghost" 
            onClick={() => setGamifiedMode(null)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <PhaseChallenge
            phases={CHALLENGE_PHASES}
            onComplete={(results) => {
              const xp = results.reduce((acc, r) => acc + r.xpEarned, 0);
              handleGameComplete(xp);
            }}
            onExit={() => setGamifiedMode(null)}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Conquistas">
      <div className="relative min-h-screen">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, hsl(var(--warning) / 0.15) 0%, transparent 70%)" }}
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)" }}
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, 30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div 
          className="relative p-6 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/30 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <motion.div 
                className="p-4 rounded-2xl bg-gradient-to-br from-warning via-warning to-accent shadow-lg shadow-warning/25"
                whileHover={{ scale: 1.05, rotate: 5 }}
                animate={{ 
                  boxShadow: [
                    "0 10px 30px -10px rgba(234, 179, 8, 0.3)",
                    "0 10px 40px -10px rgba(234, 179, 8, 0.5)",
                    "0 10px 30px -10px rgba(234, 179, 8, 0.3)",
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 2, repeat: Infinity },
                  scale: { type: "spring", stiffness: 400 }
                }}
              >
                <Trophy className="h-7 w-7 text-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">Conquistas & Ranking</h1>
                  <Badge className="bg-gradient-to-r from-warning to-accent text-primary-foreground border-0">
                    <Flame className="h-3 w-3 mr-1" />
                    Em chamas!
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Acompanhe seu progresso, desbloqueie conquistas e suba no ranking
                </p>
              </div>
            </div>

            {/* Quick Stats - Now using real data from hook */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <Award className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Nível</p>
                  <p className="font-bold text-yellow-600">{level}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <Flame className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Streak</p>
                  <p className="font-bold text-orange-600">{streak} dias</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                <Star className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">XP</p>
                  <p className="font-bold text-primary">{xp.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* PLAY NOW SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">Jogar Agora</h2>
              <Badge variant="outline" className="border-emerald-500/50 text-emerald-600">
                <Star className="h-3 w-3 mr-1" />
                Ganhe XP
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {GAME_CARDS.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card 
                    className="group cursor-pointer overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
                    onClick={() => setGamifiedMode(game.id)}
                  >
                    <CardContent className="p-0">
                      <div className={`relative p-6 bg-gradient-to-br ${game.gradient}`}>
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity"
                          style={{
                            background: `radial-gradient(circle at center, white 0%, transparent 70%)`
                          }}
                        />
                        <game.icon className="h-10 w-10 text-white mb-2 relative z-10" />
                        <Badge className="bg-white/20 text-white border-0 text-xs">
                          {game.xp}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-1">{game.title}</h3>
                        <p className="text-sm text-muted-foreground">{game.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* PHASE 2: Daily Challenges, Weekly Missions & Power-Ups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <Tabs defaultValue="challenges" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
                <TabsTrigger value="challenges" className="gap-2">
                  <Target className="h-4 w-4" />
                  <span className="hidden sm:inline">Desafios Diários</span>
                  <span className="sm:hidden">Diários</span>
                </TabsTrigger>
                <TabsTrigger value="missions" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Missões Semanais</span>
                  <span className="sm:hidden">Semanais</span>
                </TabsTrigger>
                <TabsTrigger value="powerups" className="gap-2">
                  <Rocket className="h-4 w-4" />
                  <span className="hidden sm:inline">Power-Ups</span>
                  <span className="sm:hidden">Power</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="challenges" className="mt-4">
                <DailyChallenges
                  onClaimReward={(_challengeId: string, xpAmount: number) => {
                    addXP(xpAmount, 'daily_challenge');
                    showXPToast(xpAmount, 'Desafio Diário!', 'bonus');
                  }}
                />
              </TabsContent>

              <TabsContent value="missions" className="mt-4">
                <WeeklyMissions
                  onClaimReward={(_missionId: string, xpAmount: number) => {
                    addXP(xpAmount, 'weekly_mission');
                    showXPToast(xpAmount, 'Missão Semanal!', 'large');
                  }}
                />
              </TabsContent>

              <TabsContent value="powerups" className="mt-4">
                <PowerUps
                  onActivatePowerUp={(_powerUpId: string, type: PowerUpType) => {
                    toast.success(`Power-Up Ativado!`, {
                      description: `${type} ativado com sucesso`,
                      icon: <Sparkles className="h-5 w-5 text-yellow-500" />
                    });
                  }}
                />
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Gamification Dashboard */}
          <GamificationDashboard />
        </motion.div>
      </div>

      {/* Level Up Celebration Modal */}
      {levelUpData && (
        <LevelUpCelebration
          isVisible={!!levelUpData}
          oldLevel={levelUpData.oldLevel}
          newLevel={levelUpData.newLevel}
          onClose={clearLevelUp}
        />
      )}

      {/* XP Toast */}
      <XPToast
        isVisible={xpToast.isVisible}
        amount={xpToast.amount}
        action={xpToast.action}
        variant={xpToast.variant}
        onComplete={() => setXpToast(prev => ({ ...prev, isVisible: false }))}
      />

      {/* Onboarding Modal */}
      <GamificationOnboarding
        isOpen={onboardingOpen}
        onComplete={handleOnboardingComplete}
        onSkip={skipOnboarding}
      />
    </Layout>
  );
}
