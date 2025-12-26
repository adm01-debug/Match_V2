// Google Calendar Integration Service
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

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

class GoogleCalendarServiceImpl implements GoogleCalendarService {
  private gapi: any = null;
  private tokenClient: any = null;
  isAuthenticated = false;

  async init(): Promise<void> {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_API_KEY) {
      console.warn('Google Calendar not configured');
      return;
    }

    // Load Google API
    await this.loadGoogleAPI();
    await this.initGapi();
    await this.initTokenClient();
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
        await window.gapi.client.init({
          apiKey: GOOGLE_API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        });
        this.gapi = window.gapi;
        resolve();
      });
    });
  }

  private async initTokenClient(): Promise<void> {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    document.body.appendChild(script);

    await new Promise((resolve) => (script.onload = resolve));

    this.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar',
      callback: (response: any) => {
        if (response.access_token) {
          this.isAuthenticated = true;
        }
      },
    });
  }

  async signIn(): Promise<void> {
    if (!this.tokenClient) await this.init();
    this.tokenClient.requestAccessToken({ prompt: 'consent' });
  }

  async signOut(): Promise<void> {
    const token = this.gapi?.client?.getToken();
    if (token) {
      window.google.accounts.oauth2.revoke(token.access_token);
      this.gapi.client.setToken(null);
    }
    this.isAuthenticated = false;
  }

  async listEvents(calendarId = 'primary', maxResults = 10): Promise<CalendarEvent[]> {
    if (!this.isAuthenticated) throw new Error('Not authenticated');

    const response = await this.gapi.client.calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults,
      orderBy: 'startTime',
    });

    return response.result.items;
  }

  async createEvent(event: CalendarEvent, calendarId = 'primary'): Promise<CalendarEvent> {
    if (!this.isAuthenticated) throw new Error('Not authenticated');

    const response = await this.gapi.client.calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      resource: event,
    });

    return response.result;
  }

  async updateEvent(eventId: string, event: Partial<CalendarEvent>, calendarId = 'primary'): Promise<CalendarEvent> {
    if (!this.isAuthenticated) throw new Error('Not authenticated');

    const response = await this.gapi.client.calendar.events.patch({
      calendarId,
      eventId,
      resource: event,
    });

    return response.result;
  }

  async deleteEvent(eventId: string, calendarId = 'primary'): Promise<void> {
    if (!this.isAuthenticated) throw new Error('Not authenticated');

    await this.gapi.client.calendar.events.delete({
      calendarId,
      eventId,
    });
  }

  async checkAvailability(start: string, end: string): Promise<boolean> {
    if (!this.isAuthenticated) return true;

    const events = await this.listEvents('primary', 100);
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    return !events.some((event) => {
      const eventStart = new Date(event.start.dateTime).getTime();
      const eventEnd = new Date(event.end.dateTime).getTime();
      return (startTime < eventEnd && endTime > eventStart);
    });
  }
}

export const googleCalendarService = new GoogleCalendarServiceImpl();
export default googleCalendarService;

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}
