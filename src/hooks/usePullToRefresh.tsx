/**
 * Pull to Refresh Hook
 * Provides mobile-friendly pull-to-refresh functionality
 */
import { useState, useCallback, useRef } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number; // Distance to trigger refresh (default: 80px)
  maxPull?: number; // Max pull distance (default: 150px)
  disabled?: boolean;
}

interface UsePullToRefreshReturn {
  pullDistance: number;
  isRefreshing: boolean;
  isPulling: boolean;
  progress: number; // 0-100
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  maxPull = 150,
  disabled = false,
}: UsePullToRefreshOptions): UsePullToRefreshReturn {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    // Only start if at top of scroll container
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > 0) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    startY.current = touch.clientY;
    setIsPulling(true);
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || disabled || isRefreshing) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    currentY.current = touch.clientY;
    const distance = Math.max(0, currentY.current - startY.current);
    
    // Apply resistance for overscroll
    const resistedDistance = Math.min(maxPull, distance * 0.5);
    setPullDistance(resistedDistance);
    
    // Prevent scroll if pulling down
    if (distance > 10) {
      e.preventDefault();
    }
  }, [isPulling, disabled, isRefreshing, maxPull]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || disabled) return;
    
    setIsPulling(false);
    
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold * 0.6); // Keep some distance while refreshing
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, disabled, pullDistance, threshold, isRefreshing, onRefresh]);

  // Calculate progress percentage
  const progress = Math.min(100, (pullDistance / threshold) * 100);

  return {
    pullDistance,
    isRefreshing,
    isPulling,
    progress,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}

export default usePullToRefresh;
