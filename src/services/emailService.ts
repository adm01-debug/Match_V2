/**
 * @fileoverview Serviço de envio de emails
 * @module emailService
 * @note Implementa rate limiting e validação para produção
 */

export interface EmailTemplate {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string; // Base64
  contentType: string;
}

export interface EmailConfig {
  provider: 'resend' | 'sendgrid' | 'smtp';
  apiKey?: string;
  from: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Regex para validação de email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiting simples
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const RATE_LIMIT_MAX = 10; // máximo de emails por janela

class EmailServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'EMAIL_ERROR'
  ) {
    super(message);
    this.name = 'EmailServiceError';
  }
}

// Sanitizar texto para prevenir XSS em emails
function sanitizeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Validar email
function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

// Verificar rate limit
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const key = `email_${identifier}`;
  const lastSent = rateLimitMap.get(key) ?? 0;
  const count = rateLimitMap.get(`${key}_count`) ?? 0;
  
  if (now - lastSent > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(key, now);
    rateLimitMap.set(`${key}_count`, 1);
    return true;
  }
  
  if (count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  rateLimitMap.set(`${key}_count`, count + 1);
  return true;
}

// Templates de email pré-definidos
export const emailTemplates = {
  // Confirmação de candidatura
  candidaturaRecebida: (nome: string, vaga: string) => ({
    subject: `Candidatura Recebida - ${sanitizeText(vaga)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Olá ${sanitizeText(nome)}!</h2>
        <p>Recebemos sua candidatura para a vaga de <strong>${sanitizeText(vaga)}</strong>.</p>
        <p>Nossa equipe irá analisar seu perfil e entraremos em contato em breve.</p>
        <br>
        <p>Atenciosamente,<br>Equipe de Recrutamento</p>
      </div>
    `,
    text: `Olá ${nome}!\n\nRecebemos sua candidatura para a vaga de ${vaga}.\n\nNossa equipe irá analisar seu perfil e entraremos em contato em breve.\n\nAtenciosamente,\nEquipe de Recrutamento`,
  }),

  // Convite para entrevista
  conviteEntrevista: (nome: string, vaga: string, data: string, tipo: string, link?: string) => ({
    subject: `Convite para Entrevista - ${sanitizeText(vaga)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Parabéns ${sanitizeText(nome)}!</h2>
        <p>Você foi selecionado(a) para a próxima etapa do processo seletivo para <strong>${sanitizeText(vaga)}</strong>.</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Data:</strong> ${sanitizeText(data)}</p>
          <p><strong>Tipo:</strong> ${sanitizeText(tipo)}</p>
          ${link ? `<p><strong>Link:</strong> <a href="${sanitizeText(link)}">${sanitizeText(link)}</a></p>` : ''}
        </div>
        <p>Por favor, confirme sua disponibilidade respondendo este e-mail.</p>
        <br>
        <p>Atenciosamente,<br>Equipe de Recrutamento</p>
      </div>
    `,
    text: `Parabéns ${nome}!\n\nVocê foi selecionado(a) para a próxima etapa do processo seletivo para ${vaga}.\n\nData: ${data}\nTipo: ${tipo}${link ? `\nLink: ${link}` : ''}\n\nPor favor, confirme sua disponibilidade respondendo este e-mail.\n\nAtenciosamente,\nEquipe de Recrutamento`,
  }),

  // Resultado positivo
  aprovacao: (nome: string, vaga: string) => ({
    subject: `Ótimas Notícias! - ${sanitizeText(vaga)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22c55e;">Parabéns ${sanitizeText(nome)}! 🎉</h2>
        <p>Temos o prazer de informar que você foi <strong>aprovado(a)</strong> no processo seletivo para <strong>${sanitizeText(vaga)}</strong>!</p>
        <p>Em breve entraremos em contato com os próximos passos e detalhes da proposta.</p>
        <br>
        <p>Bem-vindo(a) ao time!<br>Equipe de Recrutamento</p>
      </div>
    `,
    text: `Parabéns ${nome}! 🎉\n\nTemos o prazer de informar que você foi aprovado(a) no processo seletivo para ${vaga}!\n\nEm breve entraremos em contato com os próximos passos e detalhes da proposta.\n\nBem-vindo(a) ao time!\nEquipe de Recrutamento`,
  }),

  // Feedback negativo
  reprovacao: (nome: string, vaga: string) => ({
    subject: `Resultado do Processo Seletivo - ${sanitizeText(vaga)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Olá ${sanitizeText(nome)},</h2>
        <p>Agradecemos seu interesse e participação no processo seletivo para <strong>${sanitizeText(vaga)}</strong>.</p>
        <p>Após cuidadosa análise, decidimos seguir com outros candidatos para esta posição.</p>
        <p>Manteremos seu currículo em nosso banco de talentos para futuras oportunidades.</p>
        <br>
        <p>Desejamos sucesso em sua trajetória!<br>Equipe de Recrutamento</p>
      </div>
    `,
    text: `Olá ${nome},\n\nAgradecemos seu interesse e participação no processo seletivo para ${vaga}.\n\nApós cuidadosa análise, decidimos seguir com outros candidatos para esta posição.\n\nManteremos seu currículo em nosso banco de talentos para futuras oportunidades.\n\nDesejamos sucesso em sua trajetória!\nEquipe de Recrutamento`,
  }),
};

