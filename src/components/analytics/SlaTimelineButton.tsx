/**
 * @module components/analytics/SlaTimelineButton
 * @description Abre a timeline de contatos/etapas de uma candidatura da fila do SLA.
 *
 * Decisões deliberadas:
 * - **Popover com carga preguiçosa**: a consulta só dispara ao abrir, evitando
 *   uma requisição por linha renderizada.
 * - **Nota em destaque**: o objetivo do recurso é conferir *o que foi dito* no
 *   contato registrado; a nota aparece antes do detalhe de etapa.
 */
import { useState } from "react";
import { History, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCandidaturaTimeline } from "@/hooks/useCandidaturaTimeline";

export interface SlaTimelineButtonProps {
  readonly candidaturaId: string;
  readonly candidatoNome: string;
}

function formatarData(iso: string): string {
  const data = new Date(iso);
  return Number.isNaN(data.getTime())
    ? "—"
    : data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function SlaTimelineButton({ candidaturaId, candidatoNome }: SlaTimelineButtonProps) {
  const [aberto, setAberto] = useState(false);
  const { data: eventos = [], isLoading, isError } = useCandidaturaTimeline(candidaturaId, aberto);

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

        {isLoading && (
          <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Carregando…
          </div>
        )}

        {isError && (
          <p role="alert" className="py-4 text-sm text-destructive">
            Não foi possível carregar o histórico.
          </p>
        )}

        {!isLoading && !isError && eventos.length === 0 && (
          <p className="py-4 text-sm text-muted-foreground">
            Nenhum contato ou mudança de etapa registrado ainda.
          </p>
        )}

        {eventos.length > 0 && (
          <ScrollArea className="max-h-64">
            <ol className="space-y-3 pr-2">
              {eventos.map((evento) => (
                <li key={evento.evento_id} className="border-l-2 border-border pl-3">
                  <p className="text-xs text-muted-foreground">
                    {formatarData(evento.created_at)}
                    {evento.responsavel_nome ? ` · ${evento.responsavel_nome}` : ""}
                  </p>
                  {evento.motivo && (
                    <p className="text-sm text-foreground">{evento.motivo}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {evento.etapa_anterior && evento.etapa_anterior !== evento.etapa_nova
                      ? `${evento.etapa_anterior} → ${evento.etapa_nova}`
                      : `Etapa: ${evento.etapa_nova}`}
                  </p>
                </li>
              ))}
            </ol>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
