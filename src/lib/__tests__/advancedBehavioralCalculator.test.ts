/**
 * @fileoverview Testes do Advanced Behavioral Calculator - cenários massivos
 */
import { describe, it, expect } from 'vitest';
import {
  calculateGenerationalResult,
  calculateStressProfileResult,
  calculateTriuneBrainResult,
  performCrossFrameworkAnalysis,
  calculateAdvancedResult,
  extractDISCFromResults,
} from '../advancedBehavioralCalculator';

describe('calculateGenerationalResult', () => {
  it('retorna resultado com generation type', () => {
    const answers: Record<string, number> = { q1: 2, q2: 2, q3: 2 };
    const result = calculateGenerationalResult(answers, 'generational', 120);
    expect(result.generationType).toBeTruthy();
    expect(result.toolId).toBe('generational');
    expect(result.timeSpent).toBe(120);
  });

  it('confiança entre 0 e 100', () => {
    for (let i = 0; i < 20; i++) {
      const answers: Record<string, number> = {};
      for (let q = 0; q < 10; q++) {
        answers[`q${q}`] = Math.floor(Math.random() * 4);
      }
      const result = calculateGenerationalResult(answers, 'gen', 60);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    }
  });

  it('scores normalizados entre 0 e 100', () => {
    const answers: Record<string, number> = { q1: 0, q2: 1, q3: 2, q4: 3 };
    const result = calculateGenerationalResult(answers, 'gen', 90);
    Object.values(result.generationScores).forEach(score => {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});

describe('calculateStressProfileResult', () => {
  it('retorna perfil DISC válido', () => {
    const answers: Record<string, number> = { q1: 0, q2: 1, q3: 0 };
    const result = calculateStressProfileResult(answers, 'stress', 90);
    expect(['D', 'I', 'S', 'C']).toContain(result.discProfile);
  });

  it('resiliência entre 0 e 100', () => {
    for (let i = 0; i < 20; i++) {
      const answers: Record<string, number> = {};
      for (let q = 0; q < 8; q++) {
        answers[`q${q}`] = Math.floor(Math.random() * 4);
      }
      const result = calculateStressProfileResult(answers, 'stress', 60);
      expect(result.resilience).toBeGreaterThanOrEqual(0);
      expect(result.resilience).toBeLessThanOrEqual(100);
    }
  });

  it('usa perfil DISC existente como fallback', () => {
    const result = calculateStressProfileResult({}, 'stress', 30, 'I');
    expect(['D', 'I', 'S', 'C']).toContain(result.discProfile);
  });

  it('stressIntensity entre 0 e 100', () => {
    const answers: Record<string, number> = { q1: 0, q2: 0, q3: 0, q4: 0 };
    const result = calculateStressProfileResult(answers, 'stress', 60);
    expect(result.stressIntensity).toBeGreaterThanOrEqual(0);
    expect(result.stressIntensity).toBeLessThanOrEqual(100);
  });
});

describe('calculateTriuneBrainResult', () => {
  it('retorna dominante válido', () => {
    const answers: Record<string, number> = { q1: 0, q2: 1, q3: 2 };
    const result = calculateTriuneBrainResult(answers, 'brain', 80);
    expect(['reptiliano', 'limbico', 'neocortex']).toContain(result.dominant);
  });

  it('scores somam ~100', () => {
    const answers: Record<string, number> = { q1: 0, q2: 1, q3: 2, q4: 0, q5: 1 };
    const result = calculateTriuneBrainResult(answers, 'brain', 100);
    const total = result.reptilianoScore + result.limbicoScore + result.neocortexScore;
    expect(total).toBeGreaterThanOrEqual(95);
    expect(total).toBeLessThanOrEqual(105); // Arredondamento
  });

  it('balance detecta perfil dominante', () => {
    // Todas respostas = reptiliano
    const answers: Record<string, number> = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
    const result = calculateTriuneBrainResult(answers, 'brain', 60);
    expect(result.dominant).toBe('reptiliano');
    expect(result.balance).toBe('dominated');
  });

  it('decisionStyle nunca é vazio', () => {
    for (let i = 0; i < 10; i++) {
      const answers: Record<string, number> = {};
      for (let q = 0; q < 6; q++) {
        answers[`q${q}`] = Math.floor(Math.random() * 3);
      }
      const result = calculateTriuneBrainResult(answers, 'brain', 60);
      expect(result.decisionStyle.length).toBeGreaterThan(0);
    }
  });
});

describe('performCrossFrameworkAnalysis', () => {
  it('retorna análise com arrays definidos', () => {
    const result = performCrossFrameworkAnalysis('D', 'millennial', 'fight', 'reptiliano');
    expect(Array.isArray(result.synergies)).toBe(true);
    expect(Array.isArray(result.tensions)).toBe(true);
    expect(Array.isArray(result.recommendations)).toBe(true);
  });

  it('consistência entre 0 e 100', () => {
    const combos = [
      ['D', 'gen_x', 'fight', 'reptiliano'],
      ['I', 'millennial', 'flight', 'limbico'],
      ['S', 'baby_boomer', 'freeze', 'neocortex'],
      ['C', 'silent', 'fawn', 'neocortex'],
    ] as const;

    combos.forEach(([disc, gen, stress, brain]) => {
      const result = performCrossFrameworkAnalysis(disc, gen, stress, brain);
      expect(result.overallConsistency).toBeGreaterThanOrEqual(0);
      expect(result.overallConsistency).toBeLessThanOrEqual(100);
    });
  });

  it('D + reptiliano gera sinergia', () => {
    const result = performCrossFrameworkAnalysis('D', undefined, undefined, 'reptiliano');
    expect(result.synergies.length).toBeGreaterThan(0);
  });

  it('I + limbico gera sinergia', () => {
    const result = performCrossFrameworkAnalysis('I', undefined, undefined, 'limbico');
    expect(result.synergies.length).toBeGreaterThan(0);
  });

  it('C + neocortex gera sinergia', () => {
    const result = performCrossFrameworkAnalysis('C', undefined, undefined, 'neocortex');
    expect(result.synergies.length).toBeGreaterThan(0);
  });

  it('lida com todos os parâmetros undefined', () => {
    const result = performCrossFrameworkAnalysis();
    expect(result.overallConsistency).toBe(50);
    expect(result.synergies.length).toBe(0);
  });
});

describe('calculateAdvancedResult', () => {
  it('toolId generational usa calculateGenerationalResult', () => {
    const result = calculateAdvancedResult('generational', { q1: 2 }, 60);
    expect(result.toolId).toBe('generational');
  });

  it('toolId stress_profile usa calculateStressProfileResult', () => {
    const result = calculateAdvancedResult('stress_profile', { q1: 0 }, 60);
    expect(result.toolId).toBe('stress_profile');
  });

  it('toolId triune_brain usa calculateTriuneBrainResult', () => {
    const result = calculateAdvancedResult('triune_brain', { q1: 1 }, 60);
    expect(result.toolId).toBe('triune_brain');
  });

  it('toolId desconhecido retorna fallback', () => {
    const result = calculateAdvancedResult('unknown', { q1: 1 }, 60);
    expect(result.toolId).toBe('unknown');
    expect(result.primaryProfile).toBe('');
  });
});

describe('extractDISCFromResults', () => {
  it('extrai perfil DISC de resultados', () => {
    const results = [
      { toolId: 'disc', primaryProfile: 'D', completedAt: '', timeSpent: 0, scores: {}, rawAnswers: {} },
    ];
    expect(extractDISCFromResults(results)).toBe('D');
  });

  it('retorna undefined quando não há DISC', () => {
    const results = [
      { toolId: 'mbti', primaryProfile: 'INTJ', completedAt: '', timeSpent: 0, scores: {}, rawAnswers: {} },
    ];
    expect(extractDISCFromResults(results)).toBeUndefined();
  });

  it('retorna undefined para array vazio', () => {
    expect(extractDISCFromResults([])).toBeUndefined();
  });
});
