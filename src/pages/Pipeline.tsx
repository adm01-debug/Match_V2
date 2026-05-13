import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFuzzySearch, FUZZY_PRESETS } from '@/hooks/useFuzzySearch';
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useProcessosSeletivos, useUpdateProcessoEtapa } from "@/hooks/useProcessosSeletivos";
import { useVagas } from "@/hooks/useVagas";
import { etapasPipeline, getEtapaConfig, etapaPremiumColors } from "@/config/pipelineConfig";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { enhancedToast, useConfetti } from "@/components/ui";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { cn } from "@/lib/utils";
import { EtapaProcesso } from "@/types/recruitment";
import { PipelineStatsCards } from "@/components/pipeline/PipelineStatsCards";
import { PipelineHeader } from "@/components/pipeline/PipelineHeader";
import { PipelineCandidateCard } from "@/components/pipeline/PipelineCandidateCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
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

export default function Pipeline() {
  usePageTitle('Pipeline');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { playSuccess, playError, playSwoosh } = useSoundEffects();
  const { fireCelebration } = useConfetti();
  
  const vagaIdParam = searchParams.get('vaga');
  const [vagaSelecionada, setVagaSelecionada] = useState<string>(vagaIdParam || "todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const { data: vagas = [], isLoading: loadingVagas } = useVagas();
  const { data: processos = [], isLoading: loadingProcessos, refetch } = useProcessosSeletivos();
  const updateEtapaMutation = useUpdateProcessoEtapa();

  useEffect(() => {
    setSearchParams(vagaSelecionada && vagaSelecionada !== "todas" ? { vaga: vagaSelecionada } : {});
  }, [vagaSelecionada, setSearchParams]);

  const processosPorVaga = useMemo(() => 
    processos.filter(p => vagaSelecionada === "todas" || p.vagaId === vagaSelecionada),
    [processos, vagaSelecionada]
  );

  const { results: fuzzyResults, matchesMap } = useFuzzySearch(
    processosPorVaga,
    [{ name: 'candidatoNome', weight: 2 }, { name: 'vagaTitulo', weight: 1 }],
    searchQuery,
    { ...FUZZY_PRESETS.default, includeMatches: true }
  );

  const processosFiltrados = searchQuery ? fuzzyResults : processosPorVaga;

  const processosPorEtapa = useMemo(() => etapasPipeline.reduce((acc, etapa) => {
    acc[etapa] = processosFiltrados.filter(p => p.etapaAtual === etapa);
    return acc;
  }, {} as Record<EtapaProcesso, typeof processos>), [processosFiltrados]);

  const stats = useMemo(() => ({
    total: processosFiltrados.length,
    emAndamento: processosFiltrados.filter(p => !['contratado', 'reprovado'].includes(p.etapaAtual)).length,
    contratados: processosFiltrados.filter(p => p.etapaAtual === 'contratado').length,
    reprovados: processosFiltrados.filter(p => p.etapaAtual === 'reprovado').length,
  }), [processosFiltrados]);

  const handleDragEnd = useCallback(async (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const novaEtapa = destination.droppableId as EtapaProcesso;
    try {
      playSwoosh();
      await updateEtapaMutation.mutateAsync({ id: draggableId, etapaAtual: novaEtapa });
      if (novaEtapa === 'contratado') {
        fireCelebration();
        playSuccess();
        enhancedToast.celebration(`🎉 Candidato contratado!`);
      } else {
        playSuccess();
        enhancedToast.success(`Candidato movido para ${getEtapaConfig(novaEtapa)?.nome}`);
      }
    } catch {
      playError();
      enhancedToast.error("Não foi possível mover o candidato");
    }
  }, [updateEtapaMutation, playSwoosh, playSuccess, playError, fireCelebration]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (loadingVagas || loadingProcessos) {
    return (
      <Layout title="Pipeline">
        <div className="p-6 space-y-6">
          <Skeleton className="h-10 w-80" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
          <div className="flex gap-4 overflow-x-auto">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-[500px] w-80 rounded-2xl" />)}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Pipeline">
      <div className="p-6 space-y-6">
        <PipelineHeader 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          vagaSelecionada={vagaSelecionada} setVagaSelecionada={setVagaSelecionada}
          vagasAtivas={vagas.filter(v => ['publicada', 'em_selecao'].includes(v.status))}
          isCompact={isCompact} setIsCompact={setIsCompact}
          isRefreshing={isRefreshing} handleRefresh={handleRefresh}
        />
        <PipelineStatsCards stats={stats} />
        <DragDropContext onDragEnd={handleDragEnd}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex gap-4 overflow-x-auto pb-6 min-h-[500px] scrollbar-thin">
            {etapasPipeline.map((etapa) => {
              const config = getEtapaConfig(etapa);
              const colorScheme = etapaPremiumColors[etapa] || etapaPremiumColors.novo;
              return (
                <motion.div key={etapa} variants={columnVariants} className={cn("flex-shrink-0", isCompact ? "w-56" : "w-80")}>
                  <Card className={cn("h-full overflow-hidden bg-card/50 backdrop-blur-xl border", colorScheme.border, colorScheme.glow)}>
                    <CardHeader className={cn("bg-gradient-to-b", colorScheme.gradient, isCompact ? "pb-2 pt-3 px-3" : "pb-3 pt-4")}>
                      <CardTitle className="flex items-center justify-between text-base font-semibold">
                        <span>{config?.nome}</span>
                        <Badge variant="secondary" className="bg-background/50">{processosPorEtapa[etapa].length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 h-full">
                      <Droppable droppableId={etapa}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className={cn("min-h-[400px] transition-colors rounded-lg p-1", snapshot.isDraggingOver && "bg-primary/5")}>
                            {processosPorEtapa[etapa].map((p, i) => (
                              <PipelineCandidateCard 
                                key={p.id} processo={p} index={i} isCompact={isCompact} 
                                matches={matchesMap.get(p.id)} onNavigate={navigate} 
                              />
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
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
