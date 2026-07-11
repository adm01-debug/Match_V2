/**
 * @fileoverview Badge premium de conquista individual (com progresso e tooltip).
 */

import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Achievement,
  AchievementBadgeSize,
  sizeStyles,
  tierStyles,
} from "./achievementTypes";

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: AchievementBadgeSize;
  showProgress?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

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
      {showProgress && !isUnlocked && progress < 100 && (
        <svg
          className="absolute inset-0 -rotate-90"
          width={sizeStyle.ring}
          height={sizeStyle.ring}
          style={{
            margin:
              -(
                sizeStyle.ring -
                (parseInt(sizeStyle.container.split(" ")[0]?.replace("w-", "") ?? "0", 10) * 4)
              ) / 2,
          }}
        >
          <circle
            cx={sizeStyle.ring / 2}
            cy={sizeStyle.ring / 2}
            r={sizeStyle.ring / 2 - 3}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={3}
          />
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

      <Icon
        size={sizeStyle.icon}
        className={cn(isUnlocked ? tier.text : "text-muted-foreground", "relative z-10")}
      />

      {isUnlocked && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-transparent to-transparent"
          animate={isHovered ? { opacity: [0.3, 0.5, 0.3] } : { opacity: 0.3 }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
        />
      )}

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
        <TooltipContent side="top" className="max-w-xs p-3 bg-popover border shadow-elevated">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded",
                  tier.bg,
                  tier.text
                )}
              >
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
                <span>
                  {achievement.progress}/{achievement.maxProgress}
                </span>
              </div>
            )}
            {isUnlocked && achievement.unlockedAt && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle size={12} className="text-success" />
                Desbloqueado em {achievement.unlockedAt.toLocaleDateString("pt-BR")}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

AchievementBadge.displayName = "AchievementBadge";
