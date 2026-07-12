import * as React from "react";
import { cn } from "@/lib/utils";
import { Star, TrendingUp, TrendingDown, Minus } from "lucide-react";

/**
 * MatchScoreBadge - Componente para exibição de score de compatibilidade
 * Usa gradientes e cores para indicar nível de match
 */

interface MatchScoreBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "badge" | "pill" | "minimal";
}

function getScoreConfig(score: number) {
  if (score >= 80) {
    return {
      label: "Excelente",
      icon: TrendingUp,
      className: "bg-success/15 text-success border-success/30",
      progressColor: "bg-success",
      starColor: "text-success",
    };
  }
  if (score >= 60) {
    return {
      label: "Bom",
      icon: TrendingUp,
      className: "bg-warning/15 text-warning border-warning/30",
      progressColor: "bg-warning",
      starColor: "text-warning",
    };
  }
  if (score >= 40) {
    return {
      label: "Regular",
      icon: Minus,
      className: "bg-warning/15 text-warning border-warning/30",
      progressColor: "bg-warning",
      starColor: "text-warning",
    };
  }
  return {
    label: "Baixo",
    icon: TrendingDown,
    className: "bg-destructive/15 text-destructive border-destructive/30",
    progressColor: "bg-destructive",
    starColor: "text-destructive",
  };
}

const sizeClasses = {
  sm: "px-1.5 py-0.5 text-[10px] gap-1",
  default: "px-2 py-0.5 text-xs gap-1.5",
  lg: "px-2.5 py-1 text-sm gap-2",
};

const iconSizes = {
  sm: "h-3 w-3",
  default: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

export function MatchScoreBadge({
  score,
  showIcon = true,
  showLabel = false,
  size = "default",
  variant = "badge",
  className,
  ...props
}: MatchScoreBadgeProps) {
  const config = getScoreConfig(score);
  const Icon = config.icon;

  if (variant === "minimal") {
    return (
      <div
        className={cn("inline-flex items-center gap-1", className)}
        {...props}
      >
        <Star className={cn(iconSizes[size], config.starColor, "fill-current")} />
        <span className={cn("font-medium", config.starColor.replace("text-", "text-"))}>{score}%</span>
      </div>
    );
  }

  if (variant === "pill") {
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-full border font-medium",
          sizeClasses[size],
          config.className,
          className
        )}
        {...props}
      >
        {showIcon && <Star className={cn(iconSizes[size], "fill-current")} />}
        <span>{score}%</span>
        {showLabel && <span className="opacity-80">match</span>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border font-medium",
        sizeClasses[size],
        config.className,
        className
      )}
      {...props}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{score}%</span>
      {showLabel && <span className="opacity-80">{config.label}</span>}
    </div>
  );
}

// Componente de barra de progresso para score
export function MatchScoreBar({
  score,
  showLabel = true,
  className,
}: {
  score: number;
  showLabel?: boolean;
  className?: string;
}) {
  const config = getScoreConfig(score);

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Match Score</span>
          <span className={cn("font-medium", config.starColor)}>{score}%</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", config.progressColor)}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}

MatchScoreBadge.displayName = "MatchScoreBadge";
MatchScoreBar.displayName = "MatchScoreBar";
