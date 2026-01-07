/**
 * Serviço de integração com Microsoft Teams
 * Permite enviar notificações e cards adaptáveis
 */

interface TeamsConfig {
  webhookUrl?: string;
  tenantId?: string;
  clientId?: string;
  clientSecret?: string;
}

interface TeamsAdaptiveCard {
  type: 'AdaptiveCard';
  version: string;
  body: TeamsCardElement[];
  actions?: TeamsCardAction[];
}

interface TeamsCardElement {
  type: 'TextBlock' | 'Image' | 'ColumnSet' | 'FactSet' | 'Container';
  text?: string;
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  weight?: 'lighter' | 'default' | 'bolder';
  color?: 'default' | 'accent' | 'good' | 'warning' | 'attention';
  wrap?: boolean;
  facts?: { title: string; value: string }[];
  columns?: { type: 'Column'; width: string; items: TeamsCardElement[] }[];
}

interface TeamsCardAction {
  type: 'Action.OpenUrl' | 'Action.Submit';
  title: string;
  url?: string;
  data?: Record<string, unknown>;
}

// TeamsChannel interface for future use
// interface TeamsChannel {
//   id: string;
//   displayName: string;
//   description?: string;
// }

class TeamsService {
  private config: TeamsConfig = {};

  configure(config: TeamsConfig): void {
    this.config = config;
  }

  async sendWebhookCard(card: TeamsAdaptiveCard): Promise<boolean> {
    if (!this.config.webhookUrl) {
      throw new Error('Teams webhook URL não configurado');
    }

    const payload = {
      type: 'message',
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.adaptive',
          content: card,
        },
      ],
    };

    // Em produção:
    // await fetch(this.config.webhookUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // });

    console.log('[TeamsService] Enviando card:', payload);
    return true;
  }

  async sendTextMessage(text: string): Promise<boolean> {
    if (!this.config.webhookUrl) {
      throw new Error('Teams webhook URL não configurado');
    }

    // Em produção:
    // await fetch(this.config.webhookUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text }),
    // });

    console.log('[TeamsService] Enviando texto:', text);
    return true;
  }

  createCandidateCard(candidate: { name: string; position: string; source: string; score?: number }): TeamsAdaptiveCard {
    return {
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'TextBlock',
          text: '🎯 Novo Candidato!',
          size: 'large',
          weight: 'bolder',
          color: 'accent',
        },
        {
          type: 'FactSet',
          facts: [
            { title: 'Nome', value: candidate.name },
            { title: 'Vaga', value: candidate.position },
            { title: 'Fonte', value: candidate.source },
            ...(candidate.score ? [{ title: 'Score', value: `${candidate.score}%` }] : []),
          ],
        },
      ],
      actions: [
        { type: 'Action.OpenUrl', title: 'Ver Perfil', url: '#' },
      ],
    };
  }

  createInterviewCard(interview: { candidate: string; date: string; interviewer: string; type: string }): TeamsAdaptiveCard {
    return {
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'TextBlock',
          text: '📅 Entrevista Agendada',
          size: 'large',
          weight: 'bolder',
        },
        {
          type: 'FactSet',
          facts: [
            { title: 'Candidato', value: interview.candidate },
            { title: 'Data/Hora', value: interview.date },
            { title: 'Entrevistador', value: interview.interviewer },
            { title: 'Tipo', value: interview.type },
          ],
        },
      ],
      actions: [
        { type: 'Action.OpenUrl', title: 'Ver Detalhes', url: '#' },
        { type: 'Action.OpenUrl', title: 'Adicionar ao Calendário', url: '#' },
      ],
    };
  }

  async notifyNewCandidate(candidate: { name: string; position: string; source: string }): Promise<void> {
    const card = this.createCandidateCard(candidate);
    await this.sendWebhookCard(card);
  }

  async notifyInterview(interview: { candidate: string; date: string; interviewer: string; type: string }): Promise<void> {
    const card = this.createInterviewCard(interview);
    await this.sendWebhookCard(card);
  }
}

export const teamsService = new TeamsService();
