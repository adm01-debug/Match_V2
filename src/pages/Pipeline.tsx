import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useProcessosSeletivos, useUpdateProcessoEtapa } from "@/hooks/useProcessosSeletivos";
import { useVagas } from "@/hooks/useVagas";
import { etapasPipeline, getEtapaConfig } from "@/config/pipelineConfig";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MatchScoreBadge } from "@/components/ui/match-score-badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MoreHorizontal, RefreshCw, GripVertical, Clock, User, Briefcase, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { EtapaProcesso } from "@/types/recruitment";


const etapaColors: Record<string, string> = {
  inscrito: "from-blue-500/20 via-blue-500/10 to-transparent border-blue-500/30",
  triagem: "from-cyan-500/20 via-cyan-500/10 to-transparent border-cyan-500/30",
  entrevista_rh: "from-violet-500/20 via-violet-500/10 to-transparent border-violet-500/30",
  entrevista_tecnica: "from-purple-500/20 via-purple-500/10 to-transparent border-purple-500/30",
  entrevista_final: "from-pink-500/20 via-pink-500/10 to-transparent border-pink-500/30",
  proposta: "from-amber-500/20 via-amber-500/10 to-transparent border-amber-500/30",
  contratado: "from-emerald-500/20 via-emerald-500/10 to-transparent border-emerald-500/30",
  reprovado: "from-red-500/20 via-red-500/10 to-transparent border-red-500/30",
};

const etapaHeaderColors: Record<string, string> = {
  inscrito: "bg-blue-500",
  triagem: "bg-cyan-500",
  entrevista_rh: "bg-violet-500",
  entrevista_tecnica: "bg-purple-500",
  entrevista_final: "bg-pink-500",
  proposta: "bg-amber-500",
  contratado: "bg-emerald-500",
  reprovado: "bg-red-500",
};

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
              <Skeleton key={i} className="h-96 w-72 flex-shrink-0 rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Pipeline de Recrutamento">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Pipeline de Recrutamento
            </h1>
            <p className="text-muted-foreground mt-1">
              <span className="font-semibold text-foreground">{processosFiltrados.length}</span> candidatos em processo
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar candidato..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-card/50 border-border/50"
              />
            </div>

            <Select value={vagaSelecionada} onValueChange={setVagaSelecionada}>
              <SelectTrigger className="w-64 bg-card/50 border-border/50">
                <SelectValue placeholder="Filtrar por vaga" />
              </SelectTrigger>
              <SelectContent className="bg-popover/95 backdrop-blur-sm">
                <SelectItem value="todas">Todas as vagas</SelectItem>
                {vagasAtivas.map(vaga => (
                  <SelectItem key={vaga.id} value={vaga.id}>
                    {vaga.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => refetch()}
              className="hover:bg-primary/5 hover:border-primary/30"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Pipeline Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
            {etapasPipeline.map((etapa, colIndex) => {
              const config = getEtapaConfig(etapa);
              const candidatos = processosPorEtapa[etapa] || [];
              const colorClass = etapaColors[etapa] || etapaColors['inscrito'];
              const headerColor = etapaHeaderColors[etapa] || etapaHeaderColors['inscrito'];

              return (
                <motion.div 
                  key={etapa} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: colIndex * 0.05 }}
                  className="flex-shrink-0 w-72"
                >
                  <Card className={cn(
                    "h-full overflow-hidden",
                    "bg-gradient-to-b border",
                    colorClass
                  )}>
                    {/* Header */}
                    <CardHeader className="pb-3 pt-4">
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          <div className={cn("w-2.5 h-2.5 rounded-full", headerColor)} />
                          {config?.nome || etapa}
                        </span>
                        <Badge 
                          variant="secondary" 
                          className="text-xs font-bold bg-background/50 backdrop-blur-sm"
                        >
                          {candidatos.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>

                    {/* Cards */}
                    <CardContent className="p-2">
                      <ScrollArea className="h-[400px]">
                        <Droppable droppableId={etapa}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={cn(
                                "space-y-2 min-h-[350px] p-1 rounded-lg transition-colors",
                                snapshot.isDraggingOver && "bg-primary/5 ring-1 ring-primary/20"
                              )}
                            >
                              {candidatos.map((processo, index) => (
                                <Draggable
                                  key={processo.id}
                                  draggableId={processo.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <motion.div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.02 }}
                                      className={cn(
                                        "group relative bg-card/95 backdrop-blur-sm rounded-lg p-3 border shadow-sm",
                                        "hover:shadow-md hover:border-primary/30 transition-all duration-200",
                                        "cursor-grab active:cursor-grabbing",
                                        snapshot.isDragging && "shadow-xl ring-2 ring-primary scale-[1.02] z-50"
                                      )}
                                    >
                                      {/* Drag handle */}
                                      <div 
                                        {...provided.dragHandleProps}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                      </div>

                                      <div className="flex items-start gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                          <AvatarImage src={processo.candidatoFoto} />
                                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
                                            {processo.candidatoNome?.charAt(0) || '?'}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-sm truncate">
                                            {processo.candidatoNome}
                                          </p>
                                          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                            <Briefcase className="h-3 w-3" />
                                            {processo.vagaTitulo}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Match Score */}
                                      {processo.matchScore > 0 && (
                                        <div className="mt-3 flex items-center justify-between">
                                          <MatchScoreBadge 
                                            score={processo.matchScore} 
                                            variant="minimal" 
                                            size="sm"
                                          />
                                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {processo.diasNaEtapa}d
                                          </span>
                                        </div>
                                      )}

                                      {/* Actions */}
                                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                              <MoreHorizontal className="h-3 w-3" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-sm">
                                            <DropdownMenuItem onClick={() => navigate(`/candidatos/${processo.candidatoId}`)}>
                                              <User className="h-4 w-4 mr-2" />
                                              Ver perfil
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate(`/agenda?processo=${processo.id}`)}>
                                              <Clock className="h-4 w-4 mr-2" />
                                              Agendar entrevista
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate(`/avaliacoes/novo?processo=${processo.id}`)}>
                                              <Sparkles className="h-4 w-4 mr-2" />
                                              Avaliar
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </motion.div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}

                              {candidatos.length === 0 && (
                                <motion.div 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="flex flex-col items-center justify-center py-12 text-center"
                                >
                                  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                                    <User className="h-6 w-6 text-muted-foreground/50" />
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Nenhum candidato
                                  </p>
                                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                                    Arraste um candidato para cá
                                  </p>
                                </motion.div>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </Layout>
  );
}
