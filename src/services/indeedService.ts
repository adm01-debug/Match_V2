/**
 * Indeed Brasil Integration Service
 * API para publicação de vagas e sincronização de candidatos
 */

import { createContextLogger } from './logger';

const log = createContextLogger('IndeedService');

export interface IndeedJobPosting {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: { min?: number; max?: number; currency?: string; period?: string };
  jobType: 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship';
  remoteType?: 'remote' | 'hybrid' | 'on-site';
  requirements?: string[];
  benefits?: string[];
  applicationUrl?: string;
  externalId?: string;
}

export interface IndeedCandidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  appliedAt: Date;
  source: 'indeed';
  jobId: string;
}

export interface IndeedJobMetrics {
  jobId: string;
  views: number;
  applications: number;
  clicks: number;
  impressions: number;
  ctr: number;
  conversionRate: number;
}

export interface IndeedConfig {
  apiKey: string;
  employerId: string;
  baseUrl?: string;
}

export interface IndeedApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

class IndeedServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'INDEED_ERROR',
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'IndeedServiceError';
  }
}

class IndeedService {
  private config: IndeedConfig | null = null;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  configure(config: IndeedConfig): void {
    if (!config.apiKey?.trim()) {
      throw new IndeedServiceError('API Key é obrigatória', 'INVALID_CONFIG');
    }
    if (!config.employerId?.trim()) {
      throw new IndeedServiceError('Employer ID é obrigatório', 'INVALID_CONFIG');
    }
    this.config = config;
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  private ensureConfigured(): void {
    if (!this.config) {
      throw new IndeedServiceError('Indeed service não configurado', 'NOT_CONFIGURED');
    }
  }

  private validateJobPosting(job: IndeedJobPosting): void {
    if (!job.title?.trim()) {
      throw new IndeedServiceError('Título da vaga é obrigatório', 'VALIDATION_ERROR');
    }
    if (!job.description?.trim()) {
      throw new IndeedServiceError('Descrição da vaga é obrigatória', 'VALIDATION_ERROR');
    }
    if (!job.company?.trim()) {
      throw new IndeedServiceError('Nome da empresa é obrigatório', 'VALIDATION_ERROR');
    }
    if (!job.location?.trim()) {
      throw new IndeedServiceError('Localização é obrigatória', 'VALIDATION_ERROR');
    }
    if (job.salary) {
      if (job.salary.min !== undefined && job.salary.min < 0) {
        throw new IndeedServiceError('Salário mínimo não pode ser negativo', 'VALIDATION_ERROR');
      }
      if (job.salary.max !== undefined && job.salary.min !== undefined && job.salary.max < job.salary.min) {
        throw new IndeedServiceError('Salário máximo deve ser maior que o mínimo', 'VALIDATION_ERROR');
      }
    }
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    retries = this.MAX_RETRIES
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`[IndeedService] Attempt ${attempt}/${retries} failed:`, lastError.message);
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt));
        }
      }
    }
    
    throw lastError;
  }

  async publishJob(job: IndeedJobPosting): Promise<{ jobId: string; url: string }> {
    this.ensureConfigured();
    this.validateJobPosting(job);

    const payload = {
      title: job.title.trim(),
      description: job.description.trim(),
      company: job.company.trim(),
      location: job.location.trim(),
      salary: job.salary ? {
        minimumValue: job.salary.min,
        maximumValue: job.salary.max,
        currencyCode: job.salary.currency || 'BRL',
        unitText: job.salary.period || 'MONTH',
      } : undefined,
      employmentType: job.jobType.toUpperCase().replace('-', '_'),
      jobLocationType: job.remoteType?.toUpperCase(),
      requirements: job.requirements?.filter(r => r.trim()),
      benefits: job.benefits?.filter(b => b.trim()),
      applicationUrl: job.applicationUrl?.trim(),
      clientJobId: job.externalId?.trim(),
    };

    return this.withRetry(async () => {
      // Simulação - em produção, fazer requisição real
      log.debug('Publishing job:', payload);
      
      const mockJobId = `indeed-${Date.now()}`;
      return {
        jobId: mockJobId,
        url: `https://br.indeed.com/viewjob?jk=${mockJobId}`,
      };
    });
  }

  async updateJob(jobId: string, updates: Partial<IndeedJobPosting>): Promise<void> {
    this.ensureConfigured();
    
    if (!jobId?.trim()) {
      throw new IndeedServiceError('Job ID é obrigatório', 'VALIDATION_ERROR');
    }

    return this.withRetry(async () => {
      log.debug('Updating job:', { jobId, updates });
    });
  }

  async closeJob(jobId: string): Promise<void> {
    this.ensureConfigured();
    
    if (!jobId?.trim()) {
      throw new IndeedServiceError('Job ID é obrigatório', 'VALIDATION_ERROR');
    }

    return this.withRetry(async () => {
      log.debug('Closing job:', jobId);
    });
  }

  async getJobMetrics(jobId: string): Promise<IndeedJobMetrics> {
    this.ensureConfigured();
    
    if (!jobId?.trim()) {
      throw new IndeedServiceError('Job ID é obrigatório', 'VALIDATION_ERROR');
    }

    return this.withRetry(async () => {
      // Simulação de métricas
      return {
        jobId,
        views: Math.floor(Math.random() * 1000),
        applications: Math.floor(Math.random() * 50),
        clicks: Math.floor(Math.random() * 200),
        impressions: Math.floor(Math.random() * 5000),
        ctr: Math.round(Math.random() * 500) / 100,
        conversionRate: Math.round(Math.random() * 1000) / 100,
      };
    });
  }

  async getCandidates(jobId: string): Promise<IndeedCandidate[]> {
    this.ensureConfigured();
    
    if (!jobId?.trim()) {
      throw new IndeedServiceError('Job ID é obrigatório', 'VALIDATION_ERROR');
    }

    return this.withRetry(async () => {
      log.debug('Getting candidates for job:', jobId);
      return [];
    });
  }

  async syncCandidates(since?: Date): Promise<IndeedCandidate[]> {
    this.ensureConfigured();
    
    return this.withRetry(async () => {
      log.debug('Syncing candidates since:', since?.toISOString() ?? 'beginning');
      return [];
    });
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.config) {
      return { success: false, message: 'Serviço não configurado' };
    }
    
    try {
      log.debug('Testing connection...');
      // Em produção, fazer uma chamada real de teste
      return { success: true, message: 'Conexão estabelecida com sucesso' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('[IndeedService] Connection test failed:', message);
      return { success: false, message };
    }
  }

  disconnect(): void {
    this.config = null;
  }
}

export const indeedService = new IndeedService();
