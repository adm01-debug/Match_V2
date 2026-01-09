/**
 * @fileoverview Premium KPICard component
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

const variantStyles: Record<KPIVariant, { 
  icon: string; 
  iconBg: string;
  glow: string;
  border: string;
}> = {
  default: {
    icon: "text-muted-foreground",
    iconBg: "bg-muted",
    glow: "",
    border: "",
  },
  primary: {
    icon: "text-primary",
    iconBg: "bg-primary/10",
    glow: "shadow-glow",
    border: "border-primary/20",
  },
  success: {
    icon: "text-success",
    iconBg: "bg-success/10",
    glow: "shadow-glow-success",
    border: "border-success/20",
  },
  warning: {
    icon: "text-warning",
    iconBg: "bg-warning/10",
    glow: "shadow-glow-accent",
    border: "border-warning/20",
  },
  danger: {
    icon: "text-destructive",
    iconBg: "bg-destructive/10",
    glow: "",
    border: "border-destructive/20",
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
      <Card className="overflow-hidden border-border/50 shadow-elevated">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-muted rounded-lg w-24 animate-shimmer" />
              <div className="h-9 bg-muted rounded-lg w-20 animate-shimmer" />
              <div className="h-3 bg-muted rounded-lg w-28 animate-shimmer" />
            </div>
            <div className="h-14 w-14 bg-muted rounded-2xl animate-shimmer" />
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
        type: 'spring', 
        stiffness: 300, 
        damping: 25 
      }}
    >
      <Card
        data-testid="kpi-card"
        role="article"
        aria-label={`${title}: ${formattedValue}${subtitle ? `, ${subtitle}` : ''}`}
        className={cn(
          "group relative overflow-hidden border-border/50 shadow-elevated transition-all duration-300",
          "hover:shadow-elevated-lg hover:-translate-y-1",
          styles.border
        )}
      >
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Decorative corner element */}
        <div className={cn(
          "absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150",
          styles.iconBg
        )} />
        
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <div className="flex items-baseline gap-2">
                <motion.p 
                  className="text-3xl font-bold text-foreground tracking-tight"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 + 0.2, type: 'spring', stiffness: 400 }}
                >
                  {formattedValue}
                </motion.p>
                {trend && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 + 0.3 }}
                    className={cn(
                      "text-xs font-semibold flex items-center gap-0.5 px-1.5 py-0.5 rounded-full",
                      trend.positive ? "bg-success/10" : "bg-destructive/10",
                      trendColor
                    )}
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
              className={cn(
                "rounded-2xl p-3.5 transition-all duration-300",
                styles.iconBg,
                "group-hover:scale-110"
              )}
              aria-hidden="true"
              whileHover={{ rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Icon className={cn("h-6 w-6", styles.icon)} />
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
