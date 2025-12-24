/**
 * @fileoverview Serviço de integração com WhatsApp
 * @module whatsappService
 */

// Serviço de integração com WhatsApp
// Pode ser integrado com WhatsApp Business API, Twilio, ou Z-API

export interface WhatsAppMessage {
  to: string; // Número com código do país (ex: 5511999999999)
  message: string;
  type?: 'text' | 'template';
  templateName?: string;
  templateParams?: Record<string, string>;
}

export interface WhatsAppConfig {
  provider: 'business-api' | 'twilio' | 'z-api' | 'evolution';
  apiKey?: string;
  instanceId?: string;
  baseUrl?: string;
}

// Templates de mensagem pré-definidos
export const whatsappTemplates = {
  // Confirmação de candidatura
  candidaturaRecebida: (nome: string, vaga: string) => 
    `Olá ${nome}! 👋\n\nRecebemos sua candidatura para a vaga de *${vaga}*.\n\nEm breve nossa equipe entrará em contato.\n\n_Equipe de Recrutamento_`,

  // Lembrete de entrevista
  lembreteEntrevista: (nome: string, data: string, horario: string, tipo: string) =>
    `Olá ${nome}! 📅\n\nLembrete: Você tem uma entrevista agendada:\n\n📆 *Data:* ${data}\n⏰ *Horário:* ${horario}\n💼 *Tipo:* ${tipo}\n\nPor favor, confirme sua presença respondendo esta mensagem.\n\n_Equipe de Recrutamento_`,

  // Convite para próxima etapa
  proximaEtapa: (nome: string, etapa: string, instrucoes: string) =>
    `Parabéns ${nome}! 🎉\n\nVocê avançou para a próxima etapa: *${etapa}*\n\n${instrucoes}\n\n_Equipe de Recrutamento_`,

  // Feedback geral
  feedback: (nome: string, mensagem: string) =>
    `Olá ${nome}!\n\n${mensagem}\n\n_Equipe de Recrutamento_`,
};

// Formatar número de telefone para WhatsApp
export function formatPhoneForWhatsApp(phone: string): string {
  // Remove tudo que não é número
  const numbers = phone.replace(/\D/g, '');
  
  // Adiciona código do Brasil se não tiver
  if (numbers.length === 11) {
    return `55${numbers}`;
  }
  if (numbers.length === 10) {
    return `559${numbers}`; // Adiciona 9 para celular
  }
  
  return numbers;
}

// Gerar link wa.me (funciona sem API)
export function generateWhatsAppLink(phone: string, message: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

// Abrir WhatsApp Web/App
export function openWhatsApp(phone: string, message: string): void {
  const link = generateWhatsAppLink(phone, message);
  window.open(link, '_blank');
}

// Enviar via API (requer backend configurado)
export async function sendWhatsAppMessage(
  message: WhatsAppMessage
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Falha ao enviar mensagem WhatsApp');
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error);
    return { success: false, error: String(error) };
  }
}

// Hook simplificado para uso nos componentes
export function useWhatsApp() {
  const sendMessage = (phone: string, message: string, useApi = false) => {
    if (useApi) {
      return sendWhatsAppMessage({ to: formatPhoneForWhatsApp(phone), message });
    }
    // Fallback: abre WhatsApp Web/App
    openWhatsApp(phone, message);
    return Promise.resolve({ success: true });
  };

  return { sendMessage, openWhatsApp, generateWhatsAppLink };
}
