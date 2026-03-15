/**
 * @fileoverview Testes do storageUtils
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { storage, getItem, setItem, removeItem, clearStorage } from '../storageUtils';

describe('storage object', () => {
  beforeEach(() => localStorage.clear());

  it('set e get string', () => {
    storage.set('test', 'hello');
    expect(storage.get('test')).toBe('hello');
  });

  it('set e get objeto complexo', () => {
    const obj = { a: 1, b: [1, 2, 3], c: { nested: true } };
    storage.set('complex', obj);
    expect(storage.get('complex')).toEqual(obj);
  });

  it('set e get array', () => {
    storage.set('arr', [1, 2, 3]);
    expect(storage.get('arr')).toEqual([1, 2, 3]);
  });

  it('set e get number', () => {
    storage.set('num', 42);
    expect(storage.get('num')).toBe(42);
  });

  it('set e get boolean', () => {
    storage.set('bool', true);
    expect(storage.get('bool')).toBe(true);
  });

  it('set e get null value', () => {
    storage.set('null', null);
    expect(storage.get('null')).toBeNull();
  });

  it('get retorna null para chave inexistente', () => {
    expect(storage.get('nonexistent')).toBeNull();
  });

  it('remove deleta chave', () => {
    storage.set('toRemove', 'value');
    storage.remove('toRemove');
    expect(storage.get('toRemove')).toBeNull();
  });

  it('clear limpa apenas chaves com prefixo', () => {
    storage.set('matchKey', 'value1');
    localStorage.setItem('other_key', 'value2');
    storage.clear();
    expect(storage.get('matchKey')).toBeNull();
    expect(localStorage.getItem('other_key')).toBe('value2');
  });

  it('get lida com JSON inválido', () => {
    localStorage.setItem('match_ats_broken', '{invalid');
    expect(storage.get('broken')).toBeNull();
  });

  // Stress test: muitas operações
  it('lida com 100 operações set/get', () => {
    for (let i = 0; i < 100; i++) {
      storage.set(`key_${i}`, { index: i, data: `value_${i}` });
    }
    for (let i = 0; i < 100; i++) {
      const result = storage.get<{ index: number; data: string }>(`key_${i}`);
      expect(result?.index).toBe(i);
    }
  });
});

describe('standalone functions', () => {
  beforeEach(() => localStorage.clear());

  it('setItem e getItem funcionam', () => {
    setItem('test', 'value');
    expect(getItem('test')).toBe('value');
  });

  it('getItem retorna defaultValue quando chave não existe', () => {
    expect(getItem('missing', 'default')).toBe('default');
  });

  it('getItem retorna null sem defaultValue', () => {
    expect(getItem('missing')).toBeNull();
  });

  it('removeItem remove a chave', () => {
    setItem('rem', 'val');
    removeItem('rem');
    expect(getItem('rem')).toBeNull();
  });

  it('clearStorage limpa apenas chaves prefixadas', () => {
    setItem('a', '1');
    setItem('b', '2');
    localStorage.setItem('external', 'val');
    clearStorage();
    expect(getItem('a')).toBeNull();
    expect(getItem('b')).toBeNull();
    expect(localStorage.getItem('external')).toBe('val');
  });
});
