/**
 * @module useInterviewKits
 * @description Vincula templates de entrevista (roteiros) a vagas e captura respostas.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface VagaInterviewKit {
  id: string;
  vaga_id: string;
  template_id: string;
  etapa: string | null;
  ordem: number;
  created_at: string;
  updated_at: string;
  template?: {
    id: string;
    nome: string;
    descricao: string | null;
    tipo_entrevista: string | null;
    duracao_sugerida: number | null;
  };
}

export interface KitPergunta {
  id: string;
  pergunta: string;
  tipo: string | null;
  criterios_avaliacao: string[] | null;
  resposta_ideal: string | null;
  pontuacao_maxima: number | null;
  obrigatoria: boolean | null;
  ordem: number | null;
}

export function useVagaInterviewKits(vagaId?: string) {
  return useQuery({
    queryKey: ["vaga-interview-kits", vagaId],
    queryFn: async () => {
      if (!vagaId) return [] as VagaInterviewKit[];
      const { data, error } = await supabase
        .from("vaga_interview_kits")
        .select("*, template:templates_entrevista(id, nome, descricao, tipo_entrevista, duracao_sugerida)")
        .eq("vaga_id", vagaId)
        .order("ordem", { ascending: true });
      if (error) throw error;
      return (data ?? []) as VagaInterviewKit[];
    },
    enabled: !!vagaId,
    staleTime: 60_000,
  });
}

export function useAttachKitToVaga() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { vagaId: string; templateId: string; etapa?: string; ordem?: number }) => {
      const { data, error } = await supabase
        .from("vaga_interview_kits")
        .insert({
          vaga_id: input.vagaId,
          template_id: input.templateId,
          etapa: input.etapa ?? null,
          ordem: input.ordem ?? 0,
        })
        .select()
        .single();
      if (error) throw error;
      return data as VagaInterviewKit;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["vaga-interview-kits", vars.vagaId] });
    },
  });
}

export function useDetachKitFromVaga() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; vagaId: string }) => {
      const { error } = await supabase.from("vaga_interview_kits").delete().eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["vaga-interview-kits", vars.vagaId] });
    },
  });
}

export function useKitPerguntas(templateId?: string) {
  return useQuery({
    queryKey: ["kit-perguntas", templateId],
    queryFn: async () => {
      if (!templateId) return [] as KitPergunta[];
      const { data, error } = await supabase
        .from("template_perguntas")
        .select("id, pergunta, tipo, criterios_avaliacao, resposta_ideal, pontuacao_maxima, obrigatoria, ordem")
        .eq("template_id", templateId)
        .order("ordem", { ascending: true });
      if (error) throw error;
      return (data ?? []) as KitPergunta[];
    },
    enabled: !!templateId,
    staleTime: 60_000,
  });
}

export interface RespostaInput {
  entrevistaId: string;
  templateId: string;
  perguntaId: string;
  resposta?: string;
  nota?: number;
  observacoes?: string;
}

export function useSaveKitResposta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: RespostaInput) => {
      // upsert manual: procurar existente por (entrevista, pergunta)
      const { data: existing } = await supabase
        .from("entrevista_respostas")
        .select("id")
        .eq("entrevista_id", input.entrevistaId)
        .eq("pergunta_id", input.perguntaId)
        .maybeSingle();

      const payload = {
        entrevista_id: input.entrevistaId,
        template_id: input.templateId,
        pergunta_id: input.perguntaId,
        resposta_candidato: input.resposta ?? null,
        nota: input.nota ?? null,
        observacoes: input.observacoes ?? null,
      };

      if (existing?.id) {
        const { data, error } = await supabase
          .from("entrevista_respostas")
          .update(payload)
          .eq("id", existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabase
        .from("entrevista_respostas")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["entrevista-respostas", vars.entrevistaId] });
    },
  });
}

export function useEntrevistaRespostas(entrevistaId?: string) {
  return useQuery({
    queryKey: ["entrevista-respostas", entrevistaId],
    queryFn: async () => {
      if (!entrevistaId) return [];
      const { data, error } = await supabase
        .from("entrevista_respostas")
        .select("*")
        .eq("entrevista_id", entrevistaId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!entrevistaId,
  });
}
