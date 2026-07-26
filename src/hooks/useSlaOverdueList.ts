/**
 * @module hooks/useSlaOverdueList
 * @description Fila nominal de candidaturas fora do SLA de primeira resposta.
 *
 * Complementa `useFunnelSla` (agregado por vaga) com o detalhe acionável:
 * quem exatamente está esperando e há quanto tempo. Fica em consulta separada
 * e sob demanda porque é um drill-down — carregá-la junto do agregado pagaria
 * um custo que a maioria das visitas não usa.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SlaOverdueRow {
  readonly candidatura_id: string;
  readonly candidato_nome: string;
  readonly candidato_email: string | null;
  readonly vaga_id: string;
  readonly vaga_titulo: string;
  readonly data_candidatura: string;
  readonly horas_esperando: number;
}

export interface SlaOverdueParams {
  readonly slaHoras?: number;
  readonly limite?: number;
  /** Permite montar a UI antes de disparar o drill-down. */
  readonly enabled?: boolean;
}

export const slaOverdueKeys = {
  all: (slaHoras: number, limite: number) => ["sla-overdue", slaHoras, limite] as const,
};

export function useSlaOverdueList({
  slaHoras = 48,
  limite = 50,
  enabled = true,
}: SlaOverdueParams = {}) {
  return useQuery<readonly SlaOverdueRow[]>({
    queryKey: slaOverdueKeys.all(slaHoras, limite),
    enabled,
    staleTime: 2 * 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("hr_sla_overdue_list", {
        p_sla_horas: slaHoras,
        p_limit: limite,
      });
      if (error) throw error;

      return (data ?? []).map((linha) => {
        // `numeric` chega como string no PostgREST.
        const horas = Number(linha.horas_esperando);
        return {
          candidatura_id: String(linha.candidatura_id),
          candidato_nome: String(linha.candidato_nome ?? "Candidato sem nome"),
          candidato_email: linha.candidato_email ? String(linha.candidato_email) : null,
          vaga_id: String(linha.vaga_id),
          vaga_titulo: String(linha.vaga_titulo ?? "Vaga sem título"),
          data_candidatura: String(linha.data_candidatura),
          horas_esperando: Number.isFinite(horas) ? horas : 0,
        };
      });
    },
  });
}
