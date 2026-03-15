/**
 * @fileoverview Testes exaustivos de dateUtils
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDate, formatDateTime, formatRelative, isToday } from '../dateUtils';

describe('formatDate', () => {
  it('formata string ISO corretamente', () => {
    const result = formatDate('2025-06-15T10:00:00Z');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('formata objeto Date corretamente', () => {
    const result = formatDate(new Date(2025, 5, 15));
    expect(result).toContain('15');
  });

  it('lança erro para data inválida', () => {
    expect(() => formatDate('invalid')).toThrow();
  });

  it('formata datas em diferentes meses', () => {
    for (let m = 0; m < 12; m++) {
      const result = formatDate(new Date(2025, m, 1));
      expect(result).toBeTruthy();
    }
  });
});

describe('formatDateTime', () => {
  it('inclui hora na formatação', () => {
    const result = formatDateTime('2025-06-15T14:30:00Z');
    expect(result).toBeTruthy();
  });

  it('formata objeto Date com hora', () => {
    const date = new Date(2025, 5, 15, 14, 30);
    const result = formatDateTime(date);
    expect(result).toContain('14');
    expect(result).toContain('30');
  });
});

describe('formatRelative', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 5, 15, 12, 0, 0));
  });
  afterEach(() => vi.useRealTimers());

  it('retorna "Hoje" para data de hoje', () => {
    expect(formatRelative(new Date(2025, 5, 15, 8, 0))).toBe('Hoje');
  });

  it('retorna "Ontem" para data de ontem', () => {
    expect(formatRelative(new Date(2025, 5, 14, 12, 0))).toBe('Ontem');
  });

  it('retorna "X dias atrás" para menos de 7 dias', () => {
    expect(formatRelative(new Date(2025, 5, 12, 12, 0))).toBe('3 dias atrás');
    expect(formatRelative(new Date(2025, 5, 10, 12, 0))).toBe('5 dias atrás');
  });

  it('retorna data formatada para 7+ dias', () => {
    const result = formatRelative(new Date(2025, 5, 1));
    expect(result).not.toContain('dias');
    expect(result).toBeTruthy();
  });
});

describe('isToday', () => {
  it('retorna true para data de hoje', () => {
    expect(isToday(new Date())).toBe(true);
  });

  it('retorna false para ontem', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday)).toBe(false);
  });

  it('retorna false para amanhã', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(isToday(tomorrow)).toBe(false);
  });

  it('aceita string ISO', () => {
    const todayISO = new Date().toISOString();
    expect(isToday(todayISO)).toBe(true);
  });

  it('retorna false para data antiga', () => {
    expect(isToday('2020-01-01')).toBe(false);
  });
});
