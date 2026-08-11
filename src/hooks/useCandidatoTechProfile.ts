/**
 * @module useCandidatoTechProfile
 * @description Leitura e atualização dos campos técnicos do candidato
 * (senioridade, inglês, pretensão, regime, modalidade, disponibilidade).
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { TechProfile } from "@/types/techProfile";
import { logger } from "@/services/logger";

const TECH_COLUMNS =
  "senioridade, nivel_ingles, pretensao_salarial, pretensao_moeda, regime, modalidade, disponibilidade_dias, aberto_a_oportunidades";

export function useCandidatoTechProfile(candidatoId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ["candidato-tech-profile", candidatoId];

  const query = useQuery({
    queryKey,
    enabled: Boolean(candidatoId),
    queryFn: async (): Promise<TechProfile | null> => {
      const { data, error } = await supabase
        .from("candidatos")
        .select(TECH_COLUMNS)
        .eq("id", candidatoId!)
        .maybeSingle();

      if (error) throw error;
      return (data as TechProfile | null) ?? null;
    },
  });

  const update = useMutation({
    mutationFn: async (patch: Partial<TechProfile>) => {
      if (!candidatoId) throw new Error("candidatoId é obrigatório");

      // Validações defensivas — o banco também protege, mas falhamos cedo com
      // mensagem legível em vez de devolver erro cru do Postgres.
      if (patch.pretensao_salarial != null && patch.pretensao_salarial < 0) {
        throw new Error("Pretensão salarial não pode ser negativa");
      }
      if (patch.disponibilidade_dias != null && patch.disponibilidade_dias < 0) {
        throw new Error("Disponibilidade em dias não pode ser negativa");
      }

      const { error } = await supabase
        .from("candidatos")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", candidatoId);

      if (error) throw error;
      return patch;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
      toast.success("Perfil técnico atualizado");
    },
    onError: (error: Error) => {
      logger.error("Falha ao atualizar perfil técnico", error);
      toast.error(error.message || "Não foi possível salvar o perfil técnico");
    },
  });

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    update,
    isSaving: update.isPending,
  };
}
