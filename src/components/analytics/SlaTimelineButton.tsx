/**
 * @module components/analytics/SlaTimelineButton
 * @description Abre a timeline de contatos/etapas de uma candidatura da fila do SLA.
 *
 * Decisões deliberadas:
 * - **Carga preguiçosa**: a consulta só dispara ao abrir, evitando uma
 *   requisição por linha renderizada.
 * - **Renderização compartilhada**: usa `CandidaturaTimelineList`, o mesmo
 *   componente do painel de detalhes, para que as duas telas nunca divirjam.
 */
import { useState } from "react";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CandidaturaTimelineList } from "@/components/candidatos/CandidaturaTimelineList";

export interface SlaTimelineButtonProps {
  readonly candidaturaId: string;
  readonly candidatoNome: string;
}

export function SlaTimelineButton({ candidaturaId, candidatoNome }: SlaTimelineButtonProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <Popover open={aberto} onOpenChange={setAberto}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`Ver histórico de ${candidatoNome}`}
        >
          <History className="h-4 w-4" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <p className="text-sm font-medium text-foreground">Histórico</p>
        <p className="mb-2 text-xs text-muted-foreground">{candidatoNome}</p>
        <CandidaturaTimelineList candidaturaId={candidaturaId} enabled={aberto} />
      </PopoverContent>
    </Popover>
  );
}
