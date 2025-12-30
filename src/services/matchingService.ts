/**
 * Matching Service
 * Serviço de match entre candidatos e vagas usando algoritmo de pontuação
 */

import type { ParsedResume, MatchResult, Skill } from "@/types/resumeParser";

// Tipos para compatibilidade com testes e uso geral
export interface CandidateProfile {
  id?: string;
  skills: string[] | Skill[];
  experience?: number | ParsedResume["experience"];
  education?: string | ParsedResume["education"];
  location?: string;
  salaryExpectation?: number;
}

export interface JobRequirements {
  requiredSkills: string[] | Array<{ name: string; weight?: number }>;
  preferredSkills?: string[];
  minExperience?: number;
  minExperienceYears?: number;
  requiredEducation?: string;
  location?: string;
  salaryRange?: { min: number; max: number };
}

export interface MatchInsights {
  strengths: string[];
  gaps: string[];
  recommendations?: string[];
  overallFit: 'excellent' | 'good' | 'moderate' | 'poor';
}

export interface RankedCandidate extends CandidateProfile {
  score: number;
  rank: number;
  insights?: MatchInsights;
}

class MatchingService {
  private readonly WEIGHTS = {
    skills: 0.35,
    experience: 0.30,
    education: 0.15,
    location: 0.10,
    salary: 0.10,
  };

  /**
   * Calcula match entre candidato e vaga
   * Suporta tanto o formato ParsedResume quanto formato simplificado
   */
  async calculateMatch(
    candidate: CandidateProfile | ParsedResume,
    job: JobRequirements
  ): Promise<number> {
    const normalizedCandidate = this.normalizeCandidate(candidate);
    const normalizedJob = this.normalizeJob(job);

    const skillsMatch = this.calculateSkillsMatch(normalizedCandidate.skills, normalizedJob);
    const experienceMatch = this.calculateExperienceMatch(
      normalizedCandidate.experience,
      normalizedJob.minExperience
    );
    const educationMatch = this.calculateEducationMatch(
      normalizedCandidate.education,
      normalizedJob.requiredEducation
    );
    const locationMatch = this.calculateLocationMatch(
      normalizedCandidate.location,
      normalizedJob.location
    );

    const score = Math.round(
      skillsMatch * this.WEIGHTS.skills +
      experienceMatch * this.WEIGHTS.experience +
      educationMatch * this.WEIGHTS.education +
      locationMatch * this.WEIGHTS.location +
      100 * this.WEIGHTS.salary // Default salary match
    );

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calcula match completo com breakdown (compatível com ParsedResume)
   */
  calculateMatchFull(resume: ParsedResume, job: JobRequirements): MatchResult {
    const normalizedJob = this.normalizeJob(job);
    
    const skillsMatch = this.calculateSkillsMatchFromParsed(resume.skills, normalizedJob);
    const experienceMatch = this.calculateExperienceMatchFromParsed(
      resume.experience,
      normalizedJob.minExperience
    );
    const educationMatch = this.calculateEducationMatchFromParsed(
      resume.education,
      normalizedJob.requiredEducation
    );
    const locationMatch = this.calculateLocationMatch(resume.location, normalizedJob.location);
    const salaryMatch = 100;

    const score = Math.round(
      skillsMatch * this.WEIGHTS.skills +
      experienceMatch * this.WEIGHTS.experience +
      educationMatch * this.WEIGHTS.education +
      locationMatch * this.WEIGHTS.location +
      salaryMatch * this.WEIGHTS.salary
    );

    const highlights = this.getHighlights(resume, normalizedJob);
    const gaps = this.getGaps(resume, normalizedJob);

    return {
      score: Math.min(100, Math.max(0, score)),
      breakdown: { skillsMatch, experienceMatch, educationMatch, locationMatch, salaryMatch },
      highlights,
      gaps,
      recommendation: score >= 75 ? "strong" : score >= 50 ? "moderate" : "weak",
    };
  }

  /**
   * Ranqueia candidatos por score de match
   */
  async rankCandidates(
    candidates: CandidateProfile[],
    job: JobRequirements
  ): Promise<RankedCandidate[]> {
    const rankedCandidates = await Promise.all(
      candidates.map(async (candidate) => {
        const score = await this.calculateMatch(candidate, job);
        const insights = await this.getInsights(candidate, job);
        return {
          ...candidate,
          score,
          insights,
          rank: 0,
        };
      })
    );

    // Sort by score descending and assign ranks
    rankedCandidates.sort((a, b) => b.score - a.score);
    rankedCandidates.forEach((c, index) => {
      c.rank = index + 1;
    });

    return rankedCandidates;
  }

  /**
   * Obtém insights sobre o match entre candidato e vaga
   */
  async getInsights(
    candidate: CandidateProfile | ParsedResume,
    job: JobRequirements
  ): Promise<MatchInsights> {
    const normalizedCandidate = this.normalizeCandidate(candidate);
    const normalizedJob = this.normalizeJob(job);

    const candidateSkills = normalizedCandidate.skills.map(s => s.toLowerCase());
    const requiredSkills = normalizedJob.requiredSkillNames;

    const strengths: string[] = [];
    const gaps: string[] = [];

    // Identificar skills que o candidato possui
    requiredSkills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      if (candidateSkills.some(cs => cs.includes(skillLower) || skillLower.includes(cs))) {
        strengths.push(skill);
      } else {
        gaps.push(skill);
      }
    });

