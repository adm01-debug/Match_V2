/**
 * @module useSkills
 * @description Acesso à taxonomia oficial de competências (472 skills em 15 categorias)
 * e às competências vinculadas a um candidato. A busca considera nome, slug e aliases,
 * permitindo casar variações escritas pelo candidato (ex.: "k8s" -> "Kubernetes").
 */
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Categorias suportadas pela taxonomia. */
export type SkillCategoria =
  | "linguagem"
  | "frontend"
  | "backend"
  | "mobile"
  | "banco_de_dados"
  | "cloud"
  | "devops"
  | "dados_ia"
  | "qa_testes"
  | "seguranca"
  | "ferramentas"
  | "produto_gestao"
  | "design_ux"
  | "soft_skills"
  | "idioma";

export const SKILL_CATEGORIA_LABEL: Record<SkillCategoria, string> = {
  linguagem: "Linguagens",
  frontend: "Front-end",
  backend: "Back-end",
  mobile: "Mobile",
  banco_de_dados: "Banco de Dados",
  cloud: "Cloud",
  devops: "DevOps & Infra",
  dados_ia: "Dados & IA",
  qa_testes: "QA & Testes",
  seguranca: "Segurança",
  ferramentas: "Ferramentas",
  produto_gestao: "Produto & Gestão",
  design_ux: "Design & UX",
  soft_skills: "Soft Skills",
  idioma: "Idiomas",
};

export interface Skill {
  id: string;
  nome: string;
  slug: string;
  categoria: string;
  aliases: string[];
}

export interface CandidatoSkill {
  id: string;
  candidato_id: string;
  skill_id: string;
  /** 1 a 5, validado por CHECK constraint no banco. */
  nivel: number | null;
  anos_experiencia: number | null;
  skill?: Skill;
}

/** Normaliza texto removendo acentos/pontuação para comparação tolerante a variações. */
export function normalizeSkillTerm(term: string): string {
  return term
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, "")
    .trim();
}

/**
 * Carrega a taxonomia completa. É um dataset pequeno (~472 linhas) e praticamente
 * imutável, então mantemos cache longo para evitar round-trips desnecessários.
 */
export function useSkills() {
  return useQuery({
    queryKey: ["skills", "taxonomy"],
    staleTime: 1000 * 60 * 60, // 1h — taxonomia é estável
    gcTime: 1000 * 60 * 60 * 2,
    queryFn: async (): Promise<Skill[]> => {
      const { data, error } = await supabase
        .from("skills")
        .select("id, nome, slug, categoria, aliases")
        .order("nome");

      if (error) throw error;
      return (data ?? []) as Skill[];
    },
  });
}

/**
 * Busca local (client-side) sobre a taxonomia já carregada.
 * Ranking: prefixo do nome > prefixo de alias > substring em qualquer campo.
 */
export function useSkillSearch(term: string, limit = 20) {
  const { data: skills = [], isLoading } = useSkills();

  const results = useMemo(() => {
    const q = normalizeSkillTerm(term);
    if (!q) return [] as Skill[];

    const scored: Array<{ skill: Skill; score: number }> = [];

    for (const skill of skills) {
      const nome = normalizeSkillTerm(skill.nome);
      const haystacks = [nome, skill.slug, ...skill.aliases.map(normalizeSkillTerm)];

      let score = Infinity;
      if (nome === q) score = 0;
      else if (haystacks.some((h) => h === q)) score = 1;
      else if (nome.startsWith(q)) score = 2;
      else if (haystacks.some((h) => h.startsWith(q))) score = 3;
      else if (haystacks.some((h) => h.includes(q))) score = 4;

      if (score !== Infinity) scored.push({ skill, score });
    }

    return scored
      .sort((a, b) => a.score - b.score || a.skill.nome.localeCompare(b.skill.nome))
      .slice(0, limit)
      .map((s) => s.skill);
  }, [skills, term, limit]);

  return { results, isLoading };
}

/** Agrupa a taxonomia por categoria, preservando a ordem alfabética dos nomes. */
export function useSkillsByCategoria() {
  const { data: skills = [], ...rest } = useSkills();

  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const skill of skills) {
      const list = map.get(skill.categoria) ?? [];
      list.push(skill);
      map.set(skill.categoria, list);
    }
    return map;
  }, [skills]);

  return { grouped, skills, ...rest };
}

/** Competências vinculadas a um candidato específico. */
export function useCandidatoSkills(candidatoId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ["candidato-skills", candidatoId];

  const query = useQuery({
    queryKey,
    enabled: Boolean(candidatoId),
    queryFn: async (): Promise<CandidatoSkill[]> => {
      const { data, error } = await supabase
        .from("candidato_skills")
        .select(
          "id, candidato_id, skill_id, nivel, anos_experiencia, skill:skills(id, nome, slug, categoria, aliases)"
        )
        .eq("candidato_id", candidatoId!);

      if (error) throw error;
      return (data ?? []) as unknown as CandidatoSkill[];
    },
  });

  const addSkill = useMutation({
    mutationFn: async (input: {
      skillId: string;
      nivel?: number | null;
      anosExperiencia?: number | null;
    }) => {
      if (!candidatoId) throw new Error("candidatoId é obrigatório");
      if (input.nivel != null && (input.nivel < 1 || input.nivel > 5)) {
        throw new Error("Nível deve estar entre 1 e 5");
      }

      const { data, error } = await supabase
        .from("candidato_skills")
        .upsert(
          {
            candidato_id: candidatoId,
            skill_id: input.skillId,
            nivel: input.nivel ?? null,
            anos_experiencia: input.anosExperiencia ?? null,
          },
          { onConflict: "candidato_id,skill_id" }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeSkill = useMutation({
    mutationFn: async (candidatoSkillId: string) => {
      const { error } = await supabase
        .from("candidato_skills")
        .delete()
        .eq("id", candidatoSkillId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    skills: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    addSkill,
    removeSkill,
  };
}
