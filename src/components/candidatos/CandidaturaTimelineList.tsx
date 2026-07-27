/**
 * @module components/candidatos/CandidaturaTimelineList
 * @description Renderização compartilhada da timeline de uma candidatura.
 *
 * Existe para que a fila do SLA (popover) e o painel de detalhes do candidato
 * mostrem exatamente o mesmo histórico — divergência entre as duas telas seria
 * uma fonte clássica de desconfiança no dado.
 */
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCandidaturaTimeline } from "@/hooks/useCandidaturaTimeline";

export interface CandidaturaTimelineListProps {
  readonly candidaturaId: string;
  /** Adia a consulta até o histórico ficar visível. */
  readonly enabled?: boolean;
  readonly maxHeight?: string;
}

function formatarData(iso: string): string {
  const data = new Date(iso);
  return Number.isNaN(data.getTime())
    ? "—"
    : data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function CandidaturaTimelineList({
  candidaturaId,
  enabled = true,
  maxHeight = "16rem",
}: CandidaturaTimelineListProps) {
  const { data: eventos = [], isLoading, isError } = useCandidaturaTimeline(candidaturaId, enabled);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Carregando…
      </div>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="py-4 text-sm text-destructive">
        Não foi possível carregar o histórico.
      </p>
    );
  }

  if (eventos.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        Nenhum contato ou mudança de etapa registrado ainda.
      </p>
    );
  }

  return (
    <ScrollArea style={{ maxHeight }}>
      <ol className="space-y-3 pr-2">
        {eventos.map((evento) => (
          <li key={evento.evento_id} className="border-l-2 border-border pl-3">
            <p className="text-xs text-muted-foreground">
              {formatarData(evento.created_at)}
              {evento.responsavel_nome ? ` · ${evento.responsavel_nome}` : ""}
            </p>
            {evento.motivo && <p className="text-sm text-foreground">{evento.motivo}</p>}
            <p className="text-xs text-muted-foreground">
              {evento.etapa_anterior && evento.etapa_anterior !== evento.etapa_nova
                ? `${evento.etapa_anterior} → ${evento.etapa_nova}`
                : `Etapa: ${evento.etapa_nova}`}
            </p>
          </li>
        ))}
      </ol>
    </ScrollArea>
  );
}
