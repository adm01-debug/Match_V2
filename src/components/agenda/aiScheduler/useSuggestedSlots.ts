import { useMemo } from 'react';
import { format, addDays, setHours, setMinutes, isWeekend, isBefore, addMinutes } from 'date-fns';
import { useEntrevistas } from '@/hooks/useEntrevistas';
import type { Entrevistador, SugestedSlot, ConflictInfo } from './types';

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number) as [number, number];
  return hours * 60 + minutes;
};

const hasTimeOverlap = (s1: number, e1: number, s2: number, e2: number) =>
  s1 < e2 && e1 > s2;

interface ExistingInterview {
  id: string;
  candidatoNome: string;
  data: Date;
  horaInicio: string;
  horaFim: string;
}

function detectConflicts(
  existing: ExistingInterview[],
  slotDate: Date,
  slotStart: string,
  slotEnd: string,
): ConflictInfo[] {
  const conflicts: ConflictInfo[] = [];
  const slotStartMin = timeToMinutes(slotStart);
  const slotEndMin = timeToMinutes(slotEnd);
  const slotDateStr = format(slotDate, 'yyyy-MM-dd');

  for (const iv of existing) {
    if (format(iv.data, 'yyyy-MM-dd') !== slotDateStr) continue;
    const ivStart = timeToMinutes(iv.horaInicio);
    const ivEnd = timeToMinutes(iv.horaFim);

    if (hasTimeOverlap(slotStartMin, slotEndMin, ivStart, ivEnd)) {
      conflicts.push({
        type: 'overlap',
        severity: 'high',
        message: `Conflito com entrevista de ${iv.candidatoNome} (${iv.horaInicio} - ${iv.horaFim})`,
        conflictingInterview: {
          id: iv.id,
          candidatoNome: iv.candidatoNome,
          horaInicio: iv.horaInicio,
          horaFim: iv.horaFim,
        },
      });
      continue;
    }

    const gap = Math.min(
      Math.abs(slotStartMin - ivEnd),
      Math.abs(ivStart - slotEndMin),
    );
    if (gap > 0 && gap < 15) {
      conflicts.push({
        type: 'time_proximity',
        severity: 'medium',
        message: `Apenas ${gap} min entre esta e a entrevista de ${iv.candidatoNome}`,
        conflictingInterview: {
          id: iv.id,
          candidatoNome: iv.candidatoNome,
          horaInicio: iv.horaInicio,
          horaFim: iv.horaFim,
        },
      });
    }
  }
  return conflicts;
}

export function useSuggestedSlots(entrevistadores: Entrevistador[], duracao: number) {
  const { data: existingInterviews = [] } = useEntrevistas();

  return useMemo<SugestedSlot[]>(() => {
    const slots: SugestedSlot[] = [];
    const today = new Date();

    for (let d = 1; d <= 14; d++) {
      const date = addDays(today, d);
      if (isWeekend(date)) continue;
      const dayOfWeek = date.getDay();
      const preferredTimes = ['10:00', '14:00', '15:00', '11:00', '09:00', '16:00'];

      for (const time of preferredTimes) {
        const [hours, minutes] = time.split(':').map(Number) as [number, number];
        const slotStart = setMinutes(setHours(date, hours), minutes);
        const slotEnd = addMinutes(slotStart, duracao);
        const slotEndFormatted = format(slotEnd, 'HH:mm');
        if (isBefore(slotStart, today)) continue;

        const availableInterviewers = entrevistadores.filter(e =>
          e.disponibilidade.some(disp => {
            if (disp.dia !== dayOfWeek) return false;
            const dispStart = timeToMinutes(disp.inicio);
            const dispEnd = timeToMinutes(disp.fim);
            const sMin = hours * 60 + minutes;
            return sMin >= dispStart && sMin + duracao <= dispEnd;
          }),
        );

        if (availableInterviewers.length >= 2) {
          const conflicts = detectConflicts(
            existingInterviews as ExistingInterview[],
            date,
            time,
            slotEndFormatted,
          );
          const hasConflict = conflicts.some(c => c.severity === 'high');

          let score = 50;
          const reasons: string[] = [];
          if (hasConflict) {
            score -= 40;
            reasons.push('⚠️ Conflito de horário');
          } else if (conflicts.length > 0) {
            score -= 15;
            reasons.push('⏰ Horário apertado');
          }
          if (availableInterviewers.length >= 3) {
            score += 20;
            reasons.push('Todos os avaliadores disponíveis');
          }
          if (['10:00', '14:00'].includes(time)) {
            score += 15;
            reasons.push('Horário de alta produtividade');
          }
          if (hours >= 10 && hours <= 15) {
            score += 10;
            reasons.push('Horário conveniente');
          }
          if (d <= 5) {
            score += 5;
            reasons.push('Data próxima');
          }
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
            hasConflict,
          });
        }
      }
    }

    return slots.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [entrevistadores, duracao, existingInterviews]);
}
