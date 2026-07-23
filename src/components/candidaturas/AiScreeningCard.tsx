/**
 * @component AiScreeningCard
 * @description Cartão de triagem por IA: dispara a análise, mostra score, resumo, forças e red flags.
 */
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import { useTriagemCandidatura, useRunAiScreening } from "@/hooks/useAiScreening";
import { toast } from "sonner";

interface AiScreeningCardProps {
  candidaturaId: string;
}

const recBadge = {
  aprovar: { label: "Aprovar", cls: "bg-primary/10 text-primary" },
  revisar: { label: "Revisar", cls: "bg-secondary text-secondary-foreground" },
  reprovar: { label: "Reprovar", cls: "bg-destructive/10 text-destructive" },
} as const;

export function AiScreeningCard({ candidaturaId }: AiScreeningCardProps) {
  const { data: triagem, isLoading } = useTriagemCandidatura(candidaturaId);
  const run = useRunAiScreening();

  const handleRun = async () => {
    try {
      await run.mutateAsync({ candidaturaId, force: !!triagem });
      toast.success("Triagem por IA concluída");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha na triagem");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Triagem por IA
            </CardTitle>
            <CardDescription>
              Resumo, red flags e recomendação automatizada da candidatura.
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant={triagem ? "outline" : "default"}
            onClick={handleRun}
            disabled={run.isPending}
          >
            {run.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : triagem ? (
              <RefreshCw className="mr-2 h-4 w-4" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {triagem ? "Reprocessar" : "Rodar triagem"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading && !triagem && (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        )}

        {!isLoading && !triagem && (
          <p className="text-sm text-muted-foreground">
            Nenhuma triagem ainda. Clique em <b>Rodar triagem</b> para gerar.
          </p>
        )}

        {triagem && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={recBadge[triagem.recomendacao].cls}>
                {recBadge[triagem.recomendacao].label}
              </Badge>
              <div className="flex-1 min-w-[200px]">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">Score</span>
                  <span className="font-semibold">{triagem.score}/100</span>
                </div>
                <Progress value={triagem.score} />
              </div>
              {triagem.cache_hit && (
                <Badge variant="outline" className="text-xs">cache</Badge>
              )}
            </div>

            <div className="rounded-md border border-border bg-muted/30 p-3 text-sm">
              {triagem.resumo}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="mb-2 flex items-center gap-1 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Pontos fortes
                </p>
                {triagem.pontos_fortes.length ? (
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {triagem.pontos_fortes.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>
              <div>
                <p className="mb-2 flex items-center gap-1 text-sm font-medium">
                  <ShieldAlert className="h-4 w-4 text-destructive" /> Red flags
                </p>
                {triagem.red_flags.length ? (
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {triagem.red_flags.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum alerta.</p>
                )}
              </div>
            </div>

            {(triagem.match_habilidades.presentes.length > 0 ||
              triagem.match_habilidades.ausentes.length > 0) && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Match de habilidades</p>
                <div className="flex flex-wrap gap-1">
                  {triagem.match_habilidades.presentes.map((h) => (
                    <Badge key={`p-${h}`} className="bg-primary/10 text-primary">{h}</Badge>
                  ))}
                  {triagem.match_habilidades.ausentes.map((h) => (
                    <Badge key={`a-${h}`} variant="outline" className="border-destructive/40 text-destructive">
                      <AlertTriangle className="mr-1 h-3 w-3" /> {h}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Modelo: {triagem.modelo} • Atualizado em{" "}
              {new Date(triagem.updated_at).toLocaleString("pt-BR")}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default AiScreeningCard;
