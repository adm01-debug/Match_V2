// Meeting Service for Zoom and Google Meet integration
export type MeetingProvider = 'zoom' | 'google_meet' | 'teams';

export interface MeetingDetails {
  id: string;
  provider: MeetingProvider;
  joinUrl: string;
  hostUrl?: string;
  password?: string;
  startTime: string;
  duration: number;
  topic: string;
}

export interface CreateMeetingParams {
  topic: string;
  startTime: string;
  duration: number;
  attendees?: string[];
  provider?: MeetingProvider;
}

const ZOOM_API_KEY = import.meta.env.VITE_ZOOM_API_KEY;
const ZOOM_API_SECRET = import.meta.env.VITE_ZOOM_API_SECRET;

class MeetingService {
  private defaultProvider: MeetingProvider = 'google_meet';

  setDefaultProvider(provider: MeetingProvider): void {
    this.defaultProvider = provider;
  }

  async createMeeting(params: CreateMeetingParams): Promise<MeetingDetails> {
    const provider = params.provider || this.defaultProvider;

    switch (provider) {
      case 'zoom':
        return this.createZoomMeeting(params);
      case 'google_meet':
        return this.createGoogleMeet(params);
      case 'teams':
        return this.createTeamsMeeting(params);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  private async createZoomMeeting(params: CreateMeetingParams): Promise<MeetingDetails> {
    if (!ZOOM_API_KEY || !ZOOM_API_SECRET) {
      throw new Error('Zoom not configured');
    }

    // In production, this would call Zoom API
    // For now, return mock data
    const meetingId = Math.random().toString(36).substring(7);
    
    return {
      id: meetingId,
      provider: 'zoom',
      joinUrl: `https://zoom.us/j/${meetingId}`,
      hostUrl: `https://zoom.us/s/${meetingId}`,
      password: Math.random().toString(36).substring(2, 8),
      startTime: params.startTime,
      duration: params.duration,
      topic: params.topic,
    };
  }

  private async createGoogleMeet(params: CreateMeetingParams): Promise<MeetingDetails> {
    // Google Meet links are created via Calendar API with conferenceData
    const meetingId = Math.random().toString(36).substring(2, 12);
    
    return {
      id: meetingId,
      provider: 'google_meet',
      joinUrl: `https://meet.google.com/${meetingId}`,
      startTime: params.startTime,
      duration: params.duration,
      topic: params.topic,
    };
  }

  private async createTeamsMeeting(params: CreateMeetingParams): Promise<MeetingDetails> {
    const meetingId = Math.random().toString(36).substring(7);
    
    return {
      id: meetingId,
      provider: 'teams',
      joinUrl: `https://teams.microsoft.com/l/meetup-join/${meetingId}`,
      startTime: params.startTime,
      duration: params.duration,
      topic: params.topic,
    };
  }

  async deleteMeeting(meetingId: string, provider: MeetingProvider): Promise<void> {
    // Implementation would call respective API
    // Deleting meeting silently
  }

  async updateMeeting(meetingId: string, provider: MeetingProvider, updates: Partial<CreateMeetingParams>): Promise<MeetingDetails> {
    // Implementation would call respective API
    return {
      id: meetingId,
      provider,
      joinUrl: '',
      startTime: updates.startTime || new Date().toISOString(),
      duration: updates.duration || 30,
      topic: updates.topic || '',
    };
  }

  generateMeetingLink(provider: MeetingProvider = 'google_meet'): string {
    const id = Math.random().toString(36).substring(2, 12);
    
    switch (provider) {
      case 'zoom':
        return `https://zoom.us/j/${id}`;
      case 'google_meet':
        return `https://meet.google.com/${id}`;
      case 'teams':
        return `https://teams.microsoft.com/l/meetup-join/${id}`;
      default:
        return `https://meet.google.com/${id}`;
    }
  }
}

export const meetingService = new MeetingService();
export default meetingService;

