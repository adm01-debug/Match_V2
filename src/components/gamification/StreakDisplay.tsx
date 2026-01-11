/**
 * @fileoverview Premium Streak Display components for gamification
 * @module StreakDisplay
 */

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Calendar, TrendingUp, Zap, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  streakType?: "days" | "weeks" | "tasks";
  milestones?: number[];
  lastActivity?: Date;
  animated?: boolean;
  variant?: "compact" | "card" | "banner";
  className?: string;
}

const streakColors = {
  cold: { bg: "bg-slate-500", text: "text-slate-500", glow: "slate" },
  warming: { bg: "bg-orange-400", text: "text-orange-400", glow: "orange" },
  hot: { bg: "bg-orange-500", text: "text-orange-500", glow: "orange" },
  fire: { bg: "bg-red-500", text: "text-red-500", glow: "red" },
  inferno: { bg: "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400", text: "text-orange-500", glow: "orange" },
};

function getStreakLevel(streak: number) {
  if (streak === 0) return "cold";
  if (streak < 7) return "warming";
  if (streak < 14) return "hot";
  if (streak < 30) return "fire";
  return "inferno";
}

function getStreakLabel(type: "days" | "weeks" | "tasks") {
  switch (type) {
    case "days": return "dias";
    case "weeks": return "semanas";
    case "tasks": return "tarefas";
  }
}

