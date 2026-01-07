/**
 * InfoJobs Brasil Integration Service
 * API para publicação de vagas e webhooks de candidatura
 */

import * as crypto from 'crypto';

export interface InfoJobsPosting {
  titulo: string;
  descricao: string;
  empresa: string;
  cidade: string;
  provincia: string;
  pais?: string;
  salarioMin?: number;
  salarioMax?: number;
  tipoContrato: 'INDEFINIDO' | 'TEMPORAL' | 'PRACTICAS' | 'AUTONOMO' | 'OTROS';
  jornadaLaboral: 'COMPLETA' | 'PARCIAL' | 'INDIFERENTE';
  experienciaMinima: 'NO_REQUERIDA' | 'AL_MENOS_1' | 'AL_MENOS_2' | 'AL_MENOS_3' | 'AL_MENOS_5' | 'MAS_DE_5';
  nivelFormativo?: string;
  categorias: string[];
  habilidades?: string[];
  teletrabajoOpciones?: 'PRESENCIAL' | 'TELETRABAJO' | 'HIBRIDO';
}

export interface InfoJobsCandidate {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  provincia: string;
  ciudad: string;
  fechaNacimiento?: string;
  experienciaProfesional?: Array<{
    puesto: string;
    empresa: string;
    fechaInicio: string;
    fechaFin?: string;
    descripcion?: string;
  }>;
  formacion?: Array<{
    titulo: string;
    centro: string;
    fechaFinalizacion: string;
  }>;
  idiomas?: Array<{
    idioma: string;
    nivel: string;
  }>;
  fechaCandidatura: Date;
  estadoCandidatura: InfoJobsCandidateStatus;
}

export type InfoJobsCandidateStatus = 'RECIBIDA' | 'LEIDA' | 'EN_PROCESO' | 'FINALISTA' | 'DESCARTADA' | 'CONTRATADA';

export interface InfoJobsWebhookPayload {
  event: 'NEW_APPLICATION' | 'APPLICATION_UPDATED' | 'JOB_EXPIRED';
  jobId: string;
  candidateId?: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface InfoJobsConfig {
  clientId: string;
  clientSecret: string;
  webhookSecret?: string;
}

class InfoJobsServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'INFOJOBS_ERROR',
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'InfoJobsServiceError';
  }
}

