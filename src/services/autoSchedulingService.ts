// Auto-Scheduling Service

import { meetingService } from './meetingService';

export const autoSchedulingService = {
  async findBestSlot(
    candidateAvailability: string[],
    interviewerAvailability: string[],
    _duration: number = 60
  ): Promise<string | null> {
    void _duration;
    const overlap = candidateAvailability.filter((slot) => interviewerAvailability.includes(slot));
    return overlap.length > 0 ? (overlap[0] ?? null) : null;
  },

  async suggestSlots(date: string, _interviewerIds: string[], duration: number = 60) {
    void _interviewerIds;
    const allSlots = meetingService.suggestTimeSlots(date, duration);
    return allSlots.slice(0, 5);
  },

  async autoSchedule(
    _candidatoId: string,
    _vagaId: string,
    interviewerIds: string[],
    preferredDates: string[]
  ) {
    void _candidatoId;
    void _vagaId;
    for (const date of preferredDates) {
      const slots = await this.suggestSlots(date, interviewerIds);
      if (slots.length > 0) {
        return { date, time: slots[0], available: true };
      }
    }
    return { available: false };
  },
};
