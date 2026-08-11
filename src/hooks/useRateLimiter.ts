import { useState, useCallback, useRef } from 'react';

interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
}

export function useRateLimiter({ maxRequests = 10, windowMs = 60000 }: RateLimiterOptions = { maxRequests: 10, windowMs: 60000 }) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(maxRequests);
  const [resetTime, setResetTime] = useState<number | null>(null);
  const timestamps = useRef<number[]>([]);

  const checkLimit = useCallback((): boolean => {
    const now = Date.now();
    timestamps.current = timestamps.current.filter((t) => now - t < windowMs);

    if (timestamps.current.length >= maxRequests) {
      setIsBlocked(true);
      const oldest = timestamps.current[0] ?? now;
      setResetTime(oldest + windowMs);
      setRemainingRequests(0);
      return false;
    }

    timestamps.current.push(now);
    setRemainingRequests(maxRequests - timestamps.current.length);
    setIsBlocked(false);
    return true;
  }, [maxRequests, windowMs]);

  const reset = useCallback(() => {
    timestamps.current = [];
    setIsBlocked(false);
    setRemainingRequests(maxRequests);
    setResetTime(null);
  }, [maxRequests]);

  return { isBlocked, remainingRequests, resetTime, checkLimit, reset };
}
