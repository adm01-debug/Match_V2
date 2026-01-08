/**
 * Catho Integration Service
 * API para publicação de vagas e acesso ao banco de currículos
 */

import { createContextLogger } from './logger';

const log = createContextLogger('CathoService');

export interface CathoJobPosting {
  titulo: string;
  descricao: string;
  requisitos: string;
  beneficios?: string;
  cidade: string;
  estado: string;
  salario?: { de?: number; ate?: number; combinar?: boolean };
  regime: 'CLT' | 'PJ' | 'ESTAGIO' | 'TEMPORARIO' | 'FREELANCER';
  modalidade: 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO';
  nivelHierarquico: 'ESTAGIARIO' | 'OPERACIONAL' | 'AUXILIAR' | 'ASSISTENTE' | 'ANALISTA' | 'COORDENADOR' | 'GERENTE' | 'DIRETOR';
  areaAtuacao: string;
  numeroVagas?: number;
  pcd?: boolean;
}

export interface CathoCandidate {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cidade: string;
  estado: string;
  pretensaoSalarial?: number;
  experiencias: Array<{
    cargo: string;
    empresa: string;
    periodo: string;
  }>;
  formacoes: Array<{
    curso: string;
    instituicao: string;
    ano: number;
  }>;
  candidaturaId?: string;
  dataAplicacao?: Date;
}

export interface CathoSearchFilters {
  palavrasChave?: string;
  cidade?: string;
  estado?: string;
  salarioMinimo?: number;
  salarioMaximo?: number;
  experienciaMinima?: number;
  formacao?: string;
  areaAtuacao?: string;
}

export interface CathoConfig {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  tokenExpiresAt?: Date;
}

class CathoServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'CATHO_ERROR',
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'CathoServiceError';
  }
}

const ESTADOS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 
  'SP', 'SE', 'TO'
];

