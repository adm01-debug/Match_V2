import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PipelineColumn } from "@/components/pipeline/PipelineColumn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { etapasConfig } from "@/data/pipelineData";
import { useVagas } from "@/hooks/useVagas";
import { useProcessosSeletivos, useUpdateProcessoEtapa } from "@/hooks/useProcessosSeletivos";
import { ProcessoSeletivo, EtapaProcesso } from "@/types/recruitment";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CandidatoKanbanCard } from "@/components/pipeline/CandidatoKanbanCard";
import { Users, Target, Clock, CheckCircle2, Settings, User, Mail, Phone, Calendar, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function Pipeline() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vagaIdParam = searchParams.get("vaga");
  const { toast } = useToast();
  const { notifyStageChange } = useNotifications();
  const [selectedVaga, setSelectedVaga] = useState<string>(vagaIdParam || "todas");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedProcesso, setSelectedProcesso] = useState<ProcessoSeletivo | null>(null);

  // Fetch data from Supabase
  const { data: vagas = [], isLoading: isLoadingVagas } = useVagas();
  const { data: processosDB = [], isLoading: isLoadingProcessos } = useProcessosSeletivos();
  const updateProcessoEtapa = useUpdateProcessoEtapa();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter processes by selected job
  const filteredProcessos = useMemo(() => {
    if (selectedVaga === "todas") return processosDB;
    return processosDB.filter((p) => p.vagaId === selectedVaga || p.vagaTitulo.toLowerCase().includes(selectedVaga.toLowerCase()));
  }, [processosDB, selectedVaga]);

  // Group processes by stage
  const processosByEtapa = useMemo(() => {
    const grouped: Record<EtapaProcesso, ProcessoSeletivo[]> = {} as any;
    etapasConfig.forEach((etapa) => {
      grouped[etapa.id] = filteredProcessos.filter((p) => p.etapaAtual === etapa.id);
    });
    return grouped;
  }, [filteredProcessos]);

  // Stats
  const stats = useMemo(() => {
    const total = filteredProcessos.length;
    const emProcesso = filteredProcessos.filter(
      (p) => !["contratado", "reprovado", "banco_talentos"].includes(p.etapaAtual)
    ).length;
    const contratados = filteredProcessos.filter((p) => p.etapaAtual === "contratado").length;
    const avgDias = Math.round(
      filteredProcessos.reduce((acc, p) => acc + p.diasNaEtapa, 0) / (total || 1)
    );
    return { total, emProcesso, contratados, avgDias };
  }, [filteredProcessos]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeProcesso = processosDB.find((p) => p.id === active.id);
    const overEtapa = over.id as EtapaProcesso;

    if (!activeProcesso || activeProcesso.etapaAtual === overEtapa) return;

    const fromEtapaLabel = etapasConfig.find((e) => e.id === activeProcesso.etapaAtual)?.label || '';
    const toEtapaLabel = etapasConfig.find((e) => e.id === overEtapa)?.label || '';

    try {
      // Update in database
      await updateProcessoEtapa.mutateAsync({ id: active.id as string, etapaAtual: overEtapa });

      // Notify stage change via realtime notifications
      notifyStageChange(activeProcesso.candidatoNome, fromEtapaLabel, toEtapaLabel);

      toast({
        title: "Candidato movido",
        description: `${activeProcesso.candidatoNome} foi movido para ${toEtapaLabel}`,
      });
    } catch (error) {
      toast({
        title: "Erro ao mover candidato",
        description: "Não foi possível atualizar a etapa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const activeProcesso = activeId ? processosDB.find((p) => p.id === activeId) : null;
  const isLoading = isLoadingProcessos || isLoadingVagas;

  return (
    <Layout title="Pipeline">
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="p-6 pb-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Pipeline de Seleção</h2>
              <p className="text-muted-foreground">
                Arraste os candidatos entre as etapas do processo
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedVaga} onValueChange={setSelectedVaga}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Filtrar por vaga" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="todas">Todas as vagas</SelectItem>
                  {vagas
                    .filter((v) => v.status === "publicada" || v.status === "em_selecao")
                    .map((vaga) => (
                      <SelectItem key={vaga.id} value={vaga.id}>
                        {vaga.titulo}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Target className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.emProcesso}</p>
                  <p className="text-xs text-muted-foreground">Em Processo</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.contratados}</p>
                  <p className="text-xs text-muted-foreground">Contratados</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.avgDias}d</p>
                  <p className="text-xs text-muted-foreground">Média na etapa</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden px-6 pb-6">
          {isLoading ? (
            <div className="flex gap-3 h-full overflow-x-auto pb-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="min-w-[280px] flex-shrink-0">
                  <Skeleton className="h-full w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="flex gap-3 h-full overflow-x-auto pb-4 scrollbar-thin">
                {etapasConfig.map((etapa) => (
                  <PipelineColumn
                    key={etapa.id}
                    etapa={etapa}
                    processos={processosByEtapa[etapa.id] || []}
                    onCardClick={setSelectedProcesso}
                  />
                ))}
              </div>

              <DragOverlay>
                {activeProcesso && (
                  <div className="opacity-90">
                    <CandidatoKanbanCard processo={activeProcesso} />
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>

      {/* Candidate Details Sheet */}
      <Sheet open={!!selectedProcesso} onOpenChange={() => setSelectedProcesso(null)}>
        <SheetContent className="sm:max-w-md">
          {selectedProcesso && (
            <>
              <SheetHeader>
                <SheetTitle>Detalhes do Candidato</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedProcesso.candidatoNome}</h3>
                    <p className="text-sm text-muted-foreground">{selectedProcesso.vagaTitulo}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "mt-1",
                        selectedProcesso.matchScore >= 80
                          ? "bg-success/10 text-success"
                          : selectedProcesso.matchScore >= 60
                          ? "bg-warning/10 text-warning"
                          : "bg-muted"
                      )}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {selectedProcesso.matchScore}% Match
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>candidato@email.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>(11) 98765-4321</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Inscrito em{" "}
                      {new Date(selectedProcesso.dataInscricao).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Status */}
                <div className="space-y-3">
                  <h4 className="font-medium">Status no Processo</h4>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Etapa Atual</span>
                      <Badge>
                        {etapasConfig.find((e) => e.id === selectedProcesso.etapaAtual)?.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Dias na Etapa</span>
                      <span className={cn(
                        "text-sm font-medium",
                        selectedProcesso.diasNaEtapa > 5 && "text-warning",
                        selectedProcesso.diasNaEtapa > 10 && "text-destructive"
                      )}>
                        {selectedProcesso.diasNaEtapa} dias
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Origem</span>
                      <span className="text-sm">{selectedProcesso.origem}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-4">
                  <Button className="w-full">Ver Perfil Completo</Button>
                  <Button variant="outline" className="w-full">
                    Agendar Entrevista
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/avaliacao/${selectedProcesso.id}`)}
                  >
                    Registrar Avaliação
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Layout>
  );
}
