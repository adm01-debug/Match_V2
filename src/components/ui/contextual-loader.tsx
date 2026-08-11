/**
 * @fileoverview Contextual Loading States
 * Semantic loading indicators for different contexts
 */

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2, RefreshCw, Cloud, Database, Send, Download, Upload, Search } from "lucide-react";

type LoadingContext = 
  | "default" 
  | "saving" 
  | "syncing" 
  | "fetching" 
  | "sending" 
  | "downloading" 
  | "uploading"
  | "searching"
  | "processing";

interface ContextualLoaderProps {
  context?: LoadingContext;
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showMessage?: boolean;
}

const contextConfig: Record<LoadingContext, { 
  icon: React.ElementType; 
  defaultMessage: string;
  animation: "spin" | "pulse" | "bounce";
}> = {
  default: { icon: Loader2, defaultMessage: "Carregando...", animation: "spin" },
  saving: { icon: Cloud, defaultMessage: "Salvando...", animation: "pulse" },
  syncing: { icon: RefreshCw, defaultMessage: "Sincronizando...", animation: "spin" },
  fetching: { icon: Database, defaultMessage: "Buscando dados...", animation: "pulse" },
  sending: { icon: Send, defaultMessage: "Enviando...", animation: "bounce" },
  downloading: { icon: Download, defaultMessage: "Baixando...", animation: "bounce" },
  uploading: { icon: Upload, defaultMessage: "Enviando arquivo...", animation: "bounce" },
  searching: { icon: Search, defaultMessage: "Pesquisando...", animation: "pulse" },
  processing: { icon: Loader2, defaultMessage: "Processando...", animation: "spin" }
};

const sizeConfig = {
  sm: { icon: 16, text: "text-xs", gap: "gap-1.5", padding: "px-2 py-1" },
  md: { icon: 20, text: "text-sm", gap: "gap-2", padding: "px-3 py-1.5" },
  lg: { icon: 24, text: "text-base", gap: "gap-2.5", padding: "px-4 py-2" }
};

export function ContextualLoader({ 
  context = "default",
  message,
  size = "md",
  className,
  showMessage = true
}: ContextualLoaderProps) {
  const config = contextConfig[context];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  const animationVariants = {
    spin: {
      animate: { rotate: 360 },
      transition: { duration: 1, repeat: Infinity, ease: "linear" as const }
    },
    pulse: {
      animate: { scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] },
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }
    },
    bounce: {
      animate: { y: [0, -3, 0] },
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" as const }
    }
  };

  const animation = animationVariants[config.animation];

  return (
    <div className={cn(
      "inline-flex items-center",
      sizes.gap,
      sizes.padding,
      "rounded-lg bg-muted/50",
      className
    )}>
      <motion.div
        animate={animation.animate}
        transition={animation.transition}
      >
        <Icon size={sizes.icon} className="text-muted-foreground" />
      </motion.div>
      {showMessage && (
        <span className={cn(sizes.text, "text-muted-foreground font-medium")}>
          {message || config.defaultMessage}
        </span>
      )}
    </div>
  );
}

interface InlineLoaderProps {
  className?: string;
  size?: number;
}

/**
 * Simple inline spinner for buttons and inline contexts
 */
export function InlineLoader({ className, size = 16 }: InlineLoaderProps) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      className={cn("inline-block", className)}
    >
      <Loader2 size={size} />
    </motion.div>
  );
}

interface DotsLoaderProps {
  className?: string;
  dotSize?: number;
  color?: string;
}

/**
 * Three bouncing dots loader
 */
export function DotsLoader({ className, dotSize = 8, color }: DotsLoaderProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            "rounded-full",
            color || "bg-primary"
          )}
          style={{ width: dotSize, height: dotSize }}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

interface ProgressLoaderProps {
  progress: number;
  showPercentage?: boolean;
  className?: string;
  label?: string;
}

/**
 * Progress bar with percentage
 */
export function ProgressLoader({ 
  progress, 
  showPercentage = true, 
  className,
  label
}: ProgressLoaderProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn("w-full space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm text-muted-foreground">
          {label && <span>{label}</span>}
          {showPercentage && <span>{Math.round(clampedProgress)}%</span>}
        </div>
      )}
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

interface AnimatedSkeletonTextProps {
  lines?: number;
  className?: string;
}

/**
 * Animated skeleton text loader
 * Note: Named AnimatedSkeletonText to avoid conflict with LoadingSkeleton.tsx
 */
export function AnimatedSkeletonText({ lines = 3, className }: AnimatedSkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "h-4 bg-muted rounded skeleton-shimmer",
            i === lines - 1 ? "w-2/3" : "w-full"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}

export default {
  ContextualLoader,
  InlineLoader,
  DotsLoader,
  ProgressLoader,
  AnimatedSkeletonText
};