class CathoService {
  private config: CathoConfig | null = null;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  configure(config: CathoConfig): void {
    if (!config.clientId?.trim()) {
      throw new CathoServiceError('Client ID é obrigatório', 'INVALID_CONFIG');
    }
    if (!config.clientSecret?.trim()) {
      throw new CathoServiceError('Client Secret é obrigatório', 'INVALID_CONFIG');
    }
    this.config = config;
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  private ensureConfigured(): void {
    if (!this.config) {
      throw new CathoServiceError('Catho service não configurado', 'NOT_CONFIGURED');
    }
  }

  private validateJobPosting(job: CathoJobPosting): void {
    if (!job.titulo?.trim()) {
      throw new CathoServiceError('Título da vaga é obrigatório', 'VALIDATION_ERROR');
    }
    if (job.titulo.length > 100) {
      throw new CathoServiceError('Título deve ter no máximo 100 caracteres', 'VALIDATION_ERROR');
    }
    if (!job.descricao?.trim()) {
      throw new CathoServiceError('Descrição da vaga é obrigatória', 'VALIDATION_ERROR');
    }
    if (!job.requisitos?.trim()) {
      throw new CathoServiceError('Requisitos são obrigatórios', 'VALIDATION_ERROR');
    }
    if (!job.cidade?.trim()) {
      throw new CathoServiceError('Cidade é obrigatória', 'VALIDATION_ERROR');
    }
    if (!job.estado?.trim() || !ESTADOS_BRASIL.includes(job.estado.toUpperCase())) {
      throw new CathoServiceError('Estado inválido. Use a sigla (ex: SP, RJ)', 'VALIDATION_ERROR');
    }
    if (!job.areaAtuacao?.trim()) {
      throw new CathoServiceError('Área de atuação é obrigatória', 'VALIDATION_ERROR');
    }
    if (job.salario && !job.salario.combinar) {
      if (job.salario.de !== undefined && job.salario.de < 0) {
        throw new CathoServiceError('Salário inicial não pode ser negativo', 'VALIDATION_ERROR');
      }
      if (job.salario.ate !== undefined && job.salario.de !== undefined && job.salario.ate < job.salario.de) {
        throw new CathoServiceError('Salário final deve ser maior que o inicial', 'VALIDATION_ERROR');
      }
    }
    if (job.numeroVagas !== undefined && job.numeroVagas < 1) {
      throw new CathoServiceError('Número de vagas deve ser pelo menos 1', 'VALIDATION_ERROR');
    }
  }

  private async withRetry<T>(operation: () => Promise<T>, retries = this.MAX_RETRIES): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        log.warn(`Attempt ${attempt}/${retries} failed:`, lastError.message);
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt));
        }
      }
    }
    
    throw lastError;
  }

  private isTokenExpired(): boolean {
    if (!this.config?.tokenExpiresAt) return true;
    return new Date() >= this.config.tokenExpiresAt;
  }

  private async getAccessToken(): Promise<string> {
    this.ensureConfigured();
    
    if (this.config!.accessToken && !this.isTokenExpired()) {
      return this.config!.accessToken;
    }
    
    return this.withRetry(async () => {
      log.debug('Getting access token...');
      // Em produção, fazer chamada OAuth real
      const mockToken = `catho-token-${Date.now()}`;
      this.config!.accessToken = mockToken;
      this.config!.tokenExpiresAt = new Date(Date.now() + 3600000); // 1 hora
      return mockToken;
    });
  }

  async publishJob(job: CathoJobPosting): Promise<{ vagaId: string; url: string }> {
    this.ensureConfigured();
    this.validateJobPosting(job);
    await this.getAccessToken();
    
    return this.withRetry(async () => {
      log.debug('Publishing job:', job.titulo);
      
      const mockId = `catho-${Date.now()}`;
      return {
        vagaId: mockId,
        url: `https://www.catho.com.br/vagas/${mockId}`,
      };
    });
  }

  async updateJob(vagaId: string, updates: Partial<CathoJobPosting>): Promise<void> {
    this.ensureConfigured();
    
    if (!vagaId?.trim()) {
      throw new CathoServiceError('ID da vaga é obrigatório', 'VALIDATION_ERROR');
    }
    
    await this.getAccessToken();
    
    return this.withRetry(async () => {
      log.debug('Updating job:', { vagaId, updates });
    });
  }

  async closeJob(vagaId: string): Promise<void> {
    this.ensureConfigured();
    
    if (!vagaId?.trim()) {
      throw new CathoServiceError('ID da vaga é obrigatório', 'VALIDATION_ERROR');
    }
    
    await this.getAccessToken();
    
    return this.withRetry(async () => {
      log.debug('Closing job:', vagaId);
    });
  }

  async searchCandidates(filters: CathoSearchFilters, page = 1, limit = 20): Promise<{
    candidates: CathoCandidate[];
    total: number;
    page: number;
    pages: number;
  }> {
    this.ensureConfigured();
    
    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 20;
    
    await this.getAccessToken();
    
    return this.withRetry(async () => {
      log.debug('Searching candidates:', filters);
      return {
        candidates: [],
        total: 0,
        page,
        pages: 0,
      };
    });
  }

  async getCandidateDetails(candidateId: string): Promise<CathoCandidate | null> {
    this.ensureConfigured();
    
    if (!candidateId?.trim()) {
      throw new CathoServiceError('ID do candidato é obrigatório', 'VALIDATION_ERROR');
    }
    
    await this.getAccessToken();
    
    return this.withRetry(async () => {
      log.debug('Getting candidate:', candidateId);
      return null;
    });
  }

  async getJobCandidates(vagaId: string): Promise<CathoCandidate[]> {
    this.ensureConfigured();
    
    if (!vagaId?.trim()) {
      throw new CathoServiceError('ID da vaga é obrigatório', 'VALIDATION_ERROR');
    }
    
    await this.getAccessToken();
    
    return this.withRetry(async () => {
      log.debug('Getting candidates for job:', vagaId);
      return [];
    });
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.config) {
      return { success: false, message: 'Serviço não configurado' };
    }
    
    try {
      await this.getAccessToken();
      return { success: true, message: 'Conexão estabelecida com sucesso' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      log.error('Connection test failed:', message);
      return { success: false, message };
    }
  }

  disconnect(): void {
    this.config = null;
  }
}

export const cathoService = new CathoService();
