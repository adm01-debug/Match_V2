/**
 * @module hooks/useCandidatoCandidaturas
 * @description Candidaturas de um candidato do banco de talentos.
 *
 * Decisões deliberadas:
 * - **Ponte por e-mail**: `candidaturas` referencia `candidatos_auth` (portal
 *   externo), enquanto o CRM usa `candidatos`. O elo estável entre os dois é o
 *   e-mail; sem ele o candidato do CRM simplesmente não tem candidaturas.
 * - **Consulta sob demanda (`enabled`)**: só dispara quando o painel de
 *   detalhes está aberto, evitando trabalho para listas inteiras.
 * - **Falha silenciosa controlada**: e-mail ausente retorna lista vazia em vez
 *   de erro — é ausência de dado, não falha de sistema.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CandidatoCandidatura {
  readonly id: string;
  readonly vaga_titulo: string;
  readonly etapa_atual: string;
  readonly data_candidatura: string;
}

export const candidatoCandidaturasKeys = {
  byEmail: (email: string) => ["candidato-candidaturas", email] as const,
};

export function useCandidatoCandidaturas(email: string | null | undefined, enabled = true) {
  const chave = (email ?? "").trim().toLowerCase();

  return useQuery<readonly CandidatoCandidatura[]>({
    queryKey: candidatoCandidaturasKeys.byEmail(chave),
    enabled: enabled && chave.length > 0,
    staleTime: 60_000,
    queryFn: async () => {
      const { data: auth, error: erroAuth } = await supabase
        .from("candidatos_auth")
        .select("id")
        .ilike("email", chave)
        .maybeSingle();
      if (erroAuth) throw erroAuth;
      if (!auth?.id) return [];

      const { data, error } = await supabase
        .from("candidaturas")
        .select("id, etapa_atual, data_candidatura, vagas(titulo)")
        .eq("candidato_auth_id", auth.id)
        .is("deleted_at", null)
        .order("data_candidatura", { ascending: false })
        .limit(20);
      if (error) throw error;

      return (data ?? []).map((linha) => {
        const vaga = linha.vagas as { titulo?: string | null } | null;
        return {
          id: String(linha.id),
          vaga_titulo: vaga?.titulo ? String(vaga.titulo) : "Vaga sem título",
          etapa_atual: String(linha.etapa_atual ?? ""),
          data_candidatura: String(linha.data_candidatura),
        };
      });
    },
  });
}
