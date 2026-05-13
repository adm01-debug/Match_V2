import { apiLogger } from './logger';

// Google Calendar Integration Service

export const googleCalendarService = {
  async createEvent(event: { summary: string; start: string; end: string; attendees?: string[]; description?: string }) {
    apiLogger.info('Create event', { event });
    return { success: false, message: 'Google Calendar not configured' };
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

  async listEvents(start: string, end: string) {
    apiLogger.info('List events', { start, end });
    return [];
  },

  isConfigured: () => !!import.meta.env['VITE_GOOGLE_CLIENT_ID'],
};