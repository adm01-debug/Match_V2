/**
 * @fileoverview Premium Achievement Badge components for gamification
 * @module AchievementBadge
 */

import { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Zap,
  Target,
  Crown,
  Flame,
  Rocket,
  Users,
  Briefcase,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type AchievementTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";
export type AchievementCategory = 
  | "recruitment" 
  | "speed" 
  | "quality" 
  | "engagement" 
  | "milestone" 
  | "streak"
  | "special";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tier: AchievementTier;
  category: AchievementCategory;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: Date;
  isNew?: boolean;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg" | "xl";
  showProgress?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

const tierStyles: Record<AchievementTier, { bg: string; border: string; glow: string; text: string }> = {
  bronze: {
    bg: "bg-gradient-to-br from-amber-600 to-amber-800",
    border: "border-amber-500/50",
    glow: "shadow-[0_0_20px_-5px_hsl(38_92%_50%/0.5)]",
    text: "text-amber-100",
  },
  silver: {
    bg: "bg-gradient-to-br from-slate-300 to-slate-500",
    border: "border-slate-400/50",
    glow: "shadow-[0_0_20px_-5px_hsl(215_16%_60%/0.5)]",
    text: "text-slate-100",
  },
  gold: {
    bg: "bg-gradient-to-br from-yellow-400 to-amber-600",
    border: "border-yellow-400/50",
    glow: "shadow-[0_0_25px_-5px_hsl(45_93%_47%/0.6)]",
    text: "text-yellow-50",
  },
  platinum: {
    bg: "bg-gradient-to-br from-cyan-300 to-teal-500",
    border: "border-cyan-400/50",
    glow: "shadow-[0_0_30px_-5px_hsl(173_58%_50%/0.6)]",
    text: "text-cyan-50",
  },
  diamond: {
    bg: "bg-gradient-to-br from-violet-400 via-fuchsia-400 to-pink-400",
    border: "border-violet-400/50",
    glow: "shadow-[0_0_35px_-5px_hsl(262_60%_60%/0.7)]",
    text: "text-violet-50",
  },
};

const sizeStyles = {
  sm: { container: "w-10 h-10", icon: 16, ring: 36 },
  md: { container: "w-14 h-14", icon: 22, ring: 52 },
  lg: { container: "w-20 h-20", icon: 32, ring: 76 },
  xl: { container: "w-28 h-28", icon: 44, ring: 108 },
};

export const AchievementBadge = memo(function AchievementBadge({
  achievement,
  size = "md",
  showProgress = true,
  showTooltip = true,
  animated = true,
  className,
  onClick,
}: AchievementBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = achievement.icon;
  const tier = tierStyles[achievement.tier];
  const sizeStyle = sizeStyles[size];
  
  const progress = useMemo(() => {
    if (!achievement.progress || !achievement.maxProgress) return 100;
    return (achievement.progress / achievement.maxProgress) * 100;
  }, [achievement.progress, achievement.maxProgress]);

  const isUnlocked = achievement.unlockedAt !== undefined;
  const circumference = 2 * Math.PI * (sizeStyle.ring / 2 - 3);

  const BadgeContent = (
    <motion.div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full cursor-pointer",
        sizeStyle.container,
        isUnlocked ? tier.bg : "bg-muted",
        isUnlocked ? tier.border : "border-muted-foreground/20",
        isUnlocked && isHovered && tier.glow,
        "border-2 transition-shadow duration-300",
        className
      )}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={animated ? { scale: 0, rotate: -180 } : undefined}
      animate={animated ? { scale: 1, rotate: 0 } : undefined}
      whileHover={animated ? { scale: 1.1 } : undefined}
      whileTap={animated ? { scale: 0.95 } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* Progress Ring */}
      {showProgress && !isUnlocked && progress < 100 && (
        <svg
          className="absolute inset-0 -rotate-90"
          width={sizeStyle.ring}
          height={sizeStyle.ring}
          style={{ margin: -(sizeStyle.ring - (parseInt(sizeStyle.container.split(" ")[0]?.replace("w-", "") ?? "0", 10) * 4)) / 2 }}
        >
          {/* Background circle */}
          <circle
            cx={sizeStyle.ring / 2}
            cy={sizeStyle.ring / 2}
            r={sizeStyle.ring / 2 - 3}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={3}
          />
          {/* Progress circle */}
          <motion.circle
            cx={sizeStyle.ring / 2}
            cy={sizeStyle.ring / 2}
            r={sizeStyle.ring / 2 - 3}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
      )}

      {/* Icon */}
      <Icon 
        size={sizeStyle.icon} 
        className={cn(
          isUnlocked ? tier.text : "text-muted-foreground",
          "relative z-10"
        )} 
      />

      {/* Shine effect */}
      {isUnlocked && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-transparent to-transparent"
          animate={isHovered ? { opacity: [0.3, 0.5, 0.3] } : { opacity: 0.3 }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
        />
      )}

      {/* New badge indicator */}
      {achievement.isNew && (
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
        >
          <span className="text-[8px] font-bold text-destructive-foreground">!</span>
        </motion.div>
      )}

      {/* Lock overlay for locked badges */}
      {!isUnlocked && (
        <div className="absolute inset-0 rounded-full bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
          <Icon size={sizeStyle.icon * 0.7} className="text-muted-foreground/50" />
        </div>
      )}
    </motion.div>
  );

  if (!showTooltip) return BadgeContent;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{BadgeContent}</TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs p-3 bg-popover border shadow-elevated"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded",
                tier.bg,
                tier.text
              )}>
                {achievement.tier}
              </span>
              <span className="font-semibold">{achievement.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
            {!isUnlocked && achievement.progress !== undefined && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span>{achievement.progress}/{achievement.maxProgress}</span>
              </div>
            )}
            {isUnlocked && achievement.unlockedAt && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle size={12} className="text-success" />
                Desbloqueado em {achievement.unlockedAt.toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

// Achievement Grid Component
interface AchievementGridProps {
  achievements: Achievement[];
  size?: "sm" | "md" | "lg";
  columns?: 3 | 4 | 5 | 6;
  showProgress?: boolean;
  animated?: boolean;
  className?: string;
}

export const AchievementGrid = memo(function AchievementGrid({
  achievements,
  size = "md",
  columns = 4,
  showProgress = true,
  animated = true,
  className,
}: AchievementGridProps) {
  const gridCols = {
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={animated ? { opacity: 0, y: 20 } : undefined}
          animate={animated ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="flex flex-col items-center gap-2"
        >
          <AchievementBadge
            achievement={achievement}
            size={size}
            showProgress={showProgress}
            animated={animated}
          />
          <span className={cn(
            "text-xs text-center font-medium truncate w-full",
            achievement.unlockedAt ? "text-foreground" : "text-muted-foreground"
          )}>
            {achievement.title}
          </span>
        </motion.div>
      ))}
    </div>
  );
});

