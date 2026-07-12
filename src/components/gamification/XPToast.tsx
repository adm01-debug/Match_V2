/**
 * @fileoverview XP Toast Component
 * Animated toast with particles for XP gains
 */

import { memo, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

type XPToastVariant = "small" | "medium" | "large" | "bonus" | "streak" | "levelup";

interface XPToastProps {
  isVisible: boolean;
  amount: number;
  action?: string;
  multiplier?: number;
  variant?: XPToastVariant;
  onComplete?: () => void;
}

const variantConfig: Record<XPToastVariant, {
  gradient: string;
  icon: typeof Sparkles;
  particles: boolean;
  duration: number;
  scale: number;
}> = {
  small: {
    gradient: "from-success to-success/80",
    icon: Sparkles,
    particles: false,
    duration: 2000,
    scale: 0.9,
  },
  medium: {
    gradient: "from-info to-info/80",
    icon: Zap,
    particles: true,
    duration: 2500,
    scale: 1,
  },
  large: {
    gradient: "from-accent to-accent/80",
    icon: Star,
    particles: true,
    duration: 3000,
    scale: 1.1,
  },
  bonus: {
    gradient: "from-warning to-warning/80",
    icon: TrendingUp,
    particles: true,
    duration: 3500,
    scale: 1.15,
  },
  streak: {
    gradient: "from-destructive to-destructive/80",
    icon: Zap,
    particles: true,
    duration: 3000,
    scale: 1.1,
  },
  levelup: {
    gradient: "from-warning via-warning/90 to-warning/70",
    icon: Star,
    particles: true,
    duration: 4000,
    scale: 1.2,
  },
};

// Floating particle component
const FloatingParticle = memo(function FloatingParticle({ 
  delay, 
  color 
}: { 
  delay: number; 
  color: string;
}) {
  return (
    <motion.div
      className={cn("absolute w-2 h-2 rounded-full", color)}
      initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [-10, -40, -60, -80],
        x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
        scale: [0, 1, 0.8, 0],
      }}
      transition={{
        duration: 1.5,
        delay,
        ease: "easeOut",
      }}
    />
  );
});

export const XPToast = memo(function XPToast({
  isVisible,
  amount,
  action,
  multiplier = 1,
  variant = "medium",
  onComplete,
}: XPToastProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  const [particles, setParticles] = useState<number[]>([]);

  const triggerParticles = useCallback(() => {
    if (!config.particles) return;
    
    // Create floating particles
    setParticles(Array.from({ length: 8 }, (_, i) => i));
    
    // Mini confetti
    confetti({
      particleCount: 20,
      spread: 45,
      origin: { y: 0.3, x: 0.5 },
      colors: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'],
      scalar: 0.6,
      gravity: 1.5,
    });
  }, [config.particles]);

  useEffect(() => {
    if (isVisible) {
      // Trigger particles
      triggerParticles();
      
      // Auto hide
      const timer = setTimeout(() => {
        onComplete?.();
      }, config.duration);
      
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isVisible, config.duration, onComplete, triggerParticles]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: config.scale,
          }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25 
          }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] pointer-events-none"
        >
          <motion.div
            className={cn(
              "relative flex items-center gap-3 px-5 py-3 rounded-2xl",
              "bg-gradient-to-r shadow-2xl backdrop-blur-sm",
              config.gradient
            )}
            animate={{
              boxShadow: [
                "0 10px 40px -10px rgba(0,0,0,0.3)",
                "0 20px 60px -10px rgba(0,0,0,0.4)",
                "0 10px 40px -10px rgba(0,0,0,0.3)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {particles.map((i) => (
                <FloatingParticle
                  key={i}
                  delay={i * 0.1}
                  color={i % 2 === 0 ? "bg-white/80" : "bg-yellow-300/80"}
                />
              ))}
            </div>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1, repeat: 2, repeatDelay: 0.5 }}
            />

            {/* Icon */}
            <motion.div
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/20"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 0.6, repeat: 2 }}
            >
              <Icon className="w-5 h-5 text-white" />
            </motion.div>

            {/* Content */}
            <div className="relative flex flex-col">
              <motion.div
                className="flex items-baseline gap-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-2xl font-bold text-white">+</span>
                <motion.span
                  className="text-2xl font-bold text-white tabular-nums"
                >
                  {amount}
                </motion.span>
                <span className="text-lg font-semibold text-white/90">XP</span>
                
                {multiplier > 1 && (
                  <motion.span
                    className="ml-2 px-2 py-0.5 text-xs font-bold bg-white/30 rounded-full text-white"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    x{multiplier}
                  </motion.span>
                )}
              </motion.div>
              
              {action && (
                <motion.p
                  className="text-xs text-white/80 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {action}
                </motion.p>
              )}
            </div>

            {/* Decorative stars */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

XPToast.displayName = "XPToast";

// Hook to manage XP toasts
export function useXPToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    amount: number;
    action?: string;
    multiplier?: number;
    variant: XPToastVariant;
  }>>([]);

  const showXPGain = useCallback((
    amount: number,
    options?: {
      action?: string;
      multiplier?: number;
      variant?: XPToastVariant;
    }
  ) => {
    const id = crypto.randomUUID();
    
    // Determine variant based on amount
    let variant: XPToastVariant = options?.variant || "medium";
    if (!options?.variant) {
      if (amount >= 100) variant = "large";
      else if (amount >= 50) variant = "medium";
      else variant = "small";
      
      if (options?.multiplier && options.multiplier > 1) variant = "bonus";
    }
    
    setToasts(prev => [...prev, {
      id,
      amount,
      action: options?.action,
      multiplier: options?.multiplier,
      variant,
    }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toasts,
    showXPGain,
    removeToast,
  };
}

// Global XP Toast Manager Component
export const XPToastManager = memo(function XPToastManager() {
  const { toasts, removeToast } = useXPToast();

  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ transform: `translateY(-${index * 80}px)` }}
        >
          <XPToast
            isVisible={true}
            amount={toast.amount}
            action={toast.action}
            multiplier={toast.multiplier}
            variant={toast.variant}
            onComplete={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  );
});

XPToastManager.displayName = "XPToastManager";
