/**
 * Client-side rate limiting utility
 */

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (
  key: string,
  options: RateLimitOptions = { maxRequests: 100, windowMs: 60000 }
): boolean => {
  const now = Date.now();
  const entry = requestCounts.get(key);

  if (!entry || now > entry.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + options.windowMs });
    return true;
  }

  if (entry.count >= options.maxRequests) {
    return false;
  }

  entry.count++;
  return true;
};

export const getRemainingRequests = (
  key: string,
  maxRequests: number = 100
): number => {
  const entry = requestCounts.get(key);
  if (!entry || Date.now() > entry.resetTime) {
    return maxRequests;
  }
  return Math.max(0, maxRequests - entry.count);
};