class InfoJobsService {
  private config: InfoJobsConfig | null = null;
  private accessToken: string | null = null;
  private tokenExpiresAt: Date | null = null;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  configure(config: InfoJobsConfig): void {
    if (!config.clientId?.trim()) {
      throw new InfoJobsServiceError('Client ID é obrigatório', 'INVALID_CONFIG');
    }
    if (!config.clientSecret?.trim()) {
      throw new InfoJobsServiceError('Client Secret é obrigatório', 'INVALID_CONFIG');
    }
    this.config = config;
    this.accessToken = null;
    this.tokenExpiresAt = null;
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  private ensureConfigured(): void {
    if (!this.config) {
      throw new InfoJobsServiceError('InfoJobs service não configurado', 'NOT_CONFIGURED');
    }
  }

  private validateJobPosting(job: InfoJobsPosting): void {
    if (!job.titulo?.trim()) {
      throw new InfoJobsServiceError('Título é obrigatório', 'VALIDATION_ERROR');
    }
    if (job.titulo.length > 100) {
      throw new InfoJobsServiceError('Título deve ter no máximo 100 caracteres', 'VALIDATION_ERROR');
    }
    if (!job.descricao?.trim()) {
      throw new InfoJobsServiceError('Descrição é obrigatória', 'VALIDATION_ERROR');
    }
    if (!job.empresa?.trim()) {
      throw new InfoJobsServiceError('Empresa é obrigatória', 'VALIDATION_ERROR');
    }
    if (!job.cidade?.trim()) {
      throw new InfoJobsServiceError('Cidade é obrigatória', 'VALIDATION_ERROR');
    }
    if (!job.provincia?.trim()) {
      throw new InfoJobsServiceError('Província é obrigatória', 'VALIDATION_ERROR');
    }
    if (!job.categorias?.length) {
      throw new InfoJobsServiceError('Pelo menos uma categoria é obrigatória', 'VALIDATION_ERROR');
    }
    if (job.salarioMin !== undefined && job.salarioMin < 0) {
      throw new InfoJobsServiceError('Salário mínimo não pode ser negativo', 'VALIDATION_ERROR');
    }
    if (job.salarioMax !== undefined && job.salarioMin !== undefined && job.salarioMax < job.salarioMin) {
      throw new InfoJobsServiceError('Salário máximo deve ser maior que o mínimo', 'VALIDATION_ERROR');
    }
  }

  private async withRetry<T>(operation: () => Promise<T>, retries = this.MAX_RETRIES): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`[InfoJobsService] Attempt ${attempt}/${retries} failed:`, lastError.message);
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt));
        }
      }
    }
    
    throw lastError;
  }

  private isTokenExpired(): boolean {
    if (!this.tokenExpiresAt) return true;
    return new Date() >= this.tokenExpiresAt;
  }

  private async authenticate(): Promise<string> {
    this.ensureConfigured();
    
    if (this.accessToken && !this.isTokenExpired()) {
      return this.accessToken;
    }
    
    return this.withRetry(async () => {
      console.log('[InfoJobsService] Authenticating...');
      // Em produção, fazer chamada OAuth real
      const mockToken = `ij-token-${Date.now()}`;
      this.accessToken = mockToken;
      this.tokenExpiresAt = new Date(Date.now() + 3600000); // 1 hora
      return mockToken;
    });
  }

  async publishJob(job: InfoJobsPosting): Promise<{ ofertaId: string; url: string }> {
    this.ensureConfigured();
    this.validateJobPosting(job);
    await this.authenticate();
    
    return this.withRetry(async () => {
      console.log('[InfoJobsService] Publishing job:', job.titulo);
      
      const mockId = `ij-${Date.now()}`;
      return {
        ofertaId: mockId,
        url: `https://www.infojobs.com.br/vaga/${mockId}`,
      };
    });
  }

  async updateJob(ofertaId: string, updates: Partial<InfoJobsPosting>): Promise<void> {
    this.ensureConfigured();
    
    if (!ofertaId?.trim()) {
      throw new InfoJobsServiceError('ID da oferta é obrigatório', 'VALIDATION_ERROR');
    }
    
    await this.authenticate();
    
    return this.withRetry(async () => {
      console.log('[InfoJobsService] Updating job:', ofertaId, updates);
    });
  }

  async closeJob(ofertaId: string): Promise<void> {
    this.ensureConfigured();
    
    if (!ofertaId?.trim()) {
      throw new InfoJobsServiceError('ID da oferta é obrigatório', 'VALIDATION_ERROR');
    }
    
    await this.authenticate();
    
    return this.withRetry(async () => {
      console.log('[InfoJobsService] Closing job:', ofertaId);
    });
  }

  async renewJob(ofertaId: string, days = 30): Promise<void> {
    this.ensureConfigured();
    
    if (!ofertaId?.trim()) {
      throw new InfoJobsServiceError('ID da oferta é obrigatório', 'VALIDATION_ERROR');
    }
    if (days < 1 || days > 90) {
      throw new InfoJobsServiceError('Dias de renovação deve ser entre 1 e 90', 'VALIDATION_ERROR');
    }
    
    await this.authenticate();
    
    return this.withRetry(async () => {
      console.log('[InfoJobsService] Renewing job:', ofertaId, 'for', days, 'days');
    });
  }

  async getApplications(ofertaId: string): Promise<InfoJobsCandidate[]> {
    this.ensureConfigured();
    
    if (!ofertaId?.trim()) {
      throw new InfoJobsServiceError('ID da oferta é obrigatório', 'VALIDATION_ERROR');
    }
    
    await this.authenticate();
    
    return this.withRetry(async () => {
      console.log('[InfoJobsService] Getting applications:', ofertaId);
      return [];
    });
  }

  async updateApplicationStatus(
    ofertaId: string, 
    candidatoId: string, 
    status: InfoJobsCandidateStatus
  ): Promise<void> {
    this.ensureConfigured();
    
    if (!ofertaId?.trim()) {
      throw new InfoJobsServiceError('ID da oferta é obrigatório', 'VALIDATION_ERROR');
    }
    if (!candidatoId?.trim()) {
      throw new InfoJobsServiceError('ID do candidato é obrigatório', 'VALIDATION_ERROR');
    }
    
    await this.authenticate();
    
    return this.withRetry(async () => {
      console.log('[InfoJobsService] Updating status:', ofertaId, candidatoId, status);
    });
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config?.webhookSecret) {
      console.warn('[InfoJobsService] Webhook secret not configured');
      return false;
    }
    
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(payload)
        .digest('hex');
      
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('[InfoJobsService] Signature verification error:', error);
      return false;
    }
  }

  parseWebhook(payload: InfoJobsWebhookPayload): { event: string; data: unknown } {
    if (!payload?.event) {
      throw new InfoJobsServiceError('Payload de webhook inválido', 'INVALID_WEBHOOK');
    }
    
    return {
      event: payload.event,
      data: payload.data,
    };
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.config) {
      return { success: false, message: 'Serviço não configurado' };
    }
    
    try {
      await this.authenticate();
      return { success: true, message: 'Conexão estabelecida com sucesso' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return { success: false, message };
    }
  }

  disconnect(): void {
    this.config = null;
    this.accessToken = null;
    this.tokenExpiresAt = null;
  }
}

export const infojobsService = new InfoJobsService();
