/**
 * @fileoverview Complete Gamification Dashboard component
 * @module GamificationDashboard
 * 
 * Now uses real data from useGamification hook with fallback to demo data
 */

import { memo, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Flame, 
  Target, 
  Star,
  TrendingUp,
  Award,
  Users,
  Zap,
  Crown,
  Briefcase,
  Rocket,
  Medal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AchievementGrid,
  AchievementUnlock,
  type Achievement,
} from "./AchievementBadge";
import { ProgressRing, LevelProgress } from "./ProgressRing";
import { StreakDisplay, StreakCalendar } from "./StreakDisplay";
import { Leaderboard, type LeaderboardUser } from "./Leaderboard";
import { useGamification } from "@/hooks/useGamification";

// Demo data
const demoAchievements: Achievement[] = [
  {
    id: "first-hire",
    title: "Primeira Contratação",
    description: "Realize sua primeira contratação no sistema",
    icon: Briefcase,
    tier: "bronze",
    category: "recruitment",
    unlockedAt: new Date(2024, 10, 15),
  },
  {
    id: "speed-demon",
    title: "Velocista",
    description: "Conclua um processo em menos de 7 dias",
    icon: Zap,
    tier: "silver",
    category: "speed",
    unlockedAt: new Date(2024, 11, 1),
  },
  {
    id: "talent-hunter",
    title: "Caçador de Talentos",
    description: "Contrate 10 candidatos com match score acima de 85%",
    icon: Target,
    tier: "gold",
    category: "quality",
    progress: 7,
    maxProgress: 10,
  },
  {
    id: "team-builder",
    title: "Construtor de Equipes",
    description: "Monte uma equipe completa de 5 pessoas",
    icon: Users,
    tier: "gold",
    category: "recruitment",
    progress: 3,
    maxProgress: 5,
  },
  {
    id: "streak-master",
    title: "Mestre da Consistência",
    description: "30 dias consecutivos no sistema",
    icon: Flame,
    tier: "platinum",
    category: "streak",
    progress: 18,
    maxProgress: 30,
  },
  {
    id: "perfectionist",
    title: "Perfeccionista",
    description: "100% satisfação em 5 processos",
    icon: Star,
    tier: "platinum",
    category: "quality",
    progress: 2,
    maxProgress: 5,
  },
  {
    id: "legend",
    title: "Lenda do RH",
    description: "Contrate 100 profissionais",
    icon: Crown,
    tier: "diamond",
    category: "milestone",
    progress: 42,
    maxProgress: 100,
  },
  {
    id: "rocket",
    title: "Foguete",
    description: "Triplique a velocidade de contratação",
    icon: Rocket,
    tier: "diamond",
    category: "speed",
    progress: 1,
    maxProgress: 3,
  },
];

const demoLeaderboard: LeaderboardUser[] = [
  { id: "1", name: "Maria Silva", avatar: "", score: 12500, streak: 45, achievements: 15, department: "RH Corporativo", previousRank: 1 },
  { id: "2", name: "João Santos", avatar: "", score: 11200, streak: 32, achievements: 12, department: "Tech Recruiting", previousRank: 3 },
  { id: "3", name: "Ana Costa", avatar: "", score: 10800, streak: 28, achievements: 11, department: "RH Industrial", previousRank: 2 },
  { id: "4", name: "Pedro Oliveira", avatar: "", score: 9500, streak: 21, achievements: 9, department: "RH Varejo", previousRank: 5 },
  { id: "5", name: "Carla Mendes", avatar: "", score: 8900, streak: 18, achievements: 8, department: "RH Corporativo", previousRank: 4 },
  { id: "current", name: "Você", avatar: "", score: 7200, streak: 12, achievements: 6, department: "Tech Recruiting", previousRank: 7 },
  { id: "7", name: "Lucas Ferreira", avatar: "", score: 6800, streak: 10, achievements: 5, department: "RH Industrial", previousRank: 6 },
  { id: "8", name: "Julia Almeida", avatar: "", score: 5500, streak: 8, achievements: 4, department: "RH Varejo", previousRank: 8 },
];

// Generate streak days for demo
const generateStreakDays = () => {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date);
  }
  // Add some older days
  for (let i = 15; i < 20; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date);
  }
  return days;
};

interface GamificationDashboardProps {
  className?: string;
}

