import { EmptyState } from '@/components/common/EmptyState';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useProvas, useProva } from "@/hooks/useProvas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, AlertCircle, Send, Timer, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Questao { id: string; texto: string; tipo: 'multipla_escolha' | 'verdadeiro_falso' | 'dissertativa'; opcoes: string[]; pontos: number; }

export default function ProvaAplicacao() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const processoId = searchParams.get('processo');
  const candidatoId = searchParams.get('candidato');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: prova, isLoading } = useProva(id);
  const { iniciarProva, salvarRespostas, finalizarProva } = useProvas();

  const [resultadoId, setResultadoId] = useState<string | null>(null);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number | string>>({});
  const [tempoRestante, setTempoRestante] = useState<number | null>(null);
  const [iniciada, setIniciada] = useState(false);
  const [finalizada, setFinalizada] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const questoes: Questao[] = prova?.questoes as Questao[] || [];

  useEffect(() => {
  usePageTitle('Aplicação de Prova');

    if (!iniciada || finalizada || tempoRestante === null) return;
    const timer = setInterval(() => {
      setTempoRestante(prev => {
        if (prev === null || prev <= 0) { clearInterval(timer); handleFinalizar(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [iniciada, finalizada, tempoRestante]);

  const formatarTempo = (segundos: number) => {
  useDocumentTitle('Aplicar Prova');

    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleIniciar = async () => {
    if (!id || !candidatoId) { toast({ title: "Erro", description: "Dados incompletos", variant: "destructive" }); return; }
    try {
      const resultado = await iniciarProva(id, candidatoId, processoId || undefined);
      setResultadoId(resultado.id);
      setTempoRestante((prova?.duracao_minutos || 60) * 60);
      setIniciada(true);
    } catch { toast({ title: "Erro", description: "Erro ao iniciar", variant: "destructive" }); }
  };

  const handleSalvarResposta = (questaoId: string, valor: number | string) => setRespostas(prev => ({ ...prev, [questaoId]: valor }));
  const handleProxima = () => { if (questaoAtual < questoes.length - 1) setQuestaoAtual(prev => prev + 1); };
  const handleAnterior = () => { if (questaoAtual > 0) setQuestaoAtual(prev => prev - 1); };

  const handleSalvarProgresso = async () => {
    if (!resultadoId) return;
    setSalvando(true);
    try {
      await salvarRespostas(resultadoId, Object.entries(respostas).map(([questao_id, resposta]) => ({ questao_id, resposta })));
      toast({ title: "Salvo", description: "Progresso salvo" });
    } catch { toast({ title: "Erro", variant: "destructive" }); }
    finally { setSalvando(false); }
  };

  const handleFinalizar = async () => {
    if (!resultadoId) return;
    const respondidas = Object.keys(respostas).length;
    if (respondidas < questoes.length && !confirm(`Respondeu ${respondidas}/${questoes.length}. Finalizar?`)) return;
    setSalvando(true);
    try {
      const resultado = await finalizarProva(resultadoId, Object.entries(respostas).map(([questao_id, resposta]) => ({ questao_id, resposta })));
      setFinalizada(true);
      toast({ title: resultado.status === 'aprovado' ? "Parabéns!" : "Finalizado", description: `Nota: ${resultado.nota.toFixed(1)}%`, variant: resultado.status === 'aprovado' ? 'default' : 'destructive' });
    } catch { toast({ title: "Erro", variant: "destructive" }); }
    finally { setSalvando(false); }
  };

  if (isLoading) return <Layout title="Prova"><div className="p-6"><Skeleton className="h-64" /></div></Layout>;
  if (!prova) return <Layout title="Não encontrada"><div className="p-6 text-center"><AlertCircle className="h-12 w-12 mx-auto mb-4" /><p>Prova não encontrada</p><Button onClick={() => navigate(-1)} className="mt-4">Voltar</Button></div></Layout>;

  if (!iniciada) {
    return (
      <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-64" /></div>}>
      <Layout title={prova.titulo}>
        <div className="p-6 max-w-2xl mx-auto space-y-6">
          <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
          <Card>
            <CardHeader><CardTitle className="text-2xl">{prova.titulo}</CardTitle><CardDescription>{prova.descricao}</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2"><FileText className="h-5 w-5" /><div><p className="font-medium">{prova.total_questoes}</p><p className="text-xs text-muted-foreground">Questões</p></div></div>
                <div className="flex items-center gap-2"><Clock className="h-5 w-5" /><div><p className="font-medium">{prova.duracao_minutos} min</p><p className="text-xs text-muted-foreground">Duração</p></div></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /><div><p className="font-medium">{prova.nota_minima}%</p><p className="text-xs text-muted-foreground">Nota mínima</p></div></div>
                <div className="flex items-center gap-2"><Timer className="h-5 w-5" /><div><p className="font-medium">{prova.pontuacao_maxima}</p><p className="text-xs text-muted-foreground">Pontos</p></div></div>
              </div>
              <Alert><AlertCircle className="h-4 w-4" /><AlertDescription>Ao iniciar, o cronômetro começará. Salve o progresso regularmente.</AlertDescription></Alert>
            </CardContent>
            <CardFooter><Button onClick={handleIniciar} className="w-full" size="lg">Iniciar Prova</Button></CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  if (finalizada) {
    return (
      <Layout title="Prova Finalizada">
        <div className="p-6 max-w-2xl mx-auto text-center space-y-6">
          <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
          <h1 className="text-2xl font-bold">Prova Finalizada!</h1>
          <p className="text-muted-foreground">Respostas enviadas com sucesso.</p>
          <Button onClick={() => navigate(-1)}>Voltar</Button>
        </div>
      </Layout>
    );
  }

  const questao = questoes[questaoAtual];
  const progresso = (Object.keys(respostas).length / questoes.length) * 100;
  const tempoAlerta = tempoRestante !== null && tempoRestante < 300;

  return (
    <Layout title={prova.titulo}>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-bold">{prova.titulo}</h1><p className="text-sm text-muted-foreground">Questão {questaoAtual + 1} de {questoes.length}</p></div>
          <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg", tempoAlerta ? "bg-red-100 text-red-700" : "bg-muted")}>
            <Clock className={cn("h-5 w-5", tempoAlerta && "animate-pulse")} />{tempoRestante !== null && formatarTempo(tempoRestante)}
          </div>
        </div>
        <div className="space-y-2"><div className="flex justify-between text-sm"><span>{Object.keys(respostas).length} respondidas</span><span>{Math.round(progresso)}%</span></div><Progress value={progresso} className="h-2" /></div>
        <div className="flex flex-wrap gap-2">
          {questoes.map((q, i) => (<Button key={q.id} variant={questaoAtual === i ? "default" : respostas[q.id] !== undefined ? "secondary" : "outline"} size="sm" className="w-10 h-10" onClick={() => setQuestaoAtual(i)}>{i + 1}</Button>))}
        </div>
        {questao && (
          <Card>
            <CardHeader><div className="flex items-center justify-between"><Badge variant="outline">{questao.tipo.replace('_', ' ')}</Badge><span className="text-sm text-muted-foreground">{questao.pontos} pts</span></div><CardTitle className="text-lg mt-2">{questao.texto}</CardTitle></CardHeader>
            <CardContent>
              {questao.tipo === 'dissertativa' ? (
                <Textarea placeholder="Digite sua resposta..." value={respostas[questao.id] as string || ''} onChange={(e) => handleSalvarResposta(questao.id, e.target.value)} rows={6} />
              ) : (
                <RadioGroup value={respostas[questao.id]?.toString() || ''} onValueChange={(v) => handleSalvarResposta(questao.id, parseInt(v))}>
                  {questao.opcoes.map((opcao, i) => (<div key={i} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted"><RadioGroupItem value={i.toString()} id={`op-${i}`} /><Label htmlFor={`op-${i}`} className="flex-1 cursor-pointer">{opcao}</Label></div>))}
                </RadioGroup>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleAnterior} disabled={questaoAtual === 0}><ArrowLeft className="h-4 w-4 mr-2" />Anterior</Button>
              <Button variant="outline" onClick={handleSalvarProgresso} disabled={salvando}>{salvando ? "Salvando..." : "Salvar"}</Button>
              {questaoAtual === questoes.length - 1 ? <Button onClick={handleFinalizar} disabled={salvando}><Send className="h-4 w-4 mr-2" />Finalizar</Button> : <Button onClick={handleProxima}>Próxima<ArrowRight className="h-4 w-4 ml-2" /></Button>}
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
}
