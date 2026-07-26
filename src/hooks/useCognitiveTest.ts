/**
 * @module hooks/useCognitiveTest
 * @description Etapas 2-3 — Aplicação e leitura de testes cognitivos.
 *
 * Toda a lógica sensível (sorteio de itens, correção, tempo limite, pontuação)
 * roda no banco via RPCs `SECURITY DEFINER`. Este hook é apenas o transporte:
 * ele nunca conhece o gabarito nem calcula score localmente.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  CognitiveDomain,
  CognitiveResult,
  CognitiveSessionItem,
  CognitiveSessionStatus,
  StartCognitiveSessionInput,
  CognitiveDomainScore,
} from "@/types/cognitive";

/** Chaves de cache centralizadas para invalidação previsível. */
export const cognitiveKeys = {
  all: ["cognitive"] as const,
  items: (sessionId: string) => ["cognitive", "items", sessionId] as const,
  result: (sessionId: string) => ["cognitive", "result", sessionId] as const,
  sessions: (candidatoId?: string | null) =>
    ["cognitive", "sessions", candidatoId ?? "todos"] as const,
};

interface RawSessionItem {
  item_id: string;
  ordem: number;
  dominio: CognitiveDomain;
  enunciado: string;
  contexto: string | null;
  alternativas: unknown;
  dificuldade: number;
  tempo_sugerido_seg: number;
  resposta: string | null;
}

/** Converte o JSONB de alternativas com validação defensiva. */
function parseAlternativas(bruto: unknown): CognitiveSessionItem["alternativas"] {
  if (!Array.isArray(bruto)) return [];
  return bruto
    .filter(
      (alt): alt is { id: unknown; texto: unknown } =>
        typeof alt === "object" && alt !== null && "id" in alt && "texto" in alt,
    )
    .map((alt) => ({ id: String(alt.id), texto: String(alt.texto) }));
}

function mapItem(raw: RawSessionItem): CognitiveSessionItem {
  return {
    itemId: raw.item_id,
    ordem: raw.ordem,
    dominio: raw.dominio,
    enunciado: raw.enunciado,
    contexto: raw.contexto,
    alternativas: parseAlternativas(raw.alternativas),
    dificuldade: raw.dificuldade,
    tempoSugeridoSeg: raw.tempo_sugerido_seg,
    resposta: raw.resposta,
  };
}

function mapPorDominio(bruto: unknown): CognitiveResult["porDominio"] {
  if (typeof bruto !== "object" || bruto === null) return {};
  const saida: Record<string, CognitiveDomainScore> = {};
  for (const [chave, valor] of Object.entries(bruto as Record<string, unknown>)) {
    if (typeof valor !== "object" || valor === null) continue;
    const v = valor as Record<string, unknown>;
    saida[chave] = {
      itens: Number(v["itens"] ?? 0),
      acertos: Number(v["acertos"] ?? 0),
      percentual: Number(v["percentual"] ?? 0),
      tempoMedioSeg: Number(v["tempo_medio_seg"] ?? 0),
    };
  }
  return saida as CognitiveResult["porDominio"];
}

/** Converte um campo numérico opcional preservando a distinção entre 0 e ausente. */
function numeroOuNulo(valor: unknown): number | null {
  if (valor === null || valor === undefined) return null;
  const convertido = Number(valor);
  return Number.isFinite(convertido) ? convertido : null;
}

function mapResult(bruto: unknown): CognitiveResult | null {
  if (typeof bruto !== "object" || bruto === null) return null;
  const r = bruto as Record<string, unknown>;
  return {
    sessionId: String(r["session_id"] ?? ""),
    status: (r["status"] as CognitiveSessionStatus | undefined) ?? "em_andamento",
    scoreBruto: numeroOuNulo(r["score_bruto"]),
    totalItens: Number(r["total_itens"] ?? 0),
    scoreNormalizado: numeroOuNulo(r["score_normalizado"]),
    porDominio: mapPorDominio(r["por_dominio"]),
    percentil: numeroOuNulo(r["percentil"]),
    amostraNormativa: Number(r["amostra_normativa"] ?? 0),
    iniciadaEm: (r["iniciada_em"] as string | null | undefined) ?? null,
    finalizadaEm: (r["finalizada_em"] as string | null | undefined) ?? null,
  };
}

