/**
 * @fileoverview Gamification Onboarding Component
 * Interactive tutorial for new users
 */

import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Flame, 
  Star, 
  Zap, 
  Target,
  ChevronRight,
  Gift,
  Sparkles,
  Rocket,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Trophy;
  color: string;
  gradient: string;
  reward?: number;
  action?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Bem-vindo ao Sistema de Gamificação! 🎮",
    description: "Transforme seu trabalho em uma experiência incrível! Ganhe XP, desbloqueie conquistas e suba de nível enquanto trabalha.",
    icon: Rocket,
    color: "text-primary",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    id: "xp",
    title: "Ganhe XP em Tudo!",
    description: "Cada ação conta! Adicionar candidatos, agendar entrevistas, fazer contratações... Tudo gera pontos de experiência.",
    icon: Zap,
    color: "text-amber-500",
    gradient: "from-amber-500/20 to-amber-500/5",
    reward: 10,
    action: "Exemplo: +10 XP por cadastrar candidato",
  },
  {
    id: "levels",
    title: "Suba de Nível",
    description: "Quanto mais XP você ganha, mais rápido sobe de nível! Comece como Iniciante e chegue até Lenda do RH!",
    icon: Star,
    color: "text-yellow-500",
    gradient: "from-yellow-500/20 to-yellow-500/5",
    action: "10 níveis para conquistar",
  },
  {
    id: "streak",
    title: "Mantenha seu Streak 🔥",
    description: "Use o sistema diariamente para manter seu streak ativo! Bônus especiais para 7 dias e 30 dias consecutivos.",
    icon: Flame,
    color: "text-orange-500",
    gradient: "from-orange-500/20 to-orange-500/5",
    reward: 100,
    action: "Streak de 7 dias = +100 XP bônus!",
  },
  {
    id: "achievements",
    title: "Desbloqueie Conquistas",
    description: "Complete desafios especiais para desbloquear conquistas exclusivas! Bronze, Prata, Ouro, Platina e Diamante.",
    icon: Trophy,
    color: "text-purple-500",
    gradient: "from-purple-500/20 to-purple-500/5",
    action: "8+ conquistas para desbloquear",
  },
  {
    id: "leaderboard",
    title: "Compita no Ranking",
    description: "Veja sua posição em relação aos outros! Suba no ranking e mostre quem é o melhor recruiter!",
    icon: Target,
    color: "text-success",
    gradient: "from-success/20 to-success/5",
  },
  {
    id: "start",
    title: "Pronto para Começar?",
    description: "Seu primeiro XP te espera! Complete este tutorial e ganhe seu primeiro bônus!",
    icon: Gift,
    color: "text-pink-500",
    gradient: "from-pink-500/20 to-pink-500/5",
    reward: 50,
    action: "🎁 Ganhe +50 XP agora!",
  },
];

interface GamificationOnboardingProps {
  isOpen: boolean;
  onComplete: (xpEarned: number) => void;
  onSkip?: () => void;
}

export const GamificationOnboarding = memo(function GamificationOnboarding({
  isOpen,
  onComplete,
  onSkip,
}: GamificationOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  const step = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const Icon = step?.icon || Sparkles;

  const triggerCelebration = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'],
    });
  }, []);

  const handleNext = useCallback(() => {
    if (!step) return;
    
    setCompletedSteps(prev => [...prev, step.id]);
    
    if (isLastStep) {
      triggerCelebration();
      // Calculate total XP earned
      const totalXP = onboardingSteps.reduce((sum, s) => sum + (s.reward || 0), 0);
      setTimeout(() => onComplete(totalXP), 500);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  }, [step, isLastStep, triggerCelebration, onComplete]);

  const handleSkip = useCallback(() => {
    onSkip?.();
  }, [onSkip]);

  if (!isOpen || !step) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-background shadow-2xl"
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/80"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Header with icon */}
          <div className={cn("pt-8 pb-4 px-8", `bg-gradient-to-br ${step.gradient}`)}>
            <div className="flex items-center justify-between mb-4">
              {/* Step indicators */}
              <div className="flex gap-1.5">
                {onboardingSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index < currentStep
                        ? "bg-primary"
                        : index === currentStep
                        ? "bg-primary/80"
                        : "bg-muted-foreground/30"
                    )}
                    animate={index === currentStep ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </div>
              
              {/* Skip button */}
              {!isLastStep && onSkip && (
                <button
                  onClick={handleSkip}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pular tutorial
                </button>
              )}
            </div>

            {/* Icon */}
            <motion.div
              key={step.id}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex justify-center"
            >
              <div className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center",
                "bg-background/80 backdrop-blur-sm shadow-lg"
              )}>
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon className={cn("w-10 h-10", step.color)} />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {step.description}
                </p>
                
                {step.action && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full",
                      "bg-gradient-to-r text-sm font-medium",
                      step.gradient,
                      step.color
                    )}
                  >
                    {step.reward && <Sparkles className="w-4 h-4" />}
                    {step.action}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            <Button
              onClick={handleNext}
              className={cn(
                "w-full h-12 text-base font-semibold rounded-xl",
                "bg-gradient-to-r from-primary to-primary/90",
                "hover:from-primary/90 hover:to-primary",
                "transition-all duration-300",
                isLastStep && "from-success to-success/90 hover:from-success/90 hover:to-success"
              )}
            >
              {isLastStep ? (
                <>
                  <Gift className="w-5 h-5 mr-2" />
                  Receber +50 XP e Começar!
                </>
              ) : (
                <>
                  Continuar
                  <ChevronRight className="w-5 h-5 ml-1" />
                </>
              )}
            </Button>

            {/* Completed steps */}
            {completedSteps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"
              >
                <Check className="w-3 h-3 text-success" />
                {completedSteps.length} de {onboardingSteps.length} passos completos
              </motion.div>
            )}
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-primary/20" />
            </motion.div>
          </div>
          <div className="absolute bottom-4 left-4">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-4 h-4 text-yellow-500/30" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

GamificationOnboarding.displayName = "GamificationOnboarding";

// Hook to manage onboarding state
export function useGamificationOnboarding() {
  const STORAGE_KEY = "gamification-onboarding-complete";
  const [isComplete, setIsComplete] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  const startOnboarding = useCallback(() => {
    setIsOpen(true);
  }, []);

  const completeOnboarding = useCallback(() => {
    setIsComplete(true);
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore storage errors
    }
  }, []);

  const skipOnboarding = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  const resetOnboarding = useCallback(() => {
    setIsComplete(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  return {
    isComplete,
    isOpen,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  };
}
