/**
 * @module components/analytics/FunnelSlaTab
 * @description Painel de SLA de primeira resposta por vaga.
 *
 * Regra de leitura: "aguardando agora" é a fila de risco do presente — são
 * candidaturas que já estouraram o prazo e continuam sem retorno. É o número
 * acionável; o percentual histórico é apenas diagnóstico.
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFunnelSla } from "@/hooks/useFunnelSla";
import { SlaOverdueList } from "@/components/analytics/SlaOverdueList";
import { SlaConfigBar } from "@/components/analytics/SlaConfigBar";

function corDoSla(percentual: number | null): string {
  if (percentual === null) return "text-muted-foreground";
  if (percentual >= 85) return "text-success";
  if (percentual >= 60) return "text-warning";
  return "text-destructive";
}

export function FunnelSlaTab() {
  const [dias, setDias] = useState(30);
  const [slaHoras, setSlaHoras] = useState(48);
  const { data, isLoading, error } = useFunnelSla({ dias, slaHoras });

  const controles = (
    <SlaConfigBar
      dias={dias}
      slaHoras={slaHoras}
      onDiasChange={setDias}
      onSlaHorasChange={setSlaHoras}
    />
  );


  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Não foi possível carregar o SLA de resposta.
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Nenhuma candidatura nos últimos 30 dias.
        </CardContent>
      </Card>
    );
  }

  const atrasadasTotal = data.reduce((acc, l) => acc + l.aguardando_agora, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Timer className="h-5 w-5 text-primary" />
            SLA de primeira resposta ({SLA_HORAS}h) — últimos 30 dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {atrasadasTotal > 0 ? (
              <span className="flex items-center gap-2 text-destructive font-medium">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                {atrasadasTotal} candidatura(s) sem retorno além do prazo.
              </span>
            ) : (
              "Nenhuma candidatura fora do prazo neste momento."
            )}
          </p>
        </CardContent>
      </Card>

      {atrasadasTotal > 0 && <SlaOverdueList slaHoras={SLA_HORAS} />}



      <div className="space-y-2">
        {data.map((linha) => (
          <Card key={linha.vaga_id}>
            <CardContent className="py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{linha.vaga_titulo}</p>
                <p className="text-xs text-muted-foreground">
                  {linha.com_primeira_resposta} de {linha.total_candidaturas} com retorno
                  {linha.horas_medias_primeira_resposta !== null &&
                    ` · média ${linha.horas_medias_primeira_resposta}h`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {linha.aguardando_agora > 0 && (
                  <Badge variant="outline" className="border-destructive/50 text-destructive">
                    {linha.aguardando_agora} atrasada(s)
                  </Badge>
                )}
                <span className={cn("text-xl font-bold", corDoSla(linha.percentual_sla))}>
                  {linha.percentual_sla === null ? "N/D" : `${linha.percentual_sla}%`}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
