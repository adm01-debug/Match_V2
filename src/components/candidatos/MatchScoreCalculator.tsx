import { useMemo,  useCallback,  memo   } from 'react';
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useVagas } from "@/hooks/useVagas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, Star, CheckCircle2, XCircle, AlertCircle, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MatchScoreCalculatorProps {
  candidatoId: string;
  candidatoNome?: string;
  onScoreCalculated?: (score: number) => void;
}

interface MatchResult {
  scoreTotal: number;
  scoreHabilidades: number;
  scoreExperiencia: number;
  scoreFormacao: number;
  habilidadesMatch: string[];
  habilidadesFaltantes: string[];
  habilidadesExtras: string[];
  analise: string;
  recomendacao: string;
  pontosFortes: string[];
  pontosAtencao: string[];
}

export function MatchScoreCalculator({ candidatoId, candidatoNome, onScoreCalculated }: MatchScoreCalculatorProps) {
  const { toast } = useToast();
  const { data: vagas = [], isLoading: loadingVagas } = useVagas();
  
  const [vagaSelecionada, setVagaSelecionada] = useState<string>("");
  const [calculando, setCalculando] = useState(false);
  const [resultado, setResultado] = useState<MatchResult | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Filtrar apenas vagas ativas
  const vagasAtivas = vagas.filter(v => ['publicada', 'em_selecao'].includes(v.status));

  const handleCalcular = async () => {
    if (!vagaSelecionada) {
      toast({ title: "Atenção", description: "Selecione uma vaga", variant: "destructive" });
      return;
    }

    setCalculando(true);
    setErro(null);
    setResultado(null);

    try {
      const { data, error } = await supabase.functions.invoke('match-score', {
        body: { candidatoId, vagaId: vagaSelecionada }
      });

      if (error) throw error;

      const matchResult = data as MatchResult;
      setResultado(matchResult);
      onScoreCalculated?.(matchResult.scoreTotal);

      // Buscar título da vaga para salvar
      const vagaInfo = vagas.find(v => v.id === vagaSelecionada);

      // Salvar no banco
      await supabase.from('match_scores').insert({
        candidato_id: candidatoId,
        vaga_id: vagaSelecionada,
        vaga_titulo: vagaInfo?.titulo || 'Vaga',
        score_total: matchResult.scoreTotal,
        score_habilidades: matchResult.scoreHabilidades,
        score_experiencia: matchResult.scoreExperiencia,
        score_formacao: matchResult.scoreFormacao,
        habilidades_match: matchResult.habilidadesMatch || [],
        habilidades_faltantes: matchResult.habilidadesFaltantes || [],
        habilidades_extras: matchResult.habilidadesExtras || [],
        pontos_fortes: matchResult.pontosFortes || [],
        pontos_atencao: matchResult.pontosAtencao || [],
        analise: matchResult.analise,
        recomendacao: matchResult.recomendacao,
      });

      toast({ title: "Sucesso", description: `Match Score: ${matchResult.scoreTotal}%` });
    } catch (err: any) {
      setErro(err.message || "Erro ao calcular match score");
      toast({ title: "Erro", description: "Falha ao calcular", variant: "destructive" });
    } finally {
      setCalculando(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-amber-100";
    return "bg-red-100";
  };

  const getRecomendacaoIcon = (recomendacao: string) => {
    if (recomendacao.toLowerCase().includes('altamente')) return <Star className="h-5 w-5 text-green-500" />;
    if (recomendacao.toLowerCase().includes('recomendado')) return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
    if (recomendacao.toLowerCase().includes('considera')) return <AlertCircle className="h-5 w-5 text-amber-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  if (loadingVagas) {
    return <Skeleton className="h-48" />;
  }

  return (
    <Card role="article" aria-label="Calculadora match">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Match Score AI
        </CardTitle>
        <CardDescription>
          Calcule a compatibilidade {candidatoNome ? `de ${candidatoNome}` : 'do candidato'} com uma vaga
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div data-testid="match-score-calculator" className="flex gap-4">
          <Select value={vagaSelecionada} onValueChange={setVagaSelecionada}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecione uma vaga" />
            </SelectTrigger>
            <SelectContent>
              {vagasAtivas.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground">Nenhuma vaga ativa</div>
              ) : (
                vagasAtivas.map(vaga => (
                  <SelectItem key={vaga.id} value={vaga.id}>
                    <div className="flex items-center gap-2">
                      <span>{vaga.titulo}</span>
                      <Badge variant="outline" className="text-xs">{vaga.departamento}</Badge>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button onClick={handleCalcular} disabled={calculando || !vagaSelecionada}>
            <Calculator className="h-4 w-4 mr-2" />
            {calculando ? "Calculando..." : "Calcular"}
          </Button>
        </div>

        {erro && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}

        {resultado && (
          <div className="space-y-4 animate-fade-in">
            {/* Score Principal */}
            <div className={cn("p-6 rounded-lg text-center", getScoreBg(resultado.scoreTotal))}>
              <p className="text-sm text-muted-foreground mb-1">Match Score</p>
              <p className={cn("text-5xl font-bold", getScoreColor(resultado.scoreTotal))}>
                {resultado.scoreTotal}%
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                {getRecomendacaoIcon(resultado.recomendacao)}
                <span className="text-sm font-medium">{resultado.recomendacao}</span>
              </div>
            </div>

            {/* Scores Detalhados */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Habilidades</p>
                <p className={cn("text-2xl font-bold", getScoreColor(resultado.scoreHabilidades))}>
                  {resultado.scoreHabilidades}%
                </p>
                <Progress value={resultado.scoreHabilidades} className="h-1 mt-1" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Experiência</p>
                <p className={cn("text-2xl font-bold", getScoreColor(resultado.scoreExperiencia))}>
                  {resultado.scoreExperiencia}%
                </p>
                <Progress value={resultado.scoreExperiencia} className="h-1 mt-1" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Formação</p>
                <p className={cn("text-2xl font-bold", getScoreColor(resultado.scoreFormacao))}>
                  {resultado.scoreFormacao}%
                </p>
                <Progress value={resultado.scoreFormacao} className="h-1 mt-1" />
              </div>
            </div>

            {/* Habilidades */}
            <div className="space-y-3">
              {resultado.habilidadesMatch.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">✅ Habilidades Compatíveis</p>
                  <div className="flex flex-wrap gap-1">
                    {resultado.habilidadesMatch.map((h, i) => (
                      <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200">{h}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {resultado.habilidadesFaltantes.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-red-700 mb-1">❌ Habilidades Faltantes</p>
                  <div className="flex flex-wrap gap-1">
                    {resultado.habilidadesFaltantes.map((h, i) => (
                      <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">{h}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {resultado.habilidadesExtras.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">➕ Habilidades Extras</p>
                  <div className="flex flex-wrap gap-1">
                    {resultado.habilidadesExtras.map((h, i) => (
                      <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{h}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Análise */}
            {resultado.analise && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Análise
                </p>
                <p className="text-sm text-muted-foreground">{resultado.analise}</p>
              </div>
            )}

            {/* Pontos Fortes e Atenção */}
            <div className="grid grid-cols-2 gap-4">
              {resultado.pontosFortes.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">💪 Pontos Fortes</p>
                  <ul className="text-sm space-y-1">
                    {resultado.pontosFortes.map((p, i) => (
                      <li key={i} className="text-muted-foreground">• {p}</li>
                    ))}
                  </ul>
                </div>
              )}
              {resultado.pontosAtencao.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-amber-700 mb-1">⚠️ Pontos de Atenção</p>
                  <ul className="text-sm space-y-1">
                    {resultado.pontosAtencao.map((p, i) => (
                      <li key={i} className="text-muted-foreground">• {p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

MatchScoreCalculator.displayName = "MatchScoreCalculator";

export default memo(MatchScoreCalculator);
