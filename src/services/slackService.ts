import { apiLogger } from './logger';

// Slack Integration Service

export const slackService = {
  async sendMessage(channel: string, message: string) {
    apiLogger.info('Send to channel', { channel, message });
    return { success: false, message: 'Slack not configured' };
  },

  async notifyNewCandidate(candidatoNome: string, vagaTitulo: string) {
    return this.sendMessage('#recrutamento', `🆕 Novo candidato: ${candidatoNome} para ${vagaTitulo}`);
  },

  async notifyStageChange(candidatoNome: string, novaEtapa: string) {
    return this.sendMessage('#recrutamento', `📋 ${candidatoNome} moveu para: ${novaEtapa}`);
  },

  async listChannels() {
    return [];
  },

  isConfigured: () => !!import.meta.env['VITE_SLACK_CLIENT_ID'],
};