import { describe, it, expect } from 'vitest';
import { getSecurityHeaders, applySecurityHeaders, CSP_DIRECTIVES } from './securityHeaders';

describe('securityHeaders', () => {
  describe('getSecurityHeaders', () => {
    it('returns required security headers', () => {
      const headers = getSecurityHeaders();
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['X-Frame-Options']).toBeDefined();
    });

    it('includes CSP header', () => {
      const headers = getSecurityHeaders();
      expect(headers['Content-Security-Policy']).toBeDefined();
    });

    it('includes HSTS header', () => {
      const headers = getSecurityHeaders();
      expect(headers['Strict-Transport-Security']).toBeDefined();
    });
  });

  describe('applySecurityHeaders', () => {
    it('applies headers to response', () => {
      const mockResponse = { setHeader: (k: string, v: string) => {} };
      expect(() => applySecurityHeaders(mockResponse as any)).not.toThrow();
    });
  });

  describe('CSP_DIRECTIVES', () => {
    it('has default-src directive', () => {
      expect(CSP_DIRECTIVES['default-src']).toBeDefined();
    });

    it('has script-src directive', () => {
      expect(CSP_DIRECTIVES['script-src']).toBeDefined();
    });
  });
});
