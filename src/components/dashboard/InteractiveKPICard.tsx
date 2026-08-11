/**
 * Interactive KPI Card with drill-down, trends, and comparisons
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Target, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  formatValue,
  variantStyles,
  type InteractiveKPICardProps,
} from './interactiveKPI/types';
import { KPITrendBadge } from './interactiveKPI/KPITrendBadge';
import { KPISparkline } from './interactiveKPI/KPISparkline';
import { KPIDrillDownDialog } from './interactiveKPI/KPIDrillDownDialog';

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
            isHovered && 'scale-[1.02]',
          )}
          onClick={() => drillDownData.length > 0 && setShowDrillDown(true)}
        >
          <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', styles.gradient)} />

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
                    style={{ left: `${20 + i * 30}%`, bottom: '10%' }}
                    animate={{ y: [0, -50, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
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
              {previousValue !== undefined && (
                <KPITrendBadge value={value} previousValue={previousValue} />
              )}
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

              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}

              {target && (
                <div className="space-y-1.5 mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Meta
                    </span>
                    <span
                      className={cn(
                        'font-medium',
                        isOnTrack ? 'text-success' : 'text-warning',
                      )}
                    >
                      {targetProgress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={targetProgress} className="h-1.5" />
                </div>
              )}

              {trendData.length > 0 && (
                <KPISparkline data={trendData} variant={variant} index={index} />
              )}

              {insight && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    height: isHovered ? 'auto' : 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 mt-2">
                    <Sparkles className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">{insight}</p>
                  </div>
                </motion.div>
              )}

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

      <KPIDrillDownDialog
        open={showDrillDown}
        onOpenChange={setShowDrillDown}
        title={title}
        value={value}
        previousValue={previousValue}
        target={target}
        format={format}
        icon={Icon}
        variant={variant}
        trendData={trendData}
        drillDownData={drillDownData}
      />
    </>
  );
}
