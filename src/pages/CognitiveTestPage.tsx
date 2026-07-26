/**
 * @module pages/CognitiveTestPage
 * @description Rota pública da avaliação cognitiva.
 *
 * Fluxo em três estados explícitos — intro, aplicação e resultado — para que o
 * candidato sempre saiba onde está e o que ainda falta.
 */
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Brain, Clock, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { CognitiveTestPlayer } from "@/components/cognitive/CognitiveTestPlayer";
import { CognitiveResultCard } from "@/components/cognitive/CognitiveResultCard";
import { useStartCognitiveSession } from "@/hooks/useCognitiveTest";
import {
  COGNITIVE_DOMAINS,
  COGNITIVE_DOMAIN_DESCRICAO,
  COGNITIVE_DOMAIN_LABEL,
} from "@/types/cognitive";
import type { CognitiveResult } from "@/types/cognitive";

const TEMPO_LIMITE_SEG = 20 * 60;
const ITENS_POR_DOMINIO = 5;

export default function CognitiveTestPage() {
  const { vagaId } = useParams<{ vagaId?: string }>();
  const [searchParams] = useSearchParams();
  const candidatoId = searchParams.get("candidato");

  const [sessao, setSessao] = useState<{ id: string; iniciadaEm: string } | null>(null);
  const [resultado, setResultado] = useState<CognitiveResult | null>(null);

  const iniciar = useStartCognitiveSession();

  async function comecar() {
    try {
      const id = await iniciar.mutateAsync({
        candidatoId,
        vagaId: vagaId ?? null,
        dominios: COGNITIVE_DOMAINS,
        itensPorDominio: ITENS_POR_DOMINIO,
        tempoLimiteSeg: TEMPO_LIMITE_SEG,
      });
      setSessao({ id, iniciadaEm: new Date().toISOString() });
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Não foi possível iniciar a avaliação.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Helmet>
        <title>Avaliação cognitiva | People Lovers</title>
        <meta
          name="description"
          content="Avaliação cognitiva cronometrada com raciocínio lógico, numérico, verbal e atenção concentrada."
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 className="mb-6 text-2xl font-bold text-foreground">Avaliação cognitiva</h1>

      {resultado ? (
        <div className="space-y-4">
          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertDescription>
              Avaliação concluída e registrada. O resultado já está disponível para a equipe de
              recrutamento.
            </AlertDescription>
          </Alert>
          <CognitiveResultCard resultado={resultado} />
        </div>
      ) : sessao ? (
        <CognitiveTestPlayer
          sessionId={sessao.id}
          iniciadaEm={sessao.iniciadaEm}
          tempoLimiteSeg={TEMPO_LIMITE_SEG}
          onConcluido={(res) => {
            setResultado(res);
            setSessao(null);
          }}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" aria-hidden="true" />
              Antes de começar
            </CardTitle>
            <CardDescription>
              São {COGNITIVE_DOMAINS.length * ITENS_POR_DOMINIO} questões de múltipla escolha,
              distribuídas igualmente entre quatro domínios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {COGNITIVE_DOMAINS.map((dominio) => (
                <li key={dominio} className="rounded-md border border-border p-3">
                  <p className="text-sm font-medium text-foreground">
                    {COGNITIVE_DOMAIN_LABEL[dominio]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {COGNITIVE_DOMAIN_DESCRICAO[dominio]}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex items-start gap-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>
                Você tem {TEMPO_LIMITE_SEG / 60} minutos no total. O cronômetro corre no servidor:
                fechar a aba não pausa a prova, mas suas respostas já enviadas ficam salvas.
              </p>
            </div>

            <Button onClick={() => void comecar()} disabled={iniciar.isPending} className="w-full">
              {iniciar.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : null}
              Iniciar avaliação
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
