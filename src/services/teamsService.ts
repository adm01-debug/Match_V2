// Microsoft Teams Integration Service

export const teamsService = {
  async sendMessage(channelId: string, message: string) {
    console.log('[TeamsService] Send to channel:', channelId, message);
    return { success: false, message: 'Teams not configured' };
  },

  async createMeeting(subject: string, startTime: string, endTime: string, attendees: string[]) {
    console.log('[TeamsService] Create meeting:', subject, startTime, endTime, attendees);
    return { success: false, message: 'Teams not configured' };
  },

  async notifyNewCandidate(candidatoNome: string, vagaTitulo: string) {
    return this.sendMessage('general', `🆕 Novo candidato: ${candidatoNome} para ${vagaTitulo}`);
  },

  isConfigured: () => !!import.meta.env.VITE_TEAMS_CLIENT_ID,
};
