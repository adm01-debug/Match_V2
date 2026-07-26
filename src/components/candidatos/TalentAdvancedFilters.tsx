import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MODALIDADE_OPTIONS,
  NAO_INFORMADO,
  NIVEL_IDIOMA_OPTIONS,
  REGIME_OPTIONS,
  SENIORIDADE_OPTIONS,
  type ModalidadeTrabalho,
  type NivelIdioma,
  type RegimeContratacao,
  type SenioridadeNivel,
} from "@/types/techProfile";
import type { SearchOrder, TalentSearchFilters } from "@/hooks/useTalentSearch";

export interface TalentAdvancedFiltersProps {
  filters: TalentSearchFilters;
  onChange: (patch: Partial<TalentSearchFilters>) => void;
  onReset: () => void;
  activeFiltersCount: number;
  total: number;
  isFetching: boolean;
}

const ORDER_OPTIONS: ReadonlyArray<{ value: SearchOrder; label: string }> = [
  { value: "created_at", label: "Mais recentes" },
  { value: "nome", label: "Nome (A-Z)" },
  { value: "skills_match", label: "Mais competências casadas" },
  { value: "pretensao_asc", label: "Menor pretensão" },
  { value: "pretensao_desc", label: "Maior pretensão" },
];

const STATUS_OPTIONS = [
  { value: "novo", label: "Novo" },
  { value: "em_triagem", label: "Em triagem" },
  { value: "entrevista", label: "Entrevista" },
  { value: "aprovado", label: "Aprovado" },
  { value: "reprovado", label: "Reprovado" },
] as const;

/** Alterna um valor dentro de um array de seleção múltipla. */
function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/** Converte input numérico para número ou null — nunca NaN. */
function parseNumber(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

interface ChipGroupProps<T extends string> {
  legend: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  selected: T[];
  onToggle: (value: T) => void;
}

function ChipGroup<T extends string>({ legend, options, selected, onToggle }: ChipGroupProps<T>) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-medium text-muted-foreground">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export const TalentAdvancedFilters = memo(function TalentAdvancedFilters({
  filters,
  onChange,
  onReset,
  activeFiltersCount,
  total,
  isFetching,
}: TalentAdvancedFiltersProps) {
  return (
    <section
      aria-label="Filtros avançados de talentos"
      className="rounded-xl border bg-card p-4 space-y-5"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold">Filtros avançados</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount} ativo(s)</Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground" aria-live="polite" aria-busy={isFetching}>
            {isFetching ? "Buscando…" : `${total} resultado(s)`}
          </span>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <X className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
              Limpar
            </Button>
          )}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <ChipGroup
          legend="Status"
          options={STATUS_OPTIONS}
          selected={filters.status}
          onToggle={(v) => onChange({ status: toggle(filters.status, v) })}
        />
        <ChipGroup<SenioridadeNivel>
          legend="Senioridade"
          options={SENIORIDADE_OPTIONS}
          selected={filters.senioridade}
          onToggle={(v) => onChange({ senioridade: toggle(filters.senioridade, v) })}
        />
        <ChipGroup<ModalidadeTrabalho>
          legend="Modalidade"
          options={MODALIDADE_OPTIONS}
          selected={filters.modalidade}
          onToggle={(v) => onChange({ modalidade: toggle(filters.modalidade, v) })}
        />
        <ChipGroup<RegimeContratacao>
          legend="Regime"
          options={REGIME_OPTIONS}
          selected={filters.regime}
          onToggle={(v) => onChange({ regime: toggle(filters.regime, v) })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="filtro-ingles" className="text-xs">Inglês (mínimo)</Label>
          <Select
            value={filters.nivelInglesMin ?? NAO_INFORMADO}
            onValueChange={(v) =>
              onChange({ nivelInglesMin: v === NAO_INFORMADO ? null : (v as NivelIdioma) })
            }
          >
            <SelectTrigger id="filtro-ingles">
              <SelectValue placeholder="Qualquer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NAO_INFORMADO}>Qualquer</SelectItem>
              {NIVEL_IDIOMA_OPTIONS.filter((o) => o.value !== "nenhum").map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filtro-pretensao-min" className="text-xs">Pretensão mínima</Label>
          <Input
            id="filtro-pretensao-min"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Sem mínimo"
            value={filters.pretensaoMin ?? ""}
            onChange={(e) => onChange({ pretensaoMin: parseNumber(e.target.value) })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filtro-pretensao-max" className="text-xs">Pretensão máxima</Label>
          <Input
            id="filtro-pretensao-max"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Sem teto"
            value={filters.pretensaoMax ?? ""}
            onChange={(e) => onChange({ pretensaoMax: parseNumber(e.target.value) })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filtro-ordem" className="text-xs">Ordenar por</Label>
          <Select
            value={filters.orderBy}
            onValueChange={(v) => onChange({ orderBy: v as SearchOrder })}
          >
            <SelectTrigger id="filtro-ordem">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDER_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="filtro-aberto"
            checked={filters.abertoAOportunidades === true}
            onCheckedChange={(checked) =>
              onChange({ abertoAOportunidades: checked ? true : null })
            }
          />
          <Label htmlFor="filtro-aberto" className="text-xs cursor-pointer">
            Apenas abertos a oportunidades
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="filtro-skills-all"
            checked={filters.skillsMatchAll}
            disabled={filters.skillIds.length === 0}
            onCheckedChange={(checked) => onChange({ skillsMatchAll: checked })}
          />
          <Label htmlFor="filtro-skills-all" className="text-xs cursor-pointer">
            Exigir todas as competências selecionadas
          </Label>
        </div>
      </div>
    </section>
  );
});
