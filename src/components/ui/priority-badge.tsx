import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Clock, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * PriorityBadge - Componente específico para exibição de prioridade
 * Otimizado para UX com cores de alto contraste
 */

const priorityBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      priority: {
        urgente: "bg-destructive/20 text-destructive dark:text-destructive border border-destructive/30",
        alta: "bg-warning/20 text-warning dark:text-warning border border-warning/30",
        media: "bg-info/20 text-info dark:text-info border border-info/30",
        baixa: "bg-muted-foreground/20 text-foreground dark:text-muted-foreground border border-border/30",
      },
      size: {
        sm: "px-1.5 py-0 text-[10px]",
        default: "px-2 py-0.5 text-xs",
        lg: "px-2.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      priority: "media",
      size: "default",
    },
  }
);

const priorityIcons: Record<string, LucideIcon> = {
  urgente: AlertCircle,
  alta: AlertTriangle,
  media: Clock,
  baixa: Minus,
};

const priorityLabels: Record<string, string> = {
  urgente: "Urgente",
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

export interface PriorityBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof priorityBadgeVariants> {
  showIcon?: boolean;
  showLabel?: boolean;
  customLabel?: string;
  pulse?: boolean;
}

export function PriorityBadge({
  priority = "media",
  showIcon = true,
  showLabel = true,
  customLabel,
  pulse = false,
  size,
  className,
  ...props
}: PriorityBadgeProps) {
  const Icon = priorityIcons[priority || "media"];
  const label = customLabel || priorityLabels[priority || "media"];
  const isUrgent = priority === "urgente";

  return (
    <div
      className={cn(
        priorityBadgeVariants({ priority, size }),
        pulse && isUrgent && "animate-pulse",
        className
      )}
      {...props}
    >
      {showIcon && Icon && (
        <Icon 
          className={cn(
            "shrink-0",
            size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"
          )} 
        />
      )}
      {showLabel && <span>{label}</span>}
    </div>
  );
}

PriorityBadge.displayName = "PriorityBadge";