// Validar template de email
function validateEmailTemplate(template: EmailTemplate): void {
  const recipients = Array.isArray(template.to) ? template.to : [template.to];
  
  if (recipients.length === 0) {
    throw new EmailServiceError('Destinatário é obrigatório', 'VALIDATION_ERROR');
  }
  
  for (const email of recipients) {
    if (!isValidEmail(email)) {
      throw new EmailServiceError(`Email inválido: ${email}`, 'VALIDATION_ERROR');
    }
  }
  
  if (!template.subject?.trim()) {
    throw new EmailServiceError('Assunto é obrigatório', 'VALIDATION_ERROR');
  }
  
  if (!template.html?.trim() && !template.text?.trim()) {
    throw new EmailServiceError('Conteúdo do email é obrigatório', 'VALIDATION_ERROR');
  }
  
  if (template.cc) {
    for (const email of template.cc) {
      if (!isValidEmail(email)) {
        throw new EmailServiceError(`Email CC inválido: ${email}`, 'VALIDATION_ERROR');
      }
    }
  }
  
  if (template.bcc) {
    for (const email of template.bcc) {
      if (!isValidEmail(email)) {
        throw new EmailServiceError(`Email BCC inválido: ${email}`, 'VALIDATION_ERROR');
      }
    }
  }
}

// Retry com exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[EmailService] Attempt ${attempt}/${maxRetries} failed:`, lastError.message);
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Função principal para enviar email
export async function sendEmail(template: EmailTemplate): Promise<SendEmailResult> {
  try {
    // Validar template
    validateEmailTemplate(template);
    
    // Verificar rate limit
    const recipient = Array.isArray(template.to) ? template.to[0] : template.to;
    if (!recipient || !checkRateLimit(recipient)) {
      return { 
        success: false, 
        error: 'Rate limit excedido. Aguarde um momento antes de enviar novamente.' 
      };
    }
    
    // Enviar com retry
    const result = await withRetry(async () => {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new EmailServiceError(
          (errorData as { message?: string }).message ?? `HTTP ${response.status}: ${response.statusText}`,
          'API_ERROR'
        );
      }

      const data = await response.json();
      return data;
    });

    return { 
      success: true, 
      messageId: result.messageId 
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('[EmailService] Erro ao enviar email:', message);
    return { 
      success: false, 
      error: message 
    };
  }
}

// Enviar email em lote
export async function sendBulkEmails(
  templates: EmailTemplate[],
  options?: { concurrency?: number }
): Promise<SendEmailResult[]> {
  const { concurrency = 3 } = options ?? {};
  const results: SendEmailResult[] = [];
  
  for (let i = 0; i < templates.length; i += concurrency) {
    const batch = templates.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(sendEmail));
    results.push(...batchResults);
    
    // Pequeno delay entre batches para evitar sobrecarga
    if (i + concurrency < templates.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return results;
}
