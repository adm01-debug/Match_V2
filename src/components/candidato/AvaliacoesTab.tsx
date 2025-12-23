import { useMemo,  memo  } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CandidatoPerfil } from "@/data/candidatoPerfilData";
import { ClipboardCheck, Star, ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvaliacoesTabProps {
  candidato: CandidatoPerfil;
}

export function AvaliacoesTab({ candidato }: AvaliacoesTabProps) {
  const getRecomendacaoInfo = (recomendacao: string) => {
    switch (recomendacao) {
      case 'aprovar':
        return { 
          icon: ThumbsUp, 
          label: 'Aprovado', 
          color: 'text-success',
          bgColor: 'bg-success/10'
        };
      case 'reprovar':
        return { 
          icon: ThumbsDown, 
          label: 'Reprovado', 
          color: 'text-destructive',
          bgColor: 'bg-destructive/10'
        };
      default:
        return { 
          icon: HelpCircle, 
          label: 'Em dúvida', 
          color: 'text-warning',
          bgColor: 'bg-warning/10'
        };
    }
  };

  const renderStars = (nota: number, max: number = 5) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <Star 
            key={i} 
            className={cn(
              "h-4 w-4",
              i < nota ? "text-warning fill-warning" : "text-muted"
            )} 
          />
        ))}
      </div>
    );
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'triagem': return '📞';
      case 'entrevista_rh': return '🎤';
      case 'teste_tecnico': return '📝';
      case 'entrevista_gestor': return '👔';
      case 'entrevista_final': return '👥';
      default: return '📋';
    }
  };

  // Calcular média geral
  const mediaGeral = candidato.avaliacoes.length > 0
    ? (candidato.avaliacoes.reduce((acc, aval) => acc + aval.notaGeral, 0) / candidato.avaliacoes.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Resumo das Avaliações */}
      <Card role="article" aria-label="Avaliações do candidato">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            Resumo das Avaliações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-3xl font-bold text-primary">
                {candidato.avaliacoes.length}
              </p>
              <p className="text-sm text-muted-foreground">Avaliações</p>
            </div>
            <div className="text-center p-4 bg-warning/5 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <p className="text-3xl font-bold text-warning">{mediaGeral}</p>
                <Star className="h-5 w-5 text-warning fill-warning" />
              </div>
              <p className="text-sm text-muted-foreground">Média Geral</p>
            </div>
            <div className="text-center p-4 bg-success/5 rounded-lg">
              <p className="text-3xl font-bold text-success">
                {candidato.avaliacoes.filter(a => a.recomendacao === 'aprovar').length}
              </p>
              <p className="text-sm text-muted-foreground">Aprovações</p>
            </div>
            <div className="text-center p-4 bg-destructive/5 rounded-lg">
              <p className="text-3xl font-bold text-destructive">
                {candidato.avaliacoes.filter(a => a.recomendacao === 'reprovar').length}
              </p>
              <p className="text-sm text-muted-foreground">Reprovações</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Avaliações */}
      {candidato.avaliacoes.map((aval) => {
        const recomendacaoInfo = getRecomendacaoInfo(aval.recomendacao);
        const RecomendacaoIcon = recomendacaoInfo.icon;

        return (
          <Card key={aval.id}>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTipoIcon(aval.tipo)}</span>
                  <div>
                    <CardTitle className="text-lg">{aval.tipoLabel}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {aval.data} • {aval.avaliador}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Nota Geral:</span>
                    {renderStars(aval.notaGeral)}
                    <span className="font-semibold">({aval.notaGeral}/5)</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn("flex items-center gap-1", recomendacaoInfo.bgColor, recomendacaoInfo.color)}
                  >
                    <RecomendacaoIcon className="h-4 w-4" />
                    {recomendacaoInfo.label}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Notas por Critério */}
              <div>
                <h4 className="text-sm font-medium mb-3">Notas por Critério</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {aval.notas.map((nota, idx) => (
                    <div key={idx} className="p-3 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">{nota.criterio}</p>
                      <div className="flex items-center gap-2">
                        {renderStars(nota.nota)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observações */}
              <div>
                <h4 className="text-sm font-medium mb-2">Observações</h4>
                <p className="text-muted-foreground bg-secondary/20 p-3 rounded-lg">
                  {aval.observacoes}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {candidato.avaliacoes.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-foreground">Nenhuma avaliação registrada</h3>
            <p className="text-muted-foreground mt-1">
              As avaliações serão exibidas aqui conforme o candidato avança no processo.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

AvaliacoesTab.displayName = "AvaliacoesTab";

export default memo(AvaliacoesTab);
