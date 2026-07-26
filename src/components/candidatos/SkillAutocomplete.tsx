/**
 * @module SkillAutocomplete
 * @description Combobox de busca na taxonomia oficial de competências.
 * A busca é tolerante a acentos e casa aliases (ex.: "k8s" -> Kubernetes),
 * evitando que o mesmo conhecimento seja cadastrado com N grafias diferentes.
 */
import { useState, type ComponentProps } from "react";
import { Check, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SKILL_CATEGORIA_LABEL, useSkillSearch, type Skill, type SkillCategoria } from "@/hooks/useSkills";

export interface SkillAutocompleteProps extends Omit<ComponentProps<typeof Button>, "onSelect"> {
  /** IDs já vinculados — recebem marcação de selecionado. */
  selectedIds?: string[];
  onSelectSkill: (skill: Skill) => void;
  placeholder?: string;
}

export function SkillAutocomplete({
  selectedIds = [],
  onSelectSkill,
  placeholder = "Buscar competência...",
  className,
  ...buttonProps
}: SkillAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const { results, isLoading } = useSkillSearch(term, 30);

  const handleSelect = (skill: Skill) => {
    onSelectSkill(skill);
    setTerm("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Adicionar competência"
          className={cn("justify-start gap-2 text-muted-foreground", className)}
          {...buttonProps}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            value={term}
            onValueChange={setTerm}
            placeholder="Digite: react, k8s, inglês..."
          />
          <CommandList>
            <CommandEmpty>
              <span className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                <Search className="h-4 w-4" aria-hidden="true" />
                {isLoading
                  ? "Carregando taxonomia..."
                  : term
                    ? "Nenhuma competência encontrada"
                    : "Digite para buscar"}
              </span>
            </CommandEmpty>
            {results.length > 0 && (
              <CommandGroup>
                {results.map((skill) => {
                  const isSelected = selectedIds.includes(skill.id);
                  return (
                    <CommandItem
                      key={skill.id}
                      value={skill.id}
                      onSelect={() => handleSelect(skill)}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="truncate">{skill.nome}</span>
                      <span className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {SKILL_CATEGORIA_LABEL[skill.categoria as SkillCategoria] ?? skill.categoria}
                        </span>
                        {isSelected && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
