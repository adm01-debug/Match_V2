/**
 * Client-side rate limiting utility
 */

export interface RateLimitOptions {
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

export class RateLimiter {
  private options: RateLimitOptions;
  private key: string;
  private counts = new Map<string, { count: number; resetTime: number }>();

  constructor(key: string, options?: RateLimitOptions);
  constructor(options: RateLimitOptions);
  constructor(keyOrOptions: string | RateLimitOptions, options?: RateLimitOptions) {
    if (typeof keyOrOptions === 'string') {
      this.key = keyOrOptions;
      this.options = options ?? { maxRequests: 100, windowMs: 60000 };
    } else {
      this.key = 'default';
      this.options = keyOrOptions;
    }
  }

  check(userKey?: string): boolean {
    const key = userKey ?? this.key;
    const now = Date.now();
    const entry = this.counts.get(key);

    if (!entry || now > entry.resetTime) {
      this.counts.set(key, { count: 1, resetTime: now + this.options.windowMs });
      return true;
    }

    if (entry.count >= this.options.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  // Alias for backwards compatibility
  checkLimit(userKey?: string): boolean {
    return this.check(userKey);
  }

  remaining(userKey?: string): number {
    const key = userKey ?? this.key;
    const entry = this.counts.get(key);
    if (!entry || Date.now() > entry.resetTime) {
      return this.options.maxRequests;
    }
    return Math.max(0, this.options.maxRequests - entry.count);
  }
}

export function createRateLimiter(key: string, options?: RateLimitOptions): RateLimiter;
export function createRateLimiter(options: RateLimitOptions): RateLimiter;
export function createRateLimiter(keyOrOptions: string | RateLimitOptions, options?: RateLimitOptions): RateLimiter {
  if (typeof keyOrOptions === 'string') {
    return new RateLimiter(keyOrOptions, options);
  }
  return new RateLimiter(keyOrOptions);
}
