/**
 * Serviço de integração com Slack
 * Permite enviar notificações e mensagens para canais e usuários
 */

import * as crypto from 'crypto';

export interface SlackConfig {
  webhookUrl?: string;
  botToken?: string;
  signingSecret?: string;
}

export interface SlackMessage {
  channel: string;
  text: string;
  blocks?: SlackBlock[];
  attachments?: SlackAttachment[];
  thread_ts?: string;
}

export interface SlackBlock {
  type: 'section' | 'divider' | 'header' | 'context' | 'actions';
  text?: { type: 'plain_text' | 'mrkdwn'; text: string };
  fields?: { type: 'mrkdwn'; text: string }[];
  accessory?: Record<string, unknown>;
  elements?: Record<string, unknown>[];
}

export interface SlackAttachment {
  color?: string;
  pretext?: string;
  title?: string;
  text?: string;
  fields?: { title: string; value: string; short?: boolean }[];
  footer?: string;
  ts?: number;
}

export interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  is_member: boolean;
}

export interface SlackResponse {
  ok: boolean;
  ts?: string;
  error?: string;
  channel?: string;
}

class SlackServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'SLACK_ERROR',
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'SlackServiceError';
  }
}

class SlackService {
  private config: SlackConfig = {};
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  configure(config: SlackConfig): void {
    this.config = config;
  }

  isConfigured(): boolean {
    return !!(this.config.botToken || this.config.webhookUrl);
  }

  private validateMessage(message: SlackMessage): void {
    if (!message.channel?.trim()) {
      throw new SlackServiceError('Canal é obrigatório', 'VALIDATION_ERROR');
    }
    if (!message.text?.trim() && !message.blocks?.length) {
      throw new SlackServiceError('Texto ou blocks são obrigatórios', 'VALIDATION_ERROR');
    }
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    retries = this.MAX_RETRIES
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`[SlackService] Attempt ${attempt}/${retries} failed:`, lastError.message);
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt));
        }
      }
    }
    
    throw lastError;
  }

  async sendMessage(message: SlackMessage): Promise<SlackResponse> {
    if (!this.config.botToken) {
      throw new SlackServiceError('Slack bot token não configurado', 'NOT_CONFIGURED');
    }

    this.validateMessage(message);

    return this.withRetry(async () => {
      // Em produção, fazer chamada real à API do Slack
      // const response = await fetch('https://slack.com/api/chat.postMessage', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.config.botToken}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(message),
      // });
      // const data = await response.json();
      // if (!data.ok) {
      //   throw new SlackServiceError(data.error || 'Unknown Slack error', 'API_ERROR');
      // }
      // return data;

      console.log('[SlackService] Enviando mensagem:', message);
      return { ok: true, ts: Date.now().toString(), channel: message.channel };
    });
  }

  async sendWebhook(text: string, blocks?: SlackBlock[]): Promise<boolean> {
    if (!this.config.webhookUrl) {
      throw new SlackServiceError('Slack webhook URL não configurado', 'NOT_CONFIGURED');
    }

    if (!text?.trim() && !blocks?.length) {
      throw new SlackServiceError('Texto ou blocks são obrigatórios', 'VALIDATION_ERROR');
    }

    return this.withRetry(async () => {
      // Em produção:
      // const response = await fetch(this.config.webhookUrl!, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text, blocks }),
      // });
      // if (!response.ok) {
      //   throw new SlackServiceError(`Webhook failed: ${response.statusText}`, 'WEBHOOK_ERROR');
      // }
      // return true;

      console.log('[SlackService] Enviando webhook:', { text, blocks });
      return true;
    });
  }

  async listChannels(): Promise<SlackChannel[]> {
    if (!this.config.botToken) {
      throw new SlackServiceError('Slack bot token não configurado', 'NOT_CONFIGURED');
    }

    return this.withRetry(async () => {
      // Mock - em produção chamar conversations.list
      return [
        { id: 'C001', name: 'general', is_private: false, is_member: true },
        { id: 'C002', name: 'recrutamento', is_private: true, is_member: true },
        { id: 'C003', name: 'vagas', is_private: false, is_member: true },
      ];
    });
  }

  async notifyNewCandidate(
    channel: string, 
    candidate: { name: string; position: string; source: string; url?: string }
  ): Promise<SlackResponse> {
    const blocks: SlackBlock[] = [
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
    ];

    if (candidate.url) {
      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: `<${candidate.url}|Ver candidato>` },
      });
    }

    return this.sendMessage({
      channel,
      text: `Novo candidato: ${candidate.name} para ${candidate.position}`,
      blocks,
    });
  }

  async notifyStageChange(
    channel: string, 
    data: { candidate: string; from: string; to: string; recruiter?: string }
  ): Promise<SlackResponse> {
    const blocks: SlackBlock[] = [
      {
        type: 'section',
        text: { 
          type: 'mrkdwn', 
          text: `📋 *${data.candidate}* mudou de etapa\n\n${data.from} → ${data.to}${data.recruiter ? `\n\nPor: ${data.recruiter}` : ''}` 
        },
      },
    ];

    return this.sendMessage({
      channel,
      text: `${data.candidate} avançou de ${data.from} para ${data.to}`,
      blocks,
    });
  }

  async notifyInterviewScheduled(
    channel: string,
    data: { candidate: string; position: string; dateTime: Date; interviewer: string }
  ): Promise<SlackResponse> {
    const formattedDate = data.dateTime.toLocaleString('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'short',
    });

    return this.sendMessage({
      channel,
      text: `Entrevista agendada: ${data.candidate} para ${data.position}`,
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '📅 Entrevista Agendada' },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Candidato:*\n${data.candidate}` },
            { type: 'mrkdwn', text: `*Vaga:*\n${data.position}` },
            { type: 'mrkdwn', text: `*Data/Hora:*\n${formattedDate}` },
            { type: 'mrkdwn', text: `*Entrevistador:*\n${data.interviewer}` },
          ],
        },
      ],
    });
  }

  verifySignature(signature: string, timestamp: string, body: string): boolean {
    if (!this.config.signingSecret) {
      console.warn('[SlackService] Signing secret não configurado');
      return false;
    }

    try {
      // Verificar se timestamp não é muito antigo (5 minutos)
      const requestTimestamp = parseInt(timestamp, 10);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      
      if (Math.abs(currentTimestamp - requestTimestamp) > 60 * 5) {
        console.warn('[SlackService] Timestamp muito antigo');
        return false;
      }

      const sigBasestring = `v0:${timestamp}:${body}`;
      const mySignature = 'v0=' + crypto
        .createHmac('sha256', this.config.signingSecret)
        .update(sigBasestring)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(mySignature),
        Buffer.from(signature)
      );
    } catch (error) {
      console.error('[SlackService] Erro na verificação de assinatura:', error);
      return false;
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.config.botToken && !this.config.webhookUrl) {
      return { success: false, message: 'Nenhuma configuração definida' };
    }

    try {
      if (this.config.botToken) {
        await this.listChannels();
      }
      return { success: true, message: 'Conexão estabelecida com sucesso' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return { success: false, message };
    }
  }

  disconnect(): void {
    this.config = {};
  }
}

export const slackService = new SlackService();
