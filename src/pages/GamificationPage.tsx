/**
 * @fileoverview Dedicated Gamification Page
 */

import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { GamificationDashboard } from "@/components/gamification/GamificationDashboard";
import { LevelUpCelebration } from "@/components/gamification/LevelUpCelebration";
import { XPToast } from "@/components/gamification/XPToast";
import {
  GamificationOnboarding,
  useGamificationOnboarding,
} from "@/components/gamification/GamificationOnboarding";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useGamification } from "@/hooks/useGamification";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { GamifiedMode } from "@/components/gamification/page/gameCardsConfig";
import { GamificationHeader } from "@/components/gamification/page/GamificationHeader";
import { PlayNowGrid } from "@/components/gamification/page/PlayNowGrid";
import { GamifiedModeView } from "@/components/gamification/page/GamifiedModeView";
import { GamificationEngagementTabs } from "@/components/gamification/page/GamificationEngagementTabs";

type ToastVariant = "small" | "medium" | "large" | "bonus" | "streak" | "levelup";

export default function GamificationPage() {
  usePageTitle("Conquistas");
  const [gamifiedMode, setGamifiedMode] = useState<GamifiedMode>(null);
  const { addXP, level, streak, xp, levelUpData, clearLevelUp, updateStreak } =
    useGamification();

  const [xpToast, setXpToast] = useState<{
    isVisible: boolean;
    amount: number;
    action?: string;
    variant?: ToastVariant;
  }>({ isVisible: false, amount: 0 });

  const {
    isComplete: onboardingComplete,
    isOpen: onboardingOpen,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
  } = useGamificationOnboarding();

  useEffect(() => {
    if (!onboardingComplete && xp === 0) {
      const timer = setTimeout(() => startOnboarding(), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [onboardingComplete, xp, startOnboarding]);

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const showXPToast = useCallback(
    (amount: number, action?: string, variant?: ToastVariant) => {
      setXpToast({ isVisible: true, amount, action, variant });
      setTimeout(() => setXpToast((prev) => ({ ...prev, isVisible: false })), 3000);
    },
    [],
  );

  const handleGameComplete = useCallback(
    (xpAmount: number) => {
      addXP(xpAmount, "game");
      const variant: ToastVariant =
        xpAmount >= 200 ? "large" : xpAmount >= 100 ? "medium" : "small";
      showXPToast(xpAmount, "Jogo concluído!", variant);
      toast.success(`+${xpAmount} XP ganhos!`, {
        description: "Continue jogando para subir de nível!",
        icon: <Sparkles className="h-5 w-5 text-warning" />,
      });
      setGamifiedMode(null);
    },
    [addXP, showXPToast],
  );

  const handleOnboardingComplete = useCallback(
    (xpEarned: number) => {
      addXP(xpEarned, "onboarding");
      showXPToast(xpEarned, "Tutorial completo!", "bonus");
      completeOnboarding();
      toast.success("Bem-vindo ao sistema de gamificação!", {
        description: `Você ganhou +${xpEarned} XP de bônus!`,
        icon: <Sparkles className="h-5 w-5 text-warning" />,
      });
    },
    [addXP, showXPToast, completeOnboarding],
  );

  if (gamifiedMode) {
    return (
      <GamifiedModeView
        mode={gamifiedMode}
        onExit={() => setGamifiedMode(null)}
        onComplete={handleGameComplete}
      />
    );
  }

  return (
    <Layout title="Conquistas">
      <div className="relative min-h-screen">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--warning) / 0.15) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)",
            }}
            animate={{ scale: [1.2, 1, 1.2], x: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          className="relative p-6 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GamificationHeader level={level} streak={streak} xp={xp} />

          <PlayNowGrid onSelect={setGamifiedMode} />

          <GamificationEngagementTabs
            onXpEarned={(xpAmount, source, label, variant) => {
              addXP(xpAmount, source);
              showXPToast(xpAmount, label, variant);
            }}
          />

          <GamificationDashboard />
        </motion.div>
      </div>

      {levelUpData && (
        <LevelUpCelebration
          isVisible={!!levelUpData}
          oldLevel={levelUpData.oldLevel}
          newLevel={levelUpData.newLevel}
          onClose={clearLevelUp}
        />
      )}

      <XPToast
        isVisible={xpToast.isVisible}
        amount={xpToast.amount}
        action={xpToast.action}
        variant={xpToast.variant}
        onComplete={() => setXpToast((prev) => ({ ...prev, isVisible: false }))}
      />

      <GamificationOnboarding
        isOpen={onboardingOpen}
        onComplete={handleOnboardingComplete}
        onSkip={skipOnboarding}
      />
    </Layout>
  );
}
