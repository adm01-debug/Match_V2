import { describe, it, expect, vi } from 'vitest';
import { handleError, handleApiError } from './errorHandler';

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));

describe('errorHandler', () => {
  it('handles Error instance', () => {
    const result = handleError(new Error('Test error'));
    expect(result).toBe('Test error');
  });

  it('handles unknown error', () => {
    const result = handleError('unknown');
    expect(result).toBe('Erro desconhecido');
  });
});

describe('handleApiError', () => {
  it('handles PGRST116', () => {
    const result = handleApiError({ code: 'PGRST116' });
    expect(result).toBe('Registro não encontrado');
  });
});
