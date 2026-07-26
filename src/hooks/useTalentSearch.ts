import { useCallback, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/logger";
import type {
  ModalidadeTrabalho,
  NivelIdioma,
  RegimeContratacao,
  SenioridadeNivel,
} from "@/types/techProfile";

/**
 * Busca de talentos executada no servidor (RPC `search_candidatos`).
 *
 * Por que RPC e não query builder: os filtros envolvem (a) comparação
 * ordinal de um enum de idioma, (b) contagem de skills casadas com
 * semântica "todas" vs "qualquer uma" e (c) total de resultados junto
 * da página. Nada disso é expressável em uma única chamada PostgREST
 * sem round-trips extras.
 *
 * A RPC é SECURITY INVOKER: as políticas de acesso continuam valendo.
 */

export type SearchOrder =
  | "created_at"
  | "nome"
  | "pretensao_asc"
  | "pretensao_desc"
  | "skills_match";

export interface TalentSearchFilters {
  termo: string;
  status: string[];
  senioridade: SenioridadeNivel[];
  nivelInglesMin: NivelIdioma | null;
  regime: RegimeContratacao[];
  modalidade: ModalidadeTrabalho[];
  pretensaoMin: number | null;
  pretensaoMax: number | null;
  disponibilidadeMax: number | null;
  abertoAOportunidades: boolean | null;
  skillIds: string[];
  skillsMatchAll: boolean;
  orderBy: SearchOrder;
}

export const DEFAULT_TALENT_FILTERS: TalentSearchFilters = {
  termo: "",
  status: [],
  senioridade: [],
  nivelInglesMin: null,
  regime: [],
  modalidade: [],
  pretensaoMin: null,
  pretensaoMax: null,
  disponibilidadeMax: null,
  abertoAOportunidades: null,
  skillIds: [],
  skillsMatchAll: false,
  orderBy: "created_at",
};

export interface TalentSearchRow {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  resumo: string | null;
  habilidades: string[] | null;
  experiencias: unknown;
  formacao: unknown;
  fonte: string | null;
  status: string | null;
  arquivo_curriculo: string | null;
  created_at: string;
  updated_at: string;
  senioridade: SenioridadeNivel | null;
  nivel_ingles: NivelIdioma | null;
  pretensao_salarial: number | null;
  pretensao_moeda: string | null;
  regime: RegimeContratacao | null;
  modalidade: ModalidadeTrabalho | null;
  disponibilidade_dias: number | null;
  aberto_a_oportunidades: boolean | null;
  skills_match: number;
  total_count: number;
}

/**
 * A assinatura gerada da RPC usa parâmetros opcionais (`undefined`),
 * então omitir é o equivalente a NULL no SQL — que significa
 * "sem filtro". Convertemos `null`/vazio para `undefined` aqui.
 */
function orUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

function nullIfEmpty<T>(arr: T[]): T[] | undefined {
  return arr.length > 0 ? arr : undefined;
}

export function countActiveFilters(f: TalentSearchFilters): number {
  return [
    f.termo.trim().length > 0,
    f.status.length > 0,
    f.senioridade.length > 0,
    f.nivelInglesMin !== null,
    f.regime.length > 0,
    f.modalidade.length > 0,
    f.pretensaoMin !== null,
    f.pretensaoMax !== null,
    f.disponibilidadeMax !== null,
    f.abertoAOportunidades !== null,
    f.skillIds.length > 0,
  ].filter(Boolean).length;
}

export const TALENT_PAGE_SIZE = 24;

export function useTalentSearch(pageSize: number = TALENT_PAGE_SIZE) {
  const [filters, setFilters] = useState<TalentSearchFilters>(DEFAULT_TALENT_FILTERS);
  const [page, setPage] = useState(0);

  /** Toda alteração de filtro reseta a paginação — senão o usuário cai
   *  numa página que não existe mais no novo conjunto de resultados. */
  const patchFilters = useCallback((patch: Partial<TalentSearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(0);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_TALENT_FILTERS);
    setPage(0);
  }, []);

  const query = useQuery({
    queryKey: ["talent-search", filters, page, pageSize],
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    queryFn: async (): Promise<TalentSearchRow[]> => {
      const { data, error } = await supabase.rpc("search_candidatos", {
        p_termo: filters.termo.trim() || null,
        p_status: nullIfEmpty(filters.status),
        p_senioridade: nullIfEmpty(filters.senioridade),
        p_nivel_ingles_min: filters.nivelInglesMin,
        p_regime: nullIfEmpty(filters.regime),
        p_modalidade: nullIfEmpty(filters.modalidade),
        p_pretensao_min: filters.pretensaoMin,
        p_pretensao_max: filters.pretensaoMax,
        p_disponibilidade_max: filters.disponibilidadeMax,
        p_aberto_a_oportunidades: filters.abertoAOportunidades,
        p_skill_ids: nullIfEmpty(filters.skillIds),
        p_skills_match_all: filters.skillsMatchAll,
        p_order_by: filters.orderBy,
        p_limit: pageSize,
        p_offset: page * pageSize,
      });

      if (error) {
        logger.error("Falha na busca de talentos", error);
        throw error;
      }
      return (data ?? []) as unknown as TalentSearchRow[];
    },
  });

  const rows = useMemo(() => query.data ?? [], [query.data]);

  /** `total_count` vem repetido em cada linha (CROSS JOIN no SQL).
   *  Zero linhas ⇒ zero resultados, e não "total desconhecido". */
  const total = rows[0]?.total_count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return {
    filters,
    patchFilters,
    resetFilters,
    activeFiltersCount: countActiveFilters(filters),
    rows,
    total,
    page,
    pageCount,
    setPage,
    canPrev: page > 0,
    canNext: page + 1 < pageCount,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
