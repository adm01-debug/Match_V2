/**
 * @component InterviewKitRunner
 * @description Executa um roteiro de entrevista (Interview Kit) capturando notas e observações por pergunta.
 */
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useKitPerguntas, useSaveKitResposta, useEntrevistaRespostas } from "@/hooks/useInterviewKits";
import { toast } from "sonner";

interface InterviewKitRunnerProps {
  entrevistaId: string;
  templateId: string;
  templateNome?: string;
}

interface DraftState {
  resposta: string;
  nota: number;
  observacoes: string;
}

const emptyDraft: DraftState = { resposta: "", nota: 0, observacoes: "" };

export function InterviewKitRunner({ entrevistaId, templateId, templateNome }: InterviewKitRunnerProps) {
  const { data: perguntas = [], isLoading } = useKitPerguntas(templateId);
  const { data: respostas = [] } = useEntrevistaRespostas(entrevistaId);
  const save = useSaveKitResposta();

  const respostaByPergunta = useMemo(() => {
    const map = new Map<string, { resposta: string; nota: number; observacoes: string }>();
    for (const r of respostas as Array<{ pergunta_id: string | null; resposta_candidato: string | null; nota: number | null; observacoes: string | null }>) {
      if (r.pergunta_id) {
        map.set(r.pergunta_id, {
          resposta: r.resposta_candidato ?? "",
          nota: r.nota ?? 0,
          observacoes: r.observacoes ?? "",
        });
      }
    }
    return map;
  }, [respostas]);

  const [drafts, setDrafts] = useState<Record<string, DraftState>>({});

  const getState = (perguntaId: string): DraftState => {
    if (drafts[perguntaId]) return drafts[perguntaId];
    return respostaByPergunta.get(perguntaId) ?? emptyDraft;
  };

  const patch = (perguntaId: string, partial: Partial<DraftState>) => {
    setDrafts((prev) => ({
      ...prev,
      [perguntaId]: { ...getState(perguntaId), ...partial },
    }));
  };

  const handleSave = async (perguntaId: string) => {
    const s = getState(perguntaId);
    try {
      await save.mutateAsync({
        entrevistaId,
        templateId,
        perguntaId,
        resposta: s.resposta,
        nota: s.nota,
        observacoes: s.observacoes,
      });
      toast.success("Resposta salva");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao salvar");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Carregando roteiro…
      </div>
    );
  }

  if (perguntas.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          Nenhuma pergunta neste roteiro.
        </CardContent>
      </Card>
    );
  }

  const totalAnswered = perguntas.filter((p) => respostaByPergunta.has(p.id)).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{templateNome ?? "Roteiro de Entrevista"}</h3>
          <p className="text-sm text-muted-foreground">
            {totalAnswered} de {perguntas.length} respondidas
          </p>
        </div>
      </div>

      {perguntas.map((p, idx) => {
        const state = getState(p.id);
        const persisted = respostaByPergunta.has(p.id);
        const max = p.pontuacao_maxima ?? 5;
        return (
          <Card key={p.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">
                    {idx + 1}. {p.pergunta}
                  </CardTitle>
                  <CardDescription className="mt-1 flex flex-wrap gap-1">
                    {p.tipo && <Badge variant="secondary">{p.tipo}</Badge>}
                    {p.obrigatoria && <Badge variant="outline">Obrigatória</Badge>}
                    {persisted && (
                      <Badge className="bg-primary/10 text-primary">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Salva
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {p.criterios_avaliacao && p.criterios_avaliacao.length > 0 && (
                <div className="rounded-md bg-muted/50 p-3 text-sm">
                  <p className="mb-1 font-medium">Critérios de avaliação:</p>
                  <ul className="list-inside list-disc text-muted-foreground">
                    {p.criterios_avaliacao.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium">Resposta do candidato</label>
                <Textarea
                  rows={3}
                  value={state.resposta}
                  onChange={(e) => patch(p.id, { resposta: e.target.value })}
                  placeholder="Registre a resposta…"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Nota: <span className="text-primary">{state.nota}</span> / {max}
                </label>
                <Slider
                  value={[state.nota]}
                  min={0}
                  max={max}
                  step={1}
                  onValueChange={(v) => patch(p.id, { nota: v[0] ?? 0 })}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Observações do avaliador</label>
                <Textarea
                  rows={2}
                  value={state.observacoes}
                  onChange={(e) => patch(p.id, { observacoes: e.target.value })}
                  placeholder="Impressões, exemplos, red flags…"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => handleSave(p.id)}
                  disabled={save.isPending}
                >
                  {save.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Salvar resposta
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default InterviewKitRunner;
