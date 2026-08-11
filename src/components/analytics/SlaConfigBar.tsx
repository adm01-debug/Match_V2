/**
 * @module components/analytics/SlaConfigBar
 * @description Controles de janela de análise e limite de SLA.
 *
 * Por que controlado por fora: os mesmos parâmetros alimentam o agregado por
 * vaga e o drill-down nominal. Mantê-los em um único ponto evita divergência
 * entre "o que o painel diz" e "quem o painel lista".
 */
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const JANELAS_DIAS = [7, 15, 30, 60, 90] as const;
export const LIMITES_SLA_HORAS = [12, 24, 48, 72, 120] as const;

export interface SlaConfigBarProps {
  readonly dias: number;
  readonly slaHoras: number;
  readonly onDiasChange: (dias: number) => void;
  readonly onSlaHorasChange: (horas: number) => void;
}

export function SlaConfigBar({
  dias,
  slaHoras,
  onDiasChange,
  onSlaHorasChange,
}: SlaConfigBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-1">
        <Label htmlFor="sla-janela" className="text-xs text-muted-foreground">
          Janela de análise
        </Label>
        <Select value={String(dias)} onValueChange={(v) => onDiasChange(Number(v))}>
          <SelectTrigger id="sla-janela" className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {JANELAS_DIAS.map((d) => (
              <SelectItem key={d} value={String(d)}>
                Últimos {d} dias
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="sla-limite" className="text-xs text-muted-foreground">
          Limite de primeira resposta
        </Label>
        <Select value={String(slaHoras)} onValueChange={(v) => onSlaHorasChange(Number(v))}>
          <SelectTrigger id="sla-limite" className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIMITES_SLA_HORAS.map((h) => (
              <SelectItem key={h} value={String(h)}>
                {h} horas
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
