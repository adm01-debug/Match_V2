import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useEntrevistas, useUpdateEntrevista } from "@/hooks/useEntrevistas";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AIInterviewScheduler } from "@/components/agenda/AIInterviewScheduler";
import { InterviewReminderButton } from "@/components/agenda/InterviewReminderButton";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { enhancedToast } from "@/components/ui/enhanced-toast";
import { useConfetti } from "@/components/ui/confetti";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  Phone,
  User,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Filter,
  Sparkles,
} from "lucide-react";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { AgendaEmptyState } from "@/components/empty-states";

interface EntrevistaCardData {
  id: string;
  status: string;
  tipo: string;
  data: Date;
  horaInicio: string;
  horaFim: string;
  local?: string;
  candidatoNome: string;
  vagaTitulo: string;
  entrevistadores: string[];
  candidatoId?: string;
}

const statusConfig = {
  agendada: { label: "Agendada", color: "bg-blue-100 text-blue-700", icon: CalendarIcon },
  confirmada: { label: "Confirmada", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  realizada: { label: "Realizada", color: "bg-purple-100 text-purple-700", icon: CheckCircle2 },
  cancelada: { label: "Cancelada", color: "bg-red-100 text-red-700", icon: XCircle },
  reagendada: { label: "Reagendada", color: "bg-amber-100 text-amber-700", icon: AlertCircle },
};

const tipoConfig = {
  telefone: { label: "Telefone", icon: Phone },
  online: { label: "Videoconferência", icon: Video },
  presencial: { label: "Presencial", icon: MapPin },
};

export default function AgendaPage() {
  usePageTitle('Agenda');

  const navigate = useNavigate();
  const { playSuccess, playError, playNotification, playClick } = useSoundEffects();
  const { fireCelebration } = useConfetti();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("calendario");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [, setDialogOpen] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [showAIScheduler, setShowAIScheduler] = useState(false);
  const [entrevistaSelecionada, setEntrevistaSelecionada] = useState<EntrevistaCardData | null>(null);

  const { data: entrevistas = [], isLoading, refetch } = useEntrevistas();
  const updateEntrevista = useUpdateEntrevista();

  const entrevistasFiltradas = useMemo(() => {
    return entrevistas.filter(e => {
      if (filtroStatus !== "todos" && e.status !== filtroStatus) return false;
      return true;
    });
  }, [entrevistas, filtroStatus]);

  const entrevistasDoDia = useMemo(() => {
    return entrevistasFiltradas.filter(e => 
      isSameDay(e.data, selectedDate)
    ).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }, [entrevistasFiltradas, selectedDate]);

  const diasComEntrevistas = useMemo(() => {
    const inicio = startOfMonth(selectedDate);
    const fim = endOfMonth(selectedDate);
    const dias = eachDayOfInterval({ start: inicio, end: fim });
    
    return dias.filter(dia => 
      entrevistas.some(e => isSameDay(e.data, dia))
    );
  }, [entrevistas, selectedDate]);

  const proximasEntrevistas = useMemo(() => {
    const agora = new Date();
    return entrevistasFiltradas
      .filter(e => new Date(e.data) >= agora && ['agendada', 'confirmada'].includes(e.status))
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .slice(0, 10);
  }, [entrevistasFiltradas]);

  const handleConfirmar = async (id: string) => {
    try {
      await updateEntrevista.mutateAsync({ id, status: 'confirmada' });
      playSuccess();
      enhancedToast.success("Entrevista confirmada!");
    } catch {
      playError();
      enhancedToast.error("Erro ao confirmar entrevista");
    }
  };

  const handleCancelar = async (id: string) => {
    if (!confirm("Deseja cancelar esta entrevista?")) return;
    try {
      await updateEntrevista.mutateAsync({ id, status: 'cancelada' });
      playNotification();
      enhancedToast.warning("Entrevista cancelada");
    } catch {
      playError();
      enhancedToast.error("Erro ao cancelar");
    }
  };

  const handleNoShow = async (id: string) => {
    try {
      await updateEntrevista.mutateAsync({ id, status: 'realizada', feedback_resultado: 'pendente' });
      playError();
      enhancedToast.error("No-show registrado");
    } catch {
      enhancedToast.error("Erro ao registrar no-show");
    }
  };

  const handleRegistrarFeedback = async (feedback: string, avaliacao: number) => {
    if (!entrevistaSelecionada) return;
    try {
      await updateEntrevista.mutateAsync({
        id: entrevistaSelecionada.id,
        status: 'realizada',
        feedback_comentarios: feedback,
        feedback_nota: avaliacao,
        feedback_resultado: avaliacao >= 3 ? 'aprovado' : 'reprovado',
        feedback_avaliado_em: new Date().toISOString(),
      });
      
      if (avaliacao >= 4) {
        fireCelebration();
        enhancedToast.celebration("Excelente feedback registrado!");
      } else {
        playSuccess();
        enhancedToast.success("Feedback registrado com sucesso");
      }
      
      setFeedbackDialog(false);
      setEntrevistaSelecionada(null);
    } catch {
      playError();
      enhancedToast.error("Erro ao registrar feedback");
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    playClick();
  };

  const EntrevistaCard = ({ entrevista }: { entrevista: EntrevistaCardData }) => {
    const status = statusConfig[entrevista.status as keyof typeof statusConfig];
    const tipo = tipoConfig[entrevista.tipo as keyof typeof tipoConfig];
    const TipoIcon = tipo?.icon || CalendarIcon;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={undefined} />
              <AvatarFallback>
                {entrevista.candidatoNome?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium truncate">
                  {entrevista.candidatoNome}
                </p>
                <Badge className={cn("border-0", status?.color)}>
                  {status?.label}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground truncate">
                {entrevista.vagaTitulo}
              </p>

              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {entrevista.horaInicio}
                </span>
                <span className="flex items-center gap-1">
                  <TipoIcon className="h-4 w-4" />
                  {tipo?.label}
                </span>
                {entrevista.entrevistadores.length > 0 && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {entrevista.entrevistadores[0]}
                  </span>
                )}
              </div>

              {entrevista.local && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {entrevista.local}
                </p>
              )}

              <div className="flex items-center gap-2 mt-3">
                {entrevista.status === 'agendada' && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => handleConfirmar(entrevista.id)}>
                      Confirmar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleCancelar(entrevista.id)}>
                      Cancelar
                    </Button>
                  </>
                )}
                {entrevista.status === 'confirmada' && (
                  <>
                    <Button size="sm" onClick={() => {
                      setEntrevistaSelecionada(entrevista);
                      setFeedbackDialog(true);
                    }}>
                      Registrar Feedback
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleNoShow(entrevista.id)}>
                      No-Show
                    </Button>
                  </>
                )}
                {(entrevista.status === 'agendada' || entrevista.status === 'confirmada') && (
                  <InterviewReminderButton 
                    entrevistaId={entrevista.id} 
                    candidatoNome={entrevista.candidatoNome}
                    size="sm"
                  />
                )}
                {entrevista.candidatoId && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => navigate(`/candidatos/${entrevista.candidatoId}`)}
                  >
                    Ver Perfil
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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

  // Map entrevistas to EntrevistaCardData
  const mapToCardData = (e: typeof entrevistas[0]): EntrevistaCardData => ({
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

  return (
    <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-64" /></div>}>
      <Layout title="Agenda de Entrevistas">
        <div className="p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Agenda de Entrevistas</h1>
              <p className="text-muted-foreground">
                {entrevistas.filter(e => ['agendada', 'confirmada'].includes(e.status)).length} entrevistas pendentes
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

              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Entrevista
              </Button>
            </div>
          </div>

          {/* AI Interview Scheduler Panel */}
          {showAIScheduler && (
            <AIInterviewScheduler
              duracao={60}
              onSelectSlot={(slot) => {
                playSuccess();
                enhancedToast.success(
                  `Horário selecionado: ${format(slot.data, "dd/MM/yyyy")} às ${slot.horaInicio}`
                );
              }}
              candidatoNome="Candidato Selecionado"
            />
          )}

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="calendario">Calendário</TabsTrigger>
              <TabsTrigger value="proximas">Próximas ({proximasEntrevistas.length})</TabsTrigger>
              <TabsTrigger value="todas">Todas ({entrevistasFiltradas.length})</TabsTrigger>
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
                      modifiers={{
                        hasEvent: diasComEntrevistas,
                      }}
                      modifiersStyles={{
                        hasEvent: { fontWeight: 'bold', textDecoration: 'underline' },
                      }}
                      className="rounded-md"
                    />
                  </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                    {isToday(selectedDate) && (
                      <Badge variant="secondary">Hoje</Badge>
                    )}
                  </h2>

                  {entrevistasDoDia.length === 0 ? (
                    <AgendaEmptyState dateSelected={true} />
                  ) : (
                    <div className="space-y-3">
                      {entrevistasDoDia.map(entrevista => (
                        <EntrevistaCard key={entrevista.id} entrevista={mapToCardData(entrevista)} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="proximas" className="mt-4">
              <div className="space-y-3">
                {proximasEntrevistas.length === 0 ? (
                  <AgendaEmptyState />
                ) : (
                  proximasEntrevistas.map(entrevista => (
                    <div key={entrevista.id}>
                      <p className="text-sm text-muted-foreground mb-2">
                        {format(entrevista.data, "EEEE, d 'de' MMMM", { locale: ptBR })}
                      </p>
                      <EntrevistaCard entrevista={mapToCardData(entrevista)} />
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="todas" className="mt-4">
              <div className="space-y-3">
                {entrevistasFiltradas.map(entrevista => (
                  <EntrevistaCard key={entrevista.id} entrevista={mapToCardData(entrevista)} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Dialog open={feedbackDialog} onOpenChange={setFeedbackDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Feedback da Entrevista</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const feedback = (form.elements.namedItem('feedback') as HTMLTextAreaElement).value;
                const avaliacao = parseInt((form.elements.namedItem('avaliacao') as HTMLSelectElement).value);
                handleRegistrarFeedback(feedback, avaliacao);
              }}>
                <div className="space-y-4">
                  <div>
                    <Label>Avaliação Geral</Label>
                    <Select name="avaliacao" defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ Excelente</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ Muito Bom</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ Bom</SelectItem>
                        <SelectItem value="2">⭐⭐ Regular</SelectItem>
                        <SelectItem value="1">⭐ Insatisfatório</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Feedback</Label>
                    <Textarea name="feedback" placeholder="Observações da entrevista..." rows={4} />
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setFeedbackDialog(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </Layout>
    </Suspense>
  );
}
