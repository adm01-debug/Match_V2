/**
 * @fileoverview Testes do errorHandler
 */
import { describe, it, expect, vi } from 'vitest';

// Mock sonner e logger
vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));
vi.mock('@/services/logger', () => ({
  logger: { error: vi.fn(), debug: vi.fn(), info: vi.fn(), warn: vi.fn() },
}));

import { handleError, handleApiError } from '../errorHandler';

describe('handleError', () => {
  it('extrai mensagem de Error', () => {
    const msg = handleError(new Error('Test error'));
    expect(msg).toBe('Test error');
  });

  it('retorna "Erro desconhecido" para não-Error', () => {
    expect(handleError('string error')).toBe('Erro desconhecido');
    expect(handleError(42)).toBe('Erro desconhecido');
    expect(handleError(null)).toBe('Erro desconhecido');
  });

  it('aceita contexto opcional', () => {
    const msg = handleError(new Error('fail'), 'VagaService');
    expect(msg).toBe('fail');
  });
});

describe('handleApiError', () => {
  it('mapeia PGRST116 para "Registro não encontrado"', () => {
    expect(handleApiError({ code: 'PGRST116' })).toBe('Registro não encontrado');
  });

  it('mapeia 23505 para "Registro duplicado"', () => {
    expect(handleApiError({ code: '23505' })).toBe('Registro duplicado');
  });

  it('mapeia 23503 para "Referência inválida"', () => {
    expect(handleApiError({ code: '23503' })).toBe('Referência inválida');
  });

  it('retorna "Erro na operação" para código desconhecido', () => {
    expect(handleApiError({ code: 'UNKNOWN' })).toBe('Erro na operação');
  });

  it('faz fallback para handleError para objetos sem code', () => {
    const msg = handleApiError(new Error('generic'));
    expect(msg).toBe('generic');
  });
});
