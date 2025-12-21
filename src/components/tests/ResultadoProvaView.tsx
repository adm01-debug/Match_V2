import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Questao, ResultadoProva, Prova } from '@/types/tests';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target, 
  Award, 
  TrendingUp,
  FileText,
  Download,
  Share2,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultadoProvaViewProps {
  prova: Prova;
  resultado: ResultadoProva;
  questoes: Questao[];
  onVoltar: () => void;
}

export function ResultadoProvaView({ prova, resultado, questoes, onVoltar }: ResultadoProvaViewProps) {
  const aprovado = resultado.status === 'aprovado';
  const tempoFormatado = `${Math.floor(resultado.tempoGasto / 60)}min ${resultado.tempoGasto % 60}s`;
  
  // Stats
  const questoesCorretas = resultado.respostas.filter(r => r.correta).length;
  const questoesIncorretas = resultado.respostas.filter(r => !r.correta && r.resposta !== null).length;
  const questoesPendentes = resultado.respostas.filter(r => r.resposta === null).length;
  
  // Por dificuldade
  const statsPorDificuldade = {
    facil: { corretas: 0, total: 0 },
    medio: { corretas: 0, total: 0 },
    dificil: { corretas: 0, total: 0 }
  };
  
  resultado.respostas.forEach((resp, index) => {
    const questao = questoes[index];
    if (questao) {
      statsPorDificuldade[questao.dificuldade].total++;
      if (resp.correta) {
        statsPorDificuldade[questao.dificuldade].corretas++;
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* Header com resultado principal */}
      <Card role="article" aria-label="Resultado prova" className={cn(
        "border-2",
        aprovado ? "border-green-500 bg-green-500/5" : "border-red-500 bg-red-500/5"
      )}>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center",
                aprovado ? "bg-green-500" : "bg-red-500"
              )}>
                {aprovado ? (
                  <Award className="h-10 w-10 text-white" />
                ) : (
                  <XCircle className="h-10 w-10 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {aprovado ? 'Parabéns! Você foi aprovado!' : 'Não foi dessa vez...'}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {prova.titulo}
                </p>
                <Badge 
                  variant={aprovado ? "default" : "destructive"} 
                  className="mt-2"
                >
                  {aprovado ? 'APROVADO' : 'REPROVADO'}
                </Badge>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <div className="text-5xl font-bold">
                {resultado.percentual.toFixed(0)}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Nota mínima: {prova.notaMinima}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">{resultado.nota}</p>
            <p className="text-xs text-muted-foreground">Pontos Obtidos</p>
            <p className="text-xs text-muted-foreground">de {prova.pontuacaoMaxima}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold text-green-600">{questoesCorretas}</p>
            <p className="text-xs text-muted-foreground">Questões Corretas</p>
            <p className="text-xs text-muted-foreground">de {questoes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="h-6 w-6 mx-auto text-red-500 mb-2" />
            <p className="text-2xl font-bold text-red-600">{questoesIncorretas}</p>
            <p className="text-xs text-muted-foreground">Questões Incorretas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{tempoFormatado}</p>
            <p className="text-xs text-muted-foreground">Tempo Utilizado</p>
            <p className="text-xs text-muted-foreground">de {prova.duracao}min</p>
          </CardContent>
        </Card>
      </div>

      {/* Desempenho por dificuldade */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Desempenho por Dificuldade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(statsPorDificuldade).map(([dif, stats]) => {
            if (stats.total === 0) return null;
            const percentual = (stats.corretas / stats.total) * 100;
            const colors = {
              facil: { bg: 'bg-green-500', text: 'text-green-600', label: 'Fácil' },
              medio: { bg: 'bg-yellow-500', text: 'text-yellow-600', label: 'Médio' },
              dificil: { bg: 'bg-red-500', text: 'text-red-600', label: 'Difícil' }
            };
            const color = colors[dif as keyof typeof colors];
            
            return (
              <div key={dif} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={cn("font-medium", color.text)}>{color.label}</span>
                  <span className="text-muted-foreground">
                    {stats.corretas}/{stats.total} ({percentual.toFixed(0)}%)
                  </span>
                </div>
                <Progress value={percentual} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Revisão das questões */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Revisão das Questões
          </CardTitle>
          <CardDescription>
            Confira suas respostas e o gabarito
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {questoes.map((questao, index) => {
            const resposta = resultado.respostas[index];
            const isCorreta = resposta?.correta;
            const isDissertativa = questao.tipo === 'dissertativa' || questao.tipo === 'pratica';
            
            return (
              <div 
                key={questao.id} 
                className={cn(
                  "p-4 rounded-lg border",
                  isDissertativa ? "bg-muted/30" : isCorreta ? "bg-green-500/5 border-green-500/30" : "bg-red-500/5 border-red-500/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    isDissertativa ? "bg-muted" : isCorreta ? "bg-green-500" : "bg-red-500"
                  )}>
                    {isDissertativa ? (
                      <span className="text-xs font-bold">{index + 1}</span>
                    ) : isCorreta ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <XCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-2">{questao.enunciado}</p>
                    
                    {(questao.tipo === 'multipla_escolha' || questao.tipo === 'verdadeiro_falso') && questao.alternativas && (
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          Sua resposta: {' '}
                          <span className={cn(isCorreta ? "text-green-600" : "text-red-600", "font-medium")}>
                            {resposta?.resposta !== null 
                              ? questao.alternativas[resposta.resposta as number]
                              : 'Não respondida'
                            }
                          </span>
                        </p>
                        {!isCorreta && questao.respostaCorreta !== undefined && (
                          <p className="text-green-600">
                            Resposta correta: {questao.alternativas[questao.respostaCorreta as number]}
                          </p>
                        )}
                      </div>
                    )}

                    {isDissertativa && (
                      <div className="text-sm">
                        <p className="text-muted-foreground">
                          Sua resposta: {resposta?.resposta || 'Não respondida'}
                        </p>
                        <Badge variant="outline" className="mt-2">
                          Correção Pendente
                        </Badge>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {questao.pontuacao} pts
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {resposta?.pontos || 0} pts obtidos
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={onVoltar} className="flex-1">
          Voltar para Testes
        </Button>
        <Button variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Baixar Relatório PDF
        </Button>
        <Button variant="outline" className="flex-1">
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar Resultado
        </Button>
      </div>
    </div>
  );
}
