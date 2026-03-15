// Google Calendar Integration Service

export const googleCalendarService = {
  async createEvent(event: { summary: string; start: string; end: string; attendees?: string[]; description?: string }) {
    console.log('[GoogleCalendar] Create event:', event);
    return { success: false, message: 'Google Calendar not configured' };
  },

  async updateEvent(eventId: string, updates: Record<string, unknown>) {
    console.log('[GoogleCalendar] Update event:', eventId, updates);
    return { success: false };
  },

  async deleteEvent(eventId: string) {
    console.log('[GoogleCalendar] Delete event:', eventId);
    return { success: false };
  },

  async checkAvailability(email: string, start: string, end: string) {
    console.log('[GoogleCalendar] Check availability:', email, start, end);
    return { available: true };
  },

  async listEvents(start: string, end: string) {
    console.log('[GoogleCalendar] List events:', start, end);
    return [];
  },

  isConfigured: () => !!import.meta.env.VITE_GOOGLE_CLIENT_ID,
};
