/**
 * @module components/analytics/SlaNoteTemplates
 * @description Atalhos de nota para o registro de contato do SLA.
 *
 * Por que existe: a nota é rastro operacional, não redação. Na prática o RH
 * repete três ou quatro frases ("liguei", "mandei e-mail", "chamei no
 * WhatsApp"). Oferecer os atalhos reduz o atrito e — mais importante —
 * padroniza o histórico, tornando-o pesquisável depois.
 *
 * O clique é aditivo (append), não destrutivo: quem já digitou algo não perde
 * o texto ao usar um template.
 */
import { Button } from "@/components/ui/button";

export const NOTAS_RAPIDAS = [
  "Contato por e-mail",
  "Contato por WhatsApp",
  "Contato por telefone",
  "Retorno agendado",
] as const;

interface SlaNoteTemplatesProps {
  readonly disabled?: boolean;
  /** Limite de caracteres da nota — evita estourar o cap do RPC. */
  readonly maxLength: number;
  readonly value: string;
  readonly onChange: (proximo: string) => void;
}

export function SlaNoteTemplates({
  disabled = false,
  maxLength,
  value,
  onChange,
}: SlaNoteTemplatesProps) {
  const aplicar = (texto: string) => {
    const atual = value.trim();
    // Idempotente: reclicar o mesmo atalho não duplica a frase.
    if (atual.includes(texto)) return;
    const combinado = atual ? `${atual} · ${texto}` : texto;
    onChange(combinado.slice(0, maxLength));
  };

  return (
    <div className="flex flex-wrap gap-1" role="group" aria-label="Notas rápidas">
      {NOTAS_RAPIDAS.map((texto) => (
        <Button
          key={texto}
          type="button"
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          disabled={disabled}
          onClick={() => aplicar(texto)}
        >
          {texto}
        </Button>
      ))}
    </div>
  );
}
