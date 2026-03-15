/**
 * @fileoverview Testes de integração dos serviços stub
 * Valida que todos os serviços não-configurados retornam respostas seguras
 */
import { describe, it, expect } from 'vitest';
import { cathoService } from '../cathoService';
import { infojobsService } from '../infojobsService';
import { vagasComService } from '../vagasService';

const stubServices = [
  { name: 'cathoService', service: cathoService },
  { name: 'infojobsService', service: infojobsService },
  { name: 'vagasComService', service: vagasComService },
];

describe.each(stubServices)('$name (stub)', ({ service }) => {
  it('publishJob retorna success:false', async () => {
    const result = await service.publishJob({ titulo: 'Test' });
    expect(result.success).toBe(false);
    expect(result.message).toBeTruthy();
  });

  it('importCandidates retorna array vazio', async () => {
    const result = await service.importCandidates('job-1');
    expect(result).toEqual([]);
  });

  it('isConfigured retorna false', () => {
    expect(service.isConfigured()).toBe(false);
  });
});

describe('Consistência de stubs', () => {
  it('todos os stubs seguem a mesma interface', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stubServices.forEach(({ service }) => {
      expect(typeof service.publishJob).toBe('function');
      expect(typeof service.importCandidates).toBe('function');
      expect(typeof service.isConfigured).toBe('function');
    });
  });

  it('nenhum stub lança exceção', async () => {
    for (const { service } of stubServices) {
      await expect(service.publishJob({})).resolves.toBeDefined();
      await expect(service.importCandidates('')).resolves.toBeDefined();
      expect(() => service.isConfigured()).not.toThrow();
    }
  });
});
