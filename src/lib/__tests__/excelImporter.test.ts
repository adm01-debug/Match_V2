/**
 * @fileoverview Testes do Excel/CSV importer
 */
import { describe, it, expect } from 'vitest';
import { parseCSV } from '../excelImporter';

describe('parseCSV', () => {
  it('parseia CSV simples', () => {
    const csv = 'nome,email,telefone\nJoão,joao@test.com,11999\nMaria,maria@test.com,11888';
    const result = parseCSV(csv);
    expect(result.length).toBe(2);
    expect(result[0]?.nome).toBe('João');
    expect(result[0]?.email).toBe('joao@test.com');
    expect(result[1]?.nome).toBe('Maria');
  });

  it('retorna array vazio para CSV sem dados', () => {
    expect(parseCSV('nome,email')).toEqual([]);
    expect(parseCSV('')).toEqual([]);
  });

  it('lida com linhas vazias', () => {
    const csv = 'a,b\n1,2\n\n3,4\n';
    const result = parseCSV(csv);
    expect(result.length).toBe(2);
  });

  it('remove aspas dos headers', () => {
    const csv = '"nome","email"\n"João","j@t.com"';
    const result = parseCSV(csv);
    expect(result[0]?.nome).toBe('João');
  });

  it('lida com valores ausentes', () => {
    const csv = 'a,b,c\n1,,3';
    const result = parseCSV(csv);
    expect(result[0]?.b).toBe('');
  });

  // Stress: CSV grande
  it('parseia CSV com 100 linhas', () => {
    const header = 'id,nome,email,score';
    const rows = Array.from({ length: 100 }, (_, i) =>
      `${i},User_${i},user${i}@test.com,${Math.round(Math.random() * 100)}`
    );
    const csv = [header, ...rows].join('\n');
    const result = parseCSV(csv);
    expect(result.length).toBe(100);
    expect(result[50]?.nome).toBe('User_50');
  });
});
