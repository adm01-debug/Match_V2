/**
 * Types for resume parsing and matching
 */

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
  github?: string;
  website?: string;
}

export interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  skills: string[];
  location?: string;
  highlights?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate?: string;
  endDate?: string;
  year?: string;
  gpa?: string;
  honors?: string[];
}

export interface Skill {
  name: string;
  level?: SkillLevel;
  yearsOfExperience?: number;
  category?: SkillCategory;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillCategory = 'technical' | 'soft' | 'language' | 'tool' | 'framework';

export interface Certification {
  name: string;
  issuer: string;
  date?: string;
  year?: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Language {
  name: string;
  language?: string; // Alias for backwards compatibility
  level?: string;
  proficiency?: LanguageProficiency;
}

export type LanguageProficiency = 'basic' | 'intermediate' | 'advanced' | 'fluent' | 'native';

export interface ParsedResume {
  // Personal info - structured for components
  personalInfo: PersonalInfo;
  
  // Legacy flat fields for backwards compatibility
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
  
  // Summary
  summary?: string;
  objective?: string;
  
  // Experience
  experience: WorkExperience[];
  
  // Education
  education: Education[];
  
  // Skills - can be string[] or Skill[] for flexibility
  skills: (string | Skill)[];
  
  // Certifications
  certifications?: Certification[];
  
  // Languages
  languages?: Language[];
  
  // Projects
  projects?: Project[];
  
  // Metadata
  rawText?: string;
  confidence: number;
  warnings?: string[];
  parsedAt?: string;
  parserVersion?: string;
}

export interface Project {
  name: string;
  description?: string;
  technologies?: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
  highlights?: string[];
}

export interface MatchResult {
  score: number;
  breakdown: MatchBreakdown;
  highlights: string[];
  gaps: string[];
  recommendation: MatchRecommendation;
  details?: MatchDetails;
}

export interface MatchBreakdown {
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  locationMatch?: number;
  salaryMatch?: number;
  languageMatch?: number;
}

export type MatchRecommendation = 'strong' | 'moderate' | 'weak' | 'excellent';

export interface MatchDetails {
  matchedSkills: string[];
  missingSkills: string[];
  experienceYears: number;
  requiredExperience: number;
  educationLevel: string;
  requiredEducation: string;
}

// Helper function to normalize ParsedResume
export function normalizeResume(resume: Partial<ParsedResume>): ParsedResume {
  const personalInfo: PersonalInfo = resume.personalInfo ?? {
    name: resume.name ?? '',
    email: resume.email ?? '',
    phone: resume.phone ?? '',
    location: resume.location,
    linkedin: resume.linkedin,
    portfolio: resume.portfolio,
  };

  return {
    personalInfo,
    name: personalInfo.name,
    email: personalInfo.email,
    phone: personalInfo.phone,
    location: personalInfo.location,
    linkedin: personalInfo.linkedin,
    portfolio: personalInfo.portfolio,
    summary: resume.summary,
    objective: resume.objective,
    experience: resume.experience ?? [],
    education: resume.education ?? [],
    skills: resume.skills ?? [],
    certifications: resume.certifications ?? [],
    languages: resume.languages ?? [],
    projects: resume.projects ?? [],
    rawText: resume.rawText,
    confidence: resume.confidence ?? 0,
    warnings: resume.warnings ?? [],
    parsedAt: resume.parsedAt ?? new Date().toISOString(),
  };
}

// Type guard for Skill
export function isSkillObject(skill: string | Skill): skill is Skill {
  return typeof skill === 'object' && 'name' in skill;
}

// Get skill name from string or Skill object
export function getSkillName(skill: string | Skill): string {
  return isSkillObject(skill) ? skill.name : skill;
}
