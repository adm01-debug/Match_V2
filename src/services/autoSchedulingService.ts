import { supabase } from '@/integrations/supabase/client';

interface TimeSlot { start: Date; end: Date; available: boolean; }
interface ScheduleConfig { workingHours: { start: number; end: number }; slotDuration: number; bufferTime: number; workingDays: number[]; timezone: string; }
interface BookingRequest { candidatoId: string; entrevistadorId: string; vagaId: string; preferredSlots?: Date[]; duration: number; }

const DEFAULT_CONFIG: ScheduleConfig = { workingHours: { start: 9, end: 18 }, slotDuration: 60, bufferTime: 15, workingDays: [1, 2, 3, 4, 5], timezone: 'America/Sao_Paulo' };

export const autoSchedulingService = {
  config: DEFAULT_CONFIG,

  async getAvailableSlots(entrevistadorId: string, startDate: Date, endDate: Date): Promise<TimeSlot[]> {
    const slots: TimeSlot[] = [];
    const { data: existingEvents } = await supabase.from('entrevistas').select('data, hora_inicio, hora_fim').eq('candidato_id', entrevistadorId).gte('data', startDate.toISOString().split('T')[0]).lte('data', endDate.toISOString().split('T')[0]);
    
    const busyTimes = (existingEvents || []).map(e => {
      const startDateTime = new Date(`${e.data}T${e.hora_inicio}`);
      const endDateTime = new Date(`${e.data}T${e.hora_fim}`);
      return { start: startDateTime, end: endDateTime };
    });
    let current = new Date(startDate);

    while (current < endDate) {
      const dayOfWeek = current.getDay();
      if (this.config.workingDays.includes(dayOfWeek)) {
        for (let hour = this.config.workingHours.start; hour < this.config.workingHours.end; hour++) {
          const slotStart = new Date(current);
          slotStart.setHours(hour, 0, 0, 0);
          const slotEnd = new Date(slotStart.getTime() + this.config.slotDuration * 60000);
          const isAvailable = !busyTimes.some(busy => (slotStart >= busy.start && slotStart < busy.end) || (slotEnd > busy.start && slotEnd <= busy.end));
          if (slotStart > new Date()) slots.push({ start: slotStart, end: slotEnd, available: isAvailable });
        }
      }
      current.setDate(current.getDate() + 1);
    }
    return slots;
  },

  async findBestSlot(entrevistadorIds: string[], _duration: number, preferredTimes?: Date[]): Promise<TimeSlot | null> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);

    for (const entrevistadorId of entrevistadorIds) {
      const slots = await this.getAvailableSlots(entrevistadorId, startDate, endDate);
      const available = slots.filter(s => s.available);
      
      if (preferredTimes?.length) {
        const preferred = available.find(slot => preferredTimes.some(pt => Math.abs(slot.start.getTime() - pt.getTime()) < 3600000));
        if (preferred) return preferred;
      }
      if (available.length > 0) return available[0] ?? null;
    }
    return null;
  },

  async bookSlot(request: BookingRequest): Promise<{ success: boolean; entrevistaId?: string; error?: string }> {
    try {
      const slot = await this.findBestSlot([request.entrevistadorId], request.duration, request.preferredSlots);
      if (!slot) return { success: false, error: 'Nenhum horário disponível encontrado.' };

      const horaFim = new Date(slot.start.getTime() + request.duration * 60000);
      
      const { data, error } = await supabase.from('entrevistas').insert({
        candidato_nome: 'Candidato',
        vaga_id: request.vagaId,
        vaga_titulo: 'Vaga',
        data: slot.start.toISOString().split('T')[0],
        hora_inicio: slot.start.toTimeString().slice(0, 5),
        hora_fim: horaFim.toTimeString().slice(0, 5),
        status: 'agendada',
        tipo: 'remota',
        etapa: 'tecnica',
        entrevistadores: [request.entrevistadorId],
      }).select().single();

      if (error) throw error;
      return { success: true, entrevistaId: data.id };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  },

  async suggestSlots(entrevistadorId: string, count: number = 5): Promise<TimeSlot[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);
    const slots = await this.getAvailableSlots(entrevistadorId, startDate, endDate);
    return slots.filter(s => s.available).slice(0, count);
  },

  updateConfig(config: Partial<ScheduleConfig>) {
    this.config = { ...this.config, ...config };
  },
};

export default autoSchedulingService;
