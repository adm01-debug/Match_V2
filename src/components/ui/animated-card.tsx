/**
 * @fileoverview Animated Card Component
 * Cards with hover and tap animations
 */

import { forwardRef, ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: "default" | "lift" | "glow" | "border" | "scale";
  interactive?: boolean;
  glowColor?: string;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(({
  children,
  variant = "default",
  interactive = true,
  glowColor,
  className,
  ...props
}, ref) => {
  const variants = {
    default: {
      rest: {},
      hover: {},
      tap: { scale: 0.98 }
    },
    lift: {
      rest: { y: 0, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
      hover: { y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" },
      tap: { y: 0, scale: 0.98 }
    },
    glow: {
      rest: { 
        boxShadow: `0 0 0 0 ${glowColor ?? "hsl(var(--primary) / 0)"}`
      },
      hover: { 
        boxShadow: `0 0 30px 5px ${glowColor ?? "hsl(var(--primary) / 0.3)"}`
      },
      tap: { scale: 0.98 }
    },
    border: {
      rest: {},
      hover: {},
      tap: { scale: 0.98 }
    },
    scale: {
      rest: { scale: 1 },
      hover: { scale: 1.02 },
      tap: { scale: 0.98 }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "rounded-xl bg-card border border-border/50 overflow-hidden",
        variant === "border" && "hover:border-primary transition-colors duration-300",
        interactive && "cursor-pointer",
        className
      )}
      variants={interactive ? variants[variant] : undefined}
      initial="rest"
      whileHover={interactive ? "hover" : undefined}
      whileTap={interactive ? "tap" : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

AnimatedCard.displayName = "AnimatedCard";

/**
 * Animated Button Wrapper
 */
interface AnimatedButtonWrapperProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: "scale" | "bounce" | "shake" | "pulse";
}

export const AnimatedButtonWrapper = forwardRef<HTMLDivElement, AnimatedButtonWrapperProps>(({
  children,
  variant = "scale",
  className,
  ...props
}, ref) => {
  const getAnimations = () => {
    switch (variant) {
      case 'bounce':
        return { whileHover: { y: -2 }, whileTap: { scale: 0.9 } };
      case 'shake':
        return { whileTap: { x: [0, -5, 5, -5, 5, 0] } };
      case 'pulse':
        return { whileHover: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 0.8 } } };
      default:
        return { whileHover: { scale: 1.02 }, whileTap: { scale: 0.95 } };
    }
  };

  const animations = getAnimations();

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      {...animations}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

AnimatedButtonWrapper.displayName = "AnimatedButtonWrapper";

/**
 * Shimmer Loading Effect
 */
interface ShimmerProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Shimmer({ className, width, height }: ShimmerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted rounded-md",
        className
      )}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
        }}
        animate={{ translateX: ["100%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      />
    </div>
  );
}

/**
 * Floating Action Button with animated states
 */
interface FloatingActionButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  label?: string;
  color?: "primary" | "secondary" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FloatingActionButton({
  icon,
  onClick,
  label,
  color = "primary",
  size = "md",
  className
}: FloatingActionButtonProps) {
  const sizes = {
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-16 w-16"
  };

  const colors = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    success: "bg-green-500 text-white hover:bg-green-600 shadow-green-500/25",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600 shadow-yellow-500/25"
  };

  return (
    <motion.button
      className={cn(
        "rounded-full flex items-center justify-center shadow-lg transition-colors",
        sizes[size],
        colors[color],
        className
      )}
      whileHover={{ scale: 1.1, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.15)" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {icon}
    </motion.button>
  );
}

export default AnimatedCard;