export const StreakDisplay = memo(function StreakDisplay({
  currentStreak,
  longestStreak,
  streakType = "days",
  milestones = [7, 14, 30, 60, 100],
  lastActivity,
  animated = true,
  variant = "card",
  className,
}: StreakDisplayProps) {
  const level = getStreakLevel(currentStreak);
  const colors = streakColors[level];
  const label = getStreakLabel(streakType);

  const nextMilestone = useMemo(() => {
    return milestones.find(m => m > currentStreak);
  }, [currentStreak, milestones]);

  const progressToMilestone = useMemo(() => {
    if (!nextMilestone) return 100;
    const prevMilestone = milestones[milestones.indexOf(nextMilestone) - 1] || 0;
    return ((currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
  }, [currentStreak, nextMilestone, milestones]);

  if (variant === "compact") {
    return (
      <motion.div
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
          "bg-gradient-to-r from-orange-500/10 to-red-500/10",
          "border border-orange-500/20",
          className
        )}
        initial={animated ? { scale: 0.9, opacity: 0 } : undefined}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          animate={currentStreak > 0 ? { scale: [1, 1.2, 1] } : undefined}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
        >
          <Flame className={cn("w-4 h-4", colors.text)} />
        </motion.div>
        <span className="font-bold text-foreground">{currentStreak}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </motion.div>
    );
  }

  if (variant === "banner") {
    return (
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-xl p-4",
          "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500",
          className
        )}
        initial={animated ? { y: -20, opacity: 0 } : undefined}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Animated fire particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-yellow-300/50"
              style={{ left: `${(i * 20) + 10}%` }}
              animate={{
                y: [0, -100],
                opacity: [0.8, 0],
                scale: [1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        <div className="relative flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <motion.div
              className="p-3 rounded-full bg-white/20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Flame className="w-8 h-8" />
            </motion.div>
            <div>
              <p className="text-white/80 text-sm">Streak Atual</p>
              <p className="text-4xl font-bold">{currentStreak} {label}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-white/80 text-sm">Recorde</p>
            <p className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              {longestStreak}
            </p>
          </div>
        </div>

        {nextMilestone && (
          <div className="relative mt-4">
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>Próximo marco: {nextMilestone} {label}</span>
              <span>{nextMilestone - currentStreak} restantes</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressToMilestone}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Card variant (default)
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-5",
        "shadow-elevated",
        className
      )}
      initial={animated ? { y: 20, opacity: 0 } : undefined}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-5">
        <div className={cn(
          "absolute inset-0",
          level === "inferno" 
            ? "bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500" 
            : colors.bg
        )} />
      </div>

      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className={cn(
                "p-2.5 rounded-xl",
                level === "inferno"
                  ? "bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20"
                  : `${colors.bg}/10`
              )}
              animate={currentStreak > 0 ? { 
                boxShadow: [
                  "0 0 0 0 rgba(251, 146, 60, 0)",
                  "0 0 20px 10px rgba(251, 146, 60, 0.3)",
                  "0 0 0 0 rgba(251, 146, 60, 0)",
                ]
              } : undefined}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                animate={currentStreak > 0 ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : undefined}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <Flame className={cn("w-6 h-6", colors.text)} />
              </motion.div>
            </motion.div>
            <div>
              <p className="text-sm text-muted-foreground">Streak Atual</p>
              <motion.p
                className="text-3xl font-bold"
                initial={animated ? { scale: 0 } : undefined}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {currentStreak}
                <span className="text-lg text-muted-foreground ml-1">{label}</span>
              </motion.p>
            </div>
          </div>

          {/* Streak level badge */}
          <motion.div
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium text-white",
              level === "inferno" 
                ? "bg-gradient-to-r from-red-500 to-orange-500"
                : colors.bg
            )}
            animate={level === "inferno" ? { scale: [1, 1.05, 1] } : undefined}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {level === "cold" && "Iniciante"}
            {level === "warming" && "Aquecendo"}
            {level === "hot" && "Em Chamas"}
            {level === "fire" && "Fogo!"}
            {level === "inferno" && "🔥 INFERNO!"}
          </motion.div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <Trophy className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
            <p className="text-lg font-bold">{longestStreak}</p>
            <p className="text-xs text-muted-foreground">Recorde</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <Calendar className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{nextMilestone || "🏆"}</p>
            <p className="text-xs text-muted-foreground">Próximo Marco</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <TrendingUp className="w-4 h-4 mx-auto mb-1 text-success" />
            <p className="text-lg font-bold">{Math.round(progressToMilestone)}%</p>
            <p className="text-xs text-muted-foreground">Progresso</p>
          </div>
        </div>

        {/* Milestone progress */}
        {nextMilestone && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso para {nextMilestone} {label}</span>
              <span className="font-medium">{nextMilestone - currentStreak} restantes</span>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full",
                  level === "inferno"
                    ? "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"
                    : colors.bg
                )}
                initial={{ width: 0 }}
                animate={{ width: `${progressToMilestone}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              {/* Milestone markers */}
              {milestones.map(milestone => {
                const position = (milestone / (nextMilestone || 100)) * 100;
                if (position > 100) return null;
                return (
                  <div
                    key={milestone}
                    className="absolute top-0 bottom-0 w-0.5 bg-background/50"
                    style={{ left: `${position}%` }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Last activity */}
        {lastActivity && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Última atividade: {lastActivity.toLocaleDateString('pt-BR', { 
              weekday: 'long',
              day: 'numeric',
              month: 'short'
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
});

// Streak Calendar Component
interface StreakCalendarProps {
  streakDays: Date[];
  animated?: boolean;
  className?: string;
}

export const StreakCalendar = memo(function StreakCalendar({
  streakDays,
  animated = true,
  className,
}: StreakCalendarProps) {
  const today = new Date();
  const daysToShow = 28; // 4 weeks
  
  const days = useMemo(() => {
    const result = [];
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const isActive = streakDays.some(d => 
        d.toDateString() === date.toDateString()
      );
      result.push({ date, isActive });
    }
    return result;
  }, [streakDays, today]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Últimos 28 dias</span>
        <span>{streakDays.length} dias ativos</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <motion.div
            key={day.date.toISOString()}
            className={cn(
              "aspect-square rounded-sm",
              day.isActive
                ? "bg-gradient-to-br from-orange-400 to-red-500"
                : "bg-muted"
            )}
            initial={animated ? { scale: 0, opacity: 0 } : undefined}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.02 }}
            whileHover={{ scale: 1.2 }}
            title={day.date.toLocaleDateString('pt-BR')}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{new Date(today.getTime() - (daysToShow - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</span>
        <span>Hoje</span>
      </div>
    </div>
  );
});

StreakDisplay.displayName = "StreakDisplay";
StreakCalendar.displayName = "StreakCalendar";
