import { useCallback, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/logger";
import { buildCsv, downloadCsv, type CsvColumn } from "@/lib/csvExport";
import type { TalentSearchFilters, TalentSearchRow } from "@/hooks/useTalentSearch";

/**
 * Exportação CSV do resultado COMPLETO da busca (não apenas da página
 * visível): exportar só a página corrente é a pegadinha clássica desse
 * recurso e gera relatórios silenciosamente incompletos.
 *
 * Estratégia: refaz a mesma RPC `search_candidatos` em lotes, respeitando
 * o teto de 200 do servidor. Um limite absoluto evita que um filtro vazio
 * puxe a base inteira para a memória do navegador.
 */

/** Teto por chamada imposto pela própria RPC (`LEAST(p_limit, 200)`). */
const BATCH_SIZE = 200;
/** Teto absoluto de linhas exportadas em uma única operação. */
export const EXPORT_MAX_ROWS = 5_000;

const NIVEL_LABEL: Record<string, string> = {
  nenhum: "Nenhum",
  basico: "Básico",
  intermediario: "Intermediário",
  avancado: "Avançado",
  fluente: "Fluente",
  nativo: "Nativo",
};

function label(value: string | null | undefined, map?: Record<string, string>): string {
  if (!value) return "";
  const mapped = map?.[value];
  if (mapped) return mapped;
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR");
}

export const TALENT_CSV_COLUMNS: readonly CsvColumn<TalentSearchRow>[] = [
  { header: "Nome", value: (r) => r.nome },
  { header: "E-mail", value: (r) => r.email },
  { header: "Telefone", value: (r) => r.telefone },
  { header: "Status", value: (r) => label(r.status) },
  { header: "Senioridade", value: (r) => label(r.senioridade) },
  { header: "Inglês", value: (r) => label(r.nivel_ingles, NIVEL_LABEL) },
  { header: "Regime", value: (r) => label(r.regime) },
  { header: "Modalidade", value: (r) => label(r.modalidade) },
  {
    header: "Pretensão",
    value: (r) =>
      r.pretensao_salarial === null
        ? ""
        : `${r.pretensao_moeda ?? "BRL"} ${r.pretensao_salarial}`,
  },
  { header: "Disponibilidade (dias)", value: (r) => r.disponibilidade_dias },
  { header: "Aberto a oportunidades", value: (r) => r.aberto_a_oportunidades },
  { header: "Habilidades", value: (r) => r.habilidades ?? [] },
  { header: "Skills casadas", value: (r) => r.skills_match },
  { header: "Fonte", value: (r) => r.fonte },
  { header: "Cadastrado em", value: (r) => formatDate(r.created_at) },
];

function rpcParams(filters: TalentSearchFilters, limit: number, offset: number) {
  const arr = <T,>(a: T[]) => (a.length > 0 ? a : undefined);
  const nn = <T,>(v: T | null) => (v === null ? undefined : v);
  return {
    p_termo: filters.termo.trim() || undefined,
    p_status: arr(filters.status),
    p_senioridade: arr(filters.senioridade),
    p_nivel_ingles_min: nn(filters.nivelInglesMin),
    p_regime: arr(filters.regime),
    p_modalidade: arr(filters.modalidade),
    p_pretensao_min: nn(filters.pretensaoMin),
    p_pretensao_max: nn(filters.pretensaoMax),
    p_disponibilidade_max: nn(filters.disponibilidadeMax),
    p_aberto_a_oportunidades: nn(filters.abertoAOportunidades),
    p_skill_ids: arr(filters.skillIds),
    p_skills_match_all: filters.skillsMatchAll,
    p_order_by: filters.orderBy,
    p_limit: limit,
    p_offset: offset,
  };
}

export function useTalentExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportCsv = useCallback(
    async (filters: TalentSearchFilters, expectedTotal: number) => {
      if (isExporting) return;
      if (expectedTotal <= 0) {
        toast.info("Nada para exportar", {
          description: "A busca atual não retornou candidatos.",
        });
        return;
      }

      setIsExporting(true);
      setProgress(0);
      const target = Math.min(expectedTotal, EXPORT_MAX_ROWS);

      try {
        const collected: TalentSearchRow[] = [];
        for (let offset = 0; offset < target; offset += BATCH_SIZE) {
          const limit = Math.min(BATCH_SIZE, target - offset);
          const { data, error } = await supabase.rpc(
            "search_candidatos",
            rpcParams(filters, limit, offset)
          );
          if (error) throw error;

          const batch = (data ?? []) as unknown as TalentSearchRow[];
          collected.push(...batch);
          setProgress(Math.round((collected.length / target) * 100));

          // Lote menor que o pedido ⇒ acabaram os resultados. Sem essa
          // guarda, um total desatualizado geraria requisições vazias.
          if (batch.length < limit) break;
        }

        if (collected.length === 0) {
          toast.info("Nada para exportar", {
            description: "Os resultados mudaram desde a última busca.",
          });
          return;
        }

        const stamp = new Date().toISOString().slice(0, 10);
        downloadCsv(buildCsv(collected, TALENT_CSV_COLUMNS), `talentos-${stamp}`);

        toast.success(`${collected.length} talentos exportados`, {
          description:
            expectedTotal > EXPORT_MAX_ROWS
              ? `Limite de ${EXPORT_MAX_ROWS} linhas atingido. Refine os filtros para exportar o restante.`
              : "Arquivo CSV gerado com codificação UTF-8.",
        });
      } catch (err) {
        logger.error("Falha ao exportar talentos em CSV", err);
        toast.error("Não foi possível exportar", {
          description: "Tente novamente em instantes ou reduza o intervalo de filtros.",
        });
      } finally {
        setIsExporting(false);
        setProgress(0);
      }
    },
    [isExporting]
  );

  return { exportCsv, isExporting, progress };
}
