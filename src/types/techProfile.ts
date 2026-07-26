/**
 * @module types/techProfile
 * @description Tipos e rótulos do perfil técnico do candidato, espelhando 1:1 os enums
 * do banco (`senioridade_nivel`, `nivel_idioma`, `regime_contratacao`, `modalidade_trabalho`).
 * Derivamos os tipos do `Database` gerado para que qualquer alteração no enum quebre
 * o build em vez de gerar divergência silenciosa em runtime.
 */
import type { Database } from "@/integrations/supabase/types";

type Enums = Database["public"]["Enums"];

export type SenioridadeNivel = Enums["senioridade_nivel"];
export type NivelIdioma = Enums["nivel_idioma"];
export type RegimeContratacao = Enums["regime_contratacao"];
export type ModalidadeTrabalho = Enums["modalidade_trabalho"];

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export const SENIORIDADE_OPTIONS: ReadonlyArray<SelectOption<SenioridadeNivel>> = [
  { value: "estagio", label: "Estágio" },
  { value: "junior", label: "Júnior" },
  { value: "pleno", label: "Pleno" },
  { value: "senior", label: "Sênior" },
  { value: "staff", label: "Staff" },
  { value: "principal", label: "Principal" },
  { value: "lead", label: "Tech Lead" },
];

export const NIVEL_IDIOMA_OPTIONS: ReadonlyArray<SelectOption<NivelIdioma>> = [
  { value: "nenhum", label: "Nenhum" },
  { value: "basico", label: "Básico" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
  { value: "fluente", label: "Fluente" },
  { value: "nativo", label: "Nativo" },
];

export const REGIME_OPTIONS: ReadonlyArray<SelectOption<RegimeContratacao>> = [
  { value: "clt", label: "CLT" },
  { value: "pj", label: "PJ" },
  { value: "ambos", label: "CLT ou PJ" },
];

export const MODALIDADE_OPTIONS: ReadonlyArray<SelectOption<ModalidadeTrabalho>> = [
  { value: "remoto", label: "Remoto" },
  { value: "hibrido", label: "Híbrido" },
  { value: "presencial", label: "Presencial" },
];

/** Rótulos indexados por valor, para exibição em cards, tabelas e badges. */
function toLabelMap<T extends string>(
  options: ReadonlyArray<SelectOption<T>>
): Record<T, string> {
  return options.reduce((acc, o) => {
    acc[o.value] = o.label;
    return acc;
  }, {} as Record<T, string>);
}

export const SENIORIDADE_LABEL = toLabelMap(SENIORIDADE_OPTIONS);
export const NIVEL_IDIOMA_LABEL = toLabelMap(NIVEL_IDIOMA_OPTIONS);
export const REGIME_LABEL = toLabelMap(REGIME_OPTIONS);
export const MODALIDADE_LABEL = toLabelMap(MODALIDADE_OPTIONS);

/** Sentinela usada nos <Select> — Radix não aceita `value=""` em SelectItem. */
export const NAO_INFORMADO = "__none__";

/** Campos editáveis do perfil técnico. */
export interface TechProfile {
  senioridade: SenioridadeNivel | null;
  nivel_ingles: NivelIdioma | null;
  pretensao_salarial: number | null;
  pretensao_moeda: string;
  regime: RegimeContratacao | null;
  modalidade: ModalidadeTrabalho | null;
  disponibilidade_dias: number | null;
  aberto_a_oportunidades: boolean;
}

export const MOEDAS = ["BRL", "USD", "EUR"] as const;

/** Formata pretensão salarial respeitando a moeda cadastrada. */
export function formatPretensao(valor: number | null, moeda = "BRL"): string {
  if (valor == null) return "Não informada";
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: moeda,
      maximumFractionDigits: 0,
    }).format(valor);
  } catch {
    // Moeda inválida cadastrada manualmente — degrada para número puro.
    return `${moeda} ${valor.toLocaleString("pt-BR")}`;
  }
}
