import type { ParsedResume, MatchResult, Skill } from "@/types/resumeParser";

interface JobRequirements {
  requiredSkills: string[];
  preferredSkills: string[];
  minExperienceYears: number;
  requiredEducation?: string;
  location?: string;
  salaryRange?: { min: number; max: number };
}

class MatchingService {
  calculateMatch(resume: ParsedResume, job: JobRequirements): MatchResult {
    const skillsMatch = this.calculateSkillsMatch(resume.skills, job);
    const experienceMatch = this.calculateExperienceMatch(resume.experience, job.minExperienceYears);
    const educationMatch = this.calculateEducationMatch(resume.education, job.requiredEducation);
    const locationMatch = this.calculateLocationMatch(resume.location, job.location);
    const salaryMatch = 100; // Placeholder - precisa de dados de pretensão

    const weights = { skills: 0.35, experience: 0.30, education: 0.15, location: 0.10, salary: 0.10 };
    
    const score = Math.round(
      skillsMatch * weights.skills +
      experienceMatch * weights.experience +
      educationMatch * weights.education +
      locationMatch * weights.location +
      salaryMatch * weights.salary
    );

    const highlights = this.getHighlights(resume, job);
    const gaps = this.getGaps(resume, job);

    return {
      score,
      breakdown: { skillsMatch, experienceMatch, educationMatch, locationMatch, salaryMatch },
      highlights,
      gaps,
      recommendation: score >= 75 ? "strong" : score >= 50 ? "moderate" : "weak",
    };
  }

  private calculateSkillsMatch(skills: Skill[], job: JobRequirements): number {
    const candidateSkills = skills.map(s => s.name.toLowerCase());
    const requiredMatches = job.requiredSkills.filter(s => 
      candidateSkills.some(cs => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs))
    ).length;
    const preferredMatches = job.preferredSkills.filter(s =>
      candidateSkills.some(cs => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs))
    ).length;

    const requiredScore = job.requiredSkills.length > 0 
      ? (requiredMatches / job.requiredSkills.length) * 70 
      : 70;
    const preferredScore = job.preferredSkills.length > 0 
      ? (preferredMatches / job.preferredSkills.length) * 30 
      : 30;

    return Math.round(requiredScore + preferredScore);
  }

  private calculateExperienceMatch(experience: ParsedResume["experience"], minYears: number): number {
    const totalYears = experience.reduce((acc, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : new Date(exp.endDate || new Date());
      return acc + (end.getFullYear() - start.getFullYear());
    }, 0);

    if (totalYears >= minYears) return 100;
    if (totalYears >= minYears * 0.7) return 75;
    if (totalYears >= minYears * 0.5) return 50;
    return 25;
  }

  private calculateEducationMatch(education: ParsedResume["education"], required?: string): number {
    if (!required) return 100;
    const degrees = education.map(e => e.degree.toLowerCase());
    const requiredLower = required.toLowerCase();
    
    if (degrees.some(d => d.includes(requiredLower))) return 100;
    if (degrees.length > 0) return 50;
    return 0;
  }

  private calculateLocationMatch(candidateLocation?: string, jobLocation?: string): number {
    if (!jobLocation || !candidateLocation) return 100;
    if (jobLocation.toLowerCase() === "remoto") return 100;
    return candidateLocation.toLowerCase().includes(jobLocation.toLowerCase()) ? 100 : 50;
  }

  private getHighlights(resume: ParsedResume, job: JobRequirements): string[] {
    const highlights: string[] = [];
    const candidateSkills = resume.skills.map(s => s.name.toLowerCase());
    
    job.requiredSkills.forEach(skill => {
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

  private getGaps(resume: ParsedResume, job: JobRequirements): string[] {
    const gaps: string[] = [];
    const candidateSkills = resume.skills.map(s => s.name.toLowerCase());
    
    job.requiredSkills.forEach(skill => {
      if (!candidateSkills.some(cs => cs.includes(skill.toLowerCase()))) {
        gaps.push(`✗ Não possui ${skill}`);
      }
    });

    return gaps.slice(0, 5);
  }
}

export const matchingService = new MatchingService();
