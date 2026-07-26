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
        p_nota: nota ?? null,
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
