/**
 * @module components/candidatos/CandidatoTimelineSection
 * @description Histórico de etapas e contatos das candidaturas do candidato.
 *
 * Decisões deliberadas:
 * - **Uma candidatura por vez**: um candidato pode concorrer a várias vagas e
 *   misturar as timelines produziria uma narrativa falsa. O seletor deixa o
 *   contexto explícito.
 * - **Carga preguiçosa**: a timeline só consulta o banco depois que há uma
 *   candidatura selecionada, evitando trabalho para candidatos sem processo.
 */
import { useEffect, useState } from "react";
import { History, Loader2 } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CandidaturaTimelineList } from "@/components/candidatos/CandidaturaTimelineList";
import { useCandidatoCandidaturas } from "@/hooks/useCandidatoCandidaturas";

export interface CandidatoTimelineSectionProps {
  readonly email: string | null | undefined;
}

export function CandidatoTimelineSection({ email }: CandidatoTimelineSectionProps) {
  const { data: candidaturas = [], isLoading, isError } = useCandidatoCandidaturas(email);
  const [selecionada, setSelecionada] = useState<string>("");

  // A seleção acompanha os dados: se a lista mudar, o id antigo pode não
  // existir mais e deixaria a timeline consultando um registro inválido.
  useEffect(() => {
    const primeira = candidaturas[0];
    if (!primeira) {
      setSelecionada("");
      return;
    }
    if (!candidaturas.some((c) => c.id === selecionada)) {
      setSelecionada(primeira.id);
    }
  }, [candidaturas, selecionada]);

  return (
    <div>
      <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
        <History className="h-4 w-4 text-primary" aria-hidden="true" />
        Histórico da Candidatura
      </h4>

      {isLoading && (
        <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Carregando candidaturas…
        </div>
      )}

      {isError && (
        <p role="alert" className="py-2 text-sm text-destructive">
          Não foi possível carregar as candidaturas.
        </p>
      )}

      {!isLoading && !isError && candidaturas.length === 0 && (
        <p className="rounded-xl bg-muted/30 p-4 text-sm text-muted-foreground">
          Este candidato ainda não possui candidaturas registradas no portal.
        </p>
      )}

      {candidaturas.length > 0 && (
        <div className="space-y-3">
          {candidaturas.length > 1 && (
            <Select value={selecionada} onValueChange={setSelecionada}>
              <SelectTrigger aria-label="Selecionar candidatura" className="bg-muted/50">
                <SelectValue placeholder="Selecione a candidatura" />
              </SelectTrigger>
              <SelectContent>
                {candidaturas.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.vaga_titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {selecionada && (
            <CandidaturaTimelineList candidaturaId={selecionada} maxHeight="18rem" />
          )}
        </div>
      )}
    </div>
  );
}
