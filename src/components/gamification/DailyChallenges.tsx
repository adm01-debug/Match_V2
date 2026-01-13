/**
 * @fileoverview Daily Challenges Component
 * Shows daily missions with rewards and progress tracking
 */

import { memo, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, 
  Clock, 
  Zap, 
  CheckCircle2,
  Gift,
  Flame,
  Trophy,
  Users,
  Calendar,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";

export type ChallengeType = 
  | "login" 
  | "candidatos" 
  | "entrevistas" 
  | "vagas" 
  | "avaliacoes" 
  | "games"
  | "streak";

export type ChallengeDifficulty = "easy" | "medium" | "hard" | "epic";

export interface DailyChallenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  icon: typeof Target;
  xpReward: number;
  bonusXP?: number;
  target: number;
  progress: number;
  difficulty: ChallengeDifficulty;
  expiresAt: Date;
  isCompleted: boolean;
  isClaimed: boolean;
}

const difficultyConfig: Record<ChallengeDifficulty, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  easy: {
    label: "Fácil",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
  medium: {
    label: "Médio",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  hard: {
    label: "Difícil",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  epic: {
    label: "Épico",
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
};

// Generate demo daily challenges
const generateDailyChallenges = (): DailyChallenge[] => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  return [
    {
      id: "daily-login",
      type: "login",
      title: "Check-in Diário",
      description: "Faça login no sistema hoje",
      icon: Calendar,
      xpReward: 15,
      target: 1,
      progress: 1,
      difficulty: "easy",
      expiresAt: today,
      isCompleted: true,
      isClaimed: false,
    },
    {
      id: "daily-candidatos",
      type: "candidatos",
      title: "Avaliador Dedicado",
      description: "Avalie 3 candidatos hoje",
      icon: Users,
      xpReward: 45,
      bonusXP: 15,
      target: 3,
      progress: 2,
      difficulty: "medium",
      expiresAt: today,
      isCompleted: false,
      isClaimed: false,
    },
    {
      id: "daily-games",
      type: "games",
      title: "Jogador do Dia",
      description: "Complete 2 jogos de gamificação",
      icon: Zap,
      xpReward: 60,
      bonusXP: 20,
      target: 2,
      progress: 0,
      difficulty: "medium",
      expiresAt: today,
      isCompleted: false,
      isClaimed: false,
    },
    {
      id: "daily-streak",
      type: "streak",
      title: "Mestre do Streak",
      description: "Mantenha seu streak ativo por mais 1 dia",
      icon: Flame,
      xpReward: 100,
      bonusXP: 50,
      target: 1,
      progress: 0,
      difficulty: "hard",
      expiresAt: today,
      isCompleted: false,
      isClaimed: false,
    },
  ];
};

interface DailyChallengeCardProps {
  challenge: DailyChallenge;
  onClaim: (id: string) => void;
}

const DailyChallengeCard = memo(function DailyChallengeCard({
  challenge,
  onClaim,
}: DailyChallengeCardProps) {
  const config = difficultyConfig[challenge.difficulty];
  const Icon = challenge.icon;
  const progressPercent = Math.min(100, (challenge.progress / challenge.target) * 100);
  const canClaim = challenge.isCompleted && !challenge.isClaimed;

  const handleClaim = useCallback(() => {
    if (canClaim) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#3B82F6', '#8B5CF6'],
      });
      onClaim(challenge.id);
    }
  }, [canClaim, challenge.id, onClaim]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="group"
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300",
        config.borderColor,
        challenge.isClaimed && "opacity-60",
        canClaim && "ring-2 ring-primary/50"
      )}>
        {/* Glow effect for claimable */}
        {canClaim && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <CardContent className="relative p-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={cn(
              "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
              config.bgColor,
              challenge.isCompleted && "bg-success/20"
            )}>
              {challenge.isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </motion.div>
              ) : (
                <Icon className={cn("w-6 h-6", config.color)} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-foreground line-clamp-1">
                    {challenge.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {challenge.description}
                  </p>
                </div>
                
                <Badge className={cn("flex-shrink-0", config.bgColor, config.color, "border-0")}>
                  {config.label}
                </Badge>
              </div>

              {/* Progress */}
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Progresso: {challenge.progress}/{challenge.target}
                  </span>
                  <span className={cn("font-medium", config.color)}>
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <Progress 
                  value={progressPercent} 
                  className="h-2"
                />
              </div>

              {/* Reward & Action */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                    <Zap className="w-3 h-3" />
                    +{challenge.xpReward} XP
                  </div>
                  {challenge.bonusXP && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/10 text-purple-600 text-xs font-medium">
                      <Gift className="w-3 h-3" />
                      +{challenge.bonusXP} Bônus
                    </div>
                  )}
                </div>

                {canClaim && (
                  <Button
                    size="sm"
                    onClick={handleClaim}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                  >
                    <Gift className="w-4 h-4 mr-1" />
                    Resgatar
                  </Button>
                )}

                {challenge.isClaimed && (
                  <Badge variant="outline" className="text-success border-success/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Resgatado
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

interface DailyChallengesProps {
  className?: string;
  onClaimReward?: (challengeId: string, xpAmount: number) => void;
}

export const DailyChallenges = memo(function DailyChallenges({
  className,
  onClaimReward,
}: DailyChallengesProps) {
  const [challenges, setChallenges] = useState<DailyChallenge[]>(generateDailyChallenges);
  
  // Calculate stats
  const stats = useMemo(() => {
    const completed = challenges.filter(c => c.isCompleted).length;
    const claimed = challenges.filter(c => c.isClaimed).length;
    const totalXP = challenges.reduce((sum, c) => sum + c.xpReward + (c.bonusXP || 0), 0);
    const earnedXP = challenges
      .filter(c => c.isClaimed)
      .reduce((sum, c) => sum + c.xpReward + (c.bonusXP || 0), 0);
    
    return { completed, claimed, total: challenges.length, totalXP, earnedXP };
  }, [challenges]);

  // Time until reset
  const timeUntilReset = useMemo(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }, []);

  const handleClaim = useCallback((id: string) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === id) {
        const totalReward = c.xpReward + (c.bonusXP || 0);
        onClaimReward?.(id, totalReward);
        return { ...c, isClaimed: true };
      }
      return c;
    }));
  }, [onClaimReward]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Desafios Diários
                <Badge variant="outline" className="text-amber-600 border-amber-500/30 bg-amber-500/10">
                  <Flame className="w-3 h-3 mr-1" />
                  {stats.completed}/{stats.total}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                Renova em {timeUntilReset}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-muted-foreground">XP Disponível</p>
            <p className="text-xl font-bold text-amber-600 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              {stats.totalXP - stats.earnedXP}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {challenges.map((challenge) => (
            <DailyChallengeCard
              key={challenge.id}
              challenge={challenge}
              onClaim={handleClaim}
            />
          ))}
        </AnimatePresence>

        {/* All completed bonus */}
        {stats.completed === stats.total && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-gradient-to-r from-success/10 to-emerald-500/10 border border-success/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-success" />
                <div>
                  <p className="font-semibold text-success">Todos Completados!</p>
                  <p className="text-sm text-muted-foreground">
                    Bônus especial desbloqueado
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-success to-emerald-600"
              >
                <Gift className="w-4 h-4 mr-1" />
                +100 XP Bônus
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
});

DailyChallenges.displayName = "DailyChallenges";
