import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useProcessosSeletivos } from "@/hooks/useProcessosSeletivos";
import { useVagas } from "@/hooks/useVagas";
import { etapasConfig, etapasPipeline, getEtapaConfig } from "@/config/pipelineConfig";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  Mail, 
  MoreHorizontal,
  ChevronRight,
  Users,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { EtapaProcesso } from "@/types/recruitment";

export default function Pipeline() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const vagaIdParam = searchParams.get('vaga');
  const [vagaSelecionada, setVagaSelecionada] = useState<string>(vagaIdParam || "todas");
  const [searchQuery, setSearchQuery] = useState("");

  // Hooks de dados
  const { data: vagas = [], isLoading: loadingVagas } = useVagas();
  const { 
    data: processos = [], 
    isLoading: loadingProcessos,
    moverEtapa,
    refetch 
  } = useProcessosSeletivos({ 
    vagaId: vagaSelecionada !== "todas" ? vagaSelecionada : undefined 
  });

  // Atualizar URL quando vaga mudar
  useEffect(() => {
  usePageTitle('Pipeline');

    if (vagaSelecionada && vagaSelecionada !== "todas") {
      setSearchParams({ vaga: vagaSelecionada });
    } else {
      setSearchParams({});
    }
  }, [vagaSelecionada]);

  // Filtrar processos por busca
  const processosFiltrados = processos.filter(p => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.candidato?.nome?.toLowerCase().includes(query) ||
      p.candidato?.email?.toLowerCase().includes(query) ||
      p.vaga?.titulo?.toLowerCase().includes(query)
    );
  });

  // Agrupar processos por etapa
  const processosPorEtapa = etapasPipeline.reduce((acc, etapa) => {
    acc[etapa] = processosFiltrados.filter(p => p.etapa_atual === etapa);
    return acc;
  }, {} as Record<EtapaProcesso, typeof processos>);

  // Handler de drag & drop
  const handleDragEnd = useCallback(async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const novaEtapa = destination.droppableId as EtapaProcesso;

    try {
      await moverEtapa(draggableId, novaEtapa);
      toast({
        title: "Pipeline atualizado",
        description: `Candidato movido para ${getEtapaConfig(novaEtapa)?.nome}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível mover o candidato",
        variant: "destructive",
      });
    }
  }, [moverEtapa, toast]);

  const loading = loadingVagas || loadingProcessos;

  // Vagas ativas para filtro
  const vagasAtivas = vagas.filter(v => ['publicada', 'em_selecao'].includes(v.status));

  return (
    <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-64" /></div>}>
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
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {etapasPipeline.slice(0, 5).map((_, i) => (
              <Skeleton key={i} className="h-[600px] w-72 flex-shrink-0" />
            ))}
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {etapasPipeline.map(etapa => {
                const config = getEtapaConfig(etapa);
                const candidatos = processosPorEtapa[etapa] || [];

                return (
                  <div role="main" key={etapa} className="flex-shrink-0 w-72">
                    <Card className="h-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-3 h-3 rounded-full", config?.cor)} />
                            <CardTitle className="text-sm font-medium">
                              {config?.nome}
                            </CardTitle>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {candidatos.length}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-2">
                        <Droppable droppableId={etapa}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={cn(
                                "min-h-[500px] rounded-lg p-2 transition-colors",
                                snapshot.isDraggingOver ? "bg-muted" : ""
                              )}
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
                                          <AvatarImage src={processo.candidato?.foto_url} />
                                          <AvatarFallback>
                                            {processo.candidato?.nome?.charAt(0) || '?'}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-sm truncate">
                                            {processo.candidato?.nome}
                                          </p>
                                          <p className="text-xs text-muted-foreground truncate">
                                            {processo.vaga?.titulo}
                                          </p>
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => navigate(`/candidatos/${processo.candidato_id}`)}>
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
                                      {processo.match_score && (
                                        <div className="flex items-center gap-1 mt-2">
                                          <Star className="h-3 w-3 text-amber-500" />
                                          <span className={cn(
                                            "text-xs font-medium",
                                            processo.match_score >= 80 ? "text-green-600" :
                                            processo.match_score >= 60 ? "text-amber-600" : "text-red-600"
                                          )}>
                                            {processo.match_score}% match
                                          </span>
                                        </div>
                                      )}

                                      {/* Tags */}
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {processo.candidato?.habilidades?.slice(0, 2).map((h, i) => (
                                          <Badge key={i} variant="outline" className="text-xs px-1">
                                            {h}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}

                              {candidatos.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                  Nenhum candidato
                                </div>
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
        )}
      </div>
    </Layout>
  );
}