/** Abre uma nova sessão de prova e devolve o id gerado. */
export function useStartCognitiveSession() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, StartCognitiveSessionInput>({
    mutationFn: async (input) => {
      const { data, error } = await supabase.rpc("start_cognitive_session", {
        p_candidato_id: input.candidatoId ?? undefined,
        p_vaga_id: input.vagaId ?? undefined,
        p_dominios: input.dominios ? [...input.dominios] : undefined,
        p_itens_por_dominio: input.itensPorDominio,
        p_tempo_limite_seg: input.tempoLimiteSeg,
      });
      if (error) throw new Error(error.message);
      if (!data) throw new Error("Não foi possível iniciar a avaliação.");
      return String(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cognitiveKeys.all });
    },
  });
}

/** Carrega os itens da sessão (sem gabarito). */
export function useCognitiveSessionItems(sessionId: string | null) {
  return useQuery({
    queryKey: cognitiveKeys.items(sessionId ?? ""),
    enabled: Boolean(sessionId),
    staleTime: Infinity, // itens de uma sessão não mudam durante a aplicação
    queryFn: async (): Promise<CognitiveSessionItem[]> => {
      const { data, error } = await supabase.rpc("get_cognitive_session_items", {
        p_session_id: sessionId as string,
      });
      if (error) throw new Error(error.message);
      return ((data ?? []) as RawSessionItem[]).map(mapItem);
    },
  });
}

/** Envia uma resposta; a correção é decidida no servidor. */
export function useSubmitCognitiveResponse() {
  return useMutation<
    void,
    Error,
    { sessionId: string; itemId: string; resposta: string; tempoGastoSeg: number }
  >({
    mutationFn: async ({ sessionId, itemId, resposta, tempoGastoSeg }) => {
      const { error } = await supabase.rpc("submit_cognitive_response", {
        p_session_id: sessionId,
        p_item_id: itemId,
        p_resposta: resposta,
        p_tempo_gasto_seg: Math.max(0, Math.round(tempoGastoSeg)),
      });
      if (error) throw new Error(error.message);
    },
  });
}

/** Encerra a sessão e dispara a pontuação. */
export function useFinishCognitiveSession() {
  const queryClient = useQueryClient();

  return useMutation<CognitiveResult | null, Error, string>({
    mutationFn: async (sessionId) => {
      const { error } = await supabase.rpc("finish_cognitive_session", {
        p_session_id: sessionId,
      });
      if (error) throw new Error(error.message);

      const { data, error: resultError } = await supabase.rpc("get_cognitive_result", {
        p_session_id: sessionId,
      });
      if (resultError) throw new Error(resultError.message);
      return mapResult(data);
    },
    onSuccess: (_data, sessionId) => {
      void queryClient.invalidateQueries({ queryKey: cognitiveKeys.result(sessionId) });
      void queryClient.invalidateQueries({ queryKey: cognitiveKeys.sessions() });
    },
  });
}

/** Resultado consolidado, com percentil normativo. */
export function useCognitiveResult(sessionId: string | null) {
  return useQuery({
    queryKey: cognitiveKeys.result(sessionId ?? ""),
    enabled: Boolean(sessionId),
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_cognitive_result", {
        p_session_id: sessionId as string,
      });
      if (error) throw new Error(error.message);
      return mapResult(data);
    },
  });
}

/** Últimas sessões concluídas de um candidato — usado no perfil e no ranking. */
export function useCandidatoCognitiveSessions(candidatoId: string | null) {
  return useQuery({
    queryKey: cognitiveKeys.sessions(candidatoId),
    enabled: Boolean(candidatoId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cognitive_sessions")
        .select("id, status, score_normalizado, score_bruto, total_itens, finalizada_em, vaga_id")
        .eq("candidato_id", candidatoId as string)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}

/**
 * Cronômetro regressivo da prova.
 * O servidor continua sendo a autoridade sobre expiração; este contador existe
 * apenas para dar feedback visual e disparar o encerramento automático.
 */
export function useCognitiveTimer(iniciadaEm: string | null, tempoLimiteSeg: number) {
  const fim = useMemo(() => {
    if (!iniciadaEm) return null;
    return new Date(iniciadaEm).getTime() + tempoLimiteSeg * 1000;
  }, [iniciadaEm, tempoLimiteSeg]);

  const calcular = useCallback(() => {
    if (!fim) return tempoLimiteSeg;
    return Math.max(0, Math.round((fim - Date.now()) / 1000));
  }, [fim, tempoLimiteSeg]);

  const [restante, setRestante] = useState<number>(calcular);

  useEffect(() => {
    setRestante(calcular());
    const id = window.setInterval(() => setRestante(calcular()), 1000);
    return () => window.clearInterval(id);
  }, [calcular]);

  return { restanteSeg: restante, esgotado: restante <= 0 };
}
