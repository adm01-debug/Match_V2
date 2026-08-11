/**
 * @fileoverview Testes do AI Service
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@/test/mocks/supabase';
import { mockSupabase } from '@/test/mocks/supabase';
import { aiService } from '../aiService';

describe('aiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('analyzeResume', () => {
    it('invoca parse-resume com texto do currículo', async () => {
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: { nome: 'João', habilidades: ['React'] },
        error: null,
      });

      const result = await aiService.analyzeResume('Currículo texto...');
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('parse-resume', {
        body: { resumeText: 'Currículo texto...' },
      });
      expect(result).toEqual({ nome: 'João', habilidades: ['React'] });
    });

    it('lança erro quando a função falha', async () => {
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: null,
        error: { message: 'Unauthorized' },
      });

      await expect(aiService.analyzeResume('texto')).rejects.toEqual({ message: 'Unauthorized' });
    });

    it('lida com currículo vazio', async () => {
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: { nome: '', habilidades: [] },
        error: null,
      });

      const result = await aiService.analyzeResume('');
      expect(result).toEqual({ nome: '', habilidades: [] });
    });
  });

  describe('calculateMatchScore', () => {
    it('invoca match-score com IDs corretos', async () => {
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: { score: 85, analise: 'Boa compatibilidade' },
        error: null,
      });

      const result = await aiService.calculateMatchScore('cand-1', 'vaga-1');
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('match-score', {
        body: { candidatoId: 'cand-1', vagaId: 'vaga-1' },
      });
      expect(result.score).toBe(85);
    });

    it('lança erro quando match-score falha', async () => {
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: null,
        error: { message: 'Not found' },
      });

      await expect(aiService.calculateMatchScore('x', 'y')).rejects.toBeDefined();
    });
  });

  describe('generateScorecard', () => {
    it('invoca generate-scorecard com processo ID', async () => {
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: { scorecard: { score_final: 78 } },
        error: null,
      });

      const result = await aiService.generateScorecard('proc-1');
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('generate-scorecard', {
        body: { processoId: 'proc-1' },
      });
      expect(result.scorecard.score_final).toBe(78);
    });
  });

  describe('generateInsights', () => {
    it('retorna insights vazios (stub atual)', async () => {
      const result = await aiService.generateInsights('context');
      expect(result).toEqual({ insights: [] });
    });
  });
});
