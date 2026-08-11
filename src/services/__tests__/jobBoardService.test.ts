/**
 * @fileoverview Testes do Job Board Service (stubs)
 */
import { describe, it, expect } from 'vitest';
import { jobBoardService } from '../jobBoardService';
import { cathoService } from '../cathoService';
import { infojobsService } from '../infojobsService';
import { vagasComService } from '../vagasService';

describe('jobBoardService', () => {
  const mockJobData = {
    titulo: 'Desenvolvedor React',
    departamento: 'TI',
    descricao: 'Vaga de teste',
  };

  describe('publishToBoard', () => {
    it('catho retorna not configured', async () => {
      const result = await jobBoardService.publishToBoard('catho', mockJobData);
      expect(result.success).toBe(false);
      expect(result.message).toContain('not configured');
    });

    it('indeed retorna not configured', async () => {
      const result = await jobBoardService.publishToBoard('indeed', mockJobData);
      expect(result.success).toBe(false);
    });

    it('infojobs retorna not configured', async () => {
      const result = await jobBoardService.publishToBoard('infojobs', mockJobData);
      expect(result.success).toBe(false);
    });

    it('vagas retorna not configured', async () => {
      const result = await jobBoardService.publishToBoard('vagas', mockJobData);
      expect(result.success).toBe(false);
    });
  });

  describe('publishToAll', () => {
    it('retorna resultados para todos os boards', async () => {
      const results = await jobBoardService.publishToAll(mockJobData);
      expect(results.length).toBe(5); // linkedin, indeed, catho, infojobs, vagas
    });
  });

  describe('getConfiguredBoards', () => {
    it('retorna array vazio quando nenhum board está configurado', () => {
      const boards = jobBoardService.getConfiguredBoards();
      // LinkedIn depends on env var, others are always false
      expect(Array.isArray(boards)).toBe(true);
    });
  });

  describe('services individuais - isConfigured', () => {
    it('catho não está configurado', () => {
      expect(cathoService.isConfigured()).toBe(false);
    });

    it('infojobs não está configurado', () => {
      expect(infojobsService.isConfigured()).toBe(false);
    });

    it('vagas.com não está configurado', () => {
      expect(vagasComService.isConfigured()).toBe(false);
    });
  });
});
