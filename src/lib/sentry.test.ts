import { describe, it, expect } from 'vitest';
import { initSentry, captureError, setUser, clearUser } from './sentry';

describe('sentry', () => {
  describe('initSentry', () => {
    it('initializes without error', () => {
      expect(() => initSentry()).not.toThrow();
    });

    it('accepts configuration options', () => {
      expect(() => initSentry({ dsn: 'test-dsn' })).not.toThrow();
    });
  });

  describe('captureError', () => {
    it('captures Error objects', () => {
      const error = new Error('Test error');
      expect(() => captureError(error)).not.toThrow();
    });

    it('captures string messages', () => {
      expect(() => captureError('Test message')).not.toThrow();
    });

    it('handles null/undefined', () => {
      expect(() => captureError(null)).not.toThrow();
    });
  });

  describe('setUser', () => {
    it('sets user context', () => {
      expect(() => setUser({ id: '123', email: 'test@test.com' })).not.toThrow();
    });

    it('handles partial user data', () => {
      expect(() => setUser({ id: '123' })).not.toThrow();
    });
  });

  describe('clearUser', () => {
    it('clears user context', () => {
      expect(() => clearUser()).not.toThrow();
    });
  });
});
