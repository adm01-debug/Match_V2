/**
 * @module hooks/useCandidaturaTimeline
 * @description Timeline de etapas e contatos de uma candidatura.
 *
 * Decisões deliberadas:
 * - **Consulta sob demanda (`enabled`)**: a timeline só interessa quando o
 *   recrutador abre o histórico de uma linha específica. Buscar para todas as
 *   linhas da fila seria um N+1 gratuito.
 * - **Normalização defensiva**: PostgREST devolve `null` em colunas nulas e
 *   texto em datas; convertemos aqui para o resto da UI não repetir guardas.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CandidaturaTimelineEvento {
  readonly evento_id: string;
  readonly etapa_anterior: string | null;
  readonly etapa_nova: string;
  /** Nota registrada pelo RH, quando houve. */
  readonly motivo: string | null;
  readonly responsavel_nome: string | null;
  readonly created_at: string;
}

export const candidaturaTimelineKeys = {
  byCandidatura: (id: string) => ["candidatura-timeline", id] as const,
};

export function useCandidaturaTimeline(candidaturaId: string, enabled = true) {
  return useQuery<readonly CandidaturaTimelineEvento[]>({
    queryKey: candidaturaTimelineKeys.byCandidatura(candidaturaId),
    enabled: enabled && Boolean(candidaturaId),
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("hr_candidatura_timeline", {
        p_candidatura_id: candidaturaId,
        p_limit: 50,
      });
      if (error) throw error;

      return (data ?? []).map((linha) => ({
        evento_id: String(linha.evento_id),
        etapa_anterior: linha.etapa_anterior ? String(linha.etapa_anterior) : null,
        etapa_nova: String(linha.etapa_nova ?? ""),
        motivo: linha.motivo ? String(linha.motivo) : null,
        responsavel_nome: linha.responsavel_nome ? String(linha.responsavel_nome) : null,
        created_at: String(linha.created_at),
      }));
    },
  });
}
