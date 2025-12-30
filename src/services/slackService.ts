/**
 * Serviço de integração com Slack
 * Permite enviar notificações e mensagens para canais e usuários
 */

interface SlackConfig {
  webhookUrl?: string;
  botToken?: string;
  signingSecret?: string;
}

interface SlackMessage {
  channel: string;
  text: string;
  blocks?: SlackBlock[];
  attachments?: SlackAttachment[];
  thread_ts?: string;
}

interface SlackBlock {
  type: 'section' | 'divider' | 'header' | 'context' | 'actions';
  text?: { type: 'plain_text' | 'mrkdwn'; text: string };
  fields?: { type: 'mrkdwn'; text: string }[];
  accessory?: Record<string, unknown>;
  elements?: Record<string, unknown>[];
}

interface SlackAttachment {
  color?: string;
  pretext?: string;
  title?: string;
  text?: string;
  fields?: { title: string; value: string; short?: boolean }[];
  footer?: string;
  ts?: number;
}

interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  is_member: boolean;
}

class SlackService {
  private config: SlackConfig = {};

  configure(config: SlackConfig): void {
    this.config = config;
  }

  async sendMessage(message: SlackMessage): Promise<{ ok: boolean; ts?: string }> {
    if (!this.config.botToken) {
      throw new Error('Slack bot token não configurado');
    }

    // Em produção, fazer chamada real à API do Slack
    // const response = await fetch('https://slack.com/api/chat.postMessage', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.config.botToken}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(message),
    // });
    // return response.json();

    console.log('[SlackService] Enviando mensagem:', message);
    return { ok: true, ts: Date.now().toString() };
  }

  async sendWebhook(text: string, blocks?: SlackBlock[]): Promise<boolean> {
    if (!this.config.webhookUrl) {
      throw new Error('Slack webhook URL não configurado');
    }

    // Em produção:
    // await fetch(this.config.webhookUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text, blocks }),
    // });

    console.log('[SlackService] Enviando webhook:', { text, blocks });
    return true;
  }

  async listChannels(): Promise<SlackChannel[]> {
    // Mock - em produção chamar conversations.list
    return [
      { id: 'C001', name: 'general', is_private: false, is_member: true },
      { id: 'C002', name: 'recrutamento', is_private: true, is_member: true },
      { id: 'C003', name: 'vagas', is_private: false, is_member: true },
    ];
  }

  async notifyNewCandidate(channel: string, candidate: { name: string; position: string; source: string }): Promise<void> {
    await this.sendMessage({
      channel,
      text: `Novo candidato: ${candidate.name}`,
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '🎯 Novo Candidato!' },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Nome:*\n${candidate.name}` },
            { type: 'mrkdwn', text: `*Vaga:*\n${candidate.position}` },
            { type: 'mrkdwn', text: `*Fonte:*\n${candidate.source}` },
          ],
        },
      ],
    });
  }

  async notifyStageChange(channel: string, data: { candidate: string; from: string; to: string }): Promise<void> {
    await this.sendMessage({
      channel,
      text: `${data.candidate} avançou de ${data.from} para ${data.to}`,
      blocks: [
        {
          type: 'section',
          text: { type: 'mrkdwn', text: `📋 *${data.candidate}* mudou de etapa\n\n${data.from} → ${data.to}` },
        },
      ],
    });
  }

  verifySignature(signature: string, timestamp: string, body: string): boolean {
    if (!this.config.signingSecret) return false;
    // Implementar verificação HMAC SHA256 em produção
    return true;
  }
}

export const slackService = new SlackService();
