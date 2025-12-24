import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useEntrevistas } from "@/hooks/useEntrevistas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const statusConfig = {
  agendada: { label: "Agendada", color: "bg-blue-100 text-blue-700", icon: CalendarIcon },
  confirmada: { label: "Confirmada", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  realizada: { label: "Realizada", color: "bg-purple-100 text-purple-700", icon: CheckCircle2 },
  cancelada: { label: "Cancelada", color: "bg-red-100 text-red-700", icon: XCircle },
  no_show: { label: "No-Show", color: "bg-amber-100 text-amber-700", icon: AlertCircle },
};

const tipoConfig = {
  telefone: { label: "Telefone", icon: Phone },
  video: { label: "Videoconferência", icon: Video },
  presencial: { label: "Presencial", icon: MapPin },
};

export default function AgendaPage() {
  usePageTitle('Agenda');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("calendario");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [entrevistaSelecionada, setEntrevistaSelecionada] = useState<any>(null);

  // Hook de entrevistas
  const {
    data: entrevistas = [],
    isLoading,
    confirmarEntrevista,
    cancelarEntrevista,
    registrarNoShow,
    registrarFeedback,
    refetch,
  } = useEntrevistas();

  // Filtrar entrevistas
  const entrevistasFiltradas = useMemo(() => {
    return entrevistas.filter(e => {
      if (filtroStatus !== "todos" && e.status !== filtroStatus) return false;
      return true;
    });
  }, [entrevistas, filtroStatus]);

  // Entrevistas do dia selecionado
  const entrevistasDoDia = useMemo(() => {
    return entrevistasFiltradas.filter(e => 
      isSameDay(parseISO(e.data_hora), selectedDate)
    ).sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime());
  }, [entrevistasFiltradas, selectedDate]);

  // Dias com entrevistas no mês
  const diasComEntrevistas = useMemo(() => {
    const inicio = startOfMonth(selectedDate);
    const fim = endOfMonth(selectedDate);
    const dias = eachDayOfInterval({ start: inicio, end: fim });
    
    return dias.filter(dia => 
      entrevistas.some(e => isSameDay(parseISO(e.data_hora), dia))
    );
  }, [entrevistas, selectedDate]);

  // Próximas entrevistas
  const proximasEntrevistas = useMemo(() => {
    const agora = new Date();
    return entrevistasFiltradas
      .filter(e => new Date(e.data_hora) >= agora && ['agendada', 'confirmada'].includes(e.status))
      .sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime())
      .slice(0, 10);
  }, [entrevistasFiltradas]);

  // Handlers
  const handleConfirmar = async (id: string) => {
    try {
      await confirmarEntrevista(id);
      toast({ title: "Entrevista confirmada" });
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  const handleCancelar = async (id: string) => {
    if (!confirm("Deseja cancelar esta entrevista?")) return;
    try {
      await cancelarEntrevista(id);
      toast({ title: "Entrevista cancelada" });
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  const handleNoShow = async (id: string) => {
    try {
      await registrarNoShow(id);
      toast({ title: "No-show registrado", variant: "destructive" });
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  const handleRegistrarFeedback = async (feedback: string, avaliacao: number) => {
    if (!entrevistaSelecionada) return;
    try {
      await registrarFeedback(entrevistaSelecionada.id, { feedback, avaliacao });
      toast({ title: "Feedback registrado" });
      setFeedbackDialog(false);
      setEntrevistaSelecionada(null);
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  // Render Card de Entrevista
  const EntrevistaCard = ({ entrevista }: { entrevista: any }) => {
    const status = statusConfig[entrevista.status as keyof typeof statusConfig];
    const tipo = tipoConfig[entrevista.tipo as keyof typeof tipoConfig];
    const StatusIcon = status?.icon || CalendarIcon;
    const TipoIcon = tipo?.icon || CalendarIcon;

    return (
      <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-64" /></div>}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={entrevista.processo?.candidato?.foto_url} />
              <AvatarFallback>
                {entrevista.processo?.candidato?.nome?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium truncate">
                  {entrevista.processo?.candidato?.nome}
                </p>
                <Badge className={cn("border-0", status?.color)}>
                  {status?.label}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground truncate">
                {entrevista.processo?.vaga?.titulo}
              </p>

              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(parseISO(entrevista.data_hora), "HH:mm")}
                </span>
                <span className="flex items-center gap-1">
                  <TipoIcon className="h-4 w-4" />
                  {tipo?.label}
                </span>
                {entrevista.entrevistador && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {entrevista.entrevistador.full_name}
                  </span>
                )}
              </div>

              {entrevista.local && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {entrevista.local}
                </p>
              )}

              {/* Ações */}
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
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => navigate(`/candidatos/${entrevista.processo?.candidato_id}`)}
                >
                  Ver Perfil
                </Button>
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

  return (
    <Layout title="Agenda de Entrevistas">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
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

            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Entrevista
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="calendario">Calendário</TabsTrigger>
            <TabsTrigger value="proximas">Próximas ({proximasEntrevistas.length})</TabsTrigger>
            <TabsTrigger value="todas">Todas ({entrevistasFiltradas.length})</TabsTrigger>
          </TabsList>

          {/* Tab Calendário */}
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
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      Nenhuma entrevista neste dia
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {entrevistasDoDia.map(entrevista => (
                      <EntrevistaCard key={entrevista.id} entrevista={entrevista} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Tab Próximas */}
          <TabsContent value="proximas" className="mt-4">
            <div className="space-y-3">
              {proximasEntrevistas.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Nenhuma entrevista agendada
                  </CardContent>
                </Card>
              ) : (
                proximasEntrevistas.map(entrevista => (
                  <div key={entrevista.id}>
                    <p className="text-sm text-muted-foreground mb-2">
                      {format(parseISO(entrevista.data_hora), "EEEE, d 'de' MMMM", { locale: ptBR })}
                    </p>
                    <EntrevistaCard entrevista={entrevista} />
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Tab Todas */}
          <TabsContent value="todas" className="mt-4">
            <div className="space-y-3">
              {entrevistasFiltradas.map(entrevista => (
                <EntrevistaCard key={entrevista.id} entrevista={entrevista} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog Feedback */}
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
  );
}
