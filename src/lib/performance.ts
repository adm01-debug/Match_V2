/**
 * Performance monitoring utilities
 */

export const performance = {
  /**
   * Mark a performance entry
   */
  mark: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
    }
  },

  /**
   * Measure between two marks
   */
  measure: (name: string, startMark: string, endMark: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        window.performance.measure(name, startMark, endMark);
        const entries = window.performance.getEntriesByName(name);
        return entries[entries.length - 1]?.duration;
      } catch {
        return undefined;
      }
    }
    return undefined;
  },

  /**
   * Get navigation timing
   */
  getNavigationTiming: () => {
    if (typeof window !== 'undefined' && window.performance) {
      const timing = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        dns: timing?.domainLookupEnd - timing?.domainLookupStart,
        tcp: timing?.connectEnd - timing?.connectStart,
        ttfb: timing?.responseStart - timing?.requestStart,
        download: timing?.responseEnd - timing?.responseStart,
        dom: timing?.domContentLoadedEventEnd - timing?.domContentLoadedEventStart,
        load: timing?.loadEventEnd - timing?.loadEventStart,
      };
    }
    return null;
  },

  /**
   * Report Web Vitals
   */
  reportWebVitals: (_callback: (metric: { name: string; value: number }) => void) => {
    if (typeof window !== 'undefined') {
      // LCP, FID, CLS would be measured here
      // This is a placeholder for web-vitals library integration
      // Web Vitals reporting initialized
    }
  },
};

/**
 * Measure performance of a function
 */
export function measurePerformance<T>(name: string, fn: () => T): T {
  performance.mark(`${name}-start`);
  const result = fn();
  performance.mark(`${name}-end`);
  performance.measure(name, `${name}-start`, `${name}-end`);
  return result;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: never[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: never[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize function
 */
export function memoize<T extends (...args: never[]) => unknown>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
}
