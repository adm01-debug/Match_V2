/**
 * @module components/candidatos/PotentialIndexCard
 * @description Exibe o Índice de Potencial com a composição aberta.
 * O usuário precisa conseguir refazer a conta: mostramos peso efetivo e
 * contribuição de cada sinal, e dizemos quando um sinal não foi coletado.
 */
import { Gauge, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { usePotentialIndex } from "@/hooks/usePotentialIndex";
import { POTENTIAL_TIER_LABEL, classificarPotencial } from "@/lib/potentialIndex";
import type { PotentialSignal } from "@/lib/potentialIndex";

const SIGNAL_LABEL: Record<PotentialSignal, string> = {
  cognitivo: "Cognitivo",
  comportamental: "Comportamental",
  cultural: "Fit cultural",
};

const CONFIANCA_LABEL = {
  alta: "Confiança alta",
  media: "Confiança média",
  baixa: "Confiança baixa",
  insuficiente: "Dados insuficientes",
} as const;

export interface PotentialIndexCardProps {
  readonly candidatoId: string;
  readonly className?: string;
}

export function PotentialIndexCard({ candidatoId, className }: PotentialIndexCardProps) {
  const { data, isLoading, error } = usePotentialIndex(candidatoId);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="h-5 w-5 text-primary" aria-hidden="true" />
          Índice de Potencial
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">
            Não foi possível carregar os sinais de avaliação.
          </p>
        ) : !data || data.score === null ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma avaliação registrada ainda. O índice aparece assim que o candidato concluir a
            prova cognitiva ou a avaliação comportamental.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-4xl font-bold tabular-nums text-foreground">
                {data.score.toFixed(0)}
                <span className="ml-1 text-base font-normal text-muted-foreground">/100</span>
              </p>
              <Badge variant="secondary">
                {POTENTIAL_TIER_LABEL[classificarPotencial(data.score)]}
              </Badge>
              <Badge variant="outline">{CONFIANCA_LABEL[data.confianca]}</Badge>
            </div>

            <div className="space-y-3">
              {data.componentes.map((componente) => (
                <div key={componente.sinal} className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium text-foreground">
                      {SIGNAL_LABEL[componente.sinal]}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {componente.valor.toFixed(0)} × {componente.pesoEfetivo.toFixed(0)}% ={" "}
                      {componente.contribuicao.toFixed(1)}
                    </span>
                  </div>
                  <Progress
                    value={componente.valor}
                    aria-label={`Pontuação ${SIGNAL_LABEL[componente.sinal]}`}
                  />
                </div>
              ))}
            </div>

            {data.sinaisAusentes.length > 0 ? (
              <p className="flex items-start gap-2 rounded-md bg-muted p-3 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  Sem dados de {data.sinaisAusentes.map((s) => SIGNAL_LABEL[s].toLowerCase()).join(", ")}.{" "}
                  {data.explicacao}
                </span>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">{data.explicacao}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default PotentialIndexCard;
