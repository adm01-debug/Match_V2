/**
 * @fileoverview Testes do WhatsApp Service
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@/test/mocks/supabase';
import { mockSupabase } from '@/test/mocks/supabase';
import { whatsappService } from '../whatsappService';

describe('whatsappService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('invoca send-whatsapp com telefone e mensagem', async () => {
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: { success: true, messageId: 'wpp-123' },
        error: null,
      });

      const result = await whatsappService.sendMessage('+5511999999999', 'Olá!');
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('send-whatsapp', {
        body: { to: '+5511999999999', message: 'Olá!' },
      });
      expect(result.success).toBe(true);
    });

    it('lança erro quando envio falha', async () => {
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: null,
        error: { message: 'WhatsApp API error' },
      });

      await expect(whatsappService.sendMessage('+5511999', 'msg')).rejects.toBeDefined();
    });
  });

  describe('sendTemplate', () => {
    it('invoca send-whatsapp com template e variáveis', async () => {
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: { success: true },
        error: null,
      });

      await whatsappService.sendTemplate('+5511999', 'entrevista_agendada', ['João', '15/03']);
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('send-whatsapp', {
        body: { to: '+5511999', message: '', type: 'template', templateName: 'entrevista_agendada', templateParams: ['João', '15/03'] },
      });
    });
  });

  describe('isConfigured', () => {
    it('retorna true (edge function trata config)', () => {
      expect(whatsappService.isConfigured()).toBe(true);
    });
  });
});
