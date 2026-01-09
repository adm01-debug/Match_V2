import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import { 
  Search, 
  MoreHorizontal, 
  RefreshCw, 
  GripVertical, 
  Clock, 
  User, 
  Briefcase, 
  Sparkles, 
  Kanban,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Filter,
  Calendar,
  LayoutGrid,
  List
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { EtapaProcesso } from "@/types/recruitment";

// Premium color schemes for each stage
const etapaColors: Record<string, { gradient: string; border: string; icon: string; glow: string }> = {
  inscrito: { 
    gradient: "from-blue-500/20 via-blue-500/10 to-transparent", 
    border: "border-blue-500/30 hover:border-blue-500/50",
    icon: "bg-blue-500",
    glow: "shadow-blue-500/20"
  },
  triagem: { 
    gradient: "from-cyan-500/20 via-cyan-500/10 to-transparent", 
    border: "border-cyan-500/30 hover:border-cyan-500/50",
    icon: "bg-cyan-500",
    glow: "shadow-cyan-500/20"
  },
  entrevista_rh: { 
    gradient: "from-violet-500/20 via-violet-500/10 to-transparent", 
    border: "border-violet-500/30 hover:border-violet-500/50",
    icon: "bg-violet-500",
    glow: "shadow-violet-500/20"
  },
  entrevista_tecnica: { 
    gradient: "from-purple-500/20 via-purple-500/10 to-transparent", 
    border: "border-purple-500/30 hover:border-purple-500/50",
    icon: "bg-purple-500",
    glow: "shadow-purple-500/20"
  },
  entrevista_final: { 
    gradient: "from-pink-500/20 via-pink-500/10 to-transparent", 
    border: "border-pink-500/30 hover:border-pink-500/50",
    icon: "bg-pink-500",
    glow: "shadow-pink-500/20"
  },
  proposta: { 
    gradient: "from-amber-500/20 via-amber-500/10 to-transparent", 
    border: "border-amber-500/30 hover:border-amber-500/50",
    icon: "bg-amber-500",
    glow: "shadow-amber-500/20"
  },
  contratado: { 
    gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent", 
    border: "border-emerald-500/30 hover:border-emerald-500/50",
    icon: "bg-emerald-500",
    glow: "shadow-emerald-500/20"
  },
  reprovado: { 
    gradient: "from-red-500/20 via-red-500/10 to-transparent", 
    border: "border-red-500/30 hover:border-red-500/50",
    icon: "bg-red-500",
    glow: "shadow-red-500/20"
  },
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const columnVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

export default function Pipeline() {
  usePageTitle('Pipeline');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const vagaIdParam = searchParams.get('vaga');
  const [vagaSelecionada, setVagaSelecionada] = useState<string>(vagaIdParam || "todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

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
    if (vagaSelecionada !== "todas" && p.vagaId !== vagaSelecionada) return false;
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

  // Stats
  const stats = {
    total: processosFiltrados.length,
    emAndamento: processosFiltrados.filter(p => !['contratado', 'reprovado'].includes(p.etapaAtual)).length,
    contratados: processosFiltrados.filter(p => p.etapaAtual === 'contratado').length,
    reprovados: processosFiltrados.filter(p => p.etapaAtual === 'reprovado').length,
  };

  // Handler de drag & drop
  const handleDragEnd = useCallback(async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const novaEtapa = destination.droppableId as EtapaProcesso;

    try {
      await updateEtapaMutation.mutateAsync({ id: draggableId, etapaAtual: novaEtapa });
      toast({
        title: "✨ Pipeline atualizado",
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const loading = loadingVagas || loadingProcessos;
  const vagasAtivas = vagas.filter(v => ['publicada', 'em_selecao'].includes(v.status));

  if (loading) {
    return (
      <Layout title="Pipeline de Recrutamento">
        <div className="p-6 space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-10 w-80" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-64" />
            </div>
          </div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          
          {/* Columns skeleton */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-[500px] w-80 flex-shrink-0 rounded-2xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Pipeline de Recrutamento">
      <div className="p-6 space-y-6">
        {/* Premium Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Background glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 blur-3xl opacity-50 -z-10" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/20"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Kanban className="h-6 w-6 text-primary" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                    Pipeline de Recrutamento
                  </h1>
                  <p className="text-muted-foreground">
                    Gerencie candidatos com drag & drop intuitivo
                  </p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Buscar candidato..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>

              <Select value={vagaSelecionada} onValueChange={setVagaSelecionada}>
                <SelectTrigger className="w-64 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filtrar por vaga" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
                  <SelectItem value="todas">Todas as vagas</SelectItem>
                  <DropdownMenuSeparator />
                  {vagasAtivas.map(vaga => (
                    <SelectItem key={vaga.id} value={vaga.id}>
                      {vaga.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Compact Mode Toggle */}
              <div className="flex items-center rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 p-1">
                <Button
                  variant={!isCompact ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setIsCompact(false)}
                  className="h-8 px-3 gap-1.5"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs">Normal</span>
                </Button>
                <Button
                  variant={isCompact ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setIsCompact(true)}
                  className="h-8 px-3 gap-1.5"
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs">Compacto</span>
                </Button>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-primary/5 hover:border-primary/30 transition-all"
                >
                  <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Total em Processo", value: stats.total, icon: Users, color: "from-primary/20 to-primary/5", iconColor: "text-primary" },
            { label: "Em Andamento", value: stats.emAndamento, icon: TrendingUp, color: "from-blue-500/20 to-blue-500/5", iconColor: "text-blue-500" },
            { label: "Contratados", value: stats.contratados, icon: CheckCircle2, color: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-500" },
            { label: "Reprovados", value: stats.reprovados, icon: XCircle, color: "from-red-500/20 to-red-500/5", iconColor: "text-red-500" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className={cn(
                "relative overflow-hidden border-border/50 bg-gradient-to-br backdrop-blur-sm",
                stat.color,
                "hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={cn("p-3 rounded-xl bg-background/50 backdrop-blur-sm", stat.iconColor)}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Pipeline Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-4 overflow-x-auto pb-6 min-h-[500px] scrollbar-thin"
          >
            {etapasPipeline.map((etapa, colIndex) => {
              const config = getEtapaConfig(etapa);
              const candidatos = processosPorEtapa[etapa] || [];
              const defaultColorScheme = { 
                gradient: "from-blue-500/20 via-blue-500/10 to-transparent", 
                border: "border-blue-500/30 hover:border-blue-500/50",
                icon: "bg-blue-500",
                glow: "shadow-blue-500/20"
              };
              const colorScheme = etapaColors[etapa] ?? defaultColorScheme;

              return (
                <motion.div 
                  key={etapa} 
                  variants={columnVariants}
                  className={cn("flex-shrink-0 transition-all duration-300", isCompact ? "w-56" : "w-80")}
                >
                  <Card className={cn(
                    "h-full overflow-hidden",
                    "bg-card/50 backdrop-blur-xl border",
                    colorScheme.border,
                    "hover:shadow-lg transition-all duration-300",
                    colorScheme.glow
                  )}>
                    {/* Column Header */}
                    <CardHeader className={cn(
                      "bg-gradient-to-b",
                      colorScheme.gradient,
                      isCompact ? "pb-2 pt-3 px-3" : "pb-3 pt-4"
                    )}>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <motion.div 
                            className={cn("rounded-full shadow-lg", colorScheme.icon, isCompact ? "w-2 h-2" : "w-3 h-3")}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: colIndex * 0.2 }}
                          />
                          <span className={cn("font-semibold truncate", isCompact ? "text-xs max-w-[100px]" : "text-sm")}>
                            {config?.nome || etapa}
                          </span>
                        </span>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "font-bold bg-background/70 backdrop-blur-sm border border-border/50 shadow-sm",
                            isCompact ? "text-[10px] h-5 px-1.5" : "text-xs"
                          )}
                        >
                          {candidatos.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>

                    {/* Column Content */}
                    <CardContent className={cn(isCompact ? "p-2" : "p-3")}>
                      <ScrollArea className={cn(isCompact ? "h-[480px]" : "h-[420px]", "pr-2")}>
                        <Droppable droppableId={etapa}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={cn(
                                "rounded-xl transition-all duration-200",
                                isCompact ? "space-y-2 min-h-[440px] p-1" : "space-y-3 min-h-[380px] p-2",
                                snapshot.isDraggingOver && "bg-primary/5 ring-2 ring-primary/20 ring-inset"
                              )}
                            >
                              <AnimatePresence mode="popLayout">
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
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        layout
                                        className={cn(
                                          "group relative bg-card/95 backdrop-blur-sm border shadow-sm",
                                          "hover:shadow-xl hover:border-primary/40 transition-all duration-300",
                                          "cursor-grab active:cursor-grabbing",
                                          isCompact ? "rounded-lg p-2.5" : "rounded-xl p-4",
                                          snapshot.isDragging && "shadow-2xl ring-2 ring-primary scale-[1.02] z-50 rotate-1"
                                        )}
                                      >
                                        {/* Drag handle */}
                                        <div 
                                          {...provided.dragHandleProps}
                                          className={cn(
                                            "absolute opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110",
                                            isCompact ? "top-2 right-2" : "top-3 right-3"
                                          )}
                                        >
                                          <GripVertical className={cn(isCompact ? "h-3 w-3" : "h-4 w-4", "text-muted-foreground/50")} />
                                        </div>

                                        {/* Card Content */}
                                        <div className={cn("flex items-start", isCompact ? "gap-2" : "gap-3")}>
                                          <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                                            <Avatar className={cn(
                                              "border-2 border-background shadow-md ring-2 ring-primary/10",
                                              isCompact ? "h-8 w-8" : "h-11 w-11"
                                            )}>
                                              <AvatarImage src={processo.candidatoFoto} />
                                              <AvatarFallback className={cn(
                                                "bg-gradient-to-br from-primary/30 to-accent/30 text-primary font-bold",
                                                isCompact ? "text-xs" : "text-sm"
                                              )}>
                                                {processo.candidatoNome?.charAt(0) || '?'}
                                              </AvatarFallback>
                                            </Avatar>
                                          </motion.div>
                                          <div className="flex-1 min-w-0">
                                            <p className={cn(
                                              "font-semibold truncate group-hover:text-primary transition-colors",
                                              isCompact ? "text-xs" : "text-sm"
                                            )}>
                                              {processo.candidatoNome}
                                            </p>
                                            {!isCompact && (
                                              <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                                                <Briefcase className="h-3 w-3 flex-shrink-0" />
                                                {processo.vagaTitulo}
                                              </p>
                                            )}
                                          </div>
                                        </div>

                                        {/* Match Score & Time */}
                                        <div className={cn(
                                          "flex items-center justify-between",
                                          isCompact ? "mt-2" : "mt-4"
                                        )}>
                                          {processo.matchScore > 0 ? (
                                            isCompact ? (
                                              <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                                {processo.matchScore}%
                                              </span>
                                            ) : (
                                              <MatchScoreBadge 
                                                score={processo.matchScore} 
                                                variant="minimal" 
                                                size="sm"
                                              />
                                            )
                                          ) : (
                                            <span className={cn(isCompact ? "text-[10px]" : "text-xs", "text-muted-foreground/50")}>
                                              {isCompact ? "-" : "Sem score"}
                                            </span>
                                          )}
                                          <span className={cn(
                                            "flex items-center rounded-full",
                                            isCompact ? "text-[10px] gap-1 px-1.5 py-0.5" : "text-xs gap-1.5 px-2 py-1",
                                            processo.diasNaEtapa > 10 
                                              ? "bg-destructive/10 text-destructive" 
                                              : processo.diasNaEtapa > 5 
                                                ? "bg-warning/10 text-warning" 
                                                : "bg-muted/50 text-muted-foreground"
                                          )}>
                                            <Clock className={cn(isCompact ? "h-2.5 w-2.5" : "h-3 w-3")} />
                                            {processo.diasNaEtapa}d
                                          </span>
                                        </div>

                                        {/* Quick Actions */}
                                        {!isCompact && (
                                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-7 w-7 bg-background/80 backdrop-blur-sm hover:bg-primary/10"
                                              >
                                                <MoreHorizontal className="h-4 w-4" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border/50">
                                              <DropdownMenuItem 
                                                onClick={() => navigate(`/candidato/${processo.candidatoId}`)}
                                                className="cursor-pointer"
                                              >
                                                <User className="h-4 w-4 mr-2" />
                                                Ver perfil
                                              </DropdownMenuItem>
                                              <DropdownMenuItem 
                                                onClick={() => navigate(`/agenda?processo=${processo.id}`)}
                                                className="cursor-pointer"
                                              >
                                                <Calendar className="h-4 w-4 mr-2" />
                                                Agendar entrevista
                                              </DropdownMenuItem>
                                              <DropdownMenuSeparator />
                                              <DropdownMenuItem 
                                                onClick={() => navigate(`/avaliacao/${processo.id}`)}
                                                className="cursor-pointer"
                                              >
                                                <Sparkles className="h-4 w-4 mr-2" />
                                                Avaliar candidato
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                        )}

                                        {/* Hover gradient overlay */}
                                        <div className={cn(
                                          "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                                          isCompact ? "rounded-lg" : "rounded-xl"
                                        )} />
                                      </motion.div>
                                    )}
                                  </Draggable>
                                ))}
                              </AnimatePresence>
                              {provided.placeholder}

                              {/* Empty State */}
                              {candidatos.length === 0 && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.2 }}
                                  className={cn(
                                    "flex flex-col items-center justify-center text-center",
                                    isCompact ? "py-8" : "py-16"
                                  )}
                                >
                                  <div className={cn(
                                    "rounded-2xl flex items-center justify-center",
                                    "bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm",
                                    isCompact ? "w-10 h-10 mb-2" : "w-16 h-16 mb-4"
                                  )}>
                                    <User className={cn(isCompact ? "h-5 w-5" : "h-7 w-7", "text-muted-foreground/40")} />
                                  </div>
                                  <p className={cn(isCompact ? "text-xs" : "text-sm", "font-medium text-muted-foreground/70")}>
                                    {isCompact ? "Vazio" : "Nenhum candidato"}
                                  </p>
                                  {!isCompact && (
                                  <p className="text-xs text-muted-foreground/50 mt-1 flex items-center gap-1">
                                    <ArrowRight className="h-3 w-3" />
                                    Arraste um candidato para cá
                                  </p>
                                  )}
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
          </motion.div>
        </DragDropContext>
      </div>
    </Layout>
  );
}
