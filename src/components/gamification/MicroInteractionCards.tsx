/**
 * @fileoverview Micro-interaction Card Components
 * Cards with haptic visual feedback for XP gains
 */

import { memo, useState, useCallback, type ReactNode } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Zap, TrendingUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface XPGainIndicatorProps {
  amount: number;
  isVisible: boolean;
  position?: "top-right" | "center" | "bottom-right";
}

const XPGainIndicator = memo(function XPGainIndicator({
  amount,
  isVisible,
  position = "top-right",
}: XPGainIndicatorProps) {
  const positionClasses = {
    "top-right": "-top-2 -right-2",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "bottom-right": "-bottom-2 -right-2",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 10 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: [0, -20, -30],
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ 
            duration: 0.8,
            y: { duration: 1 }
          }}
          className={cn(
            "absolute z-10 flex items-center gap-1 px-2 py-1 rounded-full",
            "bg-gradient-to-r from-success to-success text-white",
            "text-xs font-bold shadow-lg",
            positionClasses[position]
          )}
        >
          <Plus className="w-3 h-3" />
          {amount} XP
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-3 h-3" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

interface InteractiveXPCardProps {
  children: ReactNode;
  className?: string;
  xpAmount?: number;
  showXPOnHover?: boolean;
  glowColor?: string;
  variant?: "default" | "gradient" | "glass";
  onClick?: () => void;
  onXPGain?: (amount: number) => void;
}

export const InteractiveXPCard = memo(function InteractiveXPCard({
  children,
  className,
  xpAmount = 10,
  showXPOnHover = false,
  glowColor = "primary",
  variant = "default",
  onClick,
  onXPGain,
}: InteractiveXPCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showXPGain, setShowXPGain] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  const handleClick = useCallback(() => {
    // Trigger XP gain animation
    setShowXPGain(true);
    setParticles(Array.from({ length: 6 }, (_, i) => i));
    
    setTimeout(() => {
      setShowXPGain(false);
      setParticles([]);
    }, 1000);
    
    onXPGain?.(xpAmount);
    onClick?.();
  }, [xpAmount, onXPGain, onClick]);

  const variantClasses = {
    default: "bg-card border",
    gradient: "bg-gradient-to-br from-card to-muted border-0",
    glass: "bg-card/80 backdrop-blur-sm border-white/10",
  };

  const glowClasses: Record<string, string> = {
    primary: "shadow-primary/20",
    success: "shadow-success/20",
    warning: "shadow-warning/20",
    destructive: "shadow-destructive/20",
    amber: "shadow-warning/20",
    purple: "shadow-accent/20",
  };

  return (
    <motion.div
      style={{ 
        rotateX, 
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={cn(
        "relative cursor-pointer perspective-1000",
        className
      )}
    >
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          variantClasses[variant],
          isHovered && `shadow-lg ${glowClasses[glowColor] || glowClasses["primary"]}`,
        )}
      >
        {/* Glow effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Shine effect on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "200%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Floating particles on click */}
        {particles.map((i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 1, 
              scale: 0,
              x: "50%",
              y: "50%",
            }}
            animate={{ 
              opacity: 0, 
              scale: 1,
              x: `${50 + (Math.random() - 0.5) * 100}%`,
              y: `${50 - Math.random() * 80}%`,
            }}
            transition={{ duration: 0.8, delay: i * 0.05 }}
            className="absolute pointer-events-none"
          >
            <Star className="w-3 h-3 text-warning fill-warning" />
          </motion.div>
        ))}

        {/* XP Gain Indicator */}
        <XPGainIndicator 
          amount={xpAmount} 
          isVisible={showXPGain || (showXPOnHover && isHovered)} 
        />

        {/* Content */}
        {children}
      </Card>
    </motion.div>
  );
});

InteractiveXPCard.displayName = "InteractiveXPCard";

// Stat Card with XP feedback
interface XPStatCardProps {
  title: string;
  value: string | number;
  icon: typeof Star;
  trend?: number;
  trendLabel?: string;
  xpPerAction?: number;
  gradient?: string;
  iconColor?: string;
  onClick?: () => void;
  onXPGain?: (amount: number) => void;
}

export const XPStatCard = memo(function XPStatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  xpPerAction = 10,
  gradient = "from-primary/10 to-primary/5",
  iconColor = "text-primary",
  onClick,
  onXPGain,
}: XPStatCardProps) {
  const [pulseEffect, setPulseEffect] = useState(false);

  const handleClick = useCallback(() => {
    setPulseEffect(true);
    setTimeout(() => setPulseEffect(false), 600);
    onClick?.();
  }, [onClick]);

  return (
    <InteractiveXPCard
      xpAmount={xpPerAction}
      glowColor="primary"
      onClick={handleClick}
      onXPGain={onXPGain}
    >
      <CardContent className={cn("pt-6 bg-gradient-to-br", gradient)}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <motion.p 
              className="text-3xl font-bold"
              animate={pulseEffect ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {value}
            </motion.p>
            {trend !== undefined && (
              <div className={cn(
                "flex items-center gap-1 text-xs mt-1",
                trend >= 0 ? "text-success" : "text-destructive"
              )}>
                <TrendingUp className={cn(
                  "w-3 h-3",
                  trend < 0 && "rotate-180"
                )} />
                {trend >= 0 ? "+" : ""}{trend}% {trendLabel}
              </div>
            )}
          </div>
          <motion.div
            animate={pulseEffect ? { 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            } : {}}
            transition={{ duration: 0.4 }}
          >
            <Icon className={cn("w-10 h-10", iconColor)} />
          </motion.div>
        </div>
      </CardContent>
    </InteractiveXPCard>
  );
});

XPStatCard.displayName = "XPStatCard";

// Action Card with prominent XP display
interface XPActionCardProps {
  title: string;
  description: string;
  xpReward: number;
  icon: typeof Zap;
  isCompleted?: boolean;
  progress?: number;
  maxProgress?: number;
  onClick?: () => void;
  onXPGain?: (amount: number) => void;
}

export const XPActionCard = memo(function XPActionCard({
  title,
  description,
  xpReward,
  icon: Icon,
  isCompleted = false,
  progress,
  maxProgress,
  onClick,
  onXPGain,
}: XPActionCardProps) {
  return (
    <InteractiveXPCard
      xpAmount={xpReward}
      variant="gradient"
      glowColor={isCompleted ? "success" : "amber"}
      onClick={onClick}
      onXPGain={onXPGain}
      className={cn(isCompleted && "opacity-75")}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              isCompleted 
                ? "bg-success/20" 
                : "bg-warning/20"
            )}>
              <Icon className={cn(
                "w-5 h-5",
                isCompleted ? "text-success" : "text-warning"
              )} />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          
          <div className={cn(
            "px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1",
            isCompleted 
              ? "bg-success/20 text-success" 
              : "bg-warning/20 text-warning"
          )}>
            <Zap className="w-3 h-3" />
            +{xpReward} XP
          </div>
        </div>
      </CardHeader>
      
      {progress !== undefined && maxProgress !== undefined && !isCompleted && (
        <CardContent className="pt-0">
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progresso</span>
              <span>{progress}/{maxProgress}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-warning to-warning rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(progress / maxProgress) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </CardContent>
      )}
    </InteractiveXPCard>
  );
});

XPActionCard.displayName = "XPActionCard";
