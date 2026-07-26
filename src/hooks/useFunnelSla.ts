/**
 * @module hooks/useFunnelSla
 * @description Onda B — SLA de primeira resposta ao candidato.
 *
 * O cálculo vive no banco (`public.hr_funnel_sla`) e não no cliente por três
 * razões: (1) o dado bruto é volumoso e não deve trafegar; (2) a definição de
 * "primeira resposta" precisa ser única em todo o sistema; (3) a função é
 * SECURITY DEFINER com checagem de RH, então a regra de acesso não depende de
 * o frontend lembrar de filtrar.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FunnelSlaRow {
  readonly vaga_id: string;
  readonly vaga_titulo: string;
  readonly total_candidaturas: number;
  readonly com_primeira_resposta: number;
  readonly dentro_do_sla: number;
  /** `null` quando ainda não houve nenhuma resposta no período. */
  readonly percentual_sla: number | null;
  readonly horas_medias_primeira_resposta: number | null;
  readonly aguardando_agora: number;
}

export interface FunnelSlaParams {
  readonly dias?: number;
  readonly slaHoras?: number;
}

export const funnelSlaKeys = {
  all: (dias: number, slaHoras: number) => ["funnel-sla", dias, slaHoras] as const,
};

function toNumero(valor: unknown): number {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
}

function toNumeroOuNulo(valor: unknown): number | null {
  if (valor === null || valor === undefined) return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

export function useFunnelSla({ dias = 30, slaHoras = 48 }: FunnelSlaParams = {}) {
  return useQuery<readonly FunnelSlaRow[]>({
    queryKey: funnelSlaKeys.all(dias, slaHoras),
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("hr_funnel_sla", {
        p_dias: dias,
        p_sla_horas: slaHoras,
      });
      if (error) throw error;

      // `numeric` chega como string no PostgREST: normalizamos aqui para que a
      // UI nunca precise adivinhar o tipo.
      return (data ?? []).map((linha) => ({
        vaga_id: String(linha.vaga_id),
        vaga_titulo: String(linha.vaga_titulo ?? "Vaga sem título"),
        total_candidaturas: toNumero(linha.total_candidaturas),
        com_primeira_resposta: toNumero(linha.com_primeira_resposta),
        dentro_do_sla: toNumero(linha.dentro_do_sla),
        percentual_sla: toNumeroOuNulo(linha.percentual_sla),
        horas_medias_primeira_resposta: toNumeroOuNulo(linha.horas_medias_primeira_resposta),
        aguardando_agora: toNumero(linha.aguardando_agora),
      }));
    },
  });
}
