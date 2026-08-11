/**
 * @fileoverview Testes do GDPR Service
 */
import { describe, it, expect } from 'vitest';
import { gdprService } from '../gdprService';

describe('gdprService', () => {
  it('exportUserData retorna mensagem de registro', async () => {
    const result = await gdprService.exportUserData('user-1');
    expect(result['message']).toBeTruthy();
  });

  it('deleteUserData retorna false (requer aprovação)', async () => {
    const result = await gdprService.deleteUserData('user-1');
    expect(result).toBe(false);
  });

  it('getConsentStatus retorna consentimentos padrão', async () => {
    const result = await gdprService.getConsentStatus('user-1');
    expect(result['essential']).toBe(true);
    expect(result['analytics']).toBe(true);
    expect(result['marketing']).toBe(false);
  });

  it('updateConsent não lança erro', async () => {
    await expect(gdprService.updateConsent('user-1', { analytics: false })).resolves.not.toThrow();
  });

  it('getRetentionPolicy retorna políticas com valores positivos', async () => {
    const result = await gdprService.getRetentionPolicy();
    expect(result.candidateDataDays).toBeGreaterThan(0);
    expect(result.communicationLogsDays).toBeGreaterThan(0);
    expect(result.auditLogsDays).toBeGreaterThan(0);
    expect(result.sessionDataDays).toBeGreaterThan(0);
  });

  it('retenção de dados de candidatos é maior que logs de sessão', async () => {
    const policy = await gdprService.getRetentionPolicy();
    expect(policy.candidateDataDays).toBeGreaterThan(policy.sessionDataDays);
  });
});
