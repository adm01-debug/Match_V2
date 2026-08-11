/**
 * @module hooks/usePotentialIndex
 * @description Etapa 5 — Consolidação dos sinais que alimentam o Índice de Potencial.
 *
 * Origem de cada sinal (decisão explícita, para o número ser auditável):
 *  - cognitivo: `cognitive_sessions.score_normalizado` da última sessão concluída;
 *  - comportamental: `avaliacoes_comportamentais_resultados.score_geral` mais recente;
 *  - cultural: `fit_geral` da mesma avaliação — é a aderência ao perfil desejado.
 *
 * Sinal ausente permanece ausente (`null`): o cálculo renormaliza os pesos em vez
 * de penalizar quem simplesmente não fez determinada etapa.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calcularIndicePotencial } from "@/lib/potentialIndex";
import type { PotentialIndexResult } from "@/lib/potentialIndex";

export interface PotentialSignalsSources {
  readonly cognitivo: number | null;
  readonly comportamental: number | null;
  readonly cultural: number | null;
  readonly cognitivoEm: string | null;
  readonly comportamentalEm: string | null;
}

export interface PotentialIndexData extends PotentialIndexResult {
  readonly fontes: PotentialSignalsSources;
}

export const potentialIndexKeys = {
  byCandidato: (candidatoId: string) => ["potential-index", candidatoId] as const,
};

/** Converte numeric do Postgres (que chega como number|string) com segurança. */
function toNumero(valor: unknown): number | null {
  if (valor === null || valor === undefined) return null;
  const n = typeof valor === "string" ? Number(valor) : Number(valor);
  return Number.isFinite(n) ? n : null;
}

export function usePotentialIndex(candidatoId: string | null | undefined) {
  return useQuery<PotentialIndexData>({
    queryKey: potentialIndexKeys.byCandidato(candidatoId ?? ""),
    enabled: Boolean(candidatoId),
    staleTime: 60_000,
    queryFn: async () => {
      const id = candidatoId as string;

      // Consultas independentes → paralelas. Falha em uma não deve derrubar a outra,
      // então tratamos os erros individualmente e degradamos para "sinal ausente".
      const [cognitiva, comportamental] = await Promise.all([
        supabase
          .from("cognitive_sessions")
          .select("score_normalizado, finalizada_em")
          .eq("candidato_id", id)
          .eq("status", "concluida")
          .is("deleted_at", null)
          .order("finalizada_em", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("avaliacoes_comportamentais_resultados")
          .select("score_geral, fit_geral, finalizado_em")
          .eq("candidato_id", id)
          .order("finalizado_em", { ascending: false, nullsFirst: false })
          .limit(1)
          .maybeSingle(),
      ]);

      const fontes: PotentialSignalsSources = {
        cognitivo: toNumero(cognitiva.data?.score_normalizado),
        comportamental: toNumero(comportamental.data?.score_geral),
        cultural: toNumero(comportamental.data?.fit_geral),
        cognitivoEm: cognitiva.data?.finalizada_em ?? null,
        comportamentalEm: comportamental.data?.finalizado_em ?? null,
      };

      const indice = calcularIndicePotencial({
        cognitivo: fontes.cognitivo,
        comportamental: fontes.comportamental,
        cultural: fontes.cultural,
      });

      return { ...indice, fontes };
    },
  });
}
