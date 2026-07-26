/**
 * @module components/analytics/SlaOverdueList
 * @description Drill-down nominal do SLA: quem está esperando e há quanto tempo.
 *
 * Só busca dados quando aberto (`enabled`), para não onerar quem apenas olha o
 * agregado por vaga.
 */
import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Download, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useSlaOverdueList, type SlaOverdueRow } from "@/hooks/useSlaOverdueList";
import { Textarea } from "@/components/ui/textarea";
import {
  NOTA_MAX_CHARS,
  useRegisterFirstResponse,
  useRegisterFirstResponseBatch,
} from "@/hooks/useRegisterFirstResponse";
import { buildCsv, downloadCsv, type CsvColumn } from "@/lib/csvExport";



interface SlaOverdueListProps {
  readonly slaHoras?: number;
}

function formatarEspera(horas: number): string {
  if (horas < 48) return `${Math.round(horas)}h`;
  return `${Math.floor(horas / 24)} dias`;
}

/**
 * Colunas do export: o recrutador leva a fila para fora do sistema (planilha,
 * reunião de squad) sem perder o dado acionável — quem, para qual vaga, há
 * quanto tempo e desde quando.
 */
const COLUNAS_CSV: readonly CsvColumn<SlaOverdueRow>[] = [
  { header: "Candidato", value: (r) => r.candidato_nome },
  { header: "E-mail", value: (r) => r.candidato_email },
  { header: "Vaga", value: (r) => r.vaga_titulo },
  {
    header: "Candidatura em",
    value: (r) => new Date(r.data_candidatura).toLocaleString("pt-BR"),
  },
  { header: "Horas esperando", value: (r) => r.horas_esperando },
];

export function SlaOverdueList({ slaHoras = 48 }: SlaOverdueListProps) {
  const [aberto, setAberto] = useState(false);
  const [selecionados, setSelecionados] = useState<ReadonlySet<string>>(new Set());
  const [nota, setNota] = useState("");
  const { data, isLoading, error } = useSlaOverdueList({ slaHoras, enabled: aberto });


  const registrar = useRegisterFirstResponse();
  const registrarLote = useRegisterFirstResponseBatch();

  const podeExportar = !isLoading && !error && (data?.length ?? 0) > 0;

  // A lista é revalidada após cada registro: IDs selecionados que já saíram da
  // fila não podem sobreviver na seleção, senão o lote tentaria reprocessá-los.
  const idsVisiveis = useMemo(
    () => new Set((data ?? []).map((l) => l.candidatura_id)),
    [data],
  );
  const idsSelecionados = useMemo(
    () => [...selecionados].filter((id) => idsVisiveis.has(id)),
    [selecionados, idsVisiveis],
  );

  const alternarSelecao = (id: string) => {
    setSelecionados((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(id)) proximo.delete(id);
      else proximo.add(id);
      return proximo;
    });
  };

  const alternarTodos = () => {
    setSelecionados((atual) =>
      atual.size >= idsVisiveis.size ? new Set<string>() : new Set(idsVisiveis),
    );
  };

  const registrarSelecionados = () => {
    if (idsSelecionados.length === 0) return;
    registrarLote.mutate(idsSelecionados, {
      onSettled: () => setSelecionados(new Set()),
    });
  };

  const exportar = () => {
    if (!data || data.length === 0) return;
    const hoje = new Date().toISOString().slice(0, 10);
    downloadCsv(buildCsv(data, COLUNAS_CSV), `sla-atrasadas-${slaHoras}h-${hoje}`);
  };



  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
            Fila nominal fora do prazo
          </span>
          <span className="flex items-center gap-1">
            {aberto && podeExportar && (
              <Button variant="outline" size="sm" onClick={exportar}>
                <Download className="mr-1 h-4 w-4" aria-hidden="true" />
                Exportar CSV
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAberto((v) => !v)}
              aria-expanded={aberto}
            >
              {aberto ? "Ocultar" : "Ver lista"}
              {aberto ? (
                <ChevronUp className="ml-1 h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </span>

        </CardTitle>
      </CardHeader>

      {aberto && (
        <CardContent className="space-y-2">
          {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}

          {error && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Não foi possível carregar a fila de atrasadas.
            </p>
          )}

          {!isLoading && !error && (data?.length ?? 0) === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Nenhuma candidatura sem resposta além do prazo. 🎉
            </p>
          )}

          {podeExportar && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/50 p-2">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={idsVisiveis.size > 0 && idsSelecionados.length === idsVisiveis.size}
                  onCheckedChange={alternarTodos}
                  aria-label="Selecionar todas as candidaturas atrasadas"
                />
                {idsSelecionados.length > 0
                  ? `${idsSelecionados.length} selecionada(s)`
                  : "Selecionar todas"}
              </label>
              <Button
                size="sm"
                disabled={idsSelecionados.length === 0 || registrarLote.isPending}
                onClick={registrarSelecionados}
              >
                <CheckCircle2 className="mr-1 h-4 w-4" aria-hidden="true" />
                {registrarLote.isPending
                  ? "Registrando..."
                  : `Registrar contato em lote${idsSelecionados.length > 0 ? ` (${idsSelecionados.length})` : ""}`}
              </Button>
            </div>
          )}

          {data?.map((linha) => (
            <div
              key={linha.candidatura_id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Checkbox
                  checked={selecionados.has(linha.candidatura_id)}
                  onCheckedChange={() => alternarSelecao(linha.candidatura_id)}
                  aria-label={`Selecionar ${linha.candidato_nome}`}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{linha.candidato_nome}</p>
                  <p className="truncate text-xs text-muted-foreground">{linha.vaga_titulo}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="destructive">{formatarEspera(linha.horas_esperando)}</Badge>
                {linha.candidato_email && (
                  <Button asChild size="icon" variant="ghost" aria-label={`Enviar e-mail para ${linha.candidato_nome}`}>
                    <a href={`mailto:${linha.candidato_email}`}>
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={registrar.isPending}
                  onClick={() => registrar.mutate({ candidaturaId: linha.candidatura_id })}
                >
                  <CheckCircle2 className="mr-1 h-4 w-4" aria-hidden="true" />
                  Registrar contato
                </Button>
              </div>

            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