    // Adicionar experiência como força se suficiente
    if (normalizedCandidate.experience >= normalizedJob.minExperience) {
      strengths.push(`${normalizedCandidate.experience} anos de experiência`);
    }

    const score = await this.calculateMatch(candidate, job);
    const overallFit: MatchInsights['overallFit'] = 
      score >= 80 ? 'excellent' :
      score >= 60 ? 'good' :
      score >= 40 ? 'moderate' : 'poor';

    return {
      strengths,
      gaps,
      recommendations: gaps.length > 0 
        ? [`Desenvolver conhecimento em: ${gaps.slice(0, 3).join(', ')}`] 
        : [],
      overallFit,
    };
  }

  // === Métodos privados de normalização ===

  private normalizeCandidate(candidate: CandidateProfile | ParsedResume): {
    skills: string[];
    experience: number;
    education: string;
    location?: string;
  } {
    // Verificar se é ParsedResume
    if ('personalInfo' in candidate) {
      const parsed = candidate as ParsedResume;
      return {
        skills: parsed.skills.map(s => s.name),
        experience: this.calculateTotalYears(parsed.experience),
        education: parsed.education[0]?.degree ?? '',
        location: parsed.location,
      };
    }

    // É CandidateProfile
    const profile = candidate as CandidateProfile;
    const skills = Array.isArray(profile.skills)
      ? profile.skills.map(s => typeof s === 'string' ? s : s.name)
      : [];

    const experience = typeof profile.experience === 'number'
      ? profile.experience
      : Array.isArray(profile.experience)
        ? this.calculateTotalYears(profile.experience)
        : 0;

    const education = typeof profile.education === 'string'
      ? profile.education
      : Array.isArray(profile.education)
        ? profile.education[0]?.degree ?? ''
        : '';

    return { skills, experience, education, location: profile.location };
  }

  private normalizeJob(job: JobRequirements): {
    requiredSkillNames: string[];
    requiredSkillWeights: Map<string, number>;
    preferredSkills: string[];
    minExperience: number;
    requiredEducation?: string;
    location?: string;
  } {
    const requiredSkillNames: string[] = [];
    const requiredSkillWeights = new Map<string, number>();

    if (Array.isArray(job.requiredSkills)) {
      job.requiredSkills.forEach(skill => {
        if (typeof skill === 'string') {
          requiredSkillNames.push(skill);
          requiredSkillWeights.set(skill.toLowerCase(), 1);
        } else {
          requiredSkillNames.push(skill.name);
          requiredSkillWeights.set(skill.name.toLowerCase(), skill.weight ?? 1);
        }
      });
    }

    return {
      requiredSkillNames,
      requiredSkillWeights,
      preferredSkills: job.preferredSkills ?? [],
      minExperience: job.minExperience ?? job.minExperienceYears ?? 0,
      requiredEducation: job.requiredEducation,
      location: job.location,
    };
  }

  // === Métodos de cálculo ===

  private calculateSkillsMatch(
    candidateSkills: string[],
    job: ReturnType<typeof this.normalizeJob>
  ): number {
    if (job.requiredSkillNames.length === 0) return 100;

    const candidateSkillsLower = candidateSkills.map(s => s.toLowerCase());
    let totalWeight = 0;
    let matchedWeight = 0;

    job.requiredSkillNames.forEach(skill => {
      const skillLower = skill.toLowerCase();
      const weight = job.requiredSkillWeights.get(skillLower) ?? 1;
      totalWeight += weight;

      if (candidateSkillsLower.some(cs => cs.includes(skillLower) || skillLower.includes(cs))) {
        matchedWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 100;
  }

  private calculateSkillsMatchFromParsed(
    skills: Skill[],
    job: ReturnType<typeof this.normalizeJob>
  ): number {
    return this.calculateSkillsMatch(skills.map(s => s.name), job);
  }

  private calculateExperienceMatch(candidateExp: number, requiredExp: number): number {
    if (requiredExp === 0) return 100;
    if (candidateExp >= requiredExp) return 100;
    if (candidateExp >= requiredExp * 0.7) return 75;
    if (candidateExp >= requiredExp * 0.5) return 50;
    return 25;
  }

  private calculateExperienceMatchFromParsed(
    experience: ParsedResume["experience"],
    requiredExp: number
  ): number {
    const totalYears = this.calculateTotalYears(experience);
    return this.calculateExperienceMatch(totalYears, requiredExp);
  }

  private calculateEducationMatch(candidateEdu: string, requiredEdu?: string): number {
    if (!requiredEdu) return 100;
    if (!candidateEdu) return 0;
    
    const eduLower = candidateEdu.toLowerCase();
    const requiredLower = requiredEdu.toLowerCase();
    
    if (eduLower.includes(requiredLower) || requiredLower.includes(eduLower)) return 100;
    if (eduLower.length > 0) return 50;
    return 0;
  }

  private calculateEducationMatchFromParsed(
    education: ParsedResume["education"],
    requiredEdu?: string
  ): number {
    const degrees = education.map(e => e.degree).filter(Boolean);
    if (degrees.length === 0) return requiredEdu ? 0 : 100;
    return this.calculateEducationMatch(degrees[0], requiredEdu);
  }

  private calculateLocationMatch(candidateLoc?: string, jobLoc?: string): number {
    if (!jobLoc || !candidateLoc) return 100;
    if (jobLoc.toLowerCase() === "remoto") return 100;
    return candidateLoc.toLowerCase().includes(jobLoc.toLowerCase()) ? 100 : 50;
  }

  private calculateTotalYears(experience: ParsedResume["experience"]): number {
    return experience.reduce((acc, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : new Date(exp.endDate || new Date());
      const years = (end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      return acc + Math.max(0, years);
    }, 0);
  }

  private getHighlights(resume: ParsedResume, job: ReturnType<typeof this.normalizeJob>): string[] {
    const highlights: string[] = [];
    const candidateSkills = resume.skills.map(s => s.name.toLowerCase());

    job.requiredSkillNames.forEach(skill => {
      if (candidateSkills.some(cs => cs.includes(skill.toLowerCase()))) {
        highlights.push(`✓ Possui ${skill}`);
      }
    });

    const seniorSkills = resume.skills.filter(s => s.level === "expert" || s.level === "advanced");
    if (seniorSkills.length > 0) {
      highlights.push(`✓ Especialista em ${seniorSkills.slice(0, 3).map(s => s.name).join(", ")}`);
    }

    return highlights.slice(0, 5);
  }

  private getGaps(resume: ParsedResume, job: ReturnType<typeof this.normalizeJob>): string[] {
    const gaps: string[] = [];
    const candidateSkills = resume.skills.map(s => s.name.toLowerCase());

    job.requiredSkillNames.forEach(skill => {
      if (!candidateSkills.some(cs => cs.includes(skill.toLowerCase()))) {
        gaps.push(`✗ Não possui ${skill}`);
      }
    });

    return gaps.slice(0, 5);
  }
}

export const matchingService = new MatchingService();
