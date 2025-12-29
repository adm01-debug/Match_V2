/**
 * @fileoverview Candidato perfil mock data
 */

export interface ArquivoAnexo {
  id: string;
  nome: string;
  tipo: string;
  tamanho: string;
  dataUpload: string;
  url?: string;
}

export interface CandidatoPerfil {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  foto_url?: string;
  resumo?: string;
  habilidades?: string[];
  experiencias?: unknown[];
  formacao?: unknown[];
  resumoProfissional?: string;
  vagaAtual?: string;
  arquivos: ArquivoAnexo[];
  skills: Array<{ nome: string; nivel: number }>;
  certificacoes: Array<{ id: string; nome: string; instituicao: string; dataEmissao: string; dataValidade?: string }>;
  avaliacoes: Array<{
    id: string;
    tipo: string;
    tipoLabel: string;
    data: string;
    avaliador: string;
    notaGeral: number;
    recomendacao: string;
    observacoes: string;
    notas: Array<{ criterio: string; nota: number }>;
  }>;
}

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
};

export default { mockCandidatoPerfil };
