/**
 * @fileoverview Testes do apiClient e utilitários
 */
import { describe, it, expect } from 'vitest';
import '@/test/mocks/supabase';
import { createApiUrl } from '../../lib/apiClient';

describe('createApiUrl', () => {
  it('retorna path simples sem params', () => {
    expect(createApiUrl('/candidatos')).toBe('/candidatos');
  });

  it('adiciona prefixo / quando ausente', () => {
    expect(createApiUrl('vagas')).toBe('/vagas');
  });

  it('adiciona query params', () => {
    const url = createApiUrl('/vagas', { status: 'publicada', limit: 10 });
    expect(url).toContain('status=publicada');
    expect(url).toContain('limit=10');
  });

  it('ignora params null/undefined', () => {
    const url = createApiUrl('/vagas', { status: 'ativa', vazio: null, undef: undefined });
    expect(url).toContain('status=ativa');
    expect(url).not.toContain('vazio');
    expect(url).not.toContain('undef');
  });

  it('retorna path sem query quando params é undefined', () => {
    expect(createApiUrl('/test')).toBe('/test');
  });

  it('retorna path sem query quando todos params são null', () => {
    const url = createApiUrl('/test', { a: null, b: undefined });
    expect(url).toBe('/test');
  });
});
