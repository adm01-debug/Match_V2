/**
 * @fileoverview Helpers de alinhamento e visualização do sistema "Deu Match".
 * @module lib/matchHelpers
 */
import { VALORES_CULTURAIS } from '@/data/valoresCulturais';
import type { MatchDetalhe, ValorCulturalDefinicao, ValorCulturalId } from '@/types/match';

export function calcularAlinhamento(
  intensidadeEmpresa: number,
  intensidadeCandidato: number
): MatchDetalhe['alinhamento'] {
  const diferenca = Math.abs(intensidadeEmpresa - intensidadeCandidato);
  if (diferenca === 0) return 'perfeito';
  if (diferenca === 1) return 'alto';
  if (diferenca === 2) return 'medio';
  if (diferenca === 3) return 'baixo';
  return 'conflito';
}

export function getValorPorId(id: ValorCulturalId): ValorCulturalDefinicao | undefined {
  return VALORES_CULTURAIS.find((v) => v.id === id);
}

const ALINHAMENTO_CORES: Record<MatchDetalhe['alinhamento'], string> = {
  perfeito: 'bg-success',
  alto: 'bg-success/80',
  medio: 'bg-warning',
  baixo: 'bg-warning/70',
  conflito: 'bg-destructive',
};

export function getCorAlinhamento(alinhamento: MatchDetalhe['alinhamento']): string {
  return ALINHAMENTO_CORES[alinhamento];
}
