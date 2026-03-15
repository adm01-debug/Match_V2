/**
 * @fileoverview Evolution API Service
 * @description Serviço frontend para integração com a Evolution API via Edge Function proxy
 */

import { supabase } from '@/integrations/supabase/client';

interface EvolutionProxyRequest {
  endpoint: string;
  method?: string;
  body?: unknown;
  instance?: string;
}

interface EvolutionResponse<T = unknown> {
  success: boolean;
  data: T;
}

async function invokeEvolution<T = unknown>(request: EvolutionProxyRequest): Promise<T> {
  const { data, error } = await supabase.functions.invoke('evolution-api', {
    body: request,
  });
  if (error) throw error;
  const response = data as EvolutionResponse<T>;
  if (!response.success) throw new Error('Evolution API request failed');
  return response.data;
}

// ─── Instâncias ───────────────────────────────────────────────

export const evolutionInstances = {
  async fetchAll() {
    return invokeEvolution({ endpoint: '/instance/fetchInstances' });
  },

  async fetchOne(instanceName: string) {
    return invokeEvolution({ endpoint: `/instance/fetchInstances?instanceName=${instanceName}` });
  },

  async create(instanceName: string, options?: { qrcode?: boolean; webhook?: { url: string; events: string[] } }) {
    return invokeEvolution({
      endpoint: '/instance/create',
      method: 'POST',
      body: {
        instanceName,
        qrcode: options?.qrcode ?? true,
        integration: 'WHATSAPP-BAILEYS',
        ...(options?.webhook && { webhook: { ...options.webhook, byEvents: true, base64: false } }),
      },
    });
  },

  async connect(instanceName?: string) {
    return invokeEvolution({ endpoint: '/instance/connect/{instance}', instance: instanceName });
  },

  async connectionState(instanceName?: string) {
    return invokeEvolution({ endpoint: '/instance/connectionState/{instance}', instance: instanceName });
  },

  async restart(instanceName?: string) {
    return invokeEvolution({ endpoint: '/instance/restart/{instance}', method: 'PUT', instance: instanceName });
  },

  async logout(instanceName?: string) {
    return invokeEvolution({ endpoint: '/instance/logout/{instance}', method: 'DELETE', instance: instanceName });
  },

  async deleteInstance(instanceName?: string) {
    return invokeEvolution({ endpoint: '/instance/delete/{instance}', method: 'DELETE', instance: instanceName });
  },
};

// ─── Mensagens ────────────────────────────────────────────────

export const evolutionMessages = {
  async sendText(number: string, text: string, options?: { delay?: number; instance?: string }) {
    return invokeEvolution({
      endpoint: '/message/sendText/{instance}',
      method: 'POST',
      body: { number, text, delay: options?.delay ?? 1200 },
      instance: options?.instance,
    });
  },

  async sendMedia(number: string, mediatype: 'image' | 'video' | 'document', mediaUrl: string, options?: { caption?: string; fileName?: string; instance?: string }) {
    return invokeEvolution({
      endpoint: '/message/sendMedia/{instance}',
      method: 'POST',
      body: {
        number,
        mediatype,
        media: mediaUrl,
        caption: options?.caption,
        fileName: options?.fileName,
      },
      instance: options?.instance,
    });
  },

  async sendButtons(number: string, title: string, buttons: { displayText: string; id: string }[], options?: { description?: string; footer?: string; instance?: string }) {
    return invokeEvolution({
      endpoint: '/message/sendButtons/{instance}',
      method: 'POST',
      body: {
        number,
        title,
        description: options?.description ?? '',
        footer: options?.footer ?? '',
        buttons: buttons.map(b => ({ type: 'reply', ...b })),
      },
      instance: options?.instance,
    });
  },

  async sendList(number: string, title: string, sections: { title: string; rows: { title: string; description?: string; rowId: string }[] }[], options?: { buttonText?: string; description?: string; instance?: string }) {
    return invokeEvolution({
      endpoint: '/message/sendList/{instance}',
      method: 'POST',
      body: {
        number,
        title,
        description: options?.description ?? '',
        buttonText: options?.buttonText ?? 'Ver opções',
        sections,
      },
      instance: options?.instance,
    });
  },

  async sendLocation(number: string, latitude: number, longitude: number, options?: { name?: string; address?: string; instance?: string }) {
    return invokeEvolution({
      endpoint: '/message/sendLocation/{instance}',
      method: 'POST',
      body: { number, latitude, longitude, name: options?.name, address: options?.address },
      instance: options?.instance,
    });
  },

  async sendContact(number: string, contactName: string, contactPhone: string, options?: { instance?: string }) {
    return invokeEvolution({
      endpoint: '/message/sendContact/{instance}',
      method: 'POST',
      body: {
        number,
        contact: [{ fullName: contactName, wuid: contactPhone, phoneNumber: contactPhone }],
      },
      instance: options?.instance,
    });
  },

  async sendReaction(number: string, messageId: string, reaction: string, options?: { instance?: string }) {
    return invokeEvolution({
      endpoint: '/message/sendReaction/{instance}',
      method: 'POST',
      body: {
        key: { remoteJid: `${number}@s.whatsapp.net`, id: messageId },
        reaction,
      },
      instance: options?.instance,
    });
  },

  async markAsRead(messageId: string, remoteJid: string, options?: { instance?: string }) {
    return invokeEvolution({
      endpoint: '/message/markMessageAsRead/{instance}',
      method: 'POST',
      body: { readMessages: [{ id: messageId, remoteJid }] },
      instance: options?.instance,
    });
  },
};

// ─── Chats & Contatos ─────────────────────────────────────────

export const evolutionChats = {
  async findContacts(query?: string, instance?: string) {
    return invokeEvolution({
      endpoint: '/chat/findContacts/{instance}',
      method: 'POST',
      body: query ? { where: { name: query } } : {},
      instance,
    });
  },

  async findChats(instance?: string) {
    return invokeEvolution({
      endpoint: '/chat/findChats/{instance}',
      method: 'POST',
      body: {},
      instance,
    });
  },

  async findMessages(remoteJid: string, limit = 20, instance?: string) {
    return invokeEvolution({
      endpoint: '/chat/findMessages/{instance}',
      method: 'POST',
      body: { where: { key: { remoteJid } }, limit },
      instance,
    });
  },

  async checkNumber(numbers: string[], instance?: string) {
    return invokeEvolution({
      endpoint: '/chat/whatsappNumbers/{instance}',
      method: 'POST',
      body: { numbers },
      instance,
    });
  },

  async getProfilePicture(number: string, instance?: string) {
    return invokeEvolution({
      endpoint: '/chat/fetchProfilePictureUrl/{instance}',
      method: 'POST',
      body: { number },
      instance,
    });
  },
};

// ─── Serviço Consolidado ──────────────────────────────────────

export const evolutionApi = {
  instances: evolutionInstances,
  messages: evolutionMessages,
  chats: evolutionChats,
};

export default evolutionApi;
