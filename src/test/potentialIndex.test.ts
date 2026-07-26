import { describe, expect, it } from "vitest";
import {
  POTENTIAL_WEIGHTS,
  calcularIndicePotencial,
  classificarPotencial,
} from "@/lib/potentialIndex";

describe("calcularIndicePotencial", () => {
  it("pondera os três sinais conforme os pesos padrão", () => {
    const r = calcularIndicePotencial({ cognitivo: 80, comportamental: 70, cultural: 90 });
    // 80*0.40 + 70*0.35 + 90*0.25 = 32 + 24.5 + 22.5 = 79
    expect(r.score).toBe(79);
    expect(r.confianca).toBe("alta");
    expect(r.sinaisAusentes).toHaveLength(0);
  });

  it("renormaliza os pesos quando um sinal está ausente", () => {
    const r = calcularIndicePotencial({ cognitivo: 80, comportamental: 60 });
    // pesos 40/35 -> 0.5333/0.4667 => 80*0.5333 + 60*0.4667 ≈ 70.7
    expect(r.score).toBeCloseTo(70.7, 1);
    expect(r.confianca).toBe("media");
    expect(r.sinaisAusentes).toEqual(["cultural"]);
  });

  it("não trata sinal ausente como zero", () => {
    const comAusente = calcularIndicePotencial({ cognitivo: 90 });
    const comZero = calcularIndicePotencial({ cognitivo: 90, comportamental: 0, cultural: 0 });
    expect(comAusente.score).toBe(90);
    expect(comZero.score).toBeLessThan(comAusente.score as number);
  });

  it("devolve score nulo e confiança insuficiente sem nenhum sinal", () => {
    const r = calcularIndicePotencial({});
    expect(r.score).toBeNull();
    expect(r.confianca).toBe("insuficiente");
    expect(r.componentes).toHaveLength(0);
  });

  it("satura entradas fora de 0-100 e ignora valores não finitos", () => {
    expect(calcularIndicePotencial({ cognitivo: 140 }).score).toBe(100);
    expect(calcularIndicePotencial({ cognitivo: -20 }).score).toBe(0);
    expect(calcularIndicePotencial({ cognitivo: Number.NaN }).score).toBeNull();
  });

  it("mantém a soma das contribuições igual ao score", () => {
    const r = calcularIndicePotencial({ cognitivo: 55, comportamental: 82, cultural: 41 });
    const soma = r.componentes.reduce((acc, c) => acc + c.contribuicao, 0);
    expect(Math.abs(soma - (r.score as number))).toBeLessThan(0.2);
  });

  it("tolera configuração de pesos degenerada sem dividir por zero", () => {
    const r = calcularIndicePotencial(
      { cognitivo: 60, comportamental: 80 },
      { cognitivo: 0, comportamental: 0, cultural: 0 },
    );
    expect(r.score).toBe(70); // média simples como fallback
  });

  it("expõe pesos padrão somando 100", () => {
    const total =
      POTENTIAL_WEIGHTS.cognitivo + POTENTIAL_WEIGHTS.comportamental + POTENTIAL_WEIGHTS.cultural;
    expect(total).toBe(100);
  });
});

describe("classificarPotencial", () => {
  it("mapeia os cortes de faixa", () => {
    expect(classificarPotencial(92)).toBe("alto");
    expect(classificarPotencial(80)).toBe("alto");
    expect(classificarPotencial(70)).toBe("promissor");
    expect(classificarPotencial(50)).toBe("moderado");
    expect(classificarPotencial(20)).toBe("atencao");
  });
});
