/**
 * @note Consider implementing rate limiting for production
 * @see https://www.npmjs.com/package/p-throttle
 */

/**
 * @fileoverview Serviço de envio de emails
 * @module emailService
 */

// Serviço de Email
// Para usar: configure uma Edge Function com Resend ou SendGrid

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export interface EmailConfig {
  provider: 'resend' | 'sendgrid' | 'smtp';
  apiKey?: string;
  from: string;
}

// Templates de email pré-definidos
export const emailTemplates = {
  // Confirmação de candidatura
  candidaturaRecebida: (nome: string, vaga: string) => ({
    subject: `Candidatura Recebida - ${vaga}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Olá ${nome}!</h2>
        <p>Recebemos sua candidatura para a vaga de <strong>${vaga}</strong>.</p>
        <p>Nossa equipe irá analisar seu perfil e entraremos em contato em breve.</p>
        <br>
        <p>Atenciosamente,<br>Equipe de Recrutamento</p>
      </div>
    `,
  }),

  // Convite para entrevista
  conviteEntrevista: (nome: string, vaga: string, data: string, tipo: string, link?: string) => ({
    subject: `Convite para Entrevista - ${vaga}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Parabéns ${nome}!</h2>
        <p>Você foi selecionado(a) para a próxima etapa do processo seletivo para <strong>${vaga}</strong>.</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Data:</strong> ${data}</p>
          <p><strong>Tipo:</strong> ${tipo}</p>
          ${link ? `<p><strong>Link:</strong> <a href="${link}">${link}</a></p>` : ''}
        </div>
        <p>Por favor, confirme sua disponibilidade respondendo este e-mail.</p>
        <br>
        <p>Atenciosamente,<br>Equipe de Recrutamento</p>
      </div>
    `,
  }),

  // Resultado positivo
  aprovacao: (nome: string, vaga: string) => ({
    subject: `Ótimas Notícias! - ${vaga}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22c55e;">Parabéns ${nome}! 🎉</h2>
        <p>Temos o prazer de informar que você foi <strong>aprovado(a)</strong> no processo seletivo para <strong>${vaga}</strong>!</p>
        <p>Em breve entraremos em contato com os próximos passos e detalhes da proposta.</p>
        <br>
        <p>Bem-vindo(a) ao time!<br>Equipe de Recrutamento</p>
      </div>
    `,
  }),

  // Feedback negativo
  reprovacao: (nome: string, vaga: string) => ({
    subject: `Resultado do Processo Seletivo - ${vaga}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Olá ${nome},</h2>
        <p>Agradecemos seu interesse e participação no processo seletivo para <strong>${vaga}</strong>.</p>
        <p>Após cuidadosa análise, decidimos seguir com outros candidatos para esta posição.</p>
        <p>Manteremos seu currículo em nosso banco de talentos para futuras oportunidades.</p>
        <br>
        <p>Desejamos sucesso em sua trajetória!<br>Equipe de Recrutamento</p>
      </div>
    `,
  }),
};

// Função para enviar email via Edge Function
export async function sendEmail(template: EmailTemplate): Promise<{ success: boolean; error?: string }> {
  try {
    // Chamaria a Edge Function do Supabase
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      throw new Error('Falha ao enviar email');
    }

    return { success: true };
  } catch (error) {
    // Error logged: Erro ao enviar email:
    return { success: false, error: String(error) };
  }
}
