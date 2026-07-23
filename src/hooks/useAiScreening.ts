/**
 * @module useAiScreening
 * @description Consome a edge function ai-screening e expõe as triagens por vaga/candidatura.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TriagemIA {
  id: string;
  candidatura_id: string;
  vaga_id: string;
  candidato_auth_id: string;
  score: number;
  resumo: string;
  pontos_fortes: string[];
  red_flags: string[];
  recomendacao: "aprovar" | "revisar" | "reprovar";
  match_habilidades: { presentes: string[]; ausentes: string[] };
  modelo: string;
  cache_hit: boolean;
  created_at: string;
  updated_at: string;
}

export function useTriagemCandidatura(candidaturaId?: string) {
  return useQuery({
    queryKey: ["triagem-ia", candidaturaId],
    queryFn: async () => {
      if (!candidaturaId) return null;
      const { data, error } = await supabase
        .from("triagem_ia")
        .select("*")
        .eq("candidatura_id", candidaturaId)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as TriagemIA | null;
    },
    enabled: !!candidaturaId,
    staleTime: 30_000,
  });
}

export function useTriagensVaga(vagaId?: string) {
  return useQuery({
    queryKey: ["triagem-ia-vaga", vagaId],
    queryFn: async () => {
      if (!vagaId) return [] as TriagemIA[];
      const { data, error } = await supabase
        .from("triagem_ia")
        .select("*")
        .eq("vaga_id", vagaId)
        .order("score", { ascending: false });
      if (error) throw error;
      return (data ?? []) as TriagemIA[];
    },
    enabled: !!vagaId,
    staleTime: 30_000,
  });
}

export function useRunAiScreening() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { candidaturaId: string; force?: boolean }) => {
      const { data, error } = await supabase.functions.invoke<{
        triagem: TriagemIA;
        cache_hit: boolean;
      }>("ai-screening", { body: input });
      if (error) throw error;
      if (!data?.triagem) throw new Error("Resposta inesperada da triagem");
      return data.triagem;
    },
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: ["triagem-ia", t.candidatura_id] });
      qc.invalidateQueries({ queryKey: ["triagem-ia-vaga", t.vaga_id] });
    },
  });
}
