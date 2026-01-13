/**
 * @fileoverview Compact Gamification Widget for Dashboard
 * Shows streak, next achievements, and ranking position
 * Now uses real data from useGamification hook with demo fallback
 */

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Flame, 
  TrendingUp, 
  ChevronRight,
  Star,
  Target,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ProgressRing } from "./ProgressRing";
import { useGamification } from "@/hooks/useGamification";

interface GamificationWidgetProps {
  className?: string;
}

export const GamificationWidget = memo(function GamificationWidget({
  className,
}: GamificationWidgetProps) {
  const navigate = useNavigate();
  
  // Get real data from gamification hook
  const { 
    xp, 
    level, 
    streak, 
    currentLevel, 
    nextLevel,
    achievements
  } = useGamification();

  // Calculate required XP for next level
  const requiredXP = useMemo(() => {
    return nextLevel?.minXP || (currentLevel?.maxXP || 10000);
  }, [nextLevel, currentLevel]);

  // Calculate rank based on XP (simplified - in real app would come from leaderboard)
  const estimatedRank = useMemo(() => {
    if (xp >= 12000) return 1;
    if (xp >= 10000) return 2;
    if (xp >= 8000) return 3;
    if (xp >= 6000) return 4;
    if (xp >= 4000) return 5;
    if (xp >= 2000) return 6;
    return 7;
  }, [xp]);

  // Demo data for achievements (hybrid approach)
  const nextAchievements = useMemo(() => [
    { 
      id: "talent-hunter", 
      title: "Caçador de Talentos", 
      progress: Math.min(100, Math.round((achievements.length / 10) * 100) + 30),
      icon: Target 
    },
    { 
      id: "speed-demon", 
      title: "Velocista", 
      progress: Math.min(100, 50 + level * 5),
      icon: Zap 
    },
  ], [achievements.length, level]);

  const xpProgress = Math.round((xp / requiredXP) * 100);

  return (
    <Card 
      className={cn(
        "overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm",
        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="h-5 w-5 text-yellow-500" />
            </motion.div>
            Seu Progresso
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs gap-1 hover:text-primary"
            onClick={() => navigate('/gamification')}
          >
            Ver tudo
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Level & XP */}
        <div className="flex items-center gap-4">
          <ProgressRing
            value={xp}
            max={requiredXP}
            size="sm"
            color="primary"
            showValue={false}
          >
            <span className="text-sm font-bold">{level}</span>
          </ProgressRing>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Nível {level}</span>
              <span className="text-xs text-muted-foreground">
                {xp.toLocaleString()} / {requiredXP.toLocaleString()} XP
              </span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Streak */}
          <motion.div 
            className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={streak >= 3 ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Flame className={cn("h-5 w-5", streak >= 7 ? "text-orange-500" : streak >= 3 ? "text-amber-500" : "text-muted-foreground")} />
            </motion.div>
            <div>
              <p className="text-lg font-bold">{streak}</p>
              <p className="text-xs text-muted-foreground">dias seguidos</p>
            </div>
          </motion.div>

          {/* Rank */}
          <motion.div 
            className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20"
            whileHover={{ scale: 1.02 }}
          >
            <Star className="h-5 w-5 text-success" />
            <div>
              <div className="flex items-center gap-1">
                <p className="text-lg font-bold">#{estimatedRank}</p>
                <span className="text-xs text-success flex items-center">
                  <TrendingUp className="h-3 w-3" />
                </span>
              </div>
              <p className="text-xs text-muted-foreground">no ranking</p>
            </div>
          </motion.div>
        </div>

        {/* Next Achievements */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Próximas conquistas</p>
          {nextAchievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              whileHover={{ x: 4 }}
              onClick={() => navigate('/gamification')}
            >
              <div className="p-1.5 rounded-lg bg-primary/10">
                <achievement.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{achievement.title}</p>
                <Progress value={achievement.progress} className="h-1.5 mt-1" />
              </div>
              <span className="text-xs text-muted-foreground">{achievement.progress}%</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

GamificationWidget.displayName = "GamificationWidget";
