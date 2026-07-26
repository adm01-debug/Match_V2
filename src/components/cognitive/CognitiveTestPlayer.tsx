/**
 * @module components/cognitive/CognitiveTestPlayer
 * @description Aplicação cronometrada de uma prova cognitiva.
 * Cada resposta é persistida imediatamente: se o candidato perder a conexão ou
 * fechar a aba, nada do que ele já respondeu se perde.
 */
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useCognitiveSessionItems,
  useCognitiveTimer,
  useFinishCognitiveSession,
  useSubmitCognitiveResponse,
} from "@/hooks/useCognitiveTest";
import { COGNITIVE_DOMAIN_LABEL } from "@/types/cognitive";
import type { CognitiveResult } from "@/types/cognitive";

export interface CognitiveTestPlayerProps {
  readonly sessionId: string;
  readonly iniciadaEm: string;
  readonly tempoLimiteSeg: number;
  readonly onConcluido: (resultado: CognitiveResult | null) => void;
}

function formatarTempo(segundos: number): string {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
}

export function CognitiveTestPlayer({
  sessionId,
  iniciadaEm,
  tempoLimiteSeg,
  onConcluido,
}: CognitiveTestPlayerProps) {
  const { data: itens, isLoading, error } = useCognitiveSessionItems(sessionId);
  const submitResposta = useSubmitCognitiveResponse();
  const finalizar = useFinishCognitiveSession();
  const { restanteSeg, esgotado } = useCognitiveTimer(iniciadaEm, tempoLimiteSeg);

  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [inicioItem, setInicioItem] = useState<number>(() => Date.now());
  const [encerrando, setEncerrando] = useState(false);

  // Retoma respostas já gravadas quando a sessão é reaberta.
  useEffect(() => {
    if (!itens) return;
    const previas: Record<string, string> = {};
    for (const item of itens) {
      if (item.resposta) previas[item.itemId] = item.resposta;
    }
    setRespostas((atual) => ({ ...previas, ...atual }));
  }, [itens]);

  useEffect(() => {
    setInicioItem(Date.now());
  }, [indice]);

  const total = itens?.length ?? 0;
  const itemAtual = itens?.[indice];
  const respondidas = useMemo(
    () => (itens ?? []).filter((item) => respostas[item.itemId]).length,
    [itens, respostas],
  );

  const concluir = useMemo(
    () => async () => {
      if (encerrando) return;
      setEncerrando(true);
      try {
        const resultado = await finalizar.mutateAsync(sessionId);
        onConcluido(resultado);
      } catch (erro) {
        toast.error(erro instanceof Error ? erro.message : "Falha ao finalizar a avaliação.");
        setEncerrando(false);
      }
    },
    [encerrando, finalizar, onConcluido, sessionId],
  );

  // Encerramento automático: o servidor já recusa respostas fora do tempo,
  // aqui apenas evitamos deixar o candidato preso numa tela morta.
  useEffect(() => {
    if (esgotado && !encerrando && total > 0) {
      toast.warning("Tempo esgotado. Finalizando a avaliação.");
      void concluir();
    }
  }, [esgotado, encerrando, total, concluir]);

  async function responder(valor: string) {
    if (!itemAtual) return;
    setRespostas((atual) => ({ ...atual, [itemAtual.itemId]: valor }));
    try {
      await submitResposta.mutateAsync({
        sessionId,
        itemId: itemAtual.itemId,
        resposta: valor,
        tempoGastoSeg: (Date.now() - inicioItem) / 1000,
      });
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Não foi possível registrar a resposta.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="sr-only">Carregando avaliação</span>
      </div>
    );
  }

  if (error || !itens || total === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : "Nenhum item disponível para esta avaliação."}
        </AlertDescription>
      </Alert>
    );
  }

  const progresso = Math.round((respondidas / total) * 100);
  const tempoCritico = restanteSeg <= 60;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-base">
              Questão {indice + 1} de {total}
            </CardTitle>
            <div
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium tabular-nums",
                tempoCritico ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground",
              )}
              role="timer"
              aria-live={tempoCritico ? "assertive" : "off"}
            >
              <Clock className="h-4 w-4" aria-hidden="true" />
              {formatarTempo(restanteSeg)}
            </div>
          </div>
          <Progress value={progresso} className="mt-3" aria-label="Progresso da avaliação" />
          <p className="mt-1 text-xs text-muted-foreground">
            {respondidas} de {total} respondidas
          </p>
        </CardHeader>

        {itemAtual ? (
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{COGNITIVE_DOMAIN_LABEL[itemAtual.dominio]}</Badge>
              <Badge variant="outline">Dificuldade {itemAtual.dificuldade}/5</Badge>
            </div>

            {itemAtual.contexto ? (
              <blockquote className="rounded-md border-l-4 border-primary/40 bg-muted/50 p-3 text-sm text-muted-foreground">
                {itemAtual.contexto}
              </blockquote>
            ) : null}

            <p className="text-base font-medium text-foreground">{itemAtual.enunciado}</p>

            <RadioGroup
              value={respostas[itemAtual.itemId] ?? ""}
              onValueChange={(valor) => void responder(valor)}
              className="space-y-2"
            >
              {itemAtual.alternativas.map((alternativa) => (
                <div
                  key={alternativa.id}
                  className="flex items-center gap-3 rounded-md border border-border p-3 transition-colors hover:bg-accent"
                >
                  <RadioGroupItem
                    value={alternativa.id}
                    id={`${itemAtual.itemId}-${alternativa.id}`}
                  />
                  <Label
                    htmlFor={`${itemAtual.itemId}-${alternativa.id}`}
                    className="flex-1 cursor-pointer text-sm font-normal"
                  >
                    <span className="mr-2 font-semibold text-muted-foreground">
                      {alternativa.id}.
                    </span>
                    {alternativa.texto}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        ) : null}
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          variant="outline"
          onClick={() => setIndice((i) => Math.max(0, i - 1))}
          disabled={indice === 0 || encerrando}
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Anterior
        </Button>

        {indice < total - 1 ? (
          <Button onClick={() => setIndice((i) => Math.min(total - 1, i + 1))} disabled={encerrando}>
            Próxima
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button onClick={() => void concluir()} disabled={encerrando}>
            {encerrando ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Finalizar avaliação
          </Button>
        )}
      </div>
    </div>
  );
}

export default CognitiveTestPlayer;
