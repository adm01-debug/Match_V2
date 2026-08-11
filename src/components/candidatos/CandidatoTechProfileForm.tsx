/**
 * @module CandidatoTechProfileForm
 * @description Formulário do perfil técnico do candidato: senioridade, inglês,
 * pretensão salarial, regime, modalidade, disponibilidade e abertura a oportunidades.
 * Estado local com salvamento explícito para evitar N requisições por tecla.
 */
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCandidatoTechProfile } from "@/hooks/useCandidatoTechProfile";
import {
  MODALIDADE_OPTIONS,
  MOEDAS,
  NAO_INFORMADO,
  NIVEL_IDIOMA_OPTIONS,
  REGIME_OPTIONS,
  SENIORIDADE_OPTIONS,
  type ModalidadeTrabalho,
  type NivelIdioma,
  type RegimeContratacao,
  type SenioridadeNivel,
  type TechProfile,
} from "@/types/techProfile";

export interface CandidatoTechProfileFormProps {
  candidatoId: string;
  readOnly?: boolean;
}

const EMPTY: TechProfile = {
  senioridade: null,
  nivel_ingles: null,
  pretensao_salarial: null,
  pretensao_moeda: "BRL",
  regime: null,
  modalidade: null,
  disponibilidade_dias: null,
  aberto_a_oportunidades: true,
};

/** Converte o valor do <Select> (que nunca é vazio) para o enum ou null. */
function toEnum<T extends string>(value: string): T | null {
  return value === NAO_INFORMADO ? null : (value as T);
}

/** Converte input numérico permitindo campo vazio, rejeitando NaN. */
function toNumber(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function CandidatoTechProfileForm({ candidatoId, readOnly = false }: CandidatoTechProfileFormProps) {
  const { profile, isLoading, update, isSaving } = useCandidatoTechProfile(candidatoId);
  const [form, setForm] = useState<TechProfile>(EMPTY);

  useEffect(() => {
    if (profile) setForm({ ...EMPTY, ...profile });
  }, [profile]);

  const set = <K extends keyof TechProfile>(key: K, value: TechProfile[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2" aria-busy="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        update.mutate(form);
      }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="tp-senioridade">Senioridade</Label>
          <Select
            disabled={readOnly}
            value={form.senioridade ?? NAO_INFORMADO}
            onValueChange={(v) => set("senioridade", toEnum<SenioridadeNivel>(v))}
          >
            <SelectTrigger id="tp-senioridade"><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NAO_INFORMADO}>Não informado</SelectItem>
              {SENIORIDADE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tp-ingles">Nível de inglês</Label>
          <Select
            disabled={readOnly}
            value={form.nivel_ingles ?? NAO_INFORMADO}
            onValueChange={(v) => set("nivel_ingles", toEnum<NivelIdioma>(v))}
          >
            <SelectTrigger id="tp-ingles"><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NAO_INFORMADO}>Não informado</SelectItem>
              {NIVEL_IDIOMA_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tp-pretensao">Pretensão salarial</Label>
          <div className="flex gap-2">
            <Select
              disabled={readOnly}
              value={form.pretensao_moeda || "BRL"}
              onValueChange={(v) => set("pretensao_moeda", v)}
            >
              <SelectTrigger className="w-24" aria-label="Moeda"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MOEDAS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              id="tp-pretensao"
              type="number"
              min={0}
              step={100}
              inputMode="numeric"
              disabled={readOnly}
              placeholder="Ex.: 12000"
              value={form.pretensao_salarial ?? ""}
              onChange={(e) => set("pretensao_salarial", toNumber(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tp-regime">Regime de contratação</Label>
          <Select
            disabled={readOnly}
            value={form.regime ?? NAO_INFORMADO}
            onValueChange={(v) => set("regime", toEnum<RegimeContratacao>(v))}
          >
            <SelectTrigger id="tp-regime"><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NAO_INFORMADO}>Não informado</SelectItem>
              {REGIME_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tp-modalidade">Modalidade de trabalho</Label>
          <Select
            disabled={readOnly}
            value={form.modalidade ?? NAO_INFORMADO}
            onValueChange={(v) => set("modalidade", toEnum<ModalidadeTrabalho>(v))}
          >
            <SelectTrigger id="tp-modalidade"><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NAO_INFORMADO}>Não informado</SelectItem>
              {MODALIDADE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tp-disponibilidade">Disponibilidade (dias para início)</Label>
          <Input
            id="tp-disponibilidade"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            disabled={readOnly}
            placeholder="Ex.: 30"
            value={form.disponibilidade_dias ?? ""}
            onChange={(e) => set("disponibilidade_dias", toNumber(e.target.value))}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label htmlFor="tp-aberto" className="cursor-pointer">Aberto a oportunidades</Label>
          <p className="text-xs text-muted-foreground">Aparece nas buscas ativas de talentos.</p>
        </div>
        <Switch
          id="tp-aberto"
          disabled={readOnly}
          checked={form.aberto_a_oportunidades}
          onCheckedChange={(v) => set("aberto_a_oportunidades", v)}
        />
      </div>

      {!readOnly && (
        <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="mr-2 h-4 w-4" aria-hidden="true" />
          )}
          Salvar perfil técnico
        </Button>
      )}
    </form>
  );
}
