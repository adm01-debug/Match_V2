import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "text-foreground border-current",
        success:
          "border-transparent bg-success text-success-foreground",
        warning:
          "border-transparent bg-warning text-warning-foreground",
        info:
          "border-transparent bg-info text-info-foreground",
        // Premium variants with gradients
        gradient:
          "border-transparent bg-gradient-to-r from-primary to-accent text-white",
        "gradient-success":
          "border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
        "gradient-warning":
          "border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-white",
        "gradient-danger":
          "border-transparent bg-gradient-to-r from-red-500 to-rose-500 text-white",
        // Glass variants
        glass:
          "border-white/20 bg-white/10 backdrop-blur-sm text-foreground",
        "glass-primary":
          "border-primary/30 bg-primary/10 backdrop-blur-sm text-primary",
        "glass-success":
          "border-success/30 bg-success/10 backdrop-blur-sm text-success",
        "glass-warning":
          "border-warning/30 bg-warning/10 backdrop-blur-sm text-warning",
        "glass-destructive":
          "border-destructive/30 bg-destructive/10 backdrop-blur-sm text-destructive",
        // Glow variants
        glow:
          "border-transparent bg-primary text-primary-foreground shadow-[0_0_10px_hsl(var(--primary)/0.5)]",
        "glow-success":
          "border-transparent bg-success text-success-foreground shadow-[0_0_10px_hsl(var(--success)/0.5)]",
        "glow-warning":
          "border-transparent bg-warning text-warning-foreground shadow-[0_0_10px_hsl(var(--warning)/0.5)]",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0 text-[10px]",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
