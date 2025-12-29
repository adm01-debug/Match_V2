/**
 * @fileoverview Candidato perfil mock data
 */

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
}

export const mockCandidatoPerfil: CandidatoPerfil = {
  id: '1',
  nome: 'Candidato Exemplo',
  email: 'candidato@exemplo.com',
  telefone: '11999999999',
  habilidades: ['JavaScript', 'React', 'TypeScript'],
};

export default { mockCandidatoPerfil };
