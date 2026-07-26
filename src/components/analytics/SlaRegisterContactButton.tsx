/**
 * @module components/analytics/SlaRegisterContactButton
 * @description Registro de contato individual com nota opcional.
 *
 * Decisão de UX: o caminho rápido continua sendo um clique. A nota é um
 * segundo passo explícito (popover) para quem quer deixar rastro, sem
 * penalizar quem só precisa tirar o candidato da fila. Isso evita o pior dos
 * dois mundos — um formulário obrigatório que ninguém preenche direito.
 */
import { useState } from "react";
import { CheckCircle2, StickyNote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SlaNoteTemplates } from "@/components/analytics/SlaNoteTemplates";
import { NOTA_MAX_CHARS, useRegisterFirstResponse } from "@/hooks/useRegisterFirstResponse";

interface SlaRegisterContactButtonProps {
  readonly candidaturaId: string;
  readonly candidatoNome: string;
}

export function SlaRegisterContactButton({
  candidaturaId,
  candidatoNome,
}: SlaRegisterContactButtonProps) {
  const [aberto, setAberto] = useState(false);
  const [nota, setNota] = useState("");
  const registrar = useRegisterFirstResponse();

  const confirmar = (comNota: boolean) => {
    registrar.mutate(
      { candidaturaId, nota: comNota ? nota : undefined },
      {
        onSuccess: () => {
          setNota("");
          setAberto(false);
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="outline"
        disabled={registrar.isPending}
        onClick={() => confirmar(false)}
      >
        <CheckCircle2 className="mr-1 h-4 w-4" aria-hidden="true" />
        Registrar contato
      </Button>

      <Popover open={aberto} onOpenChange={setAberto}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            disabled={registrar.isPending}
            aria-label={`Registrar contato com nota para ${candidatoNome}`}
          >
            <StickyNote className="h-4 w-4" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 space-y-2">
          <p className="text-xs text-muted-foreground">
            Nota do contato com {candidatoNome} — fica no histórico da candidatura.
          </p>
          <SlaNoteTemplates
            value={nota}
            onChange={setNota}
            maxLength={NOTA_MAX_CHARS}
            disabled={registrar.isPending}
          />
          <Textarea
            value={nota}
            rows={3}
            maxLength={NOTA_MAX_CHARS}
            disabled={registrar.isPending}
            placeholder="Ex.: retorno por e-mail com alinhamento de expectativas"
            onChange={(e) => setNota(e.target.value)}
            aria-label="Nota do contato"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {nota.length}/{NOTA_MAX_CHARS}
            </span>
            <Button size="sm" disabled={registrar.isPending} onClick={() => confirmar(true)}>
              {registrar.isPending ? "Registrando..." : "Registrar com nota"}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
