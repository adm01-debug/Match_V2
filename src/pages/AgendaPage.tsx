import { useState, useMemo } from 'react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, List, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useEntrevistas, useCreateEntrevista, useUpdateEntrevista } from '@/hooks/useEntrevistas';
import EntrevistaCard from '@/components/agenda/EntrevistaCard';
import AgendarEntrevistaDialog from '@/components/agenda/AgendarEntrevistaDialog';
import EntrevistaDetalhesDialog from '@/components/agenda/EntrevistaDetalhesDialog';
import { cn } from '@/lib/utils';
import { Entrevista, EntrevistaFeedback } from '@/data/agendaData';

const AgendaPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [selectedEntrevista, setSelectedEntrevista] = useState<Entrevista | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const { data: entrevistas = [], isLoading, error } = useEntrevistas();
  const createMutation = useCreateEntrevista();
  const updateMutation = useUpdateEntrevista();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { locale: ptBR });
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEntrevistasForDay = (day: Date) => {
    return entrevistas.filter((e) => isSameDay(new Date(e.data), day));
  };

  const entrevistasHoje = useMemo(() => {
    return entrevistas.filter((e) => isSameDay(new Date(e.data), new Date()));
  }, [entrevistas]);

  const entrevistasSelecionadas = useMemo(() => {
    return entrevistas.filter((e) => isSameDay(new Date(e.data), selectedDate));
  }, [entrevistas, selectedDate]);

  const proximasEntrevistas = useMemo(() => {
    const hoje = new Date();
    return entrevistas
      .filter((e) => new Date(e.data) >= hoje && e.status !== 'cancelada' && e.status !== 'realizada')
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .slice(0, 10);
  }, [entrevistas]);

  const handleSaveEntrevista = (novaEntrevista: Omit<Entrevista, 'id'>) => {
    createMutation.mutate({
      candidato_nome: novaEntrevista.candidatoNome,
      vaga_id: novaEntrevista.vagaId,
      vaga_titulo: novaEntrevista.vagaTitulo,
      tipo: novaEntrevista.tipo,
      data: format(novaEntrevista.data, 'yyyy-MM-dd'),
      hora_inicio: novaEntrevista.horaInicio,
      hora_fim: novaEntrevista.horaFim,
      local: novaEntrevista.local,
      link_online: novaEntrevista.linkOnline,
      entrevistadores: novaEntrevista.entrevistadores,
      etapa: novaEntrevista.etapa,
      status: 'agendada',
      observacoes: novaEntrevista.observacoes,
    });
  };

  const handleOpenDetalhes = (entrevista: Entrevista) => {
    setSelectedEntrevista(entrevista);
    setDetalhesDialogOpen(true);
  };

  const handleUpdateEntrevista = (updated: Entrevista) => {
    updateMutation.mutate({
      id: updated.id,
      data: format(updated.data, 'yyyy-MM-dd'),
      hora_inicio: updated.horaInicio,
      hora_fim: updated.horaFim,
      local: updated.local,
      link_online: updated.linkOnline,
      entrevistadores: updated.entrevistadores,
      etapa: updated.etapa,
      observacoes: updated.observacoes,
    });
    setSelectedEntrevista(updated);
  };

  const handleCancelEntrevista = (id: string) => {
    updateMutation.mutate({ id, status: 'cancelada' });
  };

  const handleConfirmEntrevista = (id: string) => {
    updateMutation.mutate({ id, status: 'confirmada' });
    setSelectedEntrevista(prev => prev ? { ...prev, status: 'confirmada' as const } : null);
  };

  const handleMarcarRealizada = (id: string, feedback: EntrevistaFeedback) => {
    updateMutation.mutate({
      id,
      status: 'realizada',
      feedback_resultado: feedback.resultado,
      feedback_nota: feedback.notaGeral,
      feedback_pontos_fortes: feedback.pontosFortes,
      feedback_pontos_melhorar: feedback.pontosAMelhorar,
      feedback_comentarios: feedback.comentarios,
      feedback_recomendacao: feedback.recomendacao,
      feedback_avaliado_por: feedback.avaliadoPor,
      feedback_avaliado_em: new Date().toISOString(),
    });
  };

  const estatisticas = useMemo(() => {
    const esteMes = entrevistas.filter(
      (e) => {
        const entData = new Date(e.data);
        return entData >= monthStart && entData <= monthEnd;
      }
    );
    return {
      hoje: entrevistasHoje.length,
      esteMes: esteMes.length,
      agendadas: entrevistas.filter((e) => e.status === 'agendada').length,
      confirmadas: entrevistas.filter((e) => e.status === 'confirmada').length,
    };
  }, [entrevistas, entrevistasHoje, monthStart, monthEnd]);

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20" />)}
          </div>
          <Skeleton className="h-[500px]" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
          <p className="text-muted-foreground">
            Gerencie suas entrevistas e compromissos
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} disabled={createMutation.isPending}>
          {createMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
          Agendar Entrevista
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-primary">{estatisticas.hoje}</div>
            <p className="text-sm text-muted-foreground">Entrevistas Hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-foreground">{estatisticas.esteMes}</div>
            <p className="text-sm text-muted-foreground">Este Mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{estatisticas.agendadas}</div>
            <p className="text-sm text-muted-foreground">Agendadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{estatisticas.confirmadas}</div>
            <p className="text-sm text-muted-foreground">Confirmadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-lg min-w-[180px] text-center">
                  {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </CardTitle>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCurrentMonth(new Date());
                  setSelectedDate(new Date());
                }}
              >
                Hoje
              </Button>
            </div>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
              <TabsList>
                <TabsTrigger value="calendar">
                  <CalendarIcon className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {viewMode === 'calendar' ? (
              <div>
                {/* Week days header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day) => {
                    const dayEntrevistas = getEntrevistasForDay(day);
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    const isToday = isSameDay(day, new Date());
                    const isSelected = isSameDay(day, selectedDate);

                    return (
                      <div
                        key={day.toISOString()}
                        className={cn(
                          "min-h-[80px] p-1 border rounded-md cursor-pointer transition-colors",
                          !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                          isToday && "border-primary",
                          isSelected && "bg-primary/10 border-primary",
                          "hover:bg-accent"
                        )}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div
                          className={cn(
                            "text-sm font-medium mb-1",
                            isToday && "text-primary font-bold"
                          )}
                        >
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-1">
                          {dayEntrevistas.slice(0, 2).map((ent) => (
                            <div
                              key={ent.id}
                              className={cn(
                                "text-xs px-1 py-0.5 rounded truncate",
                                ent.status === 'confirmada' && "bg-green-500/20 text-green-700",
                                ent.status === 'agendada' && "bg-yellow-500/20 text-yellow-700",
                                ent.status === 'realizada' && "bg-muted text-muted-foreground",
                                ent.status === 'cancelada' && "bg-red-500/20 text-red-700"
                              )}
                            >
                              {ent.horaInicio} {ent.candidatoNome.split(' ')[0]}
                            </div>
                          ))}
                          {dayEntrevistas.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEntrevistas.length - 2} mais
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {proximasEntrevistas.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma entrevista agendada
                  </p>
                ) : (
                  proximasEntrevistas.map((ent) => (
                    <div key={ent.id} className="flex items-start gap-4">
                      <div className="text-sm text-muted-foreground min-w-[100px]">
                        {format(new Date(ent.data), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                      <EntrevistaCard entrevista={ent as any} onClick={() => handleOpenDetalhes(ent as any)} />
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar - Selected Day */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {isSameDay(selectedDate, new Date())
                  ? 'Hoje'
                  : format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {entrevistasSelecionadas.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma entrevista neste dia</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agendar
                  </Button>
                </div>
              ) : (
                entrevistasSelecionadas.map((ent) => (
                  <EntrevistaCard key={ent.id} entrevista={ent as any} onClick={() => handleOpenDetalhes(ent as any)} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Legenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-sm">Confirmada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500" />
                <span className="text-sm">Agendada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-muted-foreground" />
                <span className="text-sm">Realizada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-sm">Cancelada</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <AgendarEntrevistaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveEntrevista}
        selectedDate={selectedDate}
      />

      <EntrevistaDetalhesDialog
        entrevista={selectedEntrevista}
        open={detalhesDialogOpen}
        onOpenChange={setDetalhesDialogOpen}
        onUpdate={handleUpdateEntrevista}
        onCancel={handleCancelEntrevista}
        onConfirm={handleConfirmEntrevista}
        onMarcarRealizada={handleMarcarRealizada}
      />
    </div>
    </Layout>
  );
};

export default AgendaPage;
