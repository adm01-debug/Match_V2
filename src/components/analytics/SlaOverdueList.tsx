/**
 * @module components/analytics/SlaOverdueList
 * @description Drill-down nominal do SLA: quem está esperando e há quanto tempo.
 *
 * Só busca dados quando aberto (`enabled`), para não onerar quem apenas olha o
 * agregado por vaga.
 */
import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSlaOverdueList } from "@/hooks/useSlaOverdueList";

interface SlaOverdueListProps {
  readonly slaHoras?: number;
}

function formatarEspera(horas: number): string {
  if (horas < 48) return `${Math.round(horas)}h`;
  return `${Math.floor(horas / 24)} dias`;
}

export function SlaOverdueList({ slaHoras = 48 }: SlaOverdueListProps) {
  const [aberto, setAberto] = useState(false);
  const { data, isLoading, error } = useSlaOverdueList({ slaHoras, enabled: aberto });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
            Fila nominal fora do prazo
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
          >
            {aberto ? "Ocultar" : "Ver lista"}
            {aberto ? (
              <ChevronUp className="ml-1 h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>

      {aberto && (
        <CardContent className="space-y-2">
          {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}

          {error && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Não foi possível carregar a fila de atrasadas.
            </p>
          )}

          {!isLoading && !error && (data?.length ?? 0) === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Nenhuma candidatura sem resposta além do prazo. 🎉
            </p>
          )}

          {data?.map((linha) => (
            <div
              key={linha.candidatura_id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{linha.candidato_nome}</p>
                <p className="truncate text-xs text-muted-foreground">{linha.vaga_titulo}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="destructive">{formatarEspera(linha.horas_esperando)}</Badge>
                {linha.candidato_email && (
                  <Button asChild size="icon" variant="ghost" aria-label={`Enviar e-mail para ${linha.candidato_nome}`}>
                    <a href={`mailto:${linha.candidato_email}`}>
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