export const GamificationDashboard = memo(function GamificationDashboard({
  className,
}: GamificationDashboardProps) {
  const [showUnlock, setShowUnlock] = useState(false);
  const [selectedAchievement] = useState<Achievement | null>(null);
  
  // Get real data from gamification hook
  const { 
    xp, 
    level, 
    streak, 
    achievements: userAchievements,
    currentLevel,
    nextLevel,
  } = useGamification();

  // Calculate XP required for next level
  const requiredXP = useMemo(() => {
    return nextLevel?.minXP || (currentLevel?.maxXP || 10000);
  }, [nextLevel, currentLevel]);

  // Generate streak days based on real streak
  const realStreakDays = useMemo(() => {
    const days: Date[] = [];
    const today = new Date();
    for (let i = 0; i < streak; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  }, [streak]);

  // Merge real achievements with demo achievements for hybrid display
  const mergedAchievements = useMemo(() => {
    return demoAchievements.map(achievement => {
      // Check if user has unlocked this achievement
      const isUnlockedByUser = userAchievements.includes(achievement.id);
      if (isUnlockedByUser && !achievement.unlockedAt) {
        return { ...achievement, unlockedAt: new Date() };
      }
      return achievement;
    });
  }, [userAchievements]);

  const unlockedAchievements = mergedAchievements.filter(a => a.unlockedAt);
  const inProgressAchievements = mergedAchievements.filter(a => !a.unlockedAt && a.progress);
  const lockedAchievements = mergedAchievements.filter(a => !a.unlockedAt && !a.progress);

  // Calculate current user rank based on XP
  const currentUserRank = useMemo(() => {
    const sortedUsers = demoLeaderboard.map(user => {
      if (user.id === 'current') {
        return { ...user, score: xp };
      }
      return user;
    }).sort((a, b) => b.score - a.score);
    
    const userIndex = sortedUsers.findIndex(u => u.id === 'current');
    return userIndex + 1;
  }, [xp]);

  // Update demo leaderboard with current user's real data
  const updatedLeaderboard = useMemo(() => {
    return demoLeaderboard.map(user => {
      if (user.id === 'current') {
        return {
          ...user,
          score: xp,
          streak: streak,
          achievements: unlockedAchievements.length,
        };
      }
      return user;
    }).sort((a, b) => b.score - a.score);
  }, [xp, streak, unlockedAchievements.length]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Stats - Now using real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Nível Atual</p>
                  <p className="text-3xl font-bold">{level}</p>
                  <p className="text-xs text-primary">{currentLevel?.title || 'Iniciante'}</p>
                </div>
                <ProgressRing
                  value={xp}
                  max={requiredXP}
                  size="md"
                  color="primary"
                  showValue={false}
                >
                  <Award className="w-6 h-6 text-primary" />
                </ProgressRing>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/5 border-orange-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Streak Atual</p>
                  <p className="text-3xl font-bold">{streak} dias</p>
                  <p className="text-xs text-orange-500">
                    {streak >= 7 ? '🔥 Em chamas!' : streak >= 3 ? '🌟 Continuando!' : '✨ Comece agora!'}
                  </p>
                </div>
                <motion.div
                  animate={streak >= 3 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Flame className={cn("w-10 h-10", streak >= 7 ? "text-orange-500" : streak >= 3 ? "text-amber-500" : "text-muted-foreground")} />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conquistas</p>
                  <p className="text-3xl font-bold">{unlockedAchievements.length}/{demoAchievements.length}</p>
                  <p className="text-xs text-yellow-600">2 novas disponíveis!</p>
                </div>
                <Trophy className="w-10 h-10 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ranking</p>
                  <p className="text-3xl font-bold">#{currentUserRank}</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Continue jogando!
                  </p>
                </div>
                <Medal className="w-10 h-10 text-success" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Progress & Streak */}
        <div className="space-y-6">
          {/* Level Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Progresso de Nível
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LevelProgress
                level={level}
                currentXP={xp}
                requiredXP={requiredXP}
                title="Nível"
              />
            </CardContent>
          </Card>

          {/* Streak Display */}
          <StreakDisplay
            currentStreak={streak}
            longestStreak={Math.max(streak, 45)} // Fallback to demo longest streak
            streakType="days"
            lastActivity={new Date()}
            variant="card"
          />

          {/* Streak Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Histórico de Atividade</CardTitle>
            </CardHeader>
            <CardContent>
              <StreakCalendar streakDays={realStreakDays.length > 0 ? realStreakDays : generateStreakDays()} />
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Achievements */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="unlocked">
                    Desbloqueadas ({unlockedAchievements.length})
                  </TabsTrigger>
                  <TabsTrigger value="progress">
                    Em Progresso ({inProgressAchievements.length})
                  </TabsTrigger>
                  <TabsTrigger value="locked">
                    Bloqueadas ({lockedAchievements.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <AchievementGrid
                    achievements={mergedAchievements}
                    size="md"
                    columns={4}
                  />
                </TabsContent>

                <TabsContent value="unlocked" className="mt-4">
                  <AchievementGrid
                    achievements={unlockedAchievements}
                    size="md"
                    columns={4}
                  />
                </TabsContent>

                <TabsContent value="progress" className="mt-4">
                  <AchievementGrid
                    achievements={inProgressAchievements}
                    size="md"
                    columns={4}
                  />
                </TabsContent>

                <TabsContent value="locked" className="mt-4">
                  <AchievementGrid
                    achievements={lockedAchievements}
                    size="md"
                    columns={4}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Leaderboard
            users={updatedLeaderboard}
            currentUserId="current"
            title="Ranking Mensal"
            showRankChange
            showStreak
            maxDisplay={8}
          />
        </div>
      </div>

      {/* Achievement Unlock Modal */}
      {selectedAchievement && (
        <AchievementUnlock
          achievement={selectedAchievement}
          isVisible={showUnlock}
          onClose={() => setShowUnlock(false)}
        />
      )}
    </div>
  );
});

GamificationDashboard.displayName = "GamificationDashboard";
