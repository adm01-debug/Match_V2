/**
 * @fileoverview Avaliacao mock data
 */

export interface Competencia {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'tecnica' | 'comportamental';
}

export const competencias: Competencia[] = [
  { id: '1', nome: 'Comunicação', descricao: 'Clareza e objetividade', tipo: 'comportamental' },
  { id: '2', nome: 'Trabalho em Equipe', descricao: 'Colaboração', tipo: 'comportamental' },
  { id: '3', nome: 'Resolução de Problemas', descricao: 'Análise crítica', tipo: 'tecnica' },
];

export default { competencias };
