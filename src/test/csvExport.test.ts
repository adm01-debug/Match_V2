import { describe, expect, it } from "vitest";
import { buildCsv, escapeCsvCell, safeFileName, toCellText } from "@/lib/csvExport";

describe("csvExport", () => {
  it("normaliza valores nulos, arrays, booleanos e objetos", () => {
    expect(toCellText(null)).toBe("");
    expect(toCellText(undefined)).toBe("");
    expect(toCellText(["React", "SQL"])).toBe("React, SQL");
    expect(toCellText(true)).toBe("Sim");
    expect(toCellText(false)).toBe("Não");
    expect(toCellText({ a: 1 })).toBe('{"a":1}');
  });

  it("neutraliza fórmulas para evitar CSV injection", () => {
    expect(escapeCsvCell("=HYPERLINK(\"http://mal\")")).toMatch(/^"'=/);
    expect(escapeCsvCell("+1199999")).toBe("'+1199999");
    expect(escapeCsvCell("-teste")).toBe("'-teste");
    expect(escapeCsvCell("@user")).toBe("'@user");
  });

  it("escapa aspas, quebras de linha e separadores", () => {
    expect(escapeCsvCell('Ana "A" Silva')).toBe('"Ana ""A"" Silva"');
    expect(escapeCsvCell("linha1\nlinha2")).toBe('"linha1\nlinha2"');
    expect(escapeCsvCell("São Paulo; SP")).toBe('"São Paulo; SP"');
  });

  it("gera CSV com BOM, cabeçalho e linhas na ordem das colunas", () => {
    const csv = buildCsv(
      [{ nome: "Ana", skills: ["React"] }],
      [
        { header: "Nome", value: (r) => r.nome },
        { header: "Skills", value: (r) => r.skills },
      ]
    );
    expect(csv.startsWith("\uFEFF")).toBe(true);
    const [head, row] = csv.replace("\uFEFF", "").split("\r\n");
    expect(head).toBe("Nome;Skills");
    expect(row).toBe("Ana;React");
  });

  it("produz CSV apenas com cabeçalho quando não há linhas", () => {
    const csv = buildCsv([], [{ header: "Nome", value: () => "" }]);
    expect(csv.replace("\uFEFF", "")).toBe("Nome");
  });

  it("sanitiza nomes de arquivo contra traversal e acentos", () => {
    expect(safeFileName("../../etc/passwd")).toBe("etc-passwd.csv");
    expect(safeFileName("Talentos Ação 2026")).toBe("Talentos-Acao-2026.csv");
    expect(safeFileName("!!!")).toBe("export.csv");
  });
});
