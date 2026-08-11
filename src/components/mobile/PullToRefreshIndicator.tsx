/**
 * Pull to Refresh Indicator Component
 * Visual feedback for pull-to-refresh action
 */
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  progress: number;
  isRefreshing: boolean;
  isPulling: boolean;
  threshold?: number;
}

export function PullToRefreshIndicator({
  pullDistance,
  progress,
  isRefreshing,
  isPulling,
  threshold = 80,
}: PullToRefreshIndicatorProps) {
  const isReadyToRefresh = pullDistance >= threshold;
  const showIndicator = isPulling || isRefreshing || pullDistance > 0;

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            height: Math.max(pullDistance, isRefreshing ? 60 : 0)
          }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center overflow-hidden"
        >
          <motion.div
            className={cn(
              'flex flex-col items-center justify-center gap-2 p-4',
              'rounded-full backdrop-blur-xl',
              isReadyToRefresh || isRefreshing
                ? 'bg-primary/20 border border-primary/30'
                : 'bg-background/80 border border-border/50'
            )}
            animate={{
              scale: isReadyToRefresh ? 1.1 : 1,
              rotate: isRefreshing ? 360 : 0,
            }}
            transition={{
              scale: { type: 'spring', damping: 15 },
              rotate: { duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' },
            }}
          >
            {isRefreshing ? (
              <RefreshCw className="h-5 w-5 text-primary animate-spin" />
            ) : isReadyToRefresh ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <Check className="h-5 w-5 text-primary" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ 
                  y: [0, 4, 0],
                  rotate: progress > 50 ? 180 : 0 
                }}
                transition={{ 
                  y: { duration: 0.5, repeat: Infinity },
                  rotate: { duration: 0.2 }
                }}
              >
                <ArrowDown className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            )}
          </motion.div>

          {/* Progress ring */}
          {!isRefreshing && progress > 0 && progress < 100 && (
            <svg
              className="absolute w-12 h-12"
              viewBox="0 0 48 48"
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="2"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={126}
                strokeDashoffset={126 - (126 * progress) / 100}
                transform="rotate(-90 24 24)"
              />
            </svg>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PullToRefreshIndicator;
