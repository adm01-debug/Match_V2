/**
 * @module hooks/useRegisterFirstResponse
 * @description Registra o primeiro contato do RH com um candidato atrasado.
 *
 * A escrita é feita por RPC SECURITY DEFINER porque `historico_etapas` só
 * aceita insert por `service_role` — a regra de quem pode registrar mora no
 * banco, não no cliente.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

interface RegisterFirstResponseInput {
  readonly candidaturaId: string;
  readonly nota?: string;
}

/** Traduz os códigos de erro do banco para linguagem do usuário. */
function mensagemDeErro(mensagem: string): string {
  if (mensagem.includes("candidatura_sem_processo")) {
    return "Esta candidatura ainda não tem processo seletivo vinculado.";
  }
  if (mensagem.includes("candidatura_nao_encontrada")) {
    return "Candidatura não encontrada.";
  }
  if (mensagem.includes("forbidden")) {
    return "Você não tem permissão para registrar contato.";
  }
  return "Não foi possível registrar o contato.";
}

export function useRegisterFirstResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ candidaturaId, nota }: RegisterFirstResponseInput) => {
      const { data, error } = await supabase.rpc("hr_register_first_response", {
        p_candidatura_id: candidaturaId,
        p_nota: nota ?? undefined,
      });
      if (error) throw error;
      return data as string;
    },
    onSuccess: () => {
      toast.success("Contato registrado — candidatura saiu da fila de atraso.");
      queryClient.invalidateQueries({ queryKey: ["sla-overdue"] });
      queryClient.invalidateQueries({ queryKey: ["funnel-sla"] });
    },
    onError: (error: Error) => {
      toast.error(mensagemDeErro(error.message ?? ""));
    },
  });
}

/** Quantas chamadas simultâneas ao banco por lote. */
const CONCORRENCIA = 4;

/** Limite defensivo da nota — o histórico é para rastro, não para redação. */
export const NOTA_MAX_CHARS = 500;

export interface RegisterBatchResult {
  readonly sucesso: number;
  readonly falha: number;
  readonly primeiroErro: string | null;
}

export interface RegisterBatchInput {
  readonly ids: readonly string[];
  readonly nota?: string;
}

/** Normaliza a nota: string vazia/whitespace equivale a "sem nota". */
export function normalizarNota(nota?: string): string | undefined {
  const limpa = nota?.trim();
  if (!limpa) return undefined;
  return limpa.slice(0, NOTA_MAX_CHARS);
}

/**
 * Registra contato em lote.
 *
 * Por que não um único RPC com array: a operação precisa ser parcialmente
 * tolerante — uma candidatura sem processo vinculado não pode abortar as
 * outras 19. Aqui cada item falha isoladamente e o usuário recebe o placar.
 * A concorrência é limitada para não abrir dezenas de conexões simultâneas.
 */
export function useRegisterFirstResponseBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, nota }: RegisterBatchInput): Promise<RegisterBatchResult> => {
      const notaFinal = normalizarNota(nota);
      let sucesso = 0;
      let falha = 0;
      let primeiroErro: string | null = null;

      for (let i = 0; i < ids.length; i += CONCORRENCIA) {
        const bloco = ids.slice(i, i + CONCORRENCIA);
        const resultados = await Promise.allSettled(
          bloco.map(async (candidaturaId) => {
            const { error } = await supabase.rpc("hr_register_first_response", {
              p_candidatura_id: candidaturaId,
              p_nota: notaFinal,
            });
            if (error) throw error;
          }),

        );

        for (const r of resultados) {
          if (r.status === "fulfilled") {
            sucesso += 1;
          } else {
            falha += 1;
            if (primeiroErro === null) {
              const motivo = r.reason as { message?: string } | undefined;
              primeiroErro = mensagemDeErro(motivo?.message ?? "");
            }
          }
        }
      }

      return { sucesso, falha, primeiroErro };
    },
    onSuccess: ({ sucesso, falha, primeiroErro }) => {
      if (sucesso > 0) {
        toast.success(`${sucesso} contato(s) registrado(s).`);
      }
      if (falha > 0) {
        toast.error(`${falha} falharam. ${primeiroErro ?? ""}`.trim());
      }
      queryClient.invalidateQueries({ queryKey: ["sla-overdue"] });
      queryClient.invalidateQueries({ queryKey: ["funnel-sla"] });
    },
    onError: () => {
      toast.error("Não foi possível registrar os contatos em lote.");
    },
  });
}

