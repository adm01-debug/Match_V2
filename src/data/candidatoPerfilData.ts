/**
 * @fileoverview Candidato perfil types and mock data
 * @module data/candidatoPerfilData
 * 
 * This file contains the UI-focused CandidatoPerfil interface used by
 * presentation components. For the data-fetching version, see useCandidatoPerfil hook.
 */

export interface ArquivoAnexo {
  id: string;
  nome: string;
  tipo: string;
  tamanho: string;
  dataUpload: string;
  url?: string;
}

/**
 * UI-focused CandidatoPerfil interface for presentation components.
 * Contains all fields needed for rendering candidate profile UI.
 * 
 * Note: The useCandidatoPerfil hook returns a different structure
 * (CandidatoPerfilData) from the database. Components should use
 * this interface for UI props, and transform data as needed.
 */
/**
 * Estrutura de formação acadêmica
 */
export interface FormacaoAcademica {
  id: string;
  curso: string;
  instituicao: string;
  nivel: string;
  anoConclusao: string | number;
  status: string;
}

/**
 * Estrutura de experiência profissional
 */
export interface ExperienciaProfissional {
  id: string;
  cargo: string;
  empresa: string;
  inicio?: string;
  fim?: string;
  dataInicio?: string;
  dataFim?: string | null;
  atual?: boolean;
  descricao?: string | string[];
}

/**
 * Estrutura de certificação
 */
export interface Certificacao {
  id: string;
  nome: string;
  instituicao: string;
  dataEmissao: string;
  dataValidade?: string | null;
}

/**
 * Estrutura de histórico
 */
export interface HistoricoCandidato {
  id: string;
  data: string;
  hora: string;
  tipo: string;
  tipoIcon: string;
  descricao: string;
  detalhes?: string | null;
  usuario?: string | null;
}

/**
 * Estrutura de avaliação
 */
export interface AvaliacaoCandidato {
  id: string;
  tipo: string;
  tipoLabel: string;
  data: string;
  avaliador: string;
  notaGeral: number;
  recomendacao: string;
  observacoes: string;
  notas: Array<{ criterio: string; nota: number }>;
}

/**
 * UI-focused CandidatoPerfil interface for presentation components.
 * Contains all fields needed for rendering candidate profile UI.
 */
export interface CandidatoPerfil {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  foto_url?: string;
  foto?: string;
  resumo?: string;
  habilidades?: string[];
  experiencias?: ExperienciaProfissional[];
  formacao?: FormacaoAcademica[];
  resumoProfissional?: string;
  vagaAtual?: string;
  arquivos: ArquivoAnexo[];
  skills: Array<{ nome: string; nivel: number }>;
  certificacoes: Certificacao[];
  avaliacoes: AvaliacaoCandidato[];
  // Additional fields used by PerfilHeader and other components
  cargoAtual?: string;
  empresaAtual?: string;
  matchScore?: number;
  cidade?: string;
  estado?: string;
  linkedin?: string;
  disponibilidadeLabel?: string;
  pretensaoSalarial?: number;
  etapaAtualLabel?: string;
  dataCadastro?: string;
  historico?: HistoricoCandidato[];
}

/**
 * Default/empty CandidatoPerfil for fallback usage
 */
export const emptyCandidatoPerfil: CandidatoPerfil = {
  id: '',
  nome: '',
  email: '',
  arquivos: [],
  skills: [],
  certificacoes: [],
  avaliacoes: [],
};

export const mockCandidatoPerfil: CandidatoPerfil = {
  id: '1',
  nome: 'Candidato Exemplo',
  email: 'candidato@exemplo.com',
  telefone: '11999999999',
  habilidades: ['JavaScript', 'React', 'TypeScript'],
  resumoProfissional: 'Desenvolvedor experiente',
  vagaAtual: 'Desenvolvedor Frontend',
  arquivos: [],
  skills: [],
  certificacoes: [],
  avaliacoes: [],
  cargoAtual: 'Desenvolvedor Frontend',
  empresaAtual: 'Tech Company',
  matchScore: 85,
  cidade: 'São Paulo',
  estado: 'SP',
  linkedin: 'linkedin.com/in/candidato',
  disponibilidadeLabel: 'Imediata',
  pretensaoSalarial: 8000,
  etapaAtualLabel: 'Entrevista Técnica',
  dataCadastro: '10/12/2025',
  historico: [],
};

export default { mockCandidatoPerfil, emptyCandidatoPerfil };
