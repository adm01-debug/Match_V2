import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ProvaTimer } from '@/components/tests/ProvaTimer';
import { QuestaoAplicacao } from '@/components/tests/QuestaoAplicacao';
import { ResultadoProvaView } from '@/components/tests/ResultadoProvaView';
import { todasProvas, categoriasInfo } from '@/data/testsData';
import { Questao, Prova, ResultadoProva } from '@/types/tests';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  Send, 
  Clock, 
  FileText,
  CheckCircle,
  AlertTriangle,
  User,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Questões de demonstração para a prova
const questoesDemo: Questao[] = [
  {
    id: 'demo-1',
    enunciado: 'Qual é o resultado da expressão: 2 + 2 * 3?',
    tipo: 'multipla_escolha',
    alternativas: ['12', '8', '10', '6'],
    respostaCorreta: 1,
    pontuacao: 10,
    dificuldade: 'facil'
  },
  {
    id: 'demo-2',
    enunciado: 'Em JavaScript, o operador "===" compara valor e tipo.',
    tipo: 'verdadeiro_falso',
    alternativas: ['Verdadeiro', 'Falso'],
    respostaCorreta: 0,
    pontuacao: 10,
    dificuldade: 'facil'
  },
  {
    id: 'demo-3',
    enunciado: 'Qual estrutura de dados utiliza o conceito LIFO (Last In, First Out)?',
    tipo: 'multipla_escolha',
    alternativas: ['Fila (Queue)', 'Pilha (Stack)', 'Lista Encadeada', 'Árvore Binária'],
    respostaCorreta: 1,
    pontuacao: 15,
    dificuldade: 'medio'
  },
  {
    id: 'demo-4',
    enunciado: 'O que significa SQL?',
    tipo: 'multipla_escolha',
    alternativas: [
      'Structured Query Language', 
      'Simple Question Language', 
      'Standard Query Logic',
      'System Query Language'
    ],
    respostaCorreta: 0,
    pontuacao: 10,
    dificuldade: 'facil'
  },
  {
    id: 'demo-5',
    enunciado: 'Uma função recursiva sempre precisa de um caso base para evitar loop infinito.',
    tipo: 'verdadeiro_falso',
    alternativas: ['Verdadeiro', 'Falso'],
    respostaCorreta: 0,
    pontuacao: 10,
    dificuldade: 'medio'
  },
  {
    id: 'demo-6',
    enunciado: 'Qual a complexidade de tempo média para busca em uma tabela hash?',
    tipo: 'multipla_escolha',
    alternativas: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
    respostaCorreta: 2,
    pontuacao: 20,
    dificuldade: 'dificil'
  },
  {
    id: 'demo-7',
    enunciado: 'Explique com suas palavras a diferença entre programação síncrona e assíncrona.',
    tipo: 'dissertativa',
    pontuacao: 25,
    dificuldade: 'medio'
  }
];

type AplicacaoStatus = 'inicio' | 'em_andamento' | 'finalizada';

