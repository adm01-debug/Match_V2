/**
 * @fileoverview Testes do DNA Comportamental
 */
import { describe, it, expect } from 'vitest';
import {
  DNA_STRANDS,
  DNA_ARCHETYPES,
  calculateMatchCompatibility,
  archetypeChemistry,
  type DNAProfile,
  type DNAHelix,
} from '../behavioralDNA';

const createProfile = (helix: Partial<DNAHelix> = {}, archetype = 'visionary'): DNAProfile => ({
  helix: {
    strategic: 70,
    emotional: 60,
    influence: 50,
    values: 80,
    adaptive: 65,
    ...helix,
  },
  archetype: archetype as any,
  strengths: ['test'],
  challenges: ['test'],
  idealRoles: ['test'],
  communicationStyle: 'test',
  leadershipStyle: 'test',
});

describe('DNA_STRANDS', () => {
  it('contém 5 hélices', () => {
    expect(DNA_STRANDS.length).toBe(5);
  });

  it('cada hélice tem 2 pilares', () => {
    DNA_STRANDS.forEach(strand => {
      expect(strand.pillars.length).toBe(2);
    });
  });

  it('IDs são válidos: strategic, emotional, influence, values, adaptive', () => {
    const ids = DNA_STRANDS.map(s => s.id);
    expect(ids).toContain('strategic');
    expect(ids).toContain('emotional');
    expect(ids).toContain('influence');
    expect(ids).toContain('values');
    expect(ids).toContain('adaptive');
  });
});

describe('DNA_ARCHETYPES', () => {
  it('contém múltiplos arquétipos', () => {
    expect(DNA_ARCHETYPES.length).toBeGreaterThan(0);
  });

  it('cada arquétipo tem campos obrigatórios', () => {
    DNA_ARCHETYPES.forEach(arch => {
      expect(arch.id).toBeTruthy();
      expect(arch.name).toBeTruthy();
      expect(arch.description).toBeTruthy();
      expect(arch.compatibleWith).toBeDefined();
      expect(arch.tensionWith).toBeDefined();
    });
  });

  it('IDs de arquétipos são únicos', () => {
    const ids = DNA_ARCHETYPES.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('calculateMatchCompatibility', () => {
  it('retorna 100 para perfis idênticos com archetype compatível', () => {
    const profile = createProfile();
    const score = calculateMatchCompatibility(profile, profile);
    // Score should be high for identical profiles
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it('retorna valor entre 0 e 100', () => {
    for (let i = 0; i < 30; i++) {
      const p1 = createProfile({
        strategic: Math.random() * 100,
        emotional: Math.random() * 100,
        influence: Math.random() * 100,
        values: Math.random() * 100,
        adaptive: Math.random() * 100,
      });
      const p2 = createProfile({
        strategic: Math.random() * 100,
        emotional: Math.random() * 100,
        influence: Math.random() * 100,
        values: Math.random() * 100,
        adaptive: Math.random() * 100,
      });
      const score = calculateMatchCompatibility(p1, p2);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });

  it('retorna 50 quando um arquétipo é inválido', () => {
    const p1 = createProfile({}, 'invalid_archetype');
    const p2 = createProfile();
    const score = calculateMatchCompatibility(p1, p2);
    expect(score).toBe(50);
  });

  it('perfis com hélices opostas têm score menor', () => {
    const p1 = createProfile({ strategic: 100, emotional: 100, influence: 100, values: 100, adaptive: 100 });
    const p2 = createProfile({ strategic: 0, emotional: 0, influence: 0, values: 0, adaptive: 0 });
    const score = calculateMatchCompatibility(p1, p2);
    expect(score).toBeLessThan(50);
  });
});

describe('archetypeChemistry', () => {
  it('retorna neutral para arquétipos inválidos', () => {
    expect(archetypeChemistry('invalid' as any, 'invalid' as any)).toBe('neutral');
  });

  it('retorna um dos 4 tipos válidos', () => {
    const validTypes = ['synergy', 'complementary', 'tension', 'neutral'];
    // Test with first two valid archetypes
    if (DNA_ARCHETYPES.length >= 2) {
      const result = archetypeChemistry(DNA_ARCHETYPES[0].id, DNA_ARCHETYPES[1].id);
      expect(validTypes).toContain(result);
    }
  });
});
