// Knockout evaluation compartilhado com o frontend (src/types/knockout.ts).
// Duplicado aqui porque edge functions não importam de src/.
export type KnockoutTipo = 'boolean' | 'text' | 'select' | 'number';

export interface KnockoutQuestion {
  id: string;
  pergunta: string;
  tipo: KnockoutTipo;
  obrigatoria: boolean;
  eliminatoria: boolean;
  opcoes?: string[];
  resposta_esperada?: unknown;
  ajuda?: string;
}

export type KnockoutAnswer = string | number | boolean | null;

export interface KnockoutEvaluationResult {
  aprovado: boolean;
  reprovadas: string[];
  faltantes: string[];
}

export function evaluateKnockouts(
  questions: KnockoutQuestion[],
  answers: Record<string, KnockoutAnswer>,
): KnockoutEvaluationResult {
  const reprovadas: string[] = [];
  const faltantes: string[] = [];

  for (const q of questions) {
    const raw = answers[q.id];
    const missing = raw === undefined || raw === null || raw === '';

    if (missing) {
      if (q.obrigatoria) faltantes.push(q.id);
      continue;
    }

    if (!q.eliminatoria || q.resposta_esperada === undefined) continue;

    let ok = true;
    switch (q.tipo) {
      case 'boolean':
        ok = Boolean(raw) === Boolean(q.resposta_esperada);
        break;
      case 'select': {
        const esp = q.resposta_esperada;
        if (Array.isArray(esp)) ok = esp.map(String).includes(String(raw));
        else ok = String(raw) === String(esp);
        break;
      }
      case 'number': {
        const n = Number(raw);
        if (Number.isNaN(n)) { ok = false; break; }
        const esp = q.resposta_esperada as { min?: number; max?: number } | number;
        if (typeof esp === 'number') ok = n === esp;
        else {
          if (esp.min !== undefined && n < esp.min) ok = false;
          if (esp.max !== undefined && n > esp.max) ok = false;
        }
        break;
      }
      case 'text': {
        const esp = String(q.resposta_esperada ?? '');
        const val = String(raw);
        if (esp.startsWith('re:')) {
          try { ok = new RegExp(esp.slice(3), 'i').test(val); } catch { ok = false; }
        } else {
          ok = val.toLowerCase().includes(esp.toLowerCase());
        }
        break;
      }
    }
    if (!ok) reprovadas.push(q.id);
  }

  return {
    aprovado: reprovadas.length === 0 && faltantes.length === 0,
    reprovadas,
    faltantes,
  };
}
