// Auto-Scheduling Service

import { meetingService } from './meetingService';

export const autoSchedulingService = {
  async findBestSlot(
    candidateAvailability: string[],
    interviewerAvailability: string[],
    duration: number = 60
  ): Promise<string | null> {
    const overlap = candidateAvailability.filter((slot) => interviewerAvailability.includes(slot));
    return overlap.length > 0 ? overlap[0] : null;
  },

  async suggestSlots(date: string, interviewerIds: string[], duration: number = 60) {
    const allSlots = meetingService.suggestTimeSlots(date, duration);
    // In production, check interviewer calendar availability
    return allSlots.slice(0, 5);
  },

  async autoSchedule(
    candidatoId: string,
    vagaId: string,
    interviewerIds: string[],
    preferredDates: string[]
  ) {
    for (const date of preferredDates) {
      const slots = await this.suggestSlots(date, interviewerIds);
      if (slots.length > 0) {
        return { date, time: slots[0], available: true };
      }
    }
    return { available: false };
  },
};
