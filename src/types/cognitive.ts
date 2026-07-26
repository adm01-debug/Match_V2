/**
 * @module types/cognitive
 * @description Contratos da avaliação cognitiva (Etapas 1-4 do benchmark Pandapé).
 *
 * Premissa de segurança: nenhum tipo aqui carrega `resposta_correta`. O gabarito
 * vive exclusivamente no servidor e a correção acontece via RPC `SECURITY DEFINER`.
 */

/** Domínios cognitivos avaliados. Espelha o enum `public.cognitive_domain`. */
export type CognitiveDomain = "logico" | "numerico" | "verbal" | "atencao";

export const COGNITIVE_DOMAINS: readonly CognitiveDomain[] = [
  "logico",
  "numerico",
  "verbal",
  "atencao",
] as const;

export const COGNITIVE_DOMAIN_LABEL: Record<CognitiveDomain, string> = {
  logico: "Raciocínio lógico",
  numerico: "Raciocínio numérico",
  verbal: "Compreensão verbal",
  atencao: "Atenção concentrada",
};

export const COGNITIVE_DOMAIN_DESCRICAO: Record<CognitiveDomain, string> = {
  logico: "Dedução, inferência válida e resolução de problemas abstratos.",
  numerico: "Sequências, proporções e interpretação quantitativa.",
  verbal: "Vocabulário, precisão semântica e interpretação de texto.",
  atencao: "Varredura sistemática, precisão e resistência ao erro por descuido.",
};

/** Status possíveis de uma sessão. Espelha `public.cognitive_session_status`. */
export type CognitiveSessionStatus =
  | "em_andamento"
  | "concluida"
  | "expirada"
  | "cancelada";

/** Alternativa exibida ao candidato. */
export interface CognitiveAlternativa {
  readonly id: string;
  readonly texto: string;
}

/** Item entregue ao cliente — sem gabarito, por construção. */
export interface CognitiveSessionItem {
  readonly itemId: string;
  readonly ordem: number;
  readonly dominio: CognitiveDomain;
  readonly enunciado: string;
  readonly contexto: string | null;
  readonly alternativas: readonly CognitiveAlternativa[];
  readonly dificuldade: number;
  readonly tempoSugeridoSeg: number;
  /** Resposta já registrada (permite retomar uma sessão interrompida). */
  readonly resposta: string | null;
}

/** Desempenho consolidado em um domínio. */
export interface CognitiveDomainScore {
  readonly itens: number;
  readonly acertos: number;
  readonly percentual: number;
  readonly tempoMedioSeg: number;
}

/** Resultado completo de uma sessão concluída. */
export interface CognitiveResult {
  readonly sessionId: string;
  readonly status: CognitiveSessionStatus;
  readonly scoreBruto: number | null;
  readonly totalItens: number;
  /** 0-100 ponderado pela dificuldade dos itens. */
  readonly scoreNormalizado: number | null;
  readonly porDominio: Partial<Record<CognitiveDomain, CognitiveDomainScore>>;
  /** Percentil normativo; `null` enquanto a amostra for pequena demais. */
  readonly percentil: number | null;
  readonly amostraNormativa: number;
  readonly iniciadaEm: string | null;
  readonly finalizadaEm: string | null;
}

/** Parâmetros de abertura de uma prova. */
export interface StartCognitiveSessionInput {
  readonly candidatoId?: string | null;
  readonly vagaId?: string | null;
  readonly dominios?: readonly CognitiveDomain[];
  readonly itensPorDominio?: number;
  readonly tempoLimiteSeg?: number;
}

/** Faixa qualitativa derivada do score normalizado. */
export type CognitiveFaixa = "abaixo" | "mediano" | "acima" | "superior";

export const COGNITIVE_FAIXA_LABEL: Record<CognitiveFaixa, string> = {
  abaixo: "Abaixo da média",
  mediano: "Dentro da média",
  acima: "Acima da média",
  superior: "Desempenho superior",
};

/**
 * Converte o score normalizado em faixa qualitativa.
 * Os cortes seguem a leitura psicométrica usual de desvios em torno da média.
 */
export function faixaCognitiva(scoreNormalizado: number): CognitiveFaixa {
  if (scoreNormalizado < 40) return "abaixo";
  if (scoreNormalizado < 65) return "mediano";
  if (scoreNormalizado < 85) return "acima";
  return "superior";
}
