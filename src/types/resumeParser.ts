export interface ParsedResume {
  // Dados pessoais
  name: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
  
  // Resumo profissional
  summary?: string;
  
  // Experiência
  experience: WorkExperience[];
  
  // Educação
  education: Education[];
  
  // Skills
  skills: Skill[];
  
  // Certificações
  certifications: Certification[];
  
  // Idiomas
  languages: Language[];
  
  // Metadados
  rawText: string;
  confidence: number;
  warnings: string[];
  parsedAt: string;
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
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
}

export interface Skill {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience?: number;
  category?: "technical" | "soft" | "language" | "tool";
}

export interface Certification {
  name: string;
  issuer: string;
  date?: string;
  expirationDate?: string;
  credentialId?: string;
}

export interface Language {
  language: string;
  proficiency: "basic" | "intermediate" | "advanced" | "fluent" | "native";
}

export interface MatchResult {
  score: number;
  breakdown: {
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
    locationMatch: number;
    salaryMatch: number;
  };
  highlights: string[];
  gaps: string[];
  recommendation: "strong" | "moderate" | "weak";
}
