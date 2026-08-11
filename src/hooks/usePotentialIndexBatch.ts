/**
 * @module hooks/usePotentialIndexBatch
 * @description Etapa 5 (parte 2) — Índice de Potencial em lote, para listas e rankings.
 *
 * Por que existe um hook separado do `usePotentialIndex`:
 * chamar o hook individual dentro de cada card produziria N requisições por
 * página (problema clássico N+1 no cliente). Aqui fazemos exatamente DUAS
 * consultas com `IN (...)` e reduzimos no cliente, escolhendo o registro mais
 * recente por candidato. Custo: O(1) round-trips por página renderizada.
 *
 * As mesmas regras semânticas do hook individual valem aqui: sinal ausente
 * permanece ausente e o cálculo renormaliza os pesos.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calcularIndicePotencial } from "@/lib/potentialIndex";
import type { PotentialIndexResult } from "@/lib/potentialIndex";

export type PotentialIndexMap = Readonly<Record<string, PotentialIndexResult>>;

/** Limite defensivo: acima disso a cláusula IN degrada e o payload fica caro. */
const MAX_IDS_POR_LOTE = 200;

function toNumero(valor: unknown): number | null {
  if (valor === null || valor === undefined) return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

/** Compara datas tolerando `null` (registro sem data perde para um com data). */
function maisRecente(a: string | null, b: string | null): boolean {
  if (a === null) return false;
  if (b === null) return true;
  return Date.parse(a) > Date.parse(b);
}

export const potentialIndexBatchKeys = {
  byIds: (ids: readonly string[]) => ["potential-index-batch", [...ids].sort()] as const,
};

export function usePotentialIndexBatch(candidatoIds: readonly string[]) {
  // Ordena e deduplica para que a queryKey seja estável entre renders.
  const ids = Array.from(new Set(candidatoIds.filter(Boolean))).slice(0, MAX_IDS_POR_LOTE);

  return useQuery<PotentialIndexMap>({
    queryKey: potentialIndexBatchKeys.byIds(ids),
    enabled: ids.length > 0,
    staleTime: 60_000,
    queryFn: async () => {
      const [cognitivas, comportamentais] = await Promise.all([
        supabase
          .from("cognitive_sessions")
          .select("candidato_id, score_normalizado, finalizada_em")
          .in("candidato_id", ids)
          .eq("status", "concluida")
          .is("deleted_at", null),
        supabase
          .from("avaliacoes_comportamentais_resultados")
          .select("candidato_id, score_geral, fit_geral, finalizado_em")
          .in("candidato_id", ids),
      ]);

      // Falha parcial não derruba a tela: o sinal simplesmente fica ausente.
      const cognitivoPor = new Map<string, { valor: number | null; em: string | null }>();
      for (const linha of cognitivas.data ?? []) {
        const id = linha.candidato_id;
        if (!id) continue;
        const atual = cognitivoPor.get(id);
        if (!atual || maisRecente(linha.finalizada_em, atual.em)) {
          cognitivoPor.set(id, {
            valor: toNumero(linha.score_normalizado),
            em: linha.finalizada_em,
          });
        }
      }

      const comportamentalPor = new Map<
        string,
        { score: number | null; fit: number | null; em: string | null }
      >();
      for (const linha of comportamentais.data ?? []) {
        const id = linha.candidato_id;
        if (!id) continue;
        const atual = comportamentalPor.get(id);
        if (!atual || maisRecente(linha.finalizado_em, atual.em)) {
          comportamentalPor.set(id, {
            score: toNumero(linha.score_geral),
            fit: toNumero(linha.fit_geral),
            em: linha.finalizado_em,
          });
        }
      }

      const mapa: Record<string, PotentialIndexResult> = {};
      for (const id of ids) {
        mapa[id] = calcularIndicePotencial({
          cognitivo: cognitivoPor.get(id)?.valor ?? null,
          comportamental: comportamentalPor.get(id)?.score ?? null,
          cultural: comportamentalPor.get(id)?.fit ?? null,
        });
      }
      return mapa;
    },
  });
}
