export interface JobBoardIntegration {
  id: string;
  name: string;
  logo: string;
  isConnected: boolean;
  lastSync?: string;
}

export interface JobPosting {
  vagaId: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  salaryRange?: { min: number; max: number };
  employmentType: "full-time" | "part-time" | "contract" | "internship";
  remoteOption: boolean;
  expirationDate?: string;
}

export interface PublishResult {
  success: boolean;
  externalId?: string;
  url?: string;
  error?: string;
}

export interface JobBoardStats {
  views: number;
  applications: number;
  clicks: number;
  conversionRate: number;
}

export interface JobBoardConfig {
  apiKey?: string;
  apiSecret?: string;
  accountId?: string;
  webhookUrl?: string;
  isEnabled: boolean;
}

export const JOB_BOARDS: JobBoardIntegration[] = [
  { id: "linkedin", name: "LinkedIn Jobs", logo: "/logos/linkedin.svg", isConnected: false },
  { id: "indeed", name: "Indeed", logo: "/logos/indeed.svg", isConnected: false },
  { id: "catho", name: "Catho", logo: "/logos/catho.svg", isConnected: false },
  { id: "vagas", name: "Vagas.com.br", logo: "/logos/vagas.svg", isConnected: false },
  { id: "infojobs", name: "InfoJobs", logo: "/logos/infojobs.svg", isConnected: false },
  { id: "glassdoor", name: "Glassdoor", logo: "/logos/glassdoor.svg", isConnected: false },
];
