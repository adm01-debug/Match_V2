// Meeting Service

export interface Meeting {
  id?: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  location?: string;
  link?: string;
  type: 'presencial' | 'video' | 'telefone';
}

export const meetingService = {
  generateMeetingLink(type: 'google_meet' | 'teams' | 'zoom'): string {
    const id = crypto.randomUUID().slice(0, 12);
    switch (type) {
      case 'google_meet': return `https://meet.google.com/${id}`;
      case 'teams': return `https://teams.microsoft.com/l/meetup-join/${id}`;
      case 'zoom': return `https://zoom.us/j/${id}`;
      default: return '';
    }
  },

  calculateDuration(start: string, end: string): number {
    return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  },

  suggestTimeSlots(date: string, duration: number = 60): string[] {
    const slots = [];
    for (let h = 8; h <= 17; h++) {
      slots.push(`${date}T${String(h).padStart(2, '0')}:00:00`);
      if (duration <= 30) {
        slots.push(`${date}T${String(h).padStart(2, '0')}:30:00`);
      }
    }
    return slots;
  },
};
