/**
 * @fileoverview Haptic Feedback Visual Components
 * Visual feedback that simulates tactile interactions
 */

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef, ReactNode } from "react";

interface RippleButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
  size?: "sm" | "md" | "lg";
  rippleColor?: string;
}

/**
 * Button with ripple effect on click
 */
export const RippleButton = forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ children, className, variant = "default", size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    };

    const variantClasses = {
      default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      success: "bg-success text-success-foreground hover:bg-success/90",
      warning: "bg-warning text-warning-foreground hover:bg-warning/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-lg font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        {...props}
      >
        {children}
        <motion.span
          className="absolute inset-0 bg-white/20 pointer-events-none"
          initial={{ scale: 0, opacity: 1 }}
          whileTap={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ borderRadius: "50%", transformOrigin: "center" }}
        />
      </motion.button>
    );
  }
);

RippleButton.displayName = "RippleButton";

interface PressableCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  interactive?: boolean;
  haptic?: "light" | "medium" | "heavy";
}

/**
 * Card with press feedback animation
 */
export const PressableCard = forwardRef<HTMLDivElement, PressableCardProps>(
  ({ children, className, interactive = true, haptic = "light", ...props }, ref) => {
    const hapticScale = {
      light: 0.99,
      medium: 0.98,
      heavy: 0.96
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl border border-border/50 bg-card p-4",
          "transition-shadow duration-200",
          interactive && "cursor-pointer hover:shadow-lg hover:border-border",
          className
        )}
        whileHover={interactive ? { y: -2 } : undefined}
        whileTap={interactive ? { scale: hapticScale[haptic] } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

PressableCard.displayName = "PressableCard";

interface BounceOnHoverProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  bounceHeight?: number;
}

/**
 * Element that bounces on hover
 */
export const BounceOnHover = forwardRef<HTMLDivElement, BounceOnHoverProps>(
  ({ children, className, bounceHeight = 4, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn("inline-block", className)}
        whileHover={{ y: -bounceHeight }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

BounceOnHover.displayName = "BounceOnHover";

interface PulseOnLoadProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
}

/**
 * Element that pulses once when it appears
 */
export const PulseOnLoad = forwardRef<HTMLDivElement, PulseOnLoadProps>(
  ({ children, className, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay 
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

PulseOnLoad.displayName = "PulseOnLoad";

interface ShakeOnErrorProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  isError?: boolean;
}

/**
 * Element that shakes when error state is true
 */
export const ShakeOnError = forwardRef<HTMLDivElement, ShakeOnErrorProps>(
  ({ children, className, isError = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        animate={isError ? { 
          x: [0, -8, 8, -8, 8, -4, 4, 0],
        } : { x: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

ShakeOnError.displayName = "ShakeOnError";

interface SuccessCheckmarkProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/**
 * Animated success checkmark
 */
export function SuccessCheckmark({ 
  size = 48, 
  strokeWidth = 3,
  className 
}: SuccessCheckmarkProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-success", className)}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
      <motion.path
        d="M8 12l2.5 2.5L16 9"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      />
    </motion.svg>
  );
}

export default {
  RippleButton,
  PressableCard,
  BounceOnHover,
  PulseOnLoad,
  ShakeOnError,
  SuccessCheckmark
};
