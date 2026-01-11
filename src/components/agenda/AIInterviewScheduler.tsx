/**
 * @fileoverview AI Interview Scheduler - Sugere horários automaticamente
 * @module AIInterviewScheduler
 */

import { useState, useMemo, useEffect } from 'react';
import { format, addDays, setHours, setMinutes, isWeekend, isBefore, addMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Calendar, Clock, Users, CheckCircle2, 
  RefreshCw, Zap, Brain, ArrowRight, Star, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useEntrevistas } from '@/hooks/useEntrevistas';

interface Entrevistador {
  id: string;
  nome: string;
  cargo: string;
  disponibilidade: { dia: number; inicio: string; fim: string }[];
}

interface SugestedSlot {
  id: string;
  data: Date;
  horaInicio: string;
  horaFim: string;
  entrevistadores: Entrevistador[];
  score: number;
  reasons: string[];
  conflicts?: ConflictInfo[];
  hasConflict?: boolean;
}

interface ConflictInfo {
  type: 'overlap' | 'interviewer_busy' | 'time_proximity';
  severity: 'high' | 'medium' | 'low';
  message: string;
  conflictingInterview?: {
    id: string;
    candidatoNome: string;
    horaInicio: string;
    horaFim: string;
  };
}

interface AIInterviewSchedulerProps {
  entrevistadores?: Entrevistador[];
  duracao?: number; // em minutos
  onSelectSlot: (slot: SugestedSlot) => void;
  candidatoNome?: string;
}

const mockEntrevistadores: Entrevistador[] = [
  { 
    id: '1', 
    nome: 'Ana Silva', 
    cargo: 'Tech Lead',
    disponibilidade: [
      { dia: 1, inicio: '09:00', fim: '12:00' },
      { dia: 1, inicio: '14:00', fim: '17:00' },
      { dia: 3, inicio: '10:00', fim: '16:00' },
      { dia: 5, inicio: '09:00', fim: '12:00' },
    ]
  },
  { 
    id: '2', 
    nome: 'Carlos Santos', 
    cargo: 'Engineering Manager',
    disponibilidade: [
      { dia: 1, inicio: '10:00', fim: '12:00' },
      { dia: 2, inicio: '14:00', fim: '18:00' },
      { dia: 4, inicio: '09:00', fim: '11:00' },
    ]
  },
  { 
    id: '3', 
    nome: 'Marina Costa', 
    cargo: 'HR Business Partner',
    disponibilidade: [
      { dia: 1, inicio: '09:00', fim: '18:00' },
      { dia: 2, inicio: '09:00', fim: '18:00' },
      { dia: 3, inicio: '09:00', fim: '18:00' },
      { dia: 4, inicio: '09:00', fim: '18:00' },
      { dia: 5, inicio: '09:00', fim: '18:00' },
    ]
  },
];

