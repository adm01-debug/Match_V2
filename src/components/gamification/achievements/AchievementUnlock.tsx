/**
 * @fileoverview Modal celebrativo ao desbloquear uma conquista.
 */

import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Achievement, tierStyles } from "./achievementTypes";

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
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{ background: `hsl(${(i * 30) % 360} 70% 60%)` }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: Math.cos((i * 30 * Math.PI) / 180) * 120,
                  y: Math.sin((i * 30 * Math.PI) / 180) * 120,
                  opacity: 0,
                  scale: [0, 1, 0],
                }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              />
            ))}

            {(achievement.tier === "diamond" || achievement.tier === "platinum") && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <Crown className="w-8 h-8 text-yellow-400" />
              </motion.div>
            )}

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
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon size={48} className={tier.text} />
            </motion.div>

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

AchievementUnlock.displayName = "AchievementUnlock";
