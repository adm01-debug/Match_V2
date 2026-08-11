/**
 * @module lib/potentialIndex
 * @description Etapa 4 — Índice de Potencial.
 *
 * Combina três sinais independentes em um único número de 0 a 100:
 *  - cognitivo (capacidade de processar e resolver);
 *  - comportamental (como a pessoa opera no dia a dia);
 *  - fit cultural (aderência aos valores da empresa).
 *
 * Decisão de projeto: o modelo é explicitamente ponderado e auditável — nada de
 * caixa-preta. Quem lê o resultado precisa conseguir refazer a conta à mão.
 * Sinais ausentes NÃO viram zero: os pesos são renormalizados sobre o que existe,
 * caso contrário um candidato sem teste comportamental seria punido por algo que
 * ele não teve a chance de fazer.
 */

/** Pesos padrão. Somam 100 quando os três sinais estão presentes. */
export const POTENTIAL_WEIGHTS = {
  cognitivo: 40,
  comportamental: 35,
  cultural: 25,
} as const;

export type PotentialSignal = keyof typeof POTENTIAL_WEIGHTS;

/** Entradas do índice. Cada sinal é 0-100 ou ausente (`null`/`undefined`). */
export interface PotentialIndexInput {
  readonly cognitivo?: number | null;
  readonly comportamental?: number | null;
  readonly cultural?: number | null;
}

export interface PotentialComponent {
  readonly sinal: PotentialSignal;
  readonly valor: number;
  /** Peso efetivo após renormalização, em pontos percentuais. */
  readonly pesoEfetivo: number;
  /** Contribuição deste sinal no score final. */
  readonly contribuicao: number;
}

export type PotentialConfidence = "alta" | "media" | "baixa" | "insuficiente";

export interface PotentialIndexResult {
  /** 0-100. `null` quando nenhum sinal foi coletado. */
  readonly score: number | null;
  readonly confianca: PotentialConfidence;
  readonly componentes: readonly PotentialComponent[];
  readonly sinaisAusentes: readonly PotentialSignal[];
  readonly explicacao: string;
}

/** Mantém o valor dentro de 0-100 e descarta entradas não numéricas. */
function normalizar(valor: number | null | undefined): number | null {
  if (valor === null || valor === undefined) return null;
  if (!Number.isFinite(valor)) return null;
  return Math.min(100, Math.max(0, valor));
}

function arredondar(valor: number, casas = 1): number {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

/** Confiança decorre de quantos sinais alimentaram o índice. */
function confiancaPor(qtdSinais: number): PotentialConfidence {
  if (qtdSinais >= 3) return "alta";
  if (qtdSinais === 2) return "media";
  if (qtdSinais === 1) return "baixa";
  return "insuficiente";
}

/**
 * Calcula o Índice de Potencial a partir dos sinais disponíveis.
 *
 * @example
 * calcularIndicePotencial({ cognitivo: 80, comportamental: 70, cultural: 90 }).score // 78.5
 */
export function calcularIndicePotencial(
  entrada: PotentialIndexInput,
  pesos: Record<PotentialSignal, number> = POTENTIAL_WEIGHTS,
): PotentialIndexResult {
  const brutos: Record<PotentialSignal, number | null> = {
    cognitivo: normalizar(entrada.cognitivo),
    comportamental: normalizar(entrada.comportamental),
    cultural: normalizar(entrada.cultural),
  };

  const presentes = (Object.keys(brutos) as PotentialSignal[]).filter(
    (sinal) => brutos[sinal] !== null,
  );
  const ausentes = (Object.keys(brutos) as PotentialSignal[]).filter(
    (sinal) => brutos[sinal] === null,
  );

  if (presentes.length === 0) {
    return {
      score: null,
      confianca: "insuficiente",
      componentes: [],
      sinaisAusentes: ausentes,
      explicacao: "Nenhuma avaliação registrada para este candidato.",
    };
  }

  const somaPesos = presentes.reduce((acc, sinal) => acc + pesos[sinal], 0);
  // Guarda contra configuração inválida de pesos (todos zerados).
  const divisor = somaPesos > 0 ? somaPesos : presentes.length;

  const componentes: PotentialComponent[] = presentes.map((sinal) => {
    const pesoEfetivo = (somaPesos > 0 ? pesos[sinal] : 1) / divisor;
    const valor = brutos[sinal] as number;
    return {
      sinal,
      valor: arredondar(valor),
      pesoEfetivo: arredondar(pesoEfetivo * 100),
      contribuicao: arredondar(valor * pesoEfetivo),
    };
  });

  const score = arredondar(
    componentes.reduce((acc, componente) => acc + componente.contribuicao, 0),
  );

  const explicacao =
    ausentes.length === 0
      ? "Índice calculado com os três sinais (cognitivo, comportamental e cultural)."
      : `Índice calculado com ${presentes.length} de 3 sinais; pesos redistribuídos entre os disponíveis.`;

  return {
    score,
    confianca: confiancaPor(presentes.length),
    componentes,
    sinaisAusentes: ausentes,
    explicacao,
  };
}

export type PotentialTier = "alto" | "promissor" | "moderado" | "atencao";

export const POTENTIAL_TIER_LABEL: Record<PotentialTier, string> = {
  alto: "Alto potencial",
  promissor: "Potencial promissor",
  moderado: "Potencial moderado",
  atencao: "Requer atenção",
};

/** Classificação usada em badges e ordenação de ranking. */
export function classificarPotencial(score: number): PotentialTier {
  if (score >= 80) return "alto";
  if (score >= 65) return "promissor";
  if (score >= 45) return "moderado";
  return "atencao";
}
