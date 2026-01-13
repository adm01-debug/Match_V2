/**
 * Interactive KPI Card with drill-down, trends, and comparisons
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  Minus,
  ChevronRight,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendData {
  period: string;
  value: number;
  previousValue?: number;
}

interface DrillDownData {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

interface InteractiveKPICardProps {
  title: string;
  value: number;
  previousValue?: number;
  target?: number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'accent';
  trendData?: TrendData[];
  drillDownData?: DrillDownData[];
  comparisonLabel?: string;
  format?: 'number' | 'percentage' | 'currency' | 'days';
  insight?: string;
  actions?: { label: string; onClick: () => void }[];
  index?: number;
}

const formatValue = (value: number, format: string = 'number'): string => {
  switch (format) {
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'currency':
      return `R$ ${value.toLocaleString('pt-BR')}`;
    case 'days':
      return `${value} dias`;
    default:
      return value.toLocaleString('pt-BR');
  }
};

const variantStyles = {
  primary: {
    gradient: 'from-primary/20 via-primary/10 to-transparent',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    glow: 'shadow-primary/20',
    border: 'border-primary/20',
  },
  success: {
    gradient: 'from-success/20 via-success/10 to-transparent',
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    glow: 'shadow-success/20',
    border: 'border-success/20',
  },
  warning: {
    gradient: 'from-warning/20 via-warning/10 to-transparent',
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    glow: 'shadow-warning/20',
    border: 'border-warning/20',
  },
  info: {
    gradient: 'from-info/20 via-info/10 to-transparent',
    iconBg: 'bg-info/10',
    iconColor: 'text-info',
    glow: 'shadow-info/20',
    border: 'border-info/20',
  },
  accent: {
    gradient: 'from-accent/20 via-accent/10 to-transparent',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    glow: 'shadow-accent/20',
    border: 'border-accent/20',
  },
};

export function InteractiveKPICard({
  title,
  value,
  previousValue,
  target,
  subtitle,
  icon: Icon,
  variant = 'primary',
  trendData = [],
  drillDownData = [],
  format = 'number',
  insight,
  actions = [],
  index = 0,
}: InteractiveKPICardProps) {
  const [showDrillDown, setShowDrillDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const styles = variantStyles[variant];
  
  // Calculate change percentage
  const change = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;
  const isPositive = change > 0;
  const isNeutral = change === 0;
  
  // Calculate target progress
  const targetProgress = target ? Math.min((value / target) * 100, 100) : 0;
  const isOnTrack = target ? value >= target * 0.8 : true;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card
          className={cn(
            'relative overflow-hidden cursor-pointer transition-all duration-300',
            'hover:shadow-xl',
            styles.glow,
            styles.border,
            isHovered && 'scale-[1.02]'
          )}
          onClick={() => drillDownData.length > 0 && setShowDrillDown(true)}
        >
          {/* Background gradient */}
          <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', styles.gradient)} />
          
          {/* Animated particles on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn('absolute w-1 h-1 rounded-full', styles.iconColor)}
                    style={{
                      left: `${20 + i * 30}%`,
                      bottom: '10%',
                    }}
                    animate={{
                      y: [0, -50, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <CardContent className="relative p-5">
            <div className="flex items-start justify-between mb-4">
              <motion.div
                className={cn('p-3 rounded-xl', styles.iconBg)}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Icon className={cn('h-5 w-5', styles.iconColor)} />
              </motion.div>
              
              {/* Trend indicator */}
              <div className="flex items-center gap-1">
                {previousValue && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      'gap-1',
                      isPositive && 'bg-success/10 text-success',
                      !isPositive && !isNeutral && 'bg-destructive/10 text-destructive',
                      isNeutral && 'bg-muted'
                    )}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : isNeutral ? (
                      <Minus className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(change).toFixed(1)}%
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">{title}</p>
              
              <div className="flex items-baseline gap-2">
                <motion.span
                  className="text-3xl font-bold"
                  key={value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {formatValue(value, format)}
                </motion.span>
                
                {target && (
                  <span className="text-sm text-muted-foreground">
                    / {formatValue(target, format)}
                  </span>
                )}
              </div>

              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}

              {/* Target progress */}
              {target && (
                <div className="space-y-1.5 mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Meta
                    </span>
                    <span className={cn(
                      'font-medium',
                      isOnTrack ? 'text-success' : 'text-warning'
                    )}>
                      {targetProgress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={targetProgress}
                    className="h-1.5"
                  />
                </div>
              )}

              {/* Mini sparkline */}
              {trendData.length > 0 && (
                <div className="h-12 mt-3 -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={`hsl(var(--${variant}))`} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={`hsl(var(--${variant}))`} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={`hsl(var(--${variant}))`}
                        strokeWidth={2}
                        fill={`url(#gradient-${index})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* AI Insight */}
              {insight && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 mt-2">
                    <Sparkles className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">{insight}</p>
                  </div>
                </motion.div>
              )}

              {/* Quick actions */}
              {actions.length > 0 && isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 mt-3"
                >
                  {actions.map((action, i) => (
                    <Button
                      key={i}
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick();
                      }}
                    >
                      {action.label}
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  ))}
                </motion.div>
              )}

              {/* Drill down indicator */}
              {drillDownData.length > 0 && (
                <div className="absolute bottom-2 right-2">
                  <motion.div
                    animate={{ x: isHovered ? 3 : 0 }}
                    className="text-muted-foreground"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Drill-down Dialog */}
      <Dialog open={showDrillDown} onOpenChange={setShowDrillDown}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={cn('p-2 rounded-lg', styles.iconBg)}>
                <Icon className={cn('h-5 w-5', styles.iconColor)} />
              </div>
              {title} - Detalhamento
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Valor Atual</p>
                <p className="text-2xl font-bold">{formatValue(value, format)}</p>
              </Card>
              {previousValue && (
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Período Anterior</p>
                  <p className="text-2xl font-bold">{formatValue(previousValue, format)}</p>
                </Card>
              )}
              {target && (
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Meta</p>
                  <p className="text-2xl font-bold">{formatValue(target, format)}</p>
                </Card>
              )}
            </div>

            {/* Trend Chart */}
            {trendData.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Evolução Temporal
                </h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="period" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={`hsl(var(--${variant}))`}
                        fill={`hsl(var(--${variant}) / 0.2)`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Breakdown */}
            {drillDownData.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Distribuição por Categoria
                </h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={drillDownData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="category" type="category" width={100} className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="value" fill={`hsl(var(--${variant}))`} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Breakdown list */}
                <div className="space-y-2">
                  {drillDownData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{item.value}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
