/**
 * Swipe Gesture Hook
 * Detects swipe gestures for mobile navigation
 */
import { useCallback, useRef, useState } from 'react';

type SwipeDirection = 'left' | 'right' | 'up' | 'down' | null;

interface UseSwipeGestureOptions {
  threshold?: number; // Min distance to trigger swipe (default: 50px)
  preventScroll?: boolean; // Prevent default scroll on horizontal swipes
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeState {
  isSwiping: boolean;
  direction: SwipeDirection;
  distance: { x: number; y: number };
}

export function useSwipeGesture({
  threshold = 50,
  preventScroll = false,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}: UseSwipeGestureOptions = {}) {
  const startPos = useRef({ x: 0, y: 0 });
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    direction: null,
    distance: { x: 0, y: 0 },
  });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    
    startPos.current = { x: touch.clientX, y: touch.clientY };
    setSwipeState({ isSwiping: true, direction: null, distance: { x: 0, y: 0 } });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    // Determine direction based on larger delta
    let direction: SwipeDirection = null;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
      if (preventScroll) {
        e.preventDefault();
      }
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    setSwipeState({
      isSwiping: true,
      direction,
      distance: { x: deltaX, y: deltaY },
    });
  }, [preventScroll]);

  const handleTouchEnd = useCallback(() => {
    const { direction, distance } = swipeState;
    
    // Check if swipe exceeded threshold
    const absX = Math.abs(distance.x);
    const absY = Math.abs(distance.y);
    
    if (direction === 'left' && absX >= threshold) {
      onSwipeLeft?.();
    } else if (direction === 'right' && absX >= threshold) {
      onSwipeRight?.();
    } else if (direction === 'up' && absY >= threshold) {
      onSwipeUp?.();
    } else if (direction === 'down' && absY >= threshold) {
      onSwipeDown?.();
    }

    setSwipeState({ isSwiping: false, direction: null, distance: { x: 0, y: 0 } });
  }, [swipeState, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const handlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return {
    ...swipeState,
    handlers,
  };
}

export default useSwipeGesture;
