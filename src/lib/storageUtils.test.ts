import { describe, it, expect, beforeEach } from 'vitest';
import { getItem, setItem, removeItem, clearStorage } from './storageUtils';

describe('storageUtils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('setItem', () => {
    it('stores string value', () => {
      setItem('key', 'value');
      expect(getItem('key')).toBe('value');
    });

    it('stores object value', () => {
      setItem('key', { foo: 'bar' });
      expect(getItem('key')).toEqual({ foo: 'bar' });
    });

    it('handles null value', () => {
      setItem('key', null);
      expect(getItem('key')).toBe(null);
    });
  });

  describe('getItem', () => {
    it('retrieves stored value', () => {
      setItem('key', 'value');
      expect(getItem('key')).toBe('value');
    });

    it('returns default for missing key', () => {
      expect(getItem('missing', 'default')).toBe('default');
    });

    it('parses JSON objects', () => {
      setItem('obj', { a: 1 });
      expect(getItem('obj')).toEqual({ a: 1 });
    });
  });

  describe('removeItem', () => {
    it('removes item from storage', () => {
      setItem('key', 'value');
      removeItem('key');
      expect(getItem('key')).toBeNull();
    });
  });

  describe('clearStorage', () => {
    it('clears all items', () => {
      setItem('key1', 'value1');
      setItem('key2', 'value2');
      clearStorage();
      expect(getItem('key1')).toBeNull();
      expect(getItem('key2')).toBeNull();
    });
  });
});
