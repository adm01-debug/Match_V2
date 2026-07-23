/**
 * @module RankingVagaPage
 * @description Etapa 8 — Ranking automático de candidatos por vaga.
 * Ordena candidaturas pelo score de triagem IA (desc) e permite triagem em lote.
 */
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRankingVaga, useBulkAiScreening, useRankingStats } from "@/hooks/useRankingVaga";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

function recomendacaoBadge(rec?: string | null) {
  if (rec === "aprovar") return <Badge className="bg-emerald-600 hover:bg-emerald-700">Aprovar</Badge>;
  if (rec === "revisar") return <Badge className="bg-amber-500 hover:bg-amber-600">Revisar</Badge>;
  if (rec === "reprovar") return <Badge variant="destructive">Reprovar</Badge>;
  return <Badge variant="outline">Sem triagem</Badge>;
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-destructive";
}

export default function RankingVagaPage() {
  const { vagaId } = useParams<{ vagaId: string }>();
  const { data: rows = [], isLoading } = useRankingVaga(vagaId);
  const bulk = useBulkAiScreening(vagaId);
  const stats = useRankingStats(rows);
  const [running, setRunning] = useState(false);

  const { data: vaga } = useQuery({
    queryKey: ["vaga-mini", vagaId],
    enabled: !!vagaId,
    queryFn: async () => {
      const { data } = await supabase.from("vagas").select("id, titulo").eq("id", vagaId!).maybeSingle();
      return data;
    },
  });

  const pendentes = useMemo(() => rows.filter((r) => !r.triagem).map((r) => r.candidatura_id), [rows]);

  const runBulk = async () => {
    if (!pendentes.length) {
      toast.info("Todas as candidaturas já foram triadas.");
      return;
    }
    setRunning(true);
    toast.info(`Executando triagem IA em ${pendentes.length} candidato(s)…`);
    try {
      const results = await bulk.mutateAsync(pendentes);
      const ok = results.filter((r) => r.ok).length;
      const fail = results.length - ok;
      if (fail === 0) toast.success(`Triagem concluída: ${ok} candidato(s) analisado(s).`);
      else toast.warning(`Triagem parcial: ${ok} ok, ${fail} falha(s).`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao executar triagem em lote");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            to={vagaId ? `/vagas/${vagaId}` : "/vagas"}
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para a vaga
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Ranking IA {vaga?.titulo ? <span className="text-muted-foreground">· {vaga.titulo}</span> : null}
          </h1>
          <p className="text-sm text-muted-foreground">
            Ordenado pelo score da triagem automática. Execute a triagem para candidaturas ainda não analisadas.
          </p>
        </div>
        <Button onClick={runBulk} disabled={running || bulk.isPending || pendentes.length === 0}>
          <Play className="mr-2 h-4 w-4" />
          Triar {pendentes.length} pendente(s)
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        {[
          { label: "Total", value: stats.total },
          { label: "Triados", value: stats.triados },
          { label: "Pendentes", value: stats.pendentes },
          { label: "Aprovar", value: stats.aprovar },
          { label: "Revisar", value: stats.revisar },
          { label: "Score médio", value: stats.media },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Candidatos ranqueados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nenhuma candidatura ativa para esta vaga.
            </p>
          ) : (
            rows.map((r, idx) => {
              const score = r.triagem?.score ?? null;
              return (
                <div
                  key={r.candidatura_id}
                  className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-medium">{r.nome}</div>
                      <div className="text-xs text-muted-foreground">{r.email}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">{r.etapa_atual}</Badge>
                        {recomendacaoBadge(r.triagem?.recomendacao)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 md:w-96">
                    {score !== null ? (
                      <div className="flex-1 space-y-1">
                        <div className={`text-right text-lg font-bold ${scoreColor(score)}`}>{score}/100</div>
                        <Progress value={score} className="h-2" />
                        {r.triagem?.resumo ? (
                          <p className="line-clamp-2 text-xs text-muted-foreground">{r.triagem.resumo}</p>
                        ) : null}
                      </div>
                    ) : (
                      <span className="flex-1 text-right text-xs text-muted-foreground">
                        Aguardando triagem
                      </span>
                    )}
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/candidato/${r.candidato_auth_id}`}>Ver</Link>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
