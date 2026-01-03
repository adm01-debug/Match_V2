import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDate, formatDateTime, formatRelative, isToday } from './dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats a date string correctly', () => {
      const result = formatDate('2024-01-15');
      expect(result).toMatch(/15/);
      expect(result).toMatch(/01|1/);
    });

    it('formats a Date object correctly', () => {
      const date = new Date(2024, 0, 15);
      const result = formatDate(date);
      expect(result).toMatch(/15/);
    });

    it('handles ISO date strings', () => {
      const result = formatDate('2024-06-20T10:30:00Z');
      expect(result).toMatch(/20/);
    });
  });

  describe('formatDateTime', () => {
    it('includes time in the formatted output', () => {
      const result = formatDateTime('2024-01-15T14:30:00');
      expect(result).toMatch(/15/);
      expect(result).toMatch(/14|2/); // 14h ou 2pm dependendo do locale
    });

    it('formats Date objects with time', () => {
      const date = new Date(2024, 5, 20, 10, 45);
      const result = formatDateTime(date);
      expect(result).toMatch(/20/);
      expect(result).toMatch(/10|45/);
    });
  });

  describe('formatRelative', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2024, 5, 15, 12, 0, 0));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns "Hoje" for today dates', () => {
      const today = new Date(2024, 5, 15, 8, 0, 0);
      expect(formatRelative(today)).toBe('Hoje');
    });

    it('returns "Ontem" for yesterday', () => {
      const yesterday = new Date(2024, 5, 14, 12, 0, 0);
      expect(formatRelative(yesterday)).toBe('Ontem');
    });

    it('returns "X dias atrás" for dates within a week', () => {
      const threeDaysAgo = new Date(2024, 5, 12, 12, 0, 0);
      expect(formatRelative(threeDaysAgo)).toBe('3 dias atrás');
    });

    it('returns formatted date for dates older than a week', () => {
      const twoWeeksAgo = new Date(2024, 5, 1, 12, 0, 0);
      const result = formatRelative(twoWeeksAgo);
      expect(result).toMatch(/01|1/);
    });
  });

  describe('isToday', () => {
    it('returns true for current date', () => {
      expect(isToday(new Date())).toBe(true);
    });

    it('returns false for past dates', () => {
      expect(isToday('2020-01-01')).toBe(false);
    });

    it('returns false for future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(isToday(futureDate)).toBe(false);
    });

    it('returns true for today as string', () => {
      const todayStr = new Date().toISOString().split('T')[0];
      expect(isToday(todayStr)).toBe(true);
    });
  });
});
