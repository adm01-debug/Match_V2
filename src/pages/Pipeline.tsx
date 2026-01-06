import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useProcessosSeletivos, useUpdateProcessoEtapa } from "@/hooks/useProcessosSeletivos";
import { useVagas } from "@/hooks/useVagas";
import { etapasPipeline, getEtapaConfig } from "@/config/pipelineConfig";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MatchScoreBadge } from "@/components/ui/match-score-badge";
import { Search, MoreHorizontal, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { EtapaProcesso } from "@/types/recruitment";
import { PipelineEmptyState } from "@/components/empty-states";

export default function Pipeline() {
  usePageTitle('Pipeline');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const vagaIdParam = searchParams.get('vaga');
  const [vagaSelecionada, setVagaSelecionada] = useState<string>(vagaIdParam || "todas");
  const [searchQuery, setSearchQuery] = useState("");

  // Hooks de dados
  const { data: vagas = [], isLoading: loadingVagas } = useVagas();
  const { data: processos = [], isLoading: loadingProcessos, refetch } = useProcessosSeletivos();
  const updateEtapaMutation = useUpdateProcessoEtapa();

  // Atualizar URL quando vaga mudar
  useEffect(() => {
    if (vagaSelecionada && vagaSelecionada !== "todas") {
      setSearchParams({ vaga: vagaSelecionada });
    } else {
      setSearchParams({});
    }
  }, [vagaSelecionada, setSearchParams]);

  // Filtrar processos
  const processosFiltrados = processos.filter(p => {
    // Filtrar por vaga se selecionada
    if (vagaSelecionada !== "todas" && p.vagaId !== vagaSelecionada) return false;
    
    // Filtrar por busca
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.candidatoNome?.toLowerCase().includes(query) ||
      p.vagaTitulo?.toLowerCase().includes(query)
    );
  });

  // Agrupar processos por etapa
  const processosPorEtapa = etapasPipeline.reduce((acc, etapa) => {
    acc[etapa] = processosFiltrados.filter(p => p.etapaAtual === etapa);
    return acc;
  }, {} as Record<EtapaProcesso, typeof processos>);

  // Handler de drag & drop
  const handleDragEnd = useCallback(async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const novaEtapa = destination.droppableId as EtapaProcesso;

    try {
      await updateEtapaMutation.mutateAsync({ id: draggableId, etapaAtual: novaEtapa });
      toast({
        title: "Pipeline atualizado",
        description: `Candidato movido para ${getEtapaConfig(novaEtapa)?.nome}`,
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível mover o candidato",
        variant: "destructive",
      });
    }
  }, [updateEtapaMutation, toast]);

  const loading = loadingVagas || loadingProcessos;

  // Vagas ativas para filtro
  const vagasAtivas = vagas.filter(v => ['publicada', 'em_selecao'].includes(v.status));

  if (loading) {
    return (
      <Layout title="Pipeline de Recrutamento">
        <div className="p-6">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-96 w-72 flex-shrink-0" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Pipeline de Recrutamento">
      <div className="p-6 space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Pipeline de Recrutamento</h1>
            <p className="text-muted-foreground">
              {processosFiltrados.length} candidatos em processo
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar candidato..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            <Select value={vagaSelecionada} onValueChange={setVagaSelecionada}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filtrar por vaga" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as vagas</SelectItem>
                {vagasAtivas.map(vaga => (
                  <SelectItem key={vaga.id} value={vaga.id}>
                    {vaga.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Pipeline Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {etapasPipeline.map(etapa => {
              const config = getEtapaConfig(etapa);
              const candidatos = processosPorEtapa[etapa] || [];

              return (
                <div key={etapa} className="flex-shrink-0 w-72">
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", config?.cor || "bg-gray-500")} />
                          {config?.nome || etapa}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {candidatos.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="min-h-[400px]">
                      <Droppable droppableId={etapa}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="space-y-2 min-h-[300px]"
                          >
                            {candidatos.map((processo, index) => (
                              <Draggable
                                key={processo.id}
                                draggableId={processo.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={cn(
                                      "bg-background rounded-lg p-3 mb-2 border shadow-sm cursor-grab active:cursor-grabbing",
                                      snapshot.isDragging && "shadow-lg ring-2 ring-primary"
                                    )}
                                  >
                                    <div className="flex items-start gap-3">
                                      <Avatar className="h-10 w-10">
                                        <AvatarFallback>
                                          {processo.candidatoNome?.charAt(0) || '?'}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">
                                          {processo.candidatoNome}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {processo.vagaTitulo}
                                        </p>
                                      </div>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => navigate(`/candidatos/${processo.candidatoId}`)}>
                                            Ver perfil
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => navigate(`/agenda?processo=${processo.id}`)}>
                                            Agendar entrevista
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => navigate(`/avaliacoes/novo?processo=${processo.id}`)}>
                                            Avaliar
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>

                                    {/* Match Score */}
                                    {processo.matchScore > 0 && (
                                      <div className="mt-2">
                                        <MatchScoreBadge 
                                          score={processo.matchScore} 
                                          variant="minimal" 
                                          size="sm"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}

                            {candidatos.length === 0 && (
                              <PipelineEmptyState hasVagas={vagasAtivas.length > 0} />
                            )}
                          </div>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </Layout>
  );
}
