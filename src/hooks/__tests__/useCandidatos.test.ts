/**
 * @fileoverview Testes dos status e origens de candidatos
 */
import { describe, it, expect } from 'vitest';
import { STATUS_CANDIDATO, ORIGENS_CANDIDATO } from '../useCandidatos';

describe('STATUS_CANDIDATO', () => {
  it('contém todos os status esperados', () => {
    expect(STATUS_CANDIDATO.NOVO).toBe('novo');
    expect(STATUS_CANDIDATO.EM_ANALISE).toBe('em_analise');
    expect(STATUS_CANDIDATO.ENTREVISTA).toBe('entrevista');
    expect(STATUS_CANDIDATO.TESTE).toBe('teste');
    expect(STATUS_CANDIDATO.APROVADO).toBe('aprovado');
    expect(STATUS_CANDIDATO.REPROVADO).toBe('reprovado');
    expect(STATUS_CANDIDATO.CONTRATADO).toBe('contratado');
    expect(STATUS_CANDIDATO.DESISTENTE).toBe('desistente');
  });

  it('tem 8 status diferentes', () => {
    expect(Object.keys(STATUS_CANDIDATO).length).toBe(8);
  });

  it('todos os valores são strings não vazias', () => {
    Object.values(STATUS_CANDIDATO).forEach(status => {
      expect(typeof status).toBe('string');
      expect(status.length).toBeGreaterThan(0);
    });
  });
});

describe('ORIGENS_CANDIDATO', () => {
  it('contém todas as origens esperadas', () => {
    expect(ORIGENS_CANDIDATO.LINKEDIN).toBe('linkedin');
    expect(ORIGENS_CANDIDATO.SITE).toBe('site');
    expect(ORIGENS_CANDIDATO.INDICACAO).toBe('indicacao');
    expect(ORIGENS_CANDIDATO.PORTAL).toBe('portal');
    expect(ORIGENS_CANDIDATO.HEADHUNTER).toBe('headhunter');
    expect(ORIGENS_CANDIDATO.OUTRO).toBe('outro');
  });

  it('tem 6 origens diferentes', () => {
    expect(Object.keys(ORIGENS_CANDIDATO).length).toBe(6);
  });
});
