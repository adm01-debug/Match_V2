/**
 * @fileoverview Testes do cacheService
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cacheService } from '../cacheService';

describe('cacheService', () => {
  beforeEach(() => cacheService.clear());

  it('set e get valor simples', () => {
    cacheService.set('key', 'value');
    expect(cacheService.get('key')).toBe('value');
  });

  it('set e get objeto complexo', () => {
    const data = { id: 1, name: 'Test', nested: { a: true } };
    cacheService.set('obj', data);
    expect(cacheService.get('obj')).toEqual(data);
  });

  it('retorna null para chave inexistente', () => {
    expect(cacheService.get('missing')).toBeNull();
  });

  it('respeita TTL e expira entradas', () => {
    vi.useFakeTimers();
    cacheService.set('ttl', 'value', 1000); // 1 segundo
    expect(cacheService.get('ttl')).toBe('value');
    
    vi.advanceTimersByTime(1001);
    expect(cacheService.get('ttl')).toBeNull();
    vi.useRealTimers();
  });

  it('invalidate remove chave específica', () => {
    cacheService.set('a', 1);
    cacheService.set('b', 2);
    cacheService.invalidate('a');
    expect(cacheService.get('a')).toBeNull();
    expect(cacheService.get('b')).toBe(2);
  });

  it('invalidatePattern remove chaves com padrão', () => {
    cacheService.set('vagas:list', [1, 2]);
    cacheService.set('vagas:detail:1', { id: 1 });
    cacheService.set('candidatos:list', [3, 4]);
    cacheService.invalidatePattern('vagas');
    expect(cacheService.get('vagas:list')).toBeNull();
    expect(cacheService.get('vagas:detail:1')).toBeNull();
    expect(cacheService.get('candidatos:list')).toEqual([3, 4]);
  });

  it('clear remove todas as entradas', () => {
    cacheService.set('a', 1);
    cacheService.set('b', 2);
    cacheService.set('c', 3);
    cacheService.clear();
    expect(cacheService.size()).toBe(0);
  });

  it('size retorna contagem correta', () => {
    expect(cacheService.size()).toBe(0);
    cacheService.set('a', 1);
    cacheService.set('b', 2);
    expect(cacheService.size()).toBe(2);
  });

  it('TTL padrão é 5 minutos', () => {
    vi.useFakeTimers();
    cacheService.set('default_ttl', 'val');
    vi.advanceTimersByTime(4 * 60 * 1000); // 4 min
    expect(cacheService.get('default_ttl')).toBe('val');
    vi.advanceTimersByTime(2 * 60 * 1000); // +2 min = 6 min total
    expect(cacheService.get('default_ttl')).toBeNull();
    vi.useRealTimers();
  });

  // Stress test
  it('lida com 200 entradas simultâneas', () => {
    for (let i = 0; i < 200; i++) {
      cacheService.set(`stress_${i}`, { data: i, timestamp: Date.now() });
    }
    expect(cacheService.size()).toBe(200);
    for (let i = 0; i < 200; i++) {
      expect(cacheService.get<{ data: number }>(`stress_${i}`)?.data).toBe(i);
    }
  });

  it('sobrescreve valor existente', () => {
    cacheService.set('overwrite', 'first');
    cacheService.set('overwrite', 'second');
    expect(cacheService.get('overwrite')).toBe('second');
  });
});
