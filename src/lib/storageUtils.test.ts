import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from './storageUtils';

describe('storageUtils', () => {
  beforeEach(() => localStorage.clear());

  it('sets and gets value', () => {
    storage.set('test', { foo: 'bar' });
    expect(storage.get('test')).toEqual({ foo: 'bar' });
  });

  it('removes value', () => {
    storage.set('test', 'value');
    storage.remove('test');
    expect(storage.get('test')).toBeNull();
  });
});
