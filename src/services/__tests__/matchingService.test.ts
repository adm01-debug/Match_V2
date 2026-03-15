/**
 * @fileoverview Testes do matchingService
 */
import { describe, it, expect } from 'vitest';
import { matchingService } from '../matchingService';

describe('matchingService.calculateSkillMatch', () => {
  it('retorna 100 quando todos os skills batem', () => {
    const result = matchingService.calculateSkillMatch(
      ['React', 'TypeScript', 'Node.js'],
      ['React', 'TypeScript', 'Node.js']
    );
    expect(result.score).toBe(100);
    expect(result.missing.length).toBe(0);
  });

  it('retorna 0 quando nenhum skill bate', () => {
    const result = matchingService.calculateSkillMatch(
      ['Python', 'Django'],
      ['React', 'TypeScript']
    );
    expect(result.score).toBe(0);
    expect(result.missing.length).toBe(2);
  });

  it('calcula score parcial corretamente', () => {
    const result = matchingService.calculateSkillMatch(
      ['React', 'CSS'],
      ['React', 'TypeScript', 'Node.js', 'CSS']
    );
    expect(result.score).toBe(50); // 2/4
    expect(result.matched).toEqual(['react', 'css']);
    expect(result.missing).toEqual(['typescript', 'node.js']);
  });

  it('retorna 100 quando job não tem requisitos', () => {
    const result = matchingService.calculateSkillMatch(['React', 'Node'], []);
    expect(result.score).toBe(100);
    expect(result.extra.length).toBe(2);
  });

  it('é case-insensitive', () => {
    const result = matchingService.calculateSkillMatch(
      ['react', 'TYPESCRIPT'],
      ['React', 'TypeScript']
    );
    expect(result.score).toBe(100);
  });

  it('ignora espaços extras', () => {
    const result = matchingService.calculateSkillMatch(
      [' React ', ' Node.js '],
      ['React', 'Node.js']
    );
    expect(result.score).toBe(100);
  });

  it('identifica skills extras do candidato', () => {
    const result = matchingService.calculateSkillMatch(
      ['React', 'TypeScript', 'Go', 'Rust'],
      ['React']
    );
    expect(result.extra).toEqual(expect.arrayContaining(['typescript', 'go', 'rust']));
  });

  // Stress: muitos skills
  it('lida com 50 skills', () => {
    const candidateSkills = Array.from({ length: 50 }, (_, i) => `skill_${i}`);
    const jobSkills = Array.from({ length: 25 }, (_, i) => `skill_${i}`);
    const result = matchingService.calculateSkillMatch(candidateSkills, jobSkills);
    expect(result.score).toBe(100);
    expect(result.extra.length).toBe(25);
  });
});

describe('matchingService.getRecommendation', () => {
  it('retorna "Forte Recomendação" para score >= 80', () => {
    expect(matchingService.getRecommendation(80)).toBe('Forte Recomendação');
    expect(matchingService.getRecommendation(95)).toBe('Forte Recomendação');
    expect(matchingService.getRecommendation(100)).toBe('Forte Recomendação');
  });

  it('retorna "Recomendado" para score 60-79', () => {
    expect(matchingService.getRecommendation(60)).toBe('Recomendado');
    expect(matchingService.getRecommendation(79)).toBe('Recomendado');
  });

  it('retorna "Moderado" para score 40-59', () => {
    expect(matchingService.getRecommendation(40)).toBe('Moderado');
    expect(matchingService.getRecommendation(59)).toBe('Moderado');
  });

  it('retorna "Baixa Compatibilidade" para score < 40', () => {
    expect(matchingService.getRecommendation(39)).toBe('Baixa Compatibilidade');
    expect(matchingService.getRecommendation(0)).toBe('Baixa Compatibilidade');
  });

  // Stress: todos os valores 0-100
  it('nunca retorna string vazia para qualquer score 0-100', () => {
    for (let i = 0; i <= 100; i++) {
      expect(matchingService.getRecommendation(i).length).toBeGreaterThan(0);
    }
  });
});
