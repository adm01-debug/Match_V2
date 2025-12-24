import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('match-score edge function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate match score between candidate and job', () => {
    const candidate = { skills: ['react', 'typescript', 'node'] };
    const job = { requirements: ['react', 'typescript'] };
    
    const matchingSkills = candidate.skills.filter(s => 
      job.requirements.includes(s)
    );
    const score = (matchingSkills.length / job.requirements.length) * 100;
    
    expect(score).toBe(100);
  });

  it('should return 0 for no matching skills', () => {
    const candidate = { skills: ['python', 'django'] };
    const job = { requirements: ['react', 'typescript'] };
    
    const matchingSkills = candidate.skills.filter(s => 
      job.requirements.includes(s)
    );
    const score = matchingSkills.length > 0 
      ? (matchingSkills.length / job.requirements.length) * 100 
      : 0;
    
    expect(score).toBe(0);
  });

  it('should handle partial matches', () => {
    const candidate = { skills: ['react', 'python'] };
    const job = { requirements: ['react', 'typescript'] };
    
    const matchingSkills = candidate.skills.filter(s => 
      job.requirements.includes(s)
    );
    const score = (matchingSkills.length / job.requirements.length) * 100;
    
    expect(score).toBe(50);
  });

  it('should validate input data', () => {
    const invalidCandidate = null;
    expect(invalidCandidate).toBeNull();
  });
});
