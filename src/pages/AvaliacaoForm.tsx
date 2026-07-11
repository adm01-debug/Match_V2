import { useState } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useProcessosSeletivos } from "@/hooks/useProcessosSeletivos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Send, Briefcase, Brain, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CompetenciasList } from "@/components/avaliacao/CompetenciasList";
import { ObservacoesForm } from "@/components/avaliacao/ObservacoesForm";
import { NotaGeralCard } from "@/components/avaliacao/NotaGeralCard";
import { ParecerCard } from "@/components/avaliacao/ParecerCard";
import { useAvaliacaoForm } from "@/hooks/useAvaliacaoForm";

export default function AvaliacaoForm() {
  usePageTitle("Avaliação");
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const processoIdParam = searchParams.get("processo") || undefined;
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useAvaliacaoForm({ id, processoIdInicial: processoIdParam });
  const { data: processos = [], isLoading: loadingProcessos } = useProcessosSeletivos();
  const [activeTab, setActiveTab] = useState("tecnicas");

  const processoSelecionado = processos.find((p) => p.id === form.processoId);
  const loading = form.loading || loadingProcessos;

  const handleSalvarRascunho = async () => {
    if (!form.processoId) {
      toast({ title: "Erro", description: "Selecione um candidato", variant: "destructive" });
      return;
    }
    try {
      await form.salvarRascunho(form.buildPayload());
      toast({ title: "Rascunho salvo" });
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleFinalizar = async () => {
    if (!form.processoId) {
      toast({ title: "Erro", description: "Selecione um candidato", variant: "destructive" });
      return;
    }
    if (!form.parecer || form.parecer === "em_duvida") {
      toast({
        title: "Atenção",
        description: "Selecione um parecer final",
        variant: "destructive",
      });
      return;
    }
    try {
      if (form.isEditing && id) {
        await form.finalizarAvaliacao(id, form.parecer, form.recomendacao);
      } else {
        await form.createAvaliacao({
          ...form.buildPayload(),
          parecer: form.parecer,
          recomendacao: form.recomendacao,
        });
      }
      toast({ title: "Avaliação finalizada" });
      navigate(-1);
    } catch {
      toast({ title: "Erro ao finalizar", variant: "destructive" });
    }
  };

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
    <Layout title={form.isEditing ? "Editar Avaliação" : "Nova Avaliação"}>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {form.isEditing ? "Editar Avaliação" : "Nova Avaliação"}
            </h1>
            <p className="text-muted-foreground">
              Avalie as competências técnicas e comportamentais do candidato
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {!form.isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>Candidato</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={form.processoId} onValueChange={form.setProcessoId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o candidato" />
                    </SelectTrigger>
                    <SelectContent>
                      {processos
                        .filter((p) => p.status === "em_andamento")
                        .map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={p.candidatoFoto} />
                                <AvatarFallback>
                                  {p.candidatoNome?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{p.candidatoNome}</span>
                              <span className="text-muted-foreground">
                                - {p.vagaTitulo}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

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
                      <p className="text-lg font-semibold">
                        {processoSelecionado.candidatoNome}
                      </p>
                      <p className="text-muted-foreground">
                        {processoSelecionado.vagaTitulo}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {processoSelecionado.etapaAtual.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                  <TabsContent value="tecnicas">
                    <CompetenciasList
                      notas={form.notasTecnicas}
                      media={form.mediaTecnica}
                      mediaLabel="Média Técnica"
                      onChange={(compId, nota) =>
                        form.handleNotaChange("tecnica", compId, nota)
                      }
                    />
                  </TabsContent>
                  <TabsContent value="comportamentais">
                    <CompetenciasList
                      notas={form.notasComportamentais}
                      media={form.mediaComportamental}
                      mediaLabel="Média Comportamental"
                      onChange={(compId, nota) =>
                        form.handleNotaChange("comportamental", compId, nota)
                      }
                    />
                  </TabsContent>
                  <TabsContent value="observacoes">
                    <ObservacoesForm
                      pontosFortes={form.pontosFortes}
                      pontosDesenvolvimento={form.pontosDesenvolvimento}
                      observacoesGerais={form.observacoesGerais}
                      onPontosFortesChange={form.setPontosFortes}
                      onPontosDesenvolvimentoChange={form.setPontosDesenvolvimento}
                      onObservacoesGeraisChange={form.setObservacoesGerais}
                    />
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          <div className="space-y-6">
            <NotaGeralCard
              mediaGeral={form.mediaGeral}
              mediaTecnica={form.mediaTecnica}
              mediaComportamental={form.mediaComportamental}
            />
            <ParecerCard
              parecer={form.parecer}
              recomendacao={form.recomendacao}
              onParecerChange={form.setParecer}
              onRecomendacaoChange={form.setRecomendacao}
            />
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleFinalizar}
                disabled={form.saving || !form.processoId}
              >
                <Send className="h-4 w-4 mr-2" />
                Finalizar Avaliação
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSalvarRascunho}
                disabled={form.saving || !form.processoId}
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
