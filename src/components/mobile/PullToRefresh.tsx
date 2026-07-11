/**
 * @fileoverview Pull to Refresh Component for Mobile
 * @module PullToRefresh
 */

import { logger } from '@/services/logger';
import { memo, ReactNode, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { RefreshCw, ArrowDown, Check, Loader2 } from 'lucide-react';

type RefreshState = 'idle' | 'pulling' | 'ready' | 'refreshing' | 'complete';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPull?: number;
  className?: string;
  disabled?: boolean;
  refreshingText?: string;
  pullText?: string;
  releaseText?: string;
  completeText?: string;
}

export const PullToRefresh = memo(function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  maxPull = 150,
  className,
  disabled = false,
  refreshingText = 'Atualizando...',
  pullText = 'Puxe para atualizar',
  releaseText = 'Solte para atualizar',
  completeText = 'Atualizado!',
}: PullToRefreshProps) {
  const [state, setState] = useState<RefreshState>('idle');
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const indicatorOpacity = useTransform(y, [0, threshold / 2], [0, 1]);
  const indicatorScale = useTransform(y, [0, threshold], [0.5, 1]);
  const indicatorRotate = useTransform(y, [0, threshold], [0, 180]);
  const progress = useTransform(y, [0, threshold], [0, 100]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || state === 'refreshing') return;
    
    const container = containerRef.current;
    if (container && container.scrollTop === 0) {
      const touch = e.touches[0];
      if (touch) {
        startY.current = touch.clientY;
        isPulling.current = true;
      }
    }
  }, [disabled, state]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling.current || disabled || state === 'refreshing') return;

    const touch = e.touches[0];
    if (!touch) return;
    
    const currentY = touch.clientY;
    const diff = Math.max(0, currentY - startY.current);
    const dampedDiff = Math.min(maxPull, diff * 0.5);

    y.set(dampedDiff);

    if (dampedDiff >= threshold) {
      setState('ready');
    } else if (dampedDiff > 0) {
      setState('pulling');
    }
  }, [disabled, state, threshold, maxPull, y]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current || disabled) return;
    isPulling.current = false;

    if (state === 'ready') {
      setState('refreshing');
      y.set(threshold);

      try {
        await onRefresh();
        setState('complete');
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        logger.error('Refresh failed:', error);
      } finally {
        y.set(0);
        setState('idle');
      }
    } else {
      y.set(0);
      setState('idle');
    }
  }, [disabled, state, threshold, y, onRefresh]);

  const getIndicatorContent = () => {
    switch (state) {
      case 'pulling':
        return (
          <>
            <motion.div style={{ rotate: indicatorRotate }}>
              <ArrowDown className="h-5 w-5 text-muted-foreground" />
            </motion.div>
            <span className="text-xs text-muted-foreground ml-2">{pullText}</span>
          </>
        );
      case 'ready':
        return (
          <>
            <RefreshCw className="h-5 w-5 text-primary" />
            <span className="text-xs text-primary ml-2 font-medium">{releaseText}</span>
          </>
        );
      case 'refreshing':
        return (
          <>
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
            <span className="text-xs text-primary ml-2">{refreshingText}</span>
          </>
        );
      case 'complete':
        return (
          <>
            <Check className="h-5 w-5 text-green-500" />
            <span className="text-xs text-green-500 ml-2">{completeText}</span>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-3 z-10"
        style={{ 
          opacity: indicatorOpacity, 
          scale: indicatorScale,
          y: useTransform(y, [0, maxPull], [-40, 0])
        }}
      >
        <div className="flex items-center bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border">
          {getIndicatorContent()}
        </div>
      </motion.div>

      {/* Progress Ring */}
      <AnimatePresence>
        {(state === 'pulling' || state === 'ready') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 z-20"
          >
            <svg className="w-8 h-8 -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted/30"
              />
              <motion.circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-primary"
                strokeDasharray={88}
                style={{
                  strokeDashoffset: useTransform(progress, [0, 100], [88, 0])
                }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        ref={containerRef}
        style={{ y }}
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </motion.div>
    </div>
  );
});

interface RefreshIndicatorProps {
  isRefreshing: boolean;
  className?: string;
}

export const RefreshIndicator = memo(function RefreshIndicator({
  isRefreshing,
  className,
}: RefreshIndicatorProps) {
  return (
    <AnimatePresence>
      {isRefreshing && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            'fixed top-4 left-1/2 -translate-x-1/2 z-50',
            'flex items-center gap-2 bg-background/95 backdrop-blur-sm',
            'px-4 py-2 rounded-full shadow-lg border',
            className
          )}
        >
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm">Atualizando...</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

PullToRefresh.displayName = 'PullToRefresh';
RefreshIndicator.displayName = 'RefreshIndicator';
