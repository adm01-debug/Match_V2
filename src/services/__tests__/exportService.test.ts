/**
 * @fileoverview Testes do exportService
 */
import { describe, it, expect } from 'vitest';
import { exportService } from '../exportService';

describe('exportService.toCSV', () => {
  it('gera CSV com headers e dados', () => {
    const data = [
      { nome: 'João', idade: 30 },
      { nome: 'Maria', idade: 25 },
    ];
    const csv = exportService.toCSV(data);
    expect(csv).toContain('nome,idade');
    expect(csv).toContain('João,30');
    expect(csv).toContain('Maria,25');
  });

  it('retorna apenas header para array vazio', () => {
    const csv = exportService.toCSV([]);
    expect(csv).toBe('');
  });

  it('escapa vírgulas em valores', () => {
    const data = [{ desc: 'São Paulo, SP', value: 100 }];
    const csv = exportService.toCSV(data);
    expect(csv).toContain('"São Paulo, SP"');
  });

  it('escapa aspas em valores', () => {
    const data = [{ desc: 'Ele disse "olá"', value: 1 }];
    const csv = exportService.toCSV(data);
    expect(csv).toContain('""olá""');
  });

  it('filtra colunas quando especificadas', () => {
    const data = [{ nome: 'A', email: 'a@a.com', tel: '123' }];
    const csv = exportService.toCSV(data, ['nome', 'email']);
    expect(csv).toContain('nome,email');
    expect(csv).not.toContain('tel');
  });

  it('lida com valores null e undefined', () => {
    const data = [{ nome: 'Test', vazio: null, undef: undefined }];
    const csv = exportService.toCSV(data as any);
    expect(csv).toContain('Test');
  });

  // Stress: 100 rows
  it('gera CSV com 100 linhas', () => {
    const data = Array.from({ length: 100 }, (_, i) => ({
      id: i, name: `User_${i}`, score: Math.random() * 100,
    }));
    const csv = exportService.toCSV(data);
    const lines = csv.split('\n');
    expect(lines.length).toBe(101); // header + 100 rows
  });
});

describe('exportService.toJSON', () => {
  it('gera JSON formatado', () => {
    const data = [{ id: 1, nome: 'Test' }];
    const json = exportService.toJSON(data);
    expect(() => JSON.parse(json)).not.toThrow();
    expect(JSON.parse(json)).toEqual(data);
  });

  it('retorna "[]" para array vazio', () => {
    expect(exportService.toJSON([])).toBe('[]');
  });
});
