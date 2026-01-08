import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAvaliacoes, useAvaliacao, COMPETENCIAS_TECNICAS, COMPETENCIAS_COMPORTAMENTAIS } from "@/hooks/useAvaliacoes";
import { useProcessosSeletivos } from "@/hooks/useProcessosSeletivos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  Send,
  Star,
  AlertCircle,
  Briefcase,
  Brain,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface NotaCompetencia {
  id: string;
  nome: string;
  tipo: string;
  nota: number;
}

export default function AvaliacaoForm() {
  usePageTitle('Avaliação');

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const processoIdParam = searchParams.get('processo');
  const navigate = useNavigate();
  const { toast } = useToast();

  const isEditing = !!id;

  // Hooks de dados
  const { data: avaliacaoExistente, isLoading: loadingAvaliacao } = useAvaliacao(id);
  const { createAvaliacao, salvarRascunho, finalizarAvaliacao, isCreating, isUpdating } = useAvaliacoes();
  const { data: processos = [], isLoading: loadingProcessos } = useProcessosSeletivos();

  // State do formulário
  const [processoId, setProcessoId] = useState<string>(processoIdParam || "");
  const [notasTecnicas, setNotasTecnicas] = useState<NotaCompetencia[]>(
    COMPETENCIAS_TECNICAS.map(c => ({ ...c, nota: 5 }))
  );
  const [notasComportamentais, setNotasComportamentais] = useState<NotaCompetencia[]>(
    COMPETENCIAS_COMPORTAMENTAIS.map(c => ({ ...c, nota: 5 }))
  );
  const [pontosFortes, setPontosFortes] = useState("");
  const [pontosDesenvolvimento, setPontosDesenvolvimento] = useState("");
  const [observacoesGerais, setObservacoesGerais] = useState("");
  const [parecer, setParecer] = useState<string>("em_duvida");
  const [recomendacao, setRecomendacao] = useState("");
  const [activeTab, setActiveTab] = useState("tecnicas");

  // Carregar dados se editando
  useEffect(() => {
    if (avaliacaoExistente) {
      setProcessoId(avaliacaoExistente.processo_id);
      if (avaliacaoExistente.notas_tecnicas) {
        setNotasTecnicas(avaliacaoExistente.notas_tecnicas as unknown as NotaCompetencia[]);
      }
      if (avaliacaoExistente.notas_comportamentais) {
        setNotasComportamentais(avaliacaoExistente.notas_comportamentais as unknown as NotaCompetencia[]);
      }
      setPontosFortes(avaliacaoExistente.pontos_fortes || "");
      setPontosDesenvolvimento(avaliacaoExistente.pontos_desenvolvimento || "");
      setObservacoesGerais(avaliacaoExistente.observacoes_gerais || "");
      setParecer(avaliacaoExistente.parecer || "em_duvida");
      setRecomendacao(avaliacaoExistente.recomendacao || "");
    }
  }, [avaliacaoExistente]);

  // Calcular médias
  const mediaTecnica = notasTecnicas.reduce((acc, n) => acc + n.nota, 0) / notasTecnicas.length;
  const mediaComportamental = notasComportamentais.reduce((acc, n) => acc + n.nota, 0) / notasComportamentais.length;
  const mediaGeral = (mediaTecnica + mediaComportamental) / 2;

  // Atualizar nota de competência
  const handleNotaChange = (tipo: 'tecnica' | 'comportamental', compId: string, nota: number) => {
    if (tipo === 'tecnica') {
      setNotasTecnicas(prev => prev.map(n => n.id === compId ? { ...n, nota } : n));
    } else {
      setNotasComportamentais(prev => prev.map(n => n.id === compId ? { ...n, nota } : n));
    }
  };

  // Salvar rascunho
  const handleSalvarRascunho = async () => {
    if (!processoId) {
      toast({ title: "Erro", description: "Selecione um candidato", variant: "destructive" });
      return;
    }

    try {
      await salvarRascunho({
        processo_id: processoId,
        etapa: 'avaliacao',
        notas_tecnicas: notasTecnicas as unknown as { competenciaId: string; nota: 1 | 2 | 3 | 4 | 5; observacao?: string }[],
        notas_comportamentais: notasComportamentais as unknown as { competenciaId: string; nota: 1 | 2 | 3 | 4 | 5; observacao?: string }[],
        nota_geral: mediaGeral * 10,
        pontos_fortes: pontosFortes,
        pontos_desenvolvimento: pontosDesenvolvimento,
        observacoes_gerais: observacoesGerais,
      });
      toast({ title: "Rascunho salvo" });
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  // Finalizar avaliação
  const handleFinalizar = async () => {
    if (!processoId) {
      toast({ title: "Erro", description: "Selecione um candidato", variant: "destructive" });
      return;
    }

    if (!parecer || parecer === "em_duvida") {
      toast({ title: "Atenção", description: "Selecione um parecer final", variant: "destructive" });
      return;
    }

    try {
      if (isEditing && id) {
        await finalizarAvaliacao(id, parecer, recomendacao);
      } else {
        await createAvaliacao({
          processo_id: processoId,
          etapa: 'avaliacao',
          parecer,
          notas_tecnicas: notasTecnicas as unknown as { competenciaId: string; nota: 1 | 2 | 3 | 4 | 5; observacao?: string }[],
          notas_comportamentais: notasComportamentais as unknown as { competenciaId: string; nota: 1 | 2 | 3 | 4 | 5; observacao?: string }[],
          nota_geral: mediaGeral * 10,
          pontos_fortes: pontosFortes,
          pontos_desenvolvimento: pontosDesenvolvimento,
          observacoes_gerais: observacoesGerais,
          recomendacao,
        });
      }
      toast({ title: "Avaliação finalizada" });
      navigate(-1);
    } catch {
      toast({ title: "Erro ao finalizar", variant: "destructive" });
    }
  };

  // Processo selecionado
  const processoSelecionado = processos.find(p => p.id === processoId);

  const loading = loadingAvaliacao || loadingProcessos;
  const saving = isCreating || isUpdating;

  if (loading) {
    return (
      <Layout title="Avaliação">
        <div className="p-6 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={isEditing ? "Editar Avaliação" : "Nova Avaliação"}>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Editar Avaliação" : "Nova Avaliação"}
            </h1>
            <p className="text-muted-foreground">
              Avalie as competências técnicas e comportamentais do candidato
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Seleção de Candidato */}
            {!isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>Candidato</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={processoId} onValueChange={setProcessoId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o candidato" />
                    </SelectTrigger>
                    <SelectContent>
                      {processos.filter(p => p.status === 'em_andamento').map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={p.candidatoFoto} />
                              <AvatarFallback>{p.candidatoNome?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{p.candidatoNome}</span>
                            <span className="text-muted-foreground">- {p.vagaTitulo}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Candidato Selecionado */}
            {processoSelecionado && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={processoSelecionado.candidatoFoto} />
                      <AvatarFallback className="text-xl">
                        {processoSelecionado.candidatoNome?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-semibold">{processoSelecionado.candidatoNome}</p>
                      <p className="text-muted-foreground">{processoSelecionado.vagaTitulo}</p>
                      <Badge variant="outline" className="mt-1">
                        {processoSelecionado.etapaAtual.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs de Competências */}
            <Card>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="tecnicas" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Técnicas
                    </TabsTrigger>
                    <TabsTrigger value="comportamentais" className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Comportamentais
                    </TabsTrigger>
                    <TabsTrigger value="observacoes" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Observações
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent>
                  {/* Competências Técnicas */}
                  <TabsContent value="tecnicas" className="space-y-6 mt-0">
                    {notasTecnicas.map(comp => (
                      <div key={comp.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>{comp.nome}</Label>
                          <span className={cn(
                            "font-bold",
                            comp.nota >= 8 ? "text-green-600" :
                            comp.nota >= 6 ? "text-amber-600" : "text-red-600"
                          )}>
                            {comp.nota}/10
                          </span>
                        </div>
                        <Slider
                          value={[comp.nota]}
                          onValueChange={([value]) => handleNotaChange('tecnica', comp.id, value ?? 5)}
                          min={1}
                          max={10}
                          step={1}
                          className="py-2"
                        />
                      </div>
                    ))}
                    <Separator />
                    <div className="flex items-center justify-between text-lg">
                      <span className="font-medium">Média Técnica:</span>
                      <span className={cn(
                        "font-bold",
                        mediaTecnica >= 8 ? "text-green-600" :
                        mediaTecnica >= 6 ? "text-amber-600" : "text-red-600"
                      )}>
                        {mediaTecnica.toFixed(1)}/10
                      </span>
                    </div>
                  </TabsContent>

                  {/* Competências Comportamentais */}
                  <TabsContent value="comportamentais" className="space-y-6 mt-0">
                    {notasComportamentais.map(comp => (
                      <div key={comp.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>{comp.nome}</Label>
                          <span className={cn(
                            "font-bold",
                            comp.nota >= 8 ? "text-green-600" :
                            comp.nota >= 6 ? "text-amber-600" : "text-red-600"
                          )}>
                            {comp.nota}/10
                          </span>
                        </div>
                        <Slider
                          value={[comp.nota]}
                          onValueChange={([value]) => handleNotaChange('comportamental', comp.id, value ?? 5)}
                          min={1}
                          max={10}
                          step={1}
                          className="py-2"
                        />
                      </div>
                    ))}
                    <Separator />
                    <div className="flex items-center justify-between text-lg">
                      <span className="font-medium">Média Comportamental:</span>
                      <span className={cn(
                        "font-bold",
                        mediaComportamental >= 8 ? "text-green-600" :
                        mediaComportamental >= 6 ? "text-amber-600" : "text-red-600"
                      )}>
                        {mediaComportamental.toFixed(1)}/10
                      </span>
                    </div>
                  </TabsContent>

                  {/* Observações */}
                  <TabsContent value="observacoes" className="space-y-4 mt-0">
                    <div className="space-y-2">
                      <Label>Pontos Fortes</Label>
                      <Textarea
                        value={pontosFortes}
                        onChange={(e) => setPontosFortes(e.target.value)}
                        placeholder="Descreva os principais pontos fortes do candidato..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pontos de Desenvolvimento</Label>
                      <Textarea
                        value={pontosDesenvolvimento}
                        onChange={(e) => setPontosDesenvolvimento(e.target.value)}
                        placeholder="Áreas que precisam de desenvolvimento..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Observações Gerais</Label>
                      <Textarea
                        value={observacoesGerais}
                        onChange={(e) => setObservacoesGerais(e.target.value)}
                        placeholder="Outras observações relevantes..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Coluna Lateral - Resumo */}
          <div className="space-y-6">
            {/* Nota Geral */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Nota Geral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "text-center p-6 rounded-lg",
                  mediaGeral >= 8 ? "bg-green-100" :
                  mediaGeral >= 6 ? "bg-amber-100" : "bg-red-100"
                )}>
                  <p className={cn(
                    "text-5xl font-bold",
                    mediaGeral >= 8 ? "text-green-600" :
                    mediaGeral >= 6 ? "text-amber-600" : "text-red-600"
                  )}>
                    {(mediaGeral * 10).toFixed(0)}%
                  </p>
                  <p className="text-sm mt-2 text-muted-foreground">
                    Média das competências
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Técnica</span>
                    <span className="font-medium">{mediaTecnica.toFixed(1)}</span>
                  </div>
                  <Progress value={mediaTecnica * 10} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Comportamental</span>
                    <span className="font-medium">{mediaComportamental.toFixed(1)}</span>
                  </div>
                  <Progress value={mediaComportamental * 10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Parecer */}
            <Card>
              <CardHeader>
                <CardTitle>Parecer Final</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={parecer === 'aprovar' ? 'default' : 'outline'}
                    className={cn(
                      "w-full",
                      parecer === 'aprovar' && "bg-green-600 hover:bg-green-700"
                    )}
                    onClick={() => setParecer('aprovar')}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Aprovar
                  </Button>
                  <Button
                    type="button"
                    variant={parecer === 'reprovar' ? 'default' : 'outline'}
                    className={cn(
                      "w-full",
                      parecer === 'reprovar' && "bg-red-600 hover:bg-red-700"
                    )}
                    onClick={() => setParecer('reprovar')}
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Reprovar
                  </Button>
                </div>
                <Button
                  type="button"
                  variant={parecer === 'em_duvida' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => setParecer('em_duvida')}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Em Dúvida
                </Button>
                <div className="space-y-2">
                  <Label>Recomendação</Label>
                  <Textarea
                    value={recomendacao}
                    onChange={(e) => setRecomendacao(e.target.value)}
                    placeholder="Próximos passos recomendados..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleFinalizar}
                disabled={saving || !processoId}
              >
                <Send className="h-4 w-4 mr-2" />
                Finalizar Avaliação
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSalvarRascunho}
                disabled={saving || !processoId}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Rascunho
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
