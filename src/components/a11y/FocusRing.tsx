/**
 * @fileoverview Premium Focus Ring Component
 * Beautiful, accessible focus states with animations
 */

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface FocusRingProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error";
  disabled?: boolean;
}

/**
 * Wraps any interactive element with a premium focus ring
 */
export const FocusRing = forwardRef<HTMLDivElement, FocusRingProps>(
  ({ children, variant = "default", disabled = false, className, ...props }, ref) => {
    const variantClasses = {
      default: "focus-ring-default",
      primary: "focus-ring-primary",
      success: "focus-ring-success",
      warning: "focus-ring-warning",
      error: "focus-ring-error"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "focus-ring-wrapper",
          !disabled && variantClasses[variant],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FocusRing.displayName = "FocusRing";

export default FocusRing;