// Achievement Unlock Animation
interface AchievementUnlockProps {
  achievement: Achievement;
  isVisible: boolean;
  onClose: () => void;
}

export const AchievementUnlock = memo(function AchievementUnlock({
  achievement,
  isVisible,
  onClose,
}: AchievementUnlockProps) {
  const tier = tierStyles[achievement.tier];
  const Icon = achievement.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative flex flex-col items-center gap-6 p-8 bg-card rounded-2xl border shadow-elevated-lg"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: `hsl(${(i * 30) % 360} 70% 60%)`,
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 1,
                  scale: 0 
                }}
                animate={{ 
                  x: Math.cos((i * 30 * Math.PI) / 180) * 120,
                  y: Math.sin((i * 30 * Math.PI) / 180) * 120,
                  opacity: 0,
                  scale: [0, 1, 0],
                }}
                transition={{ 
                  duration: 1,
                  delay: 0.3,
                  ease: "easeOut"
                }}
              />
            ))}

            {/* Crown for diamond/platinum */}
            {(achievement.tier === "diamond" || achievement.tier === "platinum") && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <Crown className="w-8 h-8 text-yellow-400" />
              </motion.div>
            )}

            {/* Badge */}
            <motion.div
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center",
                tier.bg,
                tier.glow,
                "border-4",
                tier.border
              )}
              animate={{ 
                boxShadow: [
                  `0 0 30px -5px hsl(var(--primary) / 0.5)`,
                  `0 0 50px -5px hsl(var(--primary) / 0.8)`,
                  `0 0 30px -5px hsl(var(--primary) / 0.5)`,
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon size={48} className={tier.text} />
            </motion.div>

            {/* Text */}
            <div className="text-center space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-sm text-muted-foreground uppercase tracking-wider">
                  Conquista Desbloqueada!
                </p>
              </motion.div>
              <motion.h3
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {achievement.title}
              </motion.h3>
              <motion.p
                className="text-muted-foreground max-w-xs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {achievement.description}
              </motion.p>
            </div>

            {/* Tier Badge */}
            <motion.span
              className={cn(
                "px-4 py-1 rounded-full text-sm font-bold uppercase",
                tier.bg,
                tier.text
              )}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
            >
              {achievement.tier}
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Preset achievements for the recruitment system
export const recruitmentAchievements: Achievement[] = [
  {
    id: "first-hire",
    title: "Primeira Contratação",
    description: "Realize sua primeira contratação no sistema",
    icon: Briefcase,
    tier: "bronze",
    category: "recruitment",
  },
  {
    id: "speed-demon",
    title: "Velocista",
    description: "Conclua um processo seletivo em menos de 7 dias",
    icon: Zap,
    tier: "silver",
    category: "speed",
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
    description: "Monte uma equipe completa de 5 pessoas para uma vaga",
    icon: Users,
    tier: "gold",
    category: "recruitment",
  },
  {
    id: "streak-master",
    title: "Mestre da Consistência",
    description: "Mantenha um streak de 30 dias consecutivos no sistema",
    icon: Flame,
    tier: "platinum",
    category: "streak",
    progress: 18,
    maxProgress: 30,
  },
  {
    id: "perfectionist",
    title: "Perfeccionista",
    description: "Alcance 100% de satisfação em 5 processos consecutivos",
    icon: Star,
    tier: "platinum",
    category: "quality",
  },
  {
    id: "legend",
    title: "Lenda do RH",
    description: "Contrate 100 profissionais através da plataforma",
    icon: Crown,
    tier: "diamond",
    category: "milestone",
    progress: 42,
    maxProgress: 100,
  },
  {
    id: "rocket",
    title: "Foguete",
    description: "Triplique a velocidade média de contratação",
    icon: Rocket,
    tier: "diamond",
    category: "speed",
  },
];

AchievementBadge.displayName = "AchievementBadge";
AchievementGrid.displayName = "AchievementGrid";
AchievementUnlock.displayName = "AchievementUnlock";
