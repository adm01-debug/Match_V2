/**
 * @fileoverview Weekly Missions Component
 * Shows weekly objectives with multipliers and bigger rewards
 */

import { memo, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, 
  Calendar,
  Zap, 
  Star, 
  CheckCircle2,
  Gift,
  Flame,
  Trophy,
  Crown,
  Rocket,
  TrendingUp,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";

export type MissionTier = "bronze" | "silver" | "gold" | "platinum";

export interface WeeklyMission {
  id: string;
  title: string;
  description: string;
  icon: typeof Target;
  xpReward: number;
  multiplier: number;
  tier: MissionTier;
  target: number;
  progress: number;
  isCompleted: boolean;
  isClaimed: boolean;
  isLocked: boolean;
  unlockRequirement?: string;
}

const tierConfig: Record<MissionTier, {
  label: string;
  gradient: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  icon: typeof Star;
}> = {
  bronze: {
    label: "Bronze",
    gradient: "from-amber-700 to-amber-600",
    textColor: "text-amber-700",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    icon: Star,
  },
  silver: {
    label: "Prata",
    gradient: "from-slate-400 to-slate-500",
    textColor: "text-slate-600",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/30",
    icon: Trophy,
  },
  gold: {
    label: "Ouro",
    gradient: "from-yellow-500 to-amber-500",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    icon: Crown,
  },
  platinum: {
    label: "Platina",
    gradient: "from-cyan-400 to-teal-500",
    textColor: "text-cyan-600",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    icon: Rocket,
  },
};

// Generate demo weekly missions
const generateWeeklyMissions = (): WeeklyMission[] => [
  {
    id: "weekly-streak",
    title: "Maratonista",
    description: "Mantenha um streak de 7 dias consecutivos",
    icon: Flame,
    xpReward: 300,
    multiplier: 1.5,
    tier: "bronze",
    target: 7,
    progress: 4,
    isCompleted: false,
    isClaimed: false,
    isLocked: false,
  },
  {
    id: "weekly-hires",
    title: "Recrutador da Semana",
    description: "Realize 3 contratações esta semana",
    icon: Trophy,
    xpReward: 500,
    multiplier: 2.0,
    tier: "silver",
    target: 3,
    progress: 1,
    isCompleted: false,
    isClaimed: false,
    isLocked: false,
  },
  {
    id: "weekly-games",
    title: "Mestre dos Jogos",
    description: "Complete 10 jogos de gamificação",
    icon: Zap,
    xpReward: 400,
    multiplier: 1.75,
    tier: "silver",
    target: 10,
    progress: 6,
    isCompleted: false,
    isClaimed: false,
    isLocked: false,
  },
  {
    id: "weekly-perfect",
    title: "Perfeccionista",
    description: "Complete todos os desafios diários por 5 dias",
    icon: Star,
    xpReward: 750,
    multiplier: 2.5,
    tier: "gold",
    target: 5,
    progress: 2,
    isCompleted: false,
    isClaimed: false,
    isLocked: false,
  },
  {
    id: "weekly-legend",
    title: "Lenda da Semana",
    description: "Alcance o top 3 do ranking semanal",
    icon: Crown,
    xpReward: 1000,
    multiplier: 3.0,
    tier: "platinum",
    target: 1,
    progress: 0,
    isCompleted: false,
    isClaimed: false,
    isLocked: true,
    unlockRequirement: "Complete a missão 'Perfeccionista'",
  },
];

interface WeeklyMissionCardProps {
  mission: WeeklyMission;
  onClaim: (id: string) => void;
}

const WeeklyMissionCard = memo(function WeeklyMissionCard({
  mission,
  onClaim,
}: WeeklyMissionCardProps) {
  const config = tierConfig[mission.tier];
  const Icon = mission.icon;
  const TierIcon = config.icon;
  const progressPercent = Math.min(100, (mission.progress / mission.target) * 100);
  const canClaim = mission.isCompleted && !mission.isClaimed && !mission.isLocked;
  const totalXP = Math.round(mission.xpReward * mission.multiplier);

  const handleClaim = useCallback(() => {
    if (canClaim) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#9370DB'],
      });
      onClaim(mission.id);
    }
  }, [canClaim, mission.id, onClaim]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: mission.isLocked ? 1 : 1.02 }}
      className={cn("relative", mission.isLocked && "opacity-60")}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300",
        config.borderColor,
        mission.isClaimed && "opacity-60",
        canClaim && "ring-2 ring-primary/50 shadow-lg"
      )}>
        {/* Tier badge */}
        <div className={cn(
          "absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold",
          "flex items-center gap-1",
          `bg-gradient-to-r ${config.gradient} text-white shadow-md`
        )}>
          <TierIcon className="w-3 h-3" />
          {config.label}
        </div>

        {/* Lock overlay */}
        {mission.isLocked && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="text-center p-4">
              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{mission.unlockRequirement}</p>
            </div>
          </div>
        )}

        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <motion.div 
              className={cn(
                "flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center",
                `bg-gradient-to-br ${config.gradient} shadow-lg`
              )}
              animate={canClaim ? { 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              } : {}}
              transition={{ duration: 1.5, repeat: canClaim ? Infinity : 0 }}
            >
              {mission.isCompleted ? (
                <CheckCircle2 className="w-7 h-7 text-white" />
              ) : (
                <Icon className="w-7 h-7 text-white" />
              )}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-16">
              <h4 className="font-bold text-foreground text-lg mb-1">
                {mission.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                {mission.description}
              </p>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {mission.progress}/{mission.target} completo
                  </span>
                  <span className={cn("font-semibold", config.textColor)}>
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={cn("h-full rounded-full bg-gradient-to-r", config.gradient)}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Rewards */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  +{totalXP} XP
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold",
                  config.bgColor, config.textColor
                )}>
                  <TrendingUp className="w-4 h-4" />
                  x{mission.multiplier}
                </div>
              </div>

              {/* Claim button */}
              {canClaim && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <Button
                    onClick={handleClaim}
                    className={cn(
                      "w-full h-11 font-semibold",
                      `bg-gradient-to-r ${config.gradient} hover:opacity-90`
                    )}
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    Resgatar +{totalXP} XP
                  </Button>
                </motion.div>
              )}

              {mission.isClaimed && (
                <div className="mt-4 flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Recompensa resgatada!</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

interface WeeklyMissionsProps {
  className?: string;
  onClaimReward?: (missionId: string, xpAmount: number) => void;
}

export const WeeklyMissions = memo(function WeeklyMissions({
  className,
  onClaimReward,
}: WeeklyMissionsProps) {
  const [missions, setMissions] = useState<WeeklyMission[]>(generateWeeklyMissions);

  // Calculate stats
  const stats = useMemo(() => {
    const completed = missions.filter(m => m.isCompleted && !m.isLocked).length;
    const available = missions.filter(m => !m.isLocked).length;
    const totalXP = missions
      .filter(m => !m.isLocked)
      .reduce((sum, m) => sum + Math.round(m.xpReward * m.multiplier), 0);
    
    return { completed, available, totalXP };
  }, [missions]);

  // Days until reset
  const daysUntilReset = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    return daysUntilMonday;
  }, []);

  const handleClaim = useCallback((id: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        const totalReward = Math.round(m.xpReward * m.multiplier);
        onClaimReward?.(id, totalReward);
        return { ...m, isClaimed: true };
      }
      return m;
    }));
  }, [onClaimReward]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-indigo-500/10 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg"
              animate={{ 
                boxShadow: [
                  "0 4px 20px rgba(139, 92, 246, 0.3)",
                  "0 4px 30px rgba(139, 92, 246, 0.5)",
                  "0 4px 20px rgba(139, 92, 246, 0.3)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Rocket className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Missões Semanais
                <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0">
                  <Crown className="w-3 h-3 mr-1" />
                  x2 XP
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3" />
                Renova em {daysUntilReset} dias
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-muted-foreground">XP Total Possível</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              {stats.totalXP.toLocaleString()}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {missions.map((mission) => (
            <WeeklyMissionCard
              key={mission.id}
              mission={mission}
              onClaim={handleClaim}
            />
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
});

WeeklyMissions.displayName = "WeeklyMissions";
