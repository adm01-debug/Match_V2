/**
 * @fileoverview WhatsApp Service — integração via Evolution API
 * @description Serviço frontend para envio de mensagens WhatsApp
 */

import { supabase } from '@/integrations/supabase/client';
import { evolutionMessages } from './evolutionApiService';

function formatPhone(phone: string): string {
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length === 11) return `55${numbers}`;
  if (numbers.length === 10) return `559${numbers}`;
  return numbers;
}

export const whatsappService = {
  /** Envia mensagem de texto via Evolution API (Edge Function direta) */
  async sendMessage(phone: string, message: string) {
    const { data, error } = await supabase.functions.invoke('send-whatsapp', {
      body: { to: phone, message },
    });
    if (error) throw error;
    return data;
  },

  /** Envia mensagem de texto via Evolution API proxy (mais flexível) */
  async sendText(phone: string, text: string) {
    return evolutionMessages.sendText(formatPhone(phone), text);
  },

  /** Envia mídia via Evolution API */
  async sendMedia(phone: string, mediatype: 'image' | 'video' | 'document', mediaUrl: string, caption?: string) {
    return evolutionMessages.sendMedia(formatPhone(phone), mediatype, mediaUrl, { caption });
  },

  /** Envia botões interativos */
  async sendButtons(phone: string, title: string, buttons: { displayText: string; id: string }[]) {
    return evolutionMessages.sendButtons(formatPhone(phone), title, buttons);
  },

  /** Envia template (via Edge Function send-whatsapp) */
  async sendTemplate(phone: string, templateName: string, variables: string[]) {
    const { data, error } = await supabase.functions.invoke('send-whatsapp', {
      body: { to: phone, message: '', type: 'template', templateName, templateParams: variables },
    });
    if (error) throw error;
    return data;
  },

  isConfigured: () => true,
};
