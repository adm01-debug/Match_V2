/**
 * @module CandidatoSkillsEditor
 * @description Lista e edita as competências vinculadas ao candidato,
 * com nível (1-5) e remoção. Complementa o campo legado `habilidades` (text[])
 * com dados estruturados para busca e ranking.
 */
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SkillAutocomplete } from "./SkillAutocomplete";
import { useCandidatoSkills, SKILL_CATEGORIA_LABEL, type SkillCategoria } from "@/hooks/useSkills";

export interface CandidatoSkillsEditorProps {
  candidatoId: string;
  /** Somente leitura quando o usuário não tem permissão de escrita. */
  readOnly?: boolean;
}

const NIVEL_LABEL: Record<number, string> = {
  1: "Básico",
  2: "Iniciante",
  3: "Intermediário",
  4: "Avançado",
  5: "Especialista",
};

export function CandidatoSkillsEditor({ candidatoId, readOnly = false }: CandidatoSkillsEditorProps) {
  const { skills, isLoading, addSkill, removeSkill } = useCandidatoSkills(candidatoId);
  const selectedIds = skills.map((s) => s.skill_id);

  if (isLoading) {
    return (
      <div className="space-y-2" aria-busy="true">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!readOnly && (
        <SkillAutocomplete
          selectedIds={selectedIds}
          className="w-full"
          disabled={addSkill.isPending}
          onSelectSkill={(skill) => addSkill.mutate({ skillId: skill.id, nivel: 3 })}
        />
      )}

      {skills.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma competência estruturada cadastrada.</p>
      ) : (
        <ul className="flex flex-wrap gap-2" aria-label="Competências do candidato">
          {skills.map((cs) => (
            <li key={cs.id}>
              <Badge variant="secondary" className="gap-2 py-1 pl-3 pr-1">
                <span className="font-medium">{cs.skill?.nome ?? "Competência"}</span>
                <span className="text-xs text-muted-foreground">
                  {cs.nivel ? NIVEL_LABEL[cs.nivel] : ""}
                  {cs.skill?.categoria
                    ? ` · ${SKILL_CATEGORIA_LABEL[cs.skill.categoria as SkillCategoria] ?? cs.skill.categoria}`
                    : ""}
                </span>
                {!readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 hover:bg-destructive hover:text-destructive-foreground"
                    aria-label={`Remover ${cs.skill?.nome ?? "competência"}`}
                    disabled={removeSkill.isPending}
                    onClick={() => removeSkill.mutate(cs.id)}
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </Button>
                )}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
