import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  measurePerformance, 
  debounce, 
  throttle,
  memoize 
} from './performance';

describe('performance', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe('measurePerformance', () => {
    it('measures execution time', () => {
      const fn = () => 'result';
      const result = measurePerformance('test', fn);
      expect(result).toBe('result');
    });

    it('handles sync functions', () => {
      const fn = () => 'result';
      const result = measurePerformance('test', fn);
      expect(result).toBe('result');
    });

    it('handles errors gracefully', () => {
      const fn = () => { throw new Error('test'); };
      expect(() => measurePerformance('test', fn)).toThrow();
    });
  });

  describe('debounce', () => {
    it('delays function execution', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      
      debounced();
      expect(fn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('cancels previous calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      
      debounced();
      debounced();
      debounced();
      
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('limits function calls', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);
      
      throttled();
      throttled();
      throttled();
      
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('allows calls after interval', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);
      
      throttled();
      vi.advanceTimersByTime(100);
      throttled();
      
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('memoize', () => {
    it('caches function results', () => {
      let callCount = 0;
      const fn = (x: number) => { callCount++; return x * 2; };
      const memoized = memoize(fn);
      
      memoized(5);
      memoized(5);
      
      expect(callCount).toBe(1);
    });

    it('handles different arguments', () => {
      let callCount = 0;
      const fn = (x: number) => { callCount++; return x * 2; };
      const memoized = memoize(fn);
      
      memoized(5);
      memoized(10);
      
      expect(callCount).toBe(2);
    });
  });
});
