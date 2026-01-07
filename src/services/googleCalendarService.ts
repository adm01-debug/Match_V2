/**
 * Google Calendar Integration Service
 * @module services/googleCalendarService
 */

const GOOGLE_CLIENT_ID = import.meta.env['VITE_GOOGLE_CLIENT_ID'] as string | undefined;
const GOOGLE_API_KEY = import.meta.env['VITE_GOOGLE_API_KEY'] as string | undefined;

interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone?: string };
  end: { dateTime: string; timeZone?: string };
  attendees?: { email: string }[];
  conferenceData?: { createRequest?: { requestId: string } };
}

interface GoogleCalendarService {
  isAuthenticated: boolean;
  init: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  listEvents: (calendarId?: string, maxResults?: number) => Promise<CalendarEvent[]>;
  createEvent: (event: CalendarEvent, calendarId?: string) => Promise<CalendarEvent>;
  updateEvent: (eventId: string, event: Partial<CalendarEvent>, calendarId?: string) => Promise<CalendarEvent>;
  deleteEvent: (eventId: string, calendarId?: string) => Promise<void>;
  checkAvailability: (start: string, end: string) => Promise<boolean>;
}

// Type for GAPI client (minimal typing)
interface GapiClient {
  load: (api: string, callback: () => void) => void;
  client: {
    init: (config: Record<string, unknown>) => Promise<void>;
    getToken: () => { access_token: string } | null;
    setToken: (token: null) => void;
    calendar: {
      events: {
        list: (params: Record<string, unknown>) => Promise<{ result: { items: CalendarEvent[] } }>;
        insert: (params: Record<string, unknown>) => Promise<{ result: CalendarEvent }>;
        patch: (params: Record<string, unknown>) => Promise<{ result: CalendarEvent }>;
        delete: (params: Record<string, unknown>) => Promise<void>;
      };
    };
  };
}

class GoogleCalendarServiceImpl implements GoogleCalendarService {
  private gapi: GapiClient | null = null;
  private tokenClient: { requestAccessToken: (opts: { prompt: string }) => void } | null = null;
  isAuthenticated = false;

  async init(): Promise<void> {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_API_KEY) {
      return;
    }

    try {
      await this.loadGoogleAPI();
      await this.initGapi();
      await this.initTokenClient();
    } catch {
      // Initialization failed - service unavailable
    }
  }

  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  private async initGapi(): Promise<void> {
    return new Promise((resolve) => {
      window.gapi.load('client', async () => {
        try {
          await window.gapi.client.init({
            apiKey: GOOGLE_API_KEY,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          });
          this.gapi = window.gapi as GapiClient;
          resolve();
        } catch {
          resolve();
        }
      });
    });
  }

  private async initTokenClient(): Promise<void> {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    document.body.appendChild(script);

    await new Promise((resolve) => (script.onload = resolve));

    try {
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar',
        callback: (response: { access_token?: string }) => {
          if (response.access_token) {
            this.isAuthenticated = true;
          }
        },
      });
    } catch {
      // Token client init failed
    }
  }

  async signIn(): Promise<void> {
    try {
      if (!this.tokenClient) await this.init();
      this.tokenClient?.requestAccessToken({ prompt: 'consent' });
    } catch {
      throw new Error('Failed to sign in');
    }
  }

  async signOut(): Promise<void> {
    try {
      const token = this.gapi?.client?.getToken();
      if (token) {
        window.google.accounts.oauth2.revoke(token.access_token);
        this.gapi?.client.setToken(null);
      }
      this.isAuthenticated = false;
    } catch {
      this.isAuthenticated = false;
    }
  }

  async listEvents(calendarId = 'primary', maxResults = 10): Promise<CalendarEvent[]> {
    if (!this.isAuthenticated || !this.gapi) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await this.gapi.client.calendar.events.list({
        calendarId,
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults,
        orderBy: 'startTime',
      });

      return response.result.items;
    } catch {
      throw new Error('Failed to list events');
    }
  }

  async createEvent(event: CalendarEvent, calendarId = 'primary'): Promise<CalendarEvent> {
    if (!this.isAuthenticated || !this.gapi) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await this.gapi.client.calendar.events.insert({
        calendarId,
        conferenceDataVersion: 1,
        resource: event,
      });

      return response.result;
    } catch {
      throw new Error('Failed to create event');
    }
  }

  async updateEvent(eventId: string, event: Partial<CalendarEvent>, calendarId = 'primary'): Promise<CalendarEvent> {
    if (!this.isAuthenticated || !this.gapi) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await this.gapi.client.calendar.events.patch({
        calendarId,
        eventId,
        resource: event,
      });

      return response.result;
    } catch {
      throw new Error('Failed to update event');
    }
  }

  async deleteEvent(eventId: string, calendarId = 'primary'): Promise<void> {
    if (!this.isAuthenticated || !this.gapi) {
      throw new Error('Not authenticated');
    }

    try {
      await this.gapi.client.calendar.events.delete({
        calendarId,
        eventId,
      });
    } catch {
      throw new Error('Failed to delete event');
    }
  }

  async checkAvailability(start: string, end: string): Promise<boolean> {
    if (!this.isAuthenticated) return true;

    try {
      const events = await this.listEvents('primary', 100);
      const startTime = new Date(start).getTime();
      const endTime = new Date(end).getTime();

      return !events.some((event) => {
        const eventStart = new Date(event.start.dateTime).getTime();
        const eventEnd = new Date(event.end.dateTime).getTime();
        return (startTime < eventEnd && endTime > eventStart);
      });
    } catch {
      return true;
    }
  }
}

export const googleCalendarService = new GoogleCalendarServiceImpl();
export default googleCalendarService;

declare global {
  interface Window {
    gapi: GapiClient;
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: Record<string, unknown>) => { requestAccessToken: (opts: { prompt: string }) => void };
          revoke: (token: string) => void;
        };
      };
    };
  }
}
