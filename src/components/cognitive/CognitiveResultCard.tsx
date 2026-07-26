/**
 * @module components/cognitive/CognitiveResultCard
 * @description Leitura do resultado cognitivo: score normalizado, percentil
 * normativo e recorte por domínio. Comunica limitações explicitamente — quando
 * a amostra normativa é pequena, o percentil não é exibido como se fosse sólido.
 */
import { Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  COGNITIVE_DOMAIN_DESCRICAO,
  COGNITIVE_DOMAIN_LABEL,
  COGNITIVE_FAIXA_LABEL,
  faixaCognitiva,
} from "@/types/cognitive";
import type { CognitiveDomain, CognitiveResult } from "@/types/cognitive";

export interface CognitiveResultCardProps {
  readonly resultado: CognitiveResult;
  readonly className?: string;
}

export function CognitiveResultCard({ resultado, className }: CognitiveResultCardProps) {
  const score = resultado.scoreNormalizado;
  const dominios = Object.entries(resultado.porDominio) as Array<
    [CognitiveDomain, CognitiveResult["porDominio"][CognitiveDomain]]
  >;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="h-5 w-5 text-primary" aria-hidden="true" />
          Resultado cognitivo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="text-4xl font-bold tabular-nums text-foreground">
              {score === null ? "—" : score.toFixed(0)}
              <span className="ml-1 text-base font-normal text-muted-foreground">/100</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {resultado.scoreBruto ?? 0} de {resultado.totalItens} itens corretos
            </p>
          </div>
          {score !== null ? (
            <Badge variant="secondary">{COGNITIVE_FAIXA_LABEL[faixaCognitiva(score)]}</Badge>
          ) : null}
          {resultado.percentil !== null && resultado.amostraNormativa >= 30 ? (
            <Badge variant="outline">
              Percentil {resultado.percentil.toFixed(0)} (n={resultado.amostraNormativa})
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              Amostra normativa insuficiente para percentil
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          {dominios.map(([dominio, dados]) =>
            dados ? (
              <div key={dominio} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {COGNITIVE_DOMAIN_LABEL[dominio]}
                  </span>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {dados.acertos}/{dados.itens} · {dados.percentual.toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={dados.percentual}
                  aria-label={`Desempenho em ${COGNITIVE_DOMAIN_LABEL[dominio]}`}
                />
                <p className="text-xs text-muted-foreground">
                  {COGNITIVE_DOMAIN_DESCRICAO[dominio]} · tempo médio{" "}
                  {dados.tempoMedioSeg.toFixed(0)}s por item
                </p>
              </div>
            ) : null,
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default CognitiveResultCard;
