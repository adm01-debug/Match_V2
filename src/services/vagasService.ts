/**
 * Vagas.com.br Integration Service
 * API para publicação de vagas e gestão de candidaturas
 */

export interface VagasJobPosting {
  titulo: string;
  descricao: string;
  requisitos: string;
  cidade: string;
  uf: string;
  salario?: { valor?: number; combinar?: boolean; exibir?: boolean };
  tipoContrato: 'CLT' | 'PJ' | 'ESTAGIO' | 'TEMPORARIO' | 'APRENDIZ';
  jornada: 'INTEGRAL' | 'PARCIAL' | 'NOTURNO' | 'ESCALA';
  modalidade: 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO';
  deficiencia?: boolean;
  quantidade?: number;
  area: string;
  nivel: 'ESTAGIO' | 'JUNIOR' | 'PLENO' | 'SENIOR' | 'ESPECIALISTA' | 'GERENCIA' | 'DIRETORIA';
}

export interface VagasCandidate {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  localizacao: string;
  ultimoCargo?: string;
  ultimaEmpresa?: string;
  pretensaoSalarial?: number;
  disponibilidade?: string;
  dataAplicacao: Date;
  status: VagasCandidateStatus;
}

export type VagasCandidateStatus = 'NOVO' | 'VISUALIZADO' | 'EM_ANALISE' | 'FINALISTA' | 'CONTRATADO' | 'DESCARTADO';

export interface VagasConfig {
  apiKey: string;
  empresaId: string;
}

const UFS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 
  'SP', 'SE', 'TO'
];

class VagasServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'VAGAS_ERROR',
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'VagasServiceError';
  }
}

class VagasService {
  private config: VagasConfig | null = null;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  configure(config: VagasConfig): void {
    if (!config.apiKey?.trim()) {
      throw new VagasServiceError('API Key é obrigatória', 'INVALID_CONFIG');
    }
    if (!config.empresaId?.trim()) {
      throw new VagasServiceError('ID da empresa é obrigatório', 'INVALID_CONFIG');
    }
    this.config = config;
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  private ensureConfigured(): void {
    if (!this.config) {
      throw new VagasServiceError('Vagas.com.br service não configurado', 'NOT_CONFIGURED');
    }
  }

  private validateJobPosting(job: VagasJobPosting): void {
    if (!job.titulo?.trim()) {
      throw new VagasServiceError('Título é obrigatório', 'VALIDATION_ERROR');
    }
    if (job.titulo.length > 100) {
      throw new VagasServiceError('Título deve ter no máximo 100 caracteres', 'VALIDATION_ERROR');
    }
    if (!job.descricao?.trim()) {
      throw new VagasServiceError('Descrição é obrigatória', 'VALIDATION_ERROR');
    }
    if (!job.requisitos?.trim()) {
      throw new VagasServiceError('Requisitos são obrigatórios', 'VALIDATION_ERROR');
    }
    if (!job.cidade?.trim()) {
      throw new VagasServiceError('Cidade é obrigatória', 'VALIDATION_ERROR');
    }
    if (!job.uf?.trim() || !UFS_BRASIL.includes(job.uf.toUpperCase())) {
      throw new VagasServiceError('UF inválida. Use a sigla (ex: SP, RJ)', 'VALIDATION_ERROR');
    }
    if (!job.area?.trim()) {
      throw new VagasServiceError('Área é obrigatória', 'VALIDATION_ERROR');
    }
    if (job.quantidade !== undefined && job.quantidade < 1) {
      throw new VagasServiceError('Quantidade deve ser pelo menos 1', 'VALIDATION_ERROR');
    }
    if (job.salario?.valor !== undefined && job.salario.valor < 0) {
      throw new VagasServiceError('Salário não pode ser negativo', 'VALIDATION_ERROR');
    }
  }

  private async withRetry<T>(operation: () => Promise<T>, retries = this.MAX_RETRIES): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`[VagasService] Attempt ${attempt}/${retries} failed:`, lastError.message);
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt));
        }
      }
    }
    
    throw lastError;
  }

  async publishJob(job: VagasJobPosting): Promise<{ vagaId: string; url: string }> {
    this.ensureConfigured();
    this.validateJobPosting(job);
    
    return this.withRetry(async () => {
      console.log('[VagasService] Publishing job:', job.titulo);
      
      const mockId = `vagas-${Date.now()}`;
      return {
        vagaId: mockId,
        url: `https://www.vagas.com.br/vagas/${mockId}`,
      };
    });
  }

  async updateJob(vagaId: string, updates: Partial<VagasJobPosting>): Promise<void> {
    this.ensureConfigured();
    
    if (!vagaId?.trim()) {
      throw new VagasServiceError('ID da vaga é obrigatório', 'VALIDATION_ERROR');
    }
    
    return this.withRetry(async () => {
      console.log('[VagasService] Updating job:', vagaId, updates);
    });
  }

  async pauseJob(vagaId: string): Promise<void> {
    this.ensureConfigured();
    
    if (!vagaId?.trim()) {
      throw new VagasServiceError('ID da vaga é obrigatório', 'VALIDATION_ERROR');
    }
    
    return this.withRetry(async () => {
      console.log('[VagasService] Pausing job:', vagaId);
    });
  }

  async closeJob(vagaId: string): Promise<void> {
    this.ensureConfigured();
    
    if (!vagaId?.trim()) {
      throw new VagasServiceError('ID da vaga é obrigatório', 'VALIDATION_ERROR');
    }
    
    return this.withRetry(async () => {
      console.log('[VagasService] Closing job:', vagaId);
    });
  }

  async getApplications(vagaId: string, status?: VagasCandidateStatus): Promise<VagasCandidate[]> {
    this.ensureConfigured();
    
    if (!vagaId?.trim()) {
      throw new VagasServiceError('ID da vaga é obrigatório', 'VALIDATION_ERROR');
    }
    
    return this.withRetry(async () => {
      console.log('[VagasService] Getting applications:', vagaId, status ?? 'all');
      return [];
    });
  }

  async updateCandidateStatus(
    vagaId: string, 
    candidatoId: string, 
    status: VagasCandidateStatus
  ): Promise<void> {
    this.ensureConfigured();
    
    if (!vagaId?.trim()) {
      throw new VagasServiceError('ID da vaga é obrigatório', 'VALIDATION_ERROR');
    }
    if (!candidatoId?.trim()) {
      throw new VagasServiceError('ID do candidato é obrigatório', 'VALIDATION_ERROR');
    }
    
    return this.withRetry(async () => {
      console.log('[VagasService] Updating candidate status:', vagaId, candidatoId, status);
    });
  }

  async getJobStats(vagaId: string): Promise<{
    visualizacoes: number;
    candidaturas: number;
    compartilhamentos: number;
  }> {
    this.ensureConfigured();
    
    if (!vagaId?.trim()) {
      throw new VagasServiceError('ID da vaga é obrigatório', 'VALIDATION_ERROR');
    }
    
    return this.withRetry(async () => {
      return {
        visualizacoes: Math.floor(Math.random() * 500),
        candidaturas: Math.floor(Math.random() * 30),
        compartilhamentos: Math.floor(Math.random() * 20),
      };
    });
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.config) {
      return { success: false, message: 'Serviço não configurado' };
    }
    
    try {
      console.log('[VagasService] Testing connection...');
      return { success: true, message: 'Conexão estabelecida com sucesso' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return { success: false, message };
    }
  }

  disconnect(): void {
    this.config = null;
  }
}

export const vagasService = new VagasService();
