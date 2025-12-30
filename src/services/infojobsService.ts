/**
 * InfoJobs Brasil Integration Service
 * API para publicação de vagas e webhooks de candidatura
 */

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
  estadoCandidatura: 'RECIBIDA' | 'LEIDA' | 'EN_PROCESO' | 'FINALISTA' | 'DESCARTADA' | 'CONTRATADA';
}

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

class InfoJobsService {
  private config: InfoJobsConfig | null = null;
  private baseUrl = 'https://api.infojobs.net/api/9';
  private accessToken: string | null = null;

  configure(config: InfoJobsConfig): void {
    this.config = config;
  }

  private async authenticate(): Promise<string> {
    if (!this.config) throw new Error('InfoJobs service not configured');
    if (this.accessToken) return this.accessToken;
    
    console.log('[InfoJobsService] Authenticating...');
    this.accessToken = 'mock-token';
    return this.accessToken;
  }

  async publishJob(job: InfoJobsPosting): Promise<{ ofertaId: string; url: string }> {
    await this.authenticate();
    
    console.log('[InfoJobsService] Publishing job:', job.titulo);
    
    const mockId = `ij-${Date.now()}`;
    return {
      ofertaId: mockId,
      url: `https://www.infojobs.com.br/vaga/${mockId}`,
    };
  }

  async updateJob(ofertaId: string, updates: Partial<InfoJobsPosting>): Promise<void> {
    await this.authenticate();
    console.log('[InfoJobsService] Updating job:', ofertaId, updates);
  }

  async closeJob(ofertaId: string): Promise<void> {
    await this.authenticate();
    console.log('[InfoJobsService] Closing job:', ofertaId);
  }

  async renewJob(ofertaId: string, days: number = 30): Promise<void> {
    await this.authenticate();
    console.log('[InfoJobsService] Renewing job:', ofertaId, 'for', days, 'days');
  }

  async getApplications(ofertaId: string): Promise<InfoJobsCandidate[]> {
    await this.authenticate();
    console.log('[InfoJobsService] Getting applications:', ofertaId);
    return [];
  }

  async updateApplicationStatus(ofertaId: string, candidatoId: string, status: InfoJobsCandidate['estadoCandidatura']): Promise<void> {
    await this.authenticate();
    console.log('[InfoJobsService] Updating status:', ofertaId, candidatoId, status);
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config?.webhookSecret) return false;
    // Implementar verificação HMAC
    console.log('[InfoJobsService] Verifying webhook signature');
    return true;
  }

  parseWebhook(payload: InfoJobsWebhookPayload): { event: string; data: unknown } {
    return {
      event: payload.event,
      data: payload.data,
    };
  }

  async testConnection(): Promise<boolean> {
    if (!this.config) return false;
    try {
      await this.authenticate();
      return true;
    } catch {
      return false;
    }
  }
}

export const infojobsService = new InfoJobsService();
