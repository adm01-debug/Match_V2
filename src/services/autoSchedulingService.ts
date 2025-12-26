import { supabase } from '@/integrations/supabase/client';

interface TimeSlot { start: Date; end: Date; available: boolean; }
interface ScheduleConfig { workingHours: { start: number; end: number }; slotDuration: number; bufferTime: number; workingDays: number[]; timezone: string; }
interface BookingRequest { candidatoId: string; entrevistadorId: string; vagaId: string; preferredSlots?: Date[]; duration: number; }

const DEFAULT_CONFIG: ScheduleConfig = { workingHours: { start: 9, end: 18 }, slotDuration: 60, bufferTime: 15, workingDays: [1, 2, 3, 4, 5], timezone: 'America/Sao_Paulo' };

export const autoSchedulingService = {
  config: DEFAULT_CONFIG,

  async getAvailableSlots(entrevistadorId: string, startDate: Date, endDate: Date): Promise<TimeSlot[]> {
    const slots: TimeSlot[] = [];
    const { data: existingEvents } = await supabase.from('entrevistas').select('data_hora, duracao_minutos').eq('entrevistador_id', entrevistadorId).gte('data_hora', startDate.toISOString()).lte('data_hora', endDate.toISOString());
    
    const busyTimes = (existingEvents || []).map(e => ({ start: new Date(e.data_hora), end: new Date(new Date(e.data_hora).getTime() + e.duracao_minutos * 60000) }));
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

  async findBestSlot(entrevistadorIds: string[], duration: number, preferredTimes?: Date[]): Promise<TimeSlot | null> {
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
      if (available.length > 0) return available[0];
    }
    return null;
  },

  async bookSlot(request: BookingRequest): Promise<{ success: boolean; entrevistaId?: string; error?: string }> {
    try {
      const slot = await this.findBestSlot([request.entrevistadorId], request.duration, request.preferredSlots);
      if (!slot) return { success: false, error: 'Nenhum horário disponível encontrado.' };

      const { data, error } = await supabase.from('entrevistas').insert({
        candidato_id: request.candidatoId,
        entrevistador_id: request.entrevistadorId,
        vaga_id: request.vagaId,
        data_hora: slot.start.toISOString(),
        duracao_minutos: request.duration,
        status: 'agendada',
        tipo: 'remota',
      }).select().single();

      if (error) throw error;
      return { success: true, entrevistaId: data.id };
    } catch (error: any) {
      return { success: false, error: error.message };
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
