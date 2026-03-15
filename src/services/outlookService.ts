// Outlook/Microsoft Calendar Integration Service

export const outlookService = {
  async createEvent(event: { subject: string; start: string; end: string; attendees?: string[] }) {
    console.log('[OutlookService] Create event:', event);
    return { success: false, message: 'Outlook not configured' };
  },

  async updateEvent(eventId: string, updates: Record<string, unknown>) {
    console.log('[OutlookService] Update:', eventId, updates);
    return { success: false };
  },

  async deleteEvent(eventId: string) {
    console.log('[OutlookService] Delete:', eventId);
    return { success: false };
  },

  async checkAvailability(email: string, start: string, end: string) {
    console.log('[OutlookService] Availability:', email, start, end);
    return { available: true };
  },

  isConfigured: () => false,
};
