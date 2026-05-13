import { apiLogger } from './logger';

// Outlook/Microsoft Calendar Integration Service

export const outlookService = {
  async createEvent(event: { subject: string; start: string; end: string; attendees?: string[] }) {
    apiLogger.info('Create event', { event });
    return { success: false, message: 'Outlook not configured' };
  },

  async updateEvent(eventId: string, updates: Record<string, unknown>) {
    apiLogger.info('Update event', { eventId, updates });
    return { success: false };
  },

  async deleteEvent(eventId: string) {
    apiLogger.info('Delete event', { eventId });
    return { success: false };
  },

  async checkAvailability(email: string, start: string, end: string) {
    apiLogger.info('Check availability', { email, start, end });
    return { available: true };
  },

  isConfigured: () => false,
};