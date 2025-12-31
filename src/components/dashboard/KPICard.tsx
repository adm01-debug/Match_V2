/**
 * @fileoverview KPICard component
 * @module KPICard
 */

import { memo, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

type KPIVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive?: boolean;
  };
  variant?: KPIVariant;
  isLoading?: boolean;
}

const variantStyles: Record<KPIVariant, { icon: string; card: string }> = {
  default: {
    icon: "bg-muted text-muted-foreground",
    card: "",
  },
  primary: {
    icon: "bg-primary/10 text-primary",
    card: "",
  },
  success: {
    icon: "bg-success/10 text-success",
    card: "",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    card: "",
  },
  danger: {
    icon: "bg-destructive/10 text-destructive",
    card: "",
  },
};

function KPICardComponent({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  isLoading = false,
}: KPICardProps) {
  const styles = useMemo(() => variantStyles[variant], [variant]);

  const formattedValue = useMemo(() => {
    if (typeof value === 'number') {
      return value.toLocaleString('pt-BR');
    }
    return value;
  }, [value]);

  const trendColor = trend?.positive ? "text-success" : "text-destructive";
  const TrendIcon = trend?.positive ? TrendingUp : TrendingDown;

  if (isLoading) {
    return (
      <Card className={cn("card-hover", styles.card)}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-8 bg-muted rounded w-16" />
                <div className="h-3 bg-muted rounded w-24" />
              </div>
              <div className="h-12 w-12 bg-muted rounded-xl" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      data-testid="kpi-card"
      role="article"
      aria-label={`${title}: ${formattedValue}${subtitle ? `, ${subtitle}` : ''}`}
      className={cn("card-hover", styles.card)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-foreground">
                {formattedValue}
              </p>
              {trend && (
                <span
                  className={cn("text-xs font-medium flex items-center gap-0.5", trendColor)}
                  aria-label={`Tendência: ${trend.value}`}
                >
                  <TrendIcon className="h-3 w-3" aria-hidden="true" />
                  {trend.value}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          <div 
            className={cn("rounded-xl p-3", styles.icon)}
            aria-hidden="true"
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

KPICardComponent.displayName = "KPICard";

export const KPICard = memo(KPICardComponent);
export default KPICard;
