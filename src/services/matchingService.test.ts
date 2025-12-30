import { describe, it, expect, vi, beforeEach } from 'vitest';
import { matchingService } from './matchingService';

describe('matchingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateMatch', () => {
    it('calculates match score for candidate and job', async () => {
      const candidate = {
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: 5,
        education: 'Bacharelado',
      };
      const job = {
        requiredSkills: ['JavaScript', 'React'],
        minExperience: 3,
        requiredEducation: 'Bacharelado',
      };
      const score = await matchingService.calculateMatch(candidate, job);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('returns higher score for better matches', async () => {
      const perfectMatch = {
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        experience: 10,
        education: 'Mestrado',
      };
      const partialMatch = {
        skills: ['JavaScript'],
        experience: 2,
        education: 'Técnico',
      };
      const job = {
        requiredSkills: ['JavaScript', 'React', 'Node.js'],
        minExperience: 5,
        requiredEducation: 'Bacharelado',
      };
      const perfectScore = await matchingService.calculateMatch(perfectMatch, job);
      const partialScore = await matchingService.calculateMatch(partialMatch, job);
      expect(perfectScore).toBeGreaterThan(partialScore);
    });

    it('considers skill weights', async () => {
      const candidate = { skills: ['Python'], experience: 5 };
      const job = {
        requiredSkills: [
          { name: 'Python', weight: 2 },
          { name: 'SQL', weight: 1 },
        ],
      };
      const score = await matchingService.calculateMatch(candidate, job);
      expect(score).toBeGreaterThan(50);
    });
  });

  describe('rankCandidates', () => {
    it('ranks candidates by match score', async () => {
      const candidates = [
        { id: '1', skills: ['A'], experience: 1 },
        { id: '2', skills: ['A', 'B', 'C'], experience: 5 },
        { id: '3', skills: ['A', 'B'], experience: 3 },
      ];
      const job = { requiredSkills: ['A', 'B', 'C'], minExperience: 3 };
      const ranked = await matchingService.rankCandidates(candidates, job);
      expect(ranked[0].id).toBe('2');
    });

    it('returns scores with rankings', async () => {
      const candidates = [{ id: '1', skills: ['A'] }];
      const job = { requiredSkills: ['A'] };
      const ranked = await matchingService.rankCandidates(candidates, job);
      expect(ranked[0]).toHaveProperty('score');
      expect(ranked[0]).toHaveProperty('rank');
    });
  });

  describe('getInsights', () => {
    it('returns candidate insights', async () => {
      const candidate = { skills: ['JavaScript'], experience: 3 };
      const job = { requiredSkills: ['JavaScript', 'React'], minExperience: 5 };
      const insights = await matchingService.getInsights(candidate, job);
      expect(insights).toHaveProperty('strengths');
      expect(insights).toHaveProperty('gaps');
    });

    it('identifies skill gaps', async () => {
      const candidate = { skills: ['JavaScript'] };
      const job = { requiredSkills: ['JavaScript', 'React', 'Node.js'] };
      const insights = await matchingService.getInsights(candidate, job);
      expect(insights.gaps).toContain('React');
      expect(insights.gaps).toContain('Node.js');
    });
  });
});
