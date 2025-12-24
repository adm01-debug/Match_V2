import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient, handleApiError, createApiUrl } from './apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('apiClient', () => {
    it('exports default instance', () => {
      expect(apiClient).toBeDefined();
    });

    it('has request method', () => {
      expect(typeof apiClient.request).toBe('function');
    });

    it('has get method', () => {
      expect(typeof apiClient.get).toBe('function');
    });

    it('has post method', () => {
      expect(typeof apiClient.post).toBe('function');
    });
  });

  describe('handleApiError', () => {
    it('handles network errors', () => {
      const error = new Error('Network error');
      expect(() => handleApiError(error)).not.toThrow();
    });

    it('handles API errors with status code', () => {
      const error = { response: { status: 404, data: { message: 'Not found' } } };
      expect(() => handleApiError(error)).not.toThrow();
    });

    it('handles unknown errors', () => {
      expect(() => handleApiError(null)).not.toThrow();
    });
  });

  describe('createApiUrl', () => {
    it('creates URL with base path', () => {
      const url = createApiUrl('/users');
      expect(url).toContain('/users');
    });

    it('handles query parameters', () => {
      const url = createApiUrl('/users', { page: 1, limit: 10 });
      expect(url).toContain('page=1');
    });
  });
});
