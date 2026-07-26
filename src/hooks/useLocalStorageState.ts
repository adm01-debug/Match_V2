/**
 * @module hooks/useLocalStorageState
 * @description Estado de UI persistido em `localStorage`, com validação.
 *
 * Decisões deliberadas:
 * - **Validação obrigatória (`isValid`)**: o conteúdo do `localStorage` é
 *   entrada não confiável — pode vir de uma versão antiga do app, de outra
 *   aba ou de edição manual. Sem validar, um `"48"` virando `"quarenta"`
 *   quebraria a UI silenciosamente. Valor inválido cai no default.
 * - **Escrita e leitura protegidas por try/catch**: em Safari com "Prevent
 *   cross-site tracking" e em modo privado o acesso a `localStorage` lança.
 *   A preferência é conveniência, nunca um requisito de funcionamento.
 * - **Inicialização preguiçosa**: evita ler disco a cada render.
 */
import { useCallback, useEffect, useState } from "react";

function lerBruto(chave: string): string | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(chave);
  } catch {
    return null;
  }
}

function gravarBruto(chave: string, valor: string): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(chave, valor);
  } catch {
    // Quota cheia ou storage bloqueado: seguimos apenas em memória.
  }
}

export function useLocalStorageState<T>(
  chave: string,
  padrao: T,
  isValid: (valor: unknown) => valor is T,
): readonly [T, (valor: T) => void] {
  const [estado, setEstado] = useState<T>(() => {
    const bruto = lerBruto(chave);
    if (bruto === null) return padrao;
    try {
      const parsed: unknown = JSON.parse(bruto);
      return isValid(parsed) ? parsed : padrao;
    } catch {
      return padrao;
    }
  });

  // Mantém abas irmãs em sincronia: duas telas do mesmo painel divergindo de
  // configuração é uma fonte clássica de "o número mudou sozinho".
  useEffect(() => {
    const onStorage = (evento: StorageEvent) => {
      if (evento.key !== chave || evento.newValue === null) return;
      try {
        const parsed: unknown = JSON.parse(evento.newValue);
        if (isValid(parsed)) setEstado(parsed);
      } catch {
        /* valor corrompido em outra aba: ignoramos */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [chave, isValid]);

  const definir = useCallback(
    (valor: T) => {
      setEstado(valor);
      gravarBruto(chave, JSON.stringify(valor));
    },
    [chave],
  );

  return [estado, definir] as const;
}