export default function ProvaAplicacao() {
  const { provaId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const prova = todasProvas.find(p => p.id === provaId) || todasProvas[0];
  const questoes = questoesDemo;
  
  const [status, setStatus] = useState<AplicacaoStatus>('inicio');
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<(string | number | null)[]>(
    new Array(questoes.length).fill(null)
  );
  const [resultado, setResultado] = useState<ResultadoProva | null>(null);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [tempoInicio, setTempoInicio] = useState<Date | null>(null);

  // Calcular progresso
  const questoesRespondidas = respostas.filter(r => r !== null && r !== '').length;
  const progressoPercentual = (questoesRespondidas / questoes.length) * 100;

  const handleResponder = useCallback((resposta: string | number) => {
    setRespostas(prev => {
      const newRespostas = [...prev];
      newRespostas[questaoAtual] = resposta;
      return newRespostas;
    });
  }, [questaoAtual]);

  const handleIniciarProva = () => {
    setStatus('em_andamento');
    setTempoInicio(new Date());
    toast({
      title: "Prova iniciada!",
      description: `Você tem ${prova?.duracao || 30} minutos para completar.`
    });
  };

  const calcularResultado = useCallback((): ResultadoProva => {
    const tempoFim = new Date();
    const tempoGasto = tempoInicio 
      ? Math.floor((tempoFim.getTime() - tempoInicio.getTime()) / 1000)
      : 0;
    
    let totalPontos = 0;
    const respostasAvaliadas = questoes.map((questao, index) => {
      const resposta = respostas[index];
      let correta = false;
      let pontos = 0;
      
      if (questao.tipo === 'multipla_escolha' || questao.tipo === 'verdadeiro_falso') {
        correta = resposta === questao.respostaCorreta;
        pontos = correta ? questao.pontuacao : 0;
      } else {
        // Dissertativa/prática: pontuação pendente
        pontos = 0;
        correta = false;
      }
      
      totalPontos += pontos;
      
      return {
        questaoId: questao.id,
        resposta: resposta as string | number,
        correta,
        pontos
      };
    });

    const pontuacaoMaxima = questoes.reduce((sum, q) => sum + q.pontuacao, 0);
    const percentual = (totalPontos / pontuacaoMaxima) * 100;
    
    return {
      id: `res-${Date.now()}`,
      provaId: prova?.id || '',
      candidatoId: 'candidato-demo',
      nota: totalPontos,
      percentual,
      tempoGasto,
      respostas: respostasAvaliadas,
      iniciadoEm: tempoInicio?.toISOString() || '',
      finalizadoEm: tempoFim.toISOString(),
      status: percentual >= (prova?.notaMinima || 60) ? 'aprovado' : 'reprovado'
    };
  }, [questoes, respostas, tempoInicio, prova]);

  const handleFinalizarProva = () => {
    const res = calcularResultado();
    setResultado(res);
    setStatus('finalizada');
    toast({
      title: res.status === 'aprovado' ? "Parabéns!" : "Prova finalizada",
      description: res.status === 'aprovado' 
        ? `Você foi aprovado com ${res.percentual.toFixed(0)}%!`
        : `Sua nota foi ${res.percentual.toFixed(0)}%. Continue estudando!`
    });
    setShowConfirmFinish(false);
  };

  const handleTimeUp = useCallback(() => {
    toast({
      title: "Tempo esgotado!",
      description: "A prova será finalizada automaticamente.",
      variant: "destructive"
    });
    handleFinalizarProva();
  }, []);

  // Tela inicial
  if (status === 'inicio') {
    const categoriaInfo = prova ? categoriasInfo[prova.categoria] : null;
    
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Button variant="ghost" onClick={() => navigate('/testes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <Card>
            <CardHeader className="text-center">
              <div className={cn(
                "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
                categoriaInfo?.cor || "bg-primary"
              )}>
                <FileText className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{prova?.titulo}</CardTitle>
              <CardDescription className="text-base mt-2">
                {prova?.descricao}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-lg bg-muted">
                  <Clock className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-2xl font-bold">{prova?.duracao || 30}</p>
                  <p className="text-sm text-muted-foreground">minutos</p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <FileText className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-2xl font-bold">{questoes.length}</p>
                  <p className="text-sm text-muted-foreground">questões</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Informações do Candidato</h4>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">João Silva</p>
                    <p className="text-sm text-muted-foreground">joao.silva@email.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Desenvolvedor Full Stack</p>
                    <p className="text-sm text-muted-foreground">Vaga #12345</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Nota mínima para aprovação: {prova?.notaMinima || 60}%
                </p>
                <p className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  O tempo começará a contar ao iniciar a prova
                </p>
                <p className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Não é possível pausar após iniciar
                </p>
              </div>

              <Button className="w-full" size="lg" onClick={handleIniciarProva}>
                <Play className="h-5 w-5 mr-2" />
                Iniciar Prova
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Tela de resultado
  if (status === 'finalizada' && resultado && prova) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <ResultadoProvaView
            prova={prova}
            resultado={resultado}
            questoes={questoes}
            onVoltar={() => navigate('/testes')}
          />
        </div>
      </Layout>
    );
  }

  // Tela de aplicação
  return (
    <Layout>
      <div className="space-y-4">
        {/* Header fixo */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b -mx-4 px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-bold text-lg">{prova?.titulo}</h1>
              <p className="text-sm text-muted-foreground">
                Questão {questaoAtual + 1} de {questoes.length}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <ProvaTimer 
                duracaoMinutos={prova?.duracao || 30} 
                onTimeUp={handleTimeUp} 
              />
              <Button 
                variant="destructive"
                onClick={() => setShowConfirmFinish(true)}
              >
                <Send className="h-4 w-4 mr-2" />
                Finalizar
              </Button>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                {questoesRespondidas} de {questoes.length} respondidas
              </span>
              <span className="font-medium">{progressoPercentual.toFixed(0)}%</span>
            </div>
            <Progress value={progressoPercentual} className="h-2" />
          </div>
        </div>

        {/* Navegação por questões */}
        <div className="flex gap-2 flex-wrap">
          {questoes.map((_, index) => {
            const respondida = respostas[index] !== null && respostas[index] !== '';
            const atual = index === questaoAtual;
            
            return (
              <Button
                key={index}
                variant={atual ? "default" : respondida ? "secondary" : "outline"}
                size="sm"
                className={cn(
                  "w-10 h-10",
                  respondida && !atual && "bg-green-500/20 hover:bg-green-500/30"
                )}
                onClick={() => setQuestaoAtual(index)}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>

        {/* Questão atual */}
        <QuestaoAplicacao
          questao={questoes[questaoAtual]}
          index={questaoAtual}
          totalQuestoes={questoes.length}
          resposta={respostas[questaoAtual]}
          onResponder={handleResponder}
        />

        {/* Navegação */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            disabled={questaoAtual === 0}
            onClick={() => setQuestaoAtual(prev => prev - 1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          {questaoAtual < questoes.length - 1 ? (
            <Button
              onClick={() => setQuestaoAtual(prev => prev + 1)}
            >
              Próxima
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={() => setShowConfirmFinish(true)}
            >
              <Send className="h-4 w-4 mr-2" />
              Finalizar Prova
            </Button>
          )}
        </div>
      </div>

      {/* Dialog de confirmação */}
      <AlertDialog open={showConfirmFinish} onOpenChange={setShowConfirmFinish}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar Prova?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Você respondeu {questoesRespondidas} de {questoes.length} questões.
              </p>
              {questoesRespondidas < questoes.length && (
                <p className="text-yellow-600">
                  Atenção: {questoes.length - questoesRespondidas} questão(ões) não foi(ram) respondida(s).
                </p>
              )}
              <p>
                Após finalizar, não será possível alterar suas respostas.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar Respondendo</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalizarProva}>
              Finalizar Prova
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
