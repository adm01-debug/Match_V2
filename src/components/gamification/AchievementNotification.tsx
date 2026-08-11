/**
 * @fileoverview Achievement Notification Component
 * Animated toast notification with confetti when achievements are unlocked
 */

import { memo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import type { LucideIcon } from "lucide-react";

type AchievementTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

interface AchievementNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  tier?: AchievementTier;
  icon?: LucideIcon;
  xpReward?: number;
}

const tierStyles: Record<AchievementTier, {
  gradient: string;
  glow: string;
  text: string;
  particles: string[];
}> = {
  bronze: {
    gradient: "from-warning via-warning to-warning",
    glow: "shadow-warning/40",
    text: "text-warning",
    particles: ["#CD7F32", "#B87333", "#DA9100"],
  },
  silver: {
    gradient: "from-slate-400 via-slate-300 to-slate-400",
    glow: "shadow-slate-300/40",
    text: "text-foreground",
    particles: ["#C0C0C0", "#A8A9AD", "#D3D3D3"],
  },
  gold: {
    gradient: "from-warning via-warning to-warning",
    glow: "shadow-warning/50",
    text: "text-warning",
    particles: ["#FFD700", "#FFC107", "#FFB300"],
  },
  platinum: {
    gradient: "from-info via-success to-info",
    glow: "shadow-info/50",
    text: "text-info",
    particles: ["#00CED1", "#20B2AA", "#40E0D0"],
  },
  diamond: {
    gradient: "from-accent via-accent to-accent",
    glow: "shadow-accent/60",
    text: "text-accent",
    particles: ["#B9F2FF", "#E0E7FF", "#C4B5FD"],
  },
};

export const AchievementNotification = memo(function AchievementNotification({
  isVisible,
  onClose,
  title,
  description,
  tier = "gold",
  icon: Icon = Trophy,
  xpReward = 100,
}: AchievementNotificationProps) {
  const styles = tierStyles[tier];

  const triggerConfetti = useCallback(() => {
    const colors = styles.particles;
    
    // Center burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.3 },
      colors,
    });

    // Side bursts
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
    }, 200);

    // Stars
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 100,
        origin: { y: 0.4 },
        shapes: ['star'],
        colors,
        scalar: 1.2,
      });
    }, 400);
  }, [styles.particles]);

  useEffect(() => {
    if (isVisible) {
      triggerConfetti();
      
      // Auto close after 5 seconds
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isVisible, triggerConfetti, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25 
          }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto"
        >
          <motion.div
            className={cn(
              "relative overflow-hidden rounded-2xl px-6 py-4 min-w-[320px] max-w-[400px]",
              "bg-gradient-to-r shadow-2xl",
              styles.gradient,
              styles.glow
            )}
            animate={{
              boxShadow: [
                `0 20px 60px -10px ${styles.particles[0]}40`,
                `0 20px 80px -10px ${styles.particles[0]}60`,
                `0 20px 60px -10px ${styles.particles[0]}40`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            />

            {/* Stars decoration */}
            <div className="absolute top-2 right-10">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Star className="h-4 w-4 text-white/60 fill-white/40" />
              </motion.div>
            </div>

            <div className="relative flex items-center gap-4">
              {/* Icon */}
              <motion.div
                className={cn(
                  "flex items-center justify-center w-14 h-14 rounded-xl",
                  "bg-white/20 backdrop-blur-sm"
                )}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon className={cn("h-7 w-7", styles.text)} />
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <motion.p
                  className="text-xs font-medium text-white/80 uppercase tracking-wider"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  🎉 Conquista Desbloqueada!
                </motion.p>
                <motion.h3
                  className={cn("text-lg font-bold mt-0.5", styles.text)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {title}
                </motion.h3>
                <motion.p
                  className="text-sm text-white/70 mt-0.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {description}
                </motion.p>
                {xpReward > 0 && (
                  <motion.p
                    className="text-xs font-semibold text-white/90 mt-1 flex items-center gap-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Star className="h-3 w-3 fill-current" />
                    +{xpReward} XP
                  </motion.p>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className={cn("h-4 w-4", styles.text)} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

AchievementNotification.displayName = "AchievementNotification";

// Hook to manage achievement notifications
import { useState } from "react";

interface Achievement {
  title: string;
  description: string;
  tier?: AchievementTier;
  icon?: LucideIcon;
  xpReward?: number;
}

export function useAchievementNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [achievement, setAchievement] = useState<Achievement | null>(null);

  const showAchievement = useCallback((data: Achievement) => {
    setAchievement(data);
    setIsVisible(true);
  }, []);

  const hideAchievement = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setAchievement(null), 300);
  }, []);

  return {
    isVisible,
    achievement,
    showAchievement,
    hideAchievement,
  };
}
