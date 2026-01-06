import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RateLimiter, createRateLimiter, checkRateLimit } from './rateLimit';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe('RateLimiter', () => {
    it('allows requests within limit', () => {
      const limiter = new RateLimiter('test', { maxRequests: 5, windowMs: 1000 });
      expect(limiter.check('user1')).toBe(true);
    });

    it('blocks requests over limit', () => {
      const limiter = new RateLimiter('test', { maxRequests: 2, windowMs: 1000 });
      limiter.check('user1');
      limiter.check('user1');
      expect(limiter.check('user1')).toBe(false);
    });

    it('resets after window expires', () => {
      const limiter = new RateLimiter('test', { maxRequests: 1, windowMs: 1000 });
      limiter.check('user1');
      vi.advanceTimersByTime(1001);
      expect(limiter.check('user1')).toBe(true);
    });

    it('tracks different users separately', () => {
      const limiter = new RateLimiter('test', { maxRequests: 1, windowMs: 1000 });
      expect(limiter.check('user1')).toBe(true);
      expect(limiter.check('user2')).toBe(true);
    });
  });

  describe('createRateLimiter', () => {
    it('creates limiter with custom config', () => {
      const limiter = createRateLimiter('test', { maxRequests: 10, windowMs: 5000 });
      expect(limiter).toBeDefined();
    });
  });

  describe('checkRateLimit', () => {
    it('returns boolean', () => {
      const result = checkRateLimit('test-key');
      expect(typeof result).toBe('boolean');
    });
  });
});
