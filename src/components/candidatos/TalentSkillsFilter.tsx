/**
 * @module TalentSkillsFilter
 * @description Seletor de competências (taxonomia oficial) usado no painel de
 * filtros avançados de talentos. Emite apenas IDs — o casamento acontece no
 * banco (RPC `search_candidatos`), garantindo que o filtro cubra toda a base e
 * não apenas a página carregada.
 */
import { memo, useMemo } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SkillAutocomplete } from "@/components/candidatos/SkillAutocomplete";
import { useSkills, type Skill } from "@/hooks/useSkills";

export interface TalentSkillsFilterProps {
  /** IDs de competências atualmente exigidos no filtro. */
  selectedIds: string[];
  /** Recebe a nova lista completa de IDs (imutável). */
  onChange: (skillIds: string[]) => void;
}

export const TalentSkillsFilter = memo(function TalentSkillsFilter({
  selectedIds,
  onChange,
}: TalentSkillsFilterProps) {
  const { data: skills, isLoading } = useSkills();

  /**
   * Resolve IDs -> objetos para renderizar os chips. Se a taxonomia ainda não
   * carregou (ou o ID não existir mais), degradamos para um rótulo neutro em
   * vez de sumir com o chip — o usuário precisa poder remover o filtro.
   */
  const selected = useMemo(() => {
    const byId = new Map<string, Skill>((skills ?? []).map((s) => [s.id, s]));
    return selectedIds.map((id) => ({ id, nome: byId.get(id)?.nome ?? "Competência" }));
  }, [skills, selectedIds]);

  const handleAdd = (skill: Skill) => {
    if (selectedIds.includes(skill.id)) return; // idempotente
    onChange([...selectedIds, skill.id]);
  };

  const handleRemove = (id: string) => {
    onChange(selectedIds.filter((s) => s !== id));
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-medium text-muted-foreground">Competências</legend>

      <div className="flex flex-wrap items-center gap-1.5">
        {selected.map((s) => (
          <Badge key={s.id} variant="secondary" className="gap-1 pr-1">
            {s.nome}
            <button
              type="button"
              onClick={() => handleRemove(s.id)}
              aria-label={`Remover filtro de competência ${s.nome}`}
              className="rounded-full p-0.5 hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </Badge>
        ))}

        <SkillAutocomplete
          size="sm"
          selectedIds={selectedIds}
          onSelectSkill={handleAdd}
          disabled={isLoading}
          placeholder={selectedIds.length > 0 ? "Adicionar" : "Filtrar por competência"}
          className="h-7 text-xs"
        />
      </div>
    </fieldset>
  );
});
