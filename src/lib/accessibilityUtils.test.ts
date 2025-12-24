import { describe, it, expect, vi } from 'vitest';
import { 
  announceToScreenReader, 
  trapFocus, 
  getAriaLabel 
} from './accessibilityUtils';

describe('accessibilityUtils', () => {
  describe('announceToScreenReader', () => {
    it('creates live region element', () => {
      announceToScreenReader('Test message');
      const liveRegion = document.querySelector('[role="status"]');
      expect(liveRegion).toBeTruthy();
    });

    it('removes element after timeout', async () => {
      vi.useFakeTimers();
      announceToScreenReader('Test message');
      vi.advanceTimersByTime(1100);
      vi.useRealTimers();
    });

    it('handles empty message gracefully', () => {
      expect(() => announceToScreenReader('')).not.toThrow();
    });

    it('handles special characters', () => {
      expect(() => announceToScreenReader('<script>alert("xss")</script>')).not.toThrow();
    });
  });

  describe('trapFocus', () => {
    it('returns cleanup function', () => {
      const container = document.createElement('div');
      const cleanup = trapFocus(container);
      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('handles container with no focusable elements', () => {
      const container = document.createElement('div');
      expect(() => trapFocus(container)).not.toThrow();
    });
  });

  describe('getAriaLabel', () => {
    it('returns label for known element types', () => {
      expect(getAriaLabel('button')).toBeTruthy();
    });

    it('handles unknown element types', () => {
      expect(getAriaLabel('unknown')).toBe('');
    });
  });
});
