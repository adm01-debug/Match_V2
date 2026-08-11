/**
 * @module useRankingVaga
 * @description Ranking automático de candidaturas por vaga baseado em triagem_ia.
 * Combina candidaturas + triagens (via LEFT JOIN client-side) e permite executar
 * triagem em lote para candidaturas ainda não analisadas.
 */
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TriagemIA } from "./useAiScreening";

export interface RankingRow {
  candidatura_id: string;
  candidato_auth_id: string;
  vaga_id: string;
  nome: string;
  email: string;
  etapa_atual: string;
  status: string;
  data_candidatura: string;
  triagem: TriagemIA | null;
}

export function useRankingVaga(vagaId?: string) {
  return useQuery({
    queryKey: ["ranking-vaga", vagaId],
    enabled: !!vagaId,
    staleTime: 30_000,
    queryFn: async (): Promise<RankingRow[]> => {
      if (!vagaId) return [];

      const { data: candidaturas, error: cErr } = await supabase
        .from("candidaturas")
        .select("id, candidato_auth_id, vaga_id, etapa_atual, status, data_candidatura, candidatos_auth(nome, email)")
        .eq("vaga_id", vagaId)
        .is("deleted_at", null);
      if (cErr) throw cErr;

      const { data: triagens, error: tErr } = await supabase
        .from("triagem_ia")
        .select("*")
        .eq("vaga_id", vagaId);
      if (tErr) throw tErr;

      const map = new Map<string, TriagemIA>();
      (triagens ?? []).forEach((t) => map.set((t as TriagemIA).candidatura_id, t as TriagemIA));

      const rows: RankingRow[] = (candidaturas ?? []).map((c) => {
        const auth = (c as { candidatos_auth?: { nome?: string; email?: string } | null }).candidatos_auth;
        return {
          candidatura_id: c.id,
          candidato_auth_id: c.candidato_auth_id,
          vaga_id: c.vaga_id,
          nome: auth?.nome ?? "—",
          email: auth?.email ?? "—",
          etapa_atual: c.etapa_atual,
          status: c.status,
          data_candidatura: c.data_candidatura,
          triagem: map.get(c.id) ?? null,
        };
      });

      rows.sort((a, b) => {
        const sa = a.triagem?.score ?? -1;
        const sb = b.triagem?.score ?? -1;
        if (sb !== sa) return sb - sa;
        return a.data_candidatura.localeCompare(b.data_candidatura);
      });

      return rows;
    },
  });
}

export function useBulkAiScreening(vagaId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (candidaturaIds: string[]) => {
      const results: { id: string; ok: boolean; error?: string }[] = [];
      // Executa sequencialmente para respeitar rate-limit da edge function
      for (const id of candidaturaIds) {
        try {
          const { error } = await supabase.functions.invoke("ai-screening", {
            body: { candidaturaId: id },
          });
          if (error) throw error;
          results.push({ id, ok: true });
        } catch (e) {
          results.push({ id, ok: false, error: e instanceof Error ? e.message : String(e) });
        }
      }
      return results;
    },
    onSuccess: () => {
      if (vagaId) {
        qc.invalidateQueries({ queryKey: ["ranking-vaga", vagaId] });
        qc.invalidateQueries({ queryKey: ["triagem-ia-vaga", vagaId] });
      }
    },
  });
}

export function useRankingStats(rows: RankingRow[]) {
  return useMemo(() => {
    const total = rows.length;
    const triados = rows.filter((r) => r.triagem).length;
    const aprovar = rows.filter((r) => r.triagem?.recomendacao === "aprovar").length;
    const revisar = rows.filter((r) => r.triagem?.recomendacao === "revisar").length;
    const reprovar = rows.filter((r) => r.triagem?.recomendacao === "reprovar").length;
    const scores = rows.map((r) => r.triagem?.score).filter((s): s is number => typeof s === "number");
    const media = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return { total, triados, pendentes: total - triados, aprovar, revisar, reprovar, media };
  }, [rows]);
}
