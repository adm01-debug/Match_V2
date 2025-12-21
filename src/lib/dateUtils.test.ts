import { describe, it, expect } from 'vitest';
import { formatDate, isToday } from './dateUtils';

describe('dateUtils', () => {
  it('formats date correctly', () => {
    expect(formatDate('2024-01-15')).toMatch(/15/);
  });

  it('checks if date is today', () => {
    expect(isToday(new Date())).toBe(true);
    expect(isToday('2020-01-01')).toBe(false);
  });
});
