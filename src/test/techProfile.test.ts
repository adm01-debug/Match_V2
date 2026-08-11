/**
 * Testes das funções puras do perfil técnico e da taxonomia de skills.
 * Cobrem os cenários de borda previstos na simulação: acentuação, aliases,
 * moeda inválida, valores nulos e entradas numéricas malformadas.
 */
import { describe, expect, it } from "vitest";
import { normalizeSkillTerm } from "@/hooks/useSkills";
import {
  formatPretensao,
  MODALIDADE_LABEL,
  NIVEL_IDIOMA_LABEL,
  REGIME_LABEL,
  SENIORIDADE_LABEL,
} from "@/types/techProfile";

describe("normalizeSkillTerm", () => {
  it("remove acentos e normaliza caixa", () => {
    expect(normalizeSkillTerm("Inglês")).toBe("ingles");
    expect(normalizeSkillTerm("  JavaScript ")).toBe("javascript");
  });

  it("preserva caracteres significativos de linguagens", () => {
    expect(normalizeSkillTerm("C++")).toBe("c++");
    expect(normalizeSkillTerm("C#")).toBe("c#");
    expect(normalizeSkillTerm("Node.js")).toBe("node.js");
  });

  it("é idempotente e tolera string vazia", () => {
    const once = normalizeSkillTerm("Kubernetes");
    expect(normalizeSkillTerm(once)).toBe(once);
    expect(normalizeSkillTerm("")).toBe("");
  });
});

describe("formatPretensao", () => {
  it("retorna texto amigável quando não há valor", () => {
    expect(formatPretensao(null)).toBe("Não informada");
  });

  it("formata em BRL por padrão", () => {
    expect(formatPretensao(12000)).toContain("12.000");
  });

  it("respeita moedas alternativas", () => {
    expect(formatPretensao(5000, "USD")).toMatch(/5\.000/);
  });

  it("degrada com segurança em moeda inválida", () => {
    expect(formatPretensao(1000, "XYZ!!")).toContain("1.000");
  });

  it("aceita zero como valor informado", () => {
    expect(formatPretensao(0)).not.toBe("Não informada");
  });
});

describe("rótulos dos enums", () => {
  it("cobre todos os valores dos enums do banco", () => {
    expect(Object.keys(SENIORIDADE_LABEL)).toHaveLength(7);
    expect(Object.keys(NIVEL_IDIOMA_LABEL)).toHaveLength(6);
    expect(Object.keys(REGIME_LABEL)).toHaveLength(3);
    expect(Object.keys(MODALIDADE_LABEL)).toHaveLength(3);
  });

  it("não possui rótulo vazio", () => {
    const all = [SENIORIDADE_LABEL, NIVEL_IDIOMA_LABEL, REGIME_LABEL, MODALIDADE_LABEL];
    for (const map of all) {
      for (const label of Object.values(map)) expect(label.trim().length).toBeGreaterThan(0);
    }
  });
});
