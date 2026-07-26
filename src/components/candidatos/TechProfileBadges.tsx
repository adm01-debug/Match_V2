import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Globe, Home, Coins, CalendarClock, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MODALIDADE_LABEL,
  NIVEL_IDIOMA_LABEL,
  REGIME_LABEL,
  SENIORIDADE_LABEL,
  formatPretensao,
  type ModalidadeTrabalho,
  type NivelIdioma,
  type RegimeContratacao,
  type SenioridadeNivel,
} from "@/types/techProfile";

export interface TechProfileBadgesProps extends React.ComponentProps<"div"> {
  senioridade?: SenioridadeNivel | null;
  nivelIngles?: NivelIdioma | null;
  pretensaoSalarial?: number | null;
  pretensaoMoeda?: string | null;
  regime?: RegimeContratacao | null;
  modalidade?: ModalidadeTrabalho | null;
  disponibilidadeDias?: number | null;
  abertoAOportunidades?: boolean | null;
  /** Em cards a lista precisa ser enxuta; no detalhe mostramos tudo. */
  compact?: boolean;
}

/**
 * Resumo visual do perfil técnico. Renderiza apenas o que existe —
 * um candidato sem dados estruturados não deve virar uma fileira de
 * badges "Não informado".
 */
export const TechProfileBadges = memo(function TechProfileBadges({
  senioridade,
  nivelIngles,
  pretensaoSalarial,
  pretensaoMoeda,
  regime,
  modalidade,
  disponibilidadeDias,
  abertoAOportunidades,
  compact = false,
  className,
  ...rest
}: TechProfileBadgesProps) {
  const items: Array<{ key: string; icon: React.ReactNode; label: string; tone?: string }> = [];

  if (senioridade) {
    items.push({
      key: "senioridade",
      icon: <Briefcase className="h-3 w-3" aria-hidden="true" />,
      label: SENIORIDADE_LABEL[senioridade],
    });
  }
  if (nivelIngles && nivelIngles !== "nenhum") {
    items.push({
      key: "ingles",
      icon: <Globe className="h-3 w-3" aria-hidden="true" />,
      label: `Inglês ${NIVEL_IDIOMA_LABEL[nivelIngles]}`,
    });
  }
  if (modalidade) {
    items.push({
      key: "modalidade",
      icon: <Home className="h-3 w-3" aria-hidden="true" />,
      label: MODALIDADE_LABEL[modalidade],
    });
  }
  if (!compact && regime) {
    items.push({
      key: "regime",
      icon: <BadgeCheck className="h-3 w-3" aria-hidden="true" />,
      label: REGIME_LABEL[regime],
    });
  }
  if (pretensaoSalarial != null) {
    items.push({
      key: "pretensao",
      icon: <Coins className="h-3 w-3" aria-hidden="true" />,
      label: formatPretensao(pretensaoSalarial, pretensaoMoeda ?? "BRL"),
    });
  }
  if (!compact && disponibilidadeDias != null) {
    items.push({
      key: "disponibilidade",
      icon: <CalendarClock className="h-3 w-3" aria-hidden="true" />,
      label: disponibilidadeDias === 0 ? "Disponível imediato" : `Disponível em ${disponibilidadeDias}d`,
    });
  }

  if (items.length === 0 && !abertoAOportunidades) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)} {...rest}>
      {abertoAOportunidades && (
        <Badge className="gap-1 bg-success/15 text-success hover:bg-success/25 border-transparent">
          <BadgeCheck className="h-3 w-3" aria-hidden="true" />
          Aberto a oportunidades
        </Badge>
      )}
      {items.map((item) => (
        <Badge key={item.key} variant="outline" className="gap-1 font-normal">
          {item.icon}
          {item.label}
        </Badge>
      ))}
    </div>
  );
});
