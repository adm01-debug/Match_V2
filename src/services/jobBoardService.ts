import { createContextLogger } from './logger';

const log = createContextLogger('JobBoardService');

interface VagaData {
  id: string;
  titulo: string;
  descricao: string;
  requisitos: string;
  beneficios?: string;
  salario_min?: number;
  salario_max?: number;
  regime_contratacao?: string;
  local?: string;
  departamento?: string;
  tipo_contrato?: string;
}


interface JobBoard { id: string; name: string; type: 'indeed' | 'linkedin' | 'glassdoor' | 'catho' | 'gupy' | 'custom'; apiKey?: string; enabled: boolean; }
interface JobPosting { vagaId: string; boardId: string; externalId?: string; status: 'pending' | 'published' | 'failed' | 'expired'; publishedAt?: string; url?: string; }

export const jobBoardService = {
  boards: [
    { id: 'indeed', name: 'Indeed', type: 'indeed', enabled: false },
    { id: 'linkedin', name: 'LinkedIn Jobs', type: 'linkedin', enabled: false },
    { id: 'glassdoor', name: 'Glassdoor', type: 'glassdoor', enabled: false },
    { id: 'catho', name: 'Catho', type: 'catho', enabled: false },
    { id: 'gupy', name: 'Gupy', type: 'gupy', enabled: false },
  ] as JobBoard[],

  async publishJob(vaga: VagaData, boardIds: string[]): Promise<JobPosting[]> {
    const results: JobPosting[] = [];
    for (const boardId of boardIds) {
      const board = this.boards.find(b => b.id === boardId);
      if (!board || !board.enabled) continue;
      try {
        const externalId = await this.publishToBoard(board, vaga);
        results.push({ vagaId: vaga.id, boardId, externalId, status: 'published', publishedAt: new Date().toISOString(), url: this.getJobUrl(board, externalId) });
      } catch (error) {
        results.push({ vagaId: vaga.id, boardId, status: 'failed' });
      }
    }
    return results;
  },

  async publishToBoard(board: JobBoard, vaga: VagaData): Promise<string> {
    // Simulated API call - in production, use actual board APIs
    log.debug(`Publishing to ${board.name}:`, vaga.titulo);
    return `ext-${board.id}-${Date.now()}`;
  },

  formatJobData(boardType: string, vaga: VagaData) {
    const base = { title: vaga.titulo, description: vaga.descricao, location: vaga.local, salary: vaga.salario_min };
    switch (boardType) {
      case 'indeed': return { ...base, sponsoredType: 'organic' };
      case 'linkedin': return { ...base, employmentType: vaga.tipo_contrato };
      default: return base;
    }
  },

  getJobUrl(board: JobBoard, externalId: string): string {
    const urls: Record<string, string> = {
      indeed: `https://indeed.com/viewjob?jk=${externalId}`,
      linkedin: `https://linkedin.com/jobs/view/${externalId}`,
      glassdoor: `https://glassdoor.com/job/${externalId}`,
      catho: `https://catho.com.br/vagas/${externalId}`,
    };
    return urls[board.type] || '';
  },

  async unpublishJob(_posting: JobPosting): Promise<boolean> {
    // console.log(`Unpublishing job ${posting.externalId} from ${posting.boardId}`);
    return true;
  },

  async syncStats(_vagaId: string): Promise<Record<string, { views: number; applications: number }>> {
    // Simulated stats - in production, fetch from board APIs
    return { indeed: { views: 150, applications: 12 }, linkedin: { views: 230, applications: 18 } };
  },

  getEnabledBoards(): JobBoard[] {
    return this.boards.filter(b => b.enabled);
  },

  enableBoard(boardId: string, apiKey: string): void {
    const board = this.boards.find(b => b.id === boardId);
    if (board) { board.enabled = true; board.apiKey = apiKey; }
  },

  disableBoard(boardId: string): void {
    const board = this.boards.find(b => b.id === boardId);
    if (board) { board.enabled = false; board.apiKey = undefined; }
  },
};

export default jobBoardService;


