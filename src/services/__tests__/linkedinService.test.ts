/**
 * @fileoverview Testes do LinkedIn Service (stub)
 */
import { describe, it, expect } from 'vitest';
import { linkedinService } from '../linkedinService';

describe('linkedinService', () => {
  describe('importProfile', () => {
    it('retorna null (não implementado)', async () => {
      const result = await linkedinService.importProfile('https://linkedin.com/in/test');
      expect(result).toBeNull();
    });
  });

  describe('publishJob', () => {
    it('retorna success:false (não configurado)', async () => {
      const result = await linkedinService.publishJob('vaga-1', { titulo: 'Dev' });
      expect(result.success).toBe(false);
      expect(result.message).toContain('not configured');
    });
  });

  describe('searchCandidates', () => {
    it('retorna array vazio (não implementado)', async () => {
      const result = await linkedinService.searchCandidates('react developer');
      expect(result).toEqual([]);
    });
  });

  describe('isConfigured', () => {
    it('retorna false quando env var não existe', () => {
      expect(linkedinService.isConfigured()).toBe(false);
    });
  });
});
