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
  reportWebVitals: (callback: (metric: { name: string; value: number }) => void) => {
    if (typeof window !== 'undefined') {
      // LCP, FID, CLS would be measured here
      // This is a placeholder for web-vitals library integration
      // Web Vitals reporting initialized
    }
  },
};