export function AIInterviewScheduler({ 
  entrevistadores = mockEntrevistadores, 
  duracao = 60,
  onSelectSlot,
  candidatoNome = 'Candidato'
}: AIInterviewSchedulerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [conflictWarnings, setConflictWarnings] = useState<ConflictInfo[]>([]);

  // Buscar entrevistas existentes para detecção de conflitos
  const { data: existingInterviews = [] } = useEntrevistas();

  // Função para converter horário em minutos
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number) as [number, number];
    return hours * 60 + minutes;
  };

  // Função para verificar sobreposição de horários
  const hasTimeOverlap = (
    start1: number, end1: number,
    start2: number, end2: number
  ): boolean => {
    return start1 < end2 && end1 > start2;
  };

  // Detectar conflitos para um slot específico
  const detectConflicts = (slotDate: Date, slotStart: string, slotEnd: string): ConflictInfo[] => {
    const conflicts: ConflictInfo[] = [];
    const slotStartMin = timeToMinutes(slotStart);
    const slotEndMin = timeToMinutes(slotEnd);
    const slotDateStr = format(slotDate, 'yyyy-MM-dd');

    for (const interview of existingInterviews) {
      const interviewDate = interview.data;
      const interviewDateStr = format(interviewDate, 'yyyy-MM-dd');
      
      if (interviewDateStr !== slotDateStr) continue;

      const interviewStartMin = timeToMinutes(interview.horaInicio);
      const interviewEndMin = timeToMinutes(interview.horaFim);

      // Verificar sobreposição direta
      if (hasTimeOverlap(slotStartMin, slotEndMin, interviewStartMin, interviewEndMin)) {
        conflicts.push({
          type: 'overlap',
          severity: 'high',
          message: `Conflito com entrevista de ${interview.candidatoNome} (${interview.horaInicio} - ${interview.horaFim})`,
          conflictingInterview: {
            id: interview.id,
            candidatoNome: interview.candidatoNome,
            horaInicio: interview.horaInicio,
            horaFim: interview.horaFim
          }
        });
      }

      // Verificar proximidade (menos de 15 minutos entre entrevistas)
      const gap = Math.min(
        Math.abs(slotStartMin - interviewEndMin),
        Math.abs(interviewStartMin - slotEndMin)
      );

      if (gap > 0 && gap < 15 && !hasTimeOverlap(slotStartMin, slotEndMin, interviewStartMin, interviewEndMin)) {
        conflicts.push({
          type: 'time_proximity',
          severity: 'medium',
          message: `Apenas ${gap} min entre esta e a entrevista de ${interview.candidatoNome}`,
          conflictingInterview: {
            id: interview.id,
            candidatoNome: interview.candidatoNome,
            horaInicio: interview.horaInicio,
            horaFim: interview.horaFim
          }
        });
      }
    }

    return conflicts;
  };

  // Atualizar avisos quando um slot é selecionado
  useEffect(() => {
    if (selectedSlot) {
      const slot = suggestedSlots.find(s => s.id === selectedSlot);
      if (slot && slot.conflicts) {
        setConflictWarnings(slot.conflicts);
      } else {
        setConflictWarnings([]);
      }
    }
  }, [selectedSlot]);

  // Gerar slots sugeridos baseados na disponibilidade
  const suggestedSlots = useMemo((): SugestedSlot[] => {
    const slots: SugestedSlot[] = [];
    const today = new Date();
    
    // Analisar próximos 10 dias úteis
    for (let d = 1; d <= 14; d++) {
      const date = addDays(today, d);
      if (isWeekend(date)) continue;
      
      const dayOfWeek = date.getDay();
      
      // Horários preferidos (baseado em estudos de produtividade)
      const preferredTimes = ['10:00', '14:00', '15:00', '11:00', '09:00', '16:00'];
      
      for (const time of preferredTimes) {
      const [hours, minutes] = time.split(':').map(Number) as [number, number];
      const slotStart = setMinutes(setHours(date, hours), minutes);
        const slotEnd = addMinutes(slotStart, duracao);
        const slotEndFormatted = format(slotEnd, 'HH:mm');
        
        if (isBefore(slotStart, today)) continue;
        
        // Verificar disponibilidade dos entrevistadores
        const availableInterviewers = entrevistadores.filter(e => 
          e.disponibilidade.some(disp => {
            if (disp.dia !== dayOfWeek) return false;
            const [startH, startM] = disp.inicio.split(':').map(Number) as [number, number];
            const [endH, endM] = disp.fim.split(':').map(Number) as [number, number];
            const dispStart = startH * 60 + startM;
            const dispEnd = endH * 60 + endM;
            const slotStartMin = hours * 60 + minutes;
            const slotEndMin = slotStartMin + duracao;
            return slotStartMin >= dispStart && slotEndMin <= dispEnd;
          })
        );
        
        if (availableInterviewers.length >= 2) {
          // Detectar conflitos com entrevistas existentes
          const conflicts = detectConflicts(date, time, slotEndFormatted);
          const hasConflict = conflicts.some(c => c.severity === 'high');
          
          // Calcular score do slot
          let score = 50;
          const reasons: string[] = [];
          
          // Penalizar slots com conflitos
          if (hasConflict) {
            score -= 40;
            reasons.push('⚠️ Conflito de horário');
          } else if (conflicts.length > 0) {
            score -= 15;
            reasons.push('⏰ Horário apertado');
          }
          
          // Mais entrevistadores = melhor
          if (availableInterviewers.length >= 3) {
            score += 20;
            reasons.push('Todos os avaliadores disponíveis');
          }
          
          // Horários ideais (10h-11h, 14h-15h)
          if (['10:00', '14:00'].includes(time)) {
            score += 15;
            reasons.push('Horário de alta produtividade');
          }
          
          // Não muito cedo nem muito tarde
          if (hours >= 10 && hours <= 15) {
            score += 10;
            reasons.push('Horário conveniente');
          }
          
          // Próximos dias são preferidos
          if (d <= 5) {
            score += 5;
            reasons.push('Data próxima');
          }
          
          // Bonus para slots sem conflitos
          if (conflicts.length === 0) {
            score += 10;
            reasons.push('✓ Sem conflitos');
          }
          
          slots.push({
            id: `${format(date, 'yyyy-MM-dd')}-${time}`,
            data: date,
            horaInicio: time,
            horaFim: slotEndFormatted,
            entrevistadores: availableInterviewers,
            score: Math.max(0, Math.min(score, 100)),
            reasons,
            conflicts,
            hasConflict
          });
        }
      }
    }
    
    // Ordenar por score (conflitos vão para baixo) e retornar top 5
    return slots.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [entrevistadores, duracao, existingInterviews, detectConflicts]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simular análise de IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAnalyzing(false);
    setShowSuggestions(true);
  };

  const handleSelectSlot = (slot: SugestedSlot) => {
    setSelectedSlot(slot.id);
    onSelectSlot(slot);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-500/10 border-green-500/20';
    if (score >= 70) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-orange-500/10 border-orange-500/20';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              AI Interview Scheduler
              <Badge variant="secondary" className="bg-gradient-to-r from-primary to-purple-600 text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                Smart
              </Badge>
            </CardTitle>
            <CardDescription>
              Sugestões inteligentes baseadas em disponibilidade e produtividade
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {!showSuggestions ? (
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Agendar entrevista para {candidatoNome}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Nossa IA analisará os calendários dos entrevistadores e sugerirá 
              os melhores horários baseados em disponibilidade e produtividade.
            </p>
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analisando calendários...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Encontrar melhores horários
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium">
                    {suggestedSlots.length} horários encontrados
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleAnalyze}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reanalisar
                </Button>
              </div>

              {/* Conflict Summary */}
              {conflictWarnings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-destructive/10 border border-destructive/20"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-destructive">Conflitos detectados</p>
                      <ul className="mt-1 space-y-1">
                        {conflictWarnings.map((conflict, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {conflict.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-3">
                {suggestedSlots.map((slot, index) => (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "relative p-4 rounded-xl border-2 cursor-pointer transition-all",
                      slot.hasConflict 
                        ? "border-destructive/50 bg-destructive/5"
                        : selectedSlot === slot.id 
                          ? "border-primary bg-primary/5 shadow-lg" 
                          : "border-border hover:border-primary/50 hover:shadow-md",
                      !slot.hasConflict && getScoreBg(slot.score)
                    )}
                    onClick={() => handleSelectSlot(slot)}
                  >
                    {/* Conflict indicator */}
                    {slot.hasConflict && (
                      <div className="absolute -top-2 -left-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="destructive" className="animate-pulse">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Conflito
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="font-medium mb-1">Conflitos de horário:</p>
                              <ul className="text-sm space-y-1">
                                {slot.conflicts?.map((c, i) => (
                                  <li key={i}>• {c.message}</li>
                                ))}
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}

                    {/* Proximity warning */}
                    {!slot.hasConflict && slot.conflicts && slot.conflicts.length > 0 && (
                      <div className="absolute -top-2 -left-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                                <Clock className="h-3 w-3 mr-1" />
                                Atenção
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="font-medium mb-1">Aviso:</p>
                              <ul className="text-sm space-y-1">
                                {slot.conflicts?.map((c, i) => (
                                  <li key={i}>• {c.message}</li>
                                ))}
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}

                    {index === 0 && !slot.hasConflict && !slot.conflicts?.length && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                          <Star className="h-3 w-3 mr-1" />
                          Recomendado
                        </Badge>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">
                              {format(slot.data, "EEEE, d 'de' MMMM", { locale: ptBR })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {slot.horaInicio} - {slot.horaFim}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div className="flex -space-x-2">
                            {slot.entrevistadores.slice(0, 3).map((e) => (
                              <Avatar key={e.id} className="h-6 w-6 border-2 border-background">
                                <AvatarFallback className="text-xs bg-primary/20">
                                  {e.nome.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {slot.entrevistadores.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                +{slot.entrevistadores.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {slot.entrevistadores.map(e => e.nome.split(' ')[0]).join(', ')}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {slot.reasons.map((reason, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={cn("text-2xl font-bold", slot.hasConflict ? "text-destructive" : getScoreColor(slot.score))}>
                          {slot.score}%
                        </div>
                        <Progress 
                          value={slot.score} 
                          className="w-16 h-1.5 mt-1"
                        />
                        <span className="text-xs text-muted-foreground">match</span>
                      </div>
                    </div>

                    {selectedSlot === slot.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t"
                      >
                        <Button className="w-full bg-gradient-to-r from-primary to-purple-600">
                          Confirmar este horário
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
}
