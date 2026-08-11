/**
 * @fileoverview Avaliacao mock data
 * Uses Competencia type from recruitment.ts to avoid duplication
 */

import { Competencia } from '@/types/recruitment';

// Re-export for backward compatibility
export type { Competencia } from '@/types/recruitment';

export const competencias: Competencia[] = [
  { id: '1', nome: 'Comunicação', descricao: 'Clareza e objetividade', tipo: 'comportamental' },
  { id: '2', nome: 'Trabalho em Equipe', descricao: 'Colaboração', tipo: 'comportamental' },
  { id: '3', nome: 'Resolução de Problemas', descricao: 'Análise crítica', tipo: 'tecnica' },
];

export const notasDescricao: Record<number, { label: string }> = {
  1: { label: 'Insuficiente' },
  2: { label: 'Regular' },
  3: { label: 'Bom' },
  4: { label: 'Muito Bom' },
  5: { label: 'Excelente' },
};

export default { competencias, notasDescricao };
