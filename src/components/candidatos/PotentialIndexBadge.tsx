/**
 * @module components/candidatos/PotentialIndexBadge
 * @description Badge compacto do Índice de Potencial para uso em listas e rankings.
 *
 * Regra de exibição: quando não há nenhum sinal, o badge NÃO aparece —
 * mostrar "0" seria mentir sobre um candidato que apenas não foi avaliado.
 * A confiança (quantos sinais alimentaram o número) vai no tooltip, para que
 * o recrutador nunca interprete um índice de 1 sinal como equivalente a 3.
 */
import { Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  classificarPotencial,
  POTENTIAL_TIER_LABEL,
  type PotentialConfidence,
  type PotentialIndexResult,
  type PotentialTier,
} from "@/lib/potentialIndex";

const TIER_CLASSES: Record<PotentialTier, string> = {
  alto: "border-success/50 text-success",
  promissor: "border-primary/50 text-primary",
  moderado: "border-warning/50 text-warning",
  atencao: "border-destructive/50 text-destructive",
};

const CONFIANCA_LABEL: Record<PotentialConfidence, string> = {
  alta: "3 de 3 sinais",
  media: "2 de 3 sinais",
  baixa: "1 de 3 sinais",
  insuficiente: "sem sinais",
};

export interface PotentialIndexBadgeProps {
  readonly indice: PotentialIndexResult | undefined;
  readonly className?: string;
}

export function PotentialIndexBadge({ indice, className }: PotentialIndexBadgeProps) {
  if (!indice || indice.score === null) return null;

  const tier = classificarPotencial(indice.score);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          aria-label={`Índice de Potencial ${indice.score} de 100 — ${POTENTIAL_TIER_LABEL[tier]}`}
          className={cn("gap-1.5 py-1 px-3 border-2 font-bold", TIER_CLASSES[tier], className)}
        >
          <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
          {indice.score} Potencial
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="font-semibold">{POTENTIAL_TIER_LABEL[tier]}</p>
        <p className="text-xs text-muted-foreground">
          Confiança {indice.confianca} ({CONFIANCA_LABEL[indice.confianca]}).
        </p>
        <ul className="mt-1 space-y-0.5 text-xs">
          {indice.componentes.map((componente) => (
            <li key={componente.sinal}>
              {componente.sinal}: {componente.valor} × {componente.pesoEfetivo}% ={" "}
              {componente.contribuicao}
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
}
