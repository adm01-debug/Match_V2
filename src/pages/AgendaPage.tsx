import { Suspense, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Layout } from "@/components/layout/Layout";
import { useEntrevistas } from "@/hooks/useEntrevistas";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIInterviewScheduler } from "@/components/agenda/AIInterviewScheduler";
import { InterviewReminderButton } from "@/components/agenda/InterviewReminderButton";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { enhancedToast } from "@/components/ui/enhanced-toast";
import {
  Calendar as CalendarIcon,
  Plus,
  RefreshCw,
  Filter,
  Sparkles,
} from "lucide-react";
import {
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { AgendaEmptyState } from "@/components/empty-states";
import { EntrevistaCard } from "@/components/agenda/EntrevistaCard";
import { FeedbackDialog } from "@/components/agenda/FeedbackDialog";
import { EntrevistaCardData } from "@/components/agenda/agendaConfig";
import { useAgendaActions } from "@/hooks/useAgendaActions";

export default function AgendaPage() {
  usePageTitle("Agenda");

  const { playSuccess, playClick } = useSoundEffects();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("calendario");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [showAIScheduler, setShowAIScheduler] = useState(false);
  const [entrevistaSelecionada, setEntrevistaSelecionada] =
    useState<EntrevistaCardData | null>(null);

  const { data: entrevistas = [], isLoading, refetch } = useEntrevistas();
  const { handleConfirmar, handleCancelar, handleNoShow, handleRegistrarFeedback } =
    useAgendaActions();

  const entrevistasFiltradas = useMemo(() => {
    return entrevistas.filter((e) => {
      if (filtroStatus !== "todos" && e.status !== filtroStatus) return false;
      return true;
    });
  }, [entrevistas, filtroStatus]);

  const entrevistasDoDia = useMemo(() => {
    return entrevistasFiltradas
      .filter((e) => isSameDay(e.data, selectedDate))
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }, [entrevistasFiltradas, selectedDate]);

  const diasComEntrevistas = useMemo(() => {
    const inicio = startOfMonth(selectedDate);
    const fim = endOfMonth(selectedDate);
    const dias = eachDayOfInterval({ start: inicio, end: fim });
    return dias.filter((dia) => entrevistas.some((e) => isSameDay(e.data, dia)));
  }, [entrevistas, selectedDate]);

  const proximasEntrevistas = useMemo(() => {
    const agora = new Date();
    return entrevistasFiltradas
      .filter(
        (e) =>
          new Date(e.data) >= agora && ["agendada", "confirmada"].includes(e.status),
      )
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .slice(0, 10);
  }, [entrevistasFiltradas]);

  const onFeedbackSubmit = async (feedback: string, avaliacao: number) => {
    if (!entrevistaSelecionada) return;
    const ok = await handleRegistrarFeedback(entrevistaSelecionada.id, feedback, avaliacao);
    if (ok) {
      setFeedbackDialog(false);
      setEntrevistaSelecionada(null);
    }
  };

  const openFeedback = (e: EntrevistaCardData) => {
    setEntrevistaSelecionada(e);
    setFeedbackDialog(true);
  };

  const mapToCardData = (e: (typeof entrevistas)[0]): EntrevistaCardData => ({
    id: e.id,
    status: e.status,
    tipo: e.tipo,
    data: e.data,
    horaInicio: e.horaInicio,
    horaFim: e.horaFim,
    local: e.local,
    candidatoNome: e.candidatoNome,
    vagaTitulo: e.vagaTitulo,
    entrevistadores: e.entrevistadores,
    candidatoId: e.candidatoId,
  });

  const renderCard = (e: EntrevistaCardData) => (
    <EntrevistaCard
      key={e.id}
      entrevista={e}
      onConfirmar={handleConfirmar}
      onCancelar={handleCancelar}
      onNoShow={handleNoShow}
      onRegistrarFeedback={openFeedback}
    />
  );

  if (isLoading) {
    return (
      <Layout title="Agenda">
        <div className="p-6 space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80 md:col-span-2" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-64" />
        </div>
      }
    >
      <Layout title="Agenda de Entrevistas">
        <div className="p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Agenda de Entrevistas</h1>
              <p className="text-muted-foreground">
                {
                  entrevistas.filter((e) =>
                    ["agendada", "confirmada"].includes(e.status),
                  ).length
                }{" "}
                entrevistas pendentes
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="agendada">Agendadas</SelectItem>
                  <SelectItem value="confirmada">Confirmadas</SelectItem>
                  <SelectItem value="realizada">Realizadas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
              </Button>

              <InterviewReminderButton variant="bulk" />

              <Button
                variant="outline"
                onClick={() => setShowAIScheduler(!showAIScheduler)}
                className={showAIScheduler ? "bg-primary/10" : ""}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI Scheduler
              </Button>

              <Button onClick={() => setShowAIScheduler(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Entrevista
              </Button>
            </div>
          </div>

          {showAIScheduler && (
            <AIInterviewScheduler
              duracao={60}
              onSelectSlot={(slot) => {
                playSuccess();
                enhancedToast.success(
                  `Horário selecionado: ${format(slot.data, "dd/MM/yyyy")} às ${slot.horaInicio}`,
                );
              }}
              candidatoNome="Candidato Selecionado"
            />
          )}

          <Tabs
            value={activeTab}
            onValueChange={(t) => {
              setActiveTab(t);
              playClick();
            }}
          >
            <TabsList>
              <TabsTrigger value="calendario">Calendário</TabsTrigger>
              <TabsTrigger value="proximas">
                Próximas ({proximasEntrevistas.length})
              </TabsTrigger>
              <TabsTrigger value="todas">
                Todas ({entrevistasFiltradas.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendario" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      locale={ptBR}
                      modifiers={{ hasEvent: diasComEntrevistas }}
                      modifiersStyles={{
                        hasEvent: { fontWeight: "bold", textDecoration: "underline" },
                      }}
                      className="rounded-md"
                    />
                  </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                    {isToday(selectedDate) && <Badge variant="secondary">Hoje</Badge>}
                  </h2>

                  {entrevistasDoDia.length === 0 ? (
                    <AgendaEmptyState
                      dateSelected={true}
                      onOpenDialog={() => setShowAIScheduler(true)}
                    />
                  ) : (
                    <div className="space-y-3">
                      {entrevistasDoDia.map((e) => renderCard(mapToCardData(e)))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="proximas" className="mt-4">
              <div className="space-y-3">
                {proximasEntrevistas.length === 0 ? (
                  <AgendaEmptyState onOpenDialog={() => setShowAIScheduler(true)} />
                ) : (
                  proximasEntrevistas.map((e) => (
                    <div key={e.id}>
                      <p className="text-sm text-muted-foreground mb-2">
                        {format(e.data, "EEEE, d 'de' MMMM", { locale: ptBR })}
                      </p>
                      {renderCard(mapToCardData(e))}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="todas" className="mt-4">
              <div className="space-y-3">
                {entrevistasFiltradas.map((e) => renderCard(mapToCardData(e)))}
              </div>
            </TabsContent>
          </Tabs>

          <FeedbackDialog
            open={feedbackDialog}
            onOpenChange={setFeedbackDialog}
            onSubmit={onFeedbackSubmit}
          />
        </div>
      </Layout>
    </Suspense>
  );
}
