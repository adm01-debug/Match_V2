/**
 * @fileoverview KPICard component with motion interactions
 * @module KPICard
 */

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
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
  index?: number;
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
  index = 0,
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
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.08,
        type: 'spring' as const, 
        stiffness: 300, 
        damping: 25 
      }}
      whileHover={{ 
        y: -4,
        boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.12)',
      }}
    >
      <Card
        data-testid="kpi-card"
        role="article"
        aria-label={`${title}: ${formattedValue}${subtitle ? `, ${subtitle}` : ''}`}
        className={cn("card-hover overflow-hidden", styles.card)}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <div className="flex items-baseline gap-2">
                <motion.p 
                  className="text-3xl font-bold text-foreground"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 + 0.2, type: 'spring' as const, stiffness: 400 }}
                >
                  {formattedValue}
                </motion.p>
                {trend && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 + 0.3 }}
                    className={cn("text-xs font-medium flex items-center gap-0.5", trendColor)}
                    aria-label={`Tendência: ${trend.value}`}
                  >
                    <TrendIcon className="h-3 w-3" aria-hidden="true" />
                    {trend.value}
                  </motion.span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
            <motion.div 
              className={cn("rounded-xl p-3", styles.icon)}
              aria-hidden="true"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring' as const, stiffness: 400 }}
            >
              <Icon className="h-6 w-6" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

KPICardComponent.displayName = "KPICard";

export const KPICard = memo(KPICardComponent);
export default KPICard;
