/**
 * @fileoverview Testes do Email Service
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@/test/mocks/supabase';
import { mockSupabase } from '@/test/mocks/supabase';
import { emailService } from '../emailService';

describe('emailService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('invoca send-email com parâmetros corretos', async () => {
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: { success: true, id: 'email-123' },
        error: null,
      });

      const result = await emailService.sendEmail('test@test.com', 'Assunto', '<p>Corpo</p>');
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('send-email', {
        body: { to: 'test@test.com', subject: 'Assunto', html: '<p>Corpo</p>', replyTo: undefined },
      });
      expect(result.success).toBe(true);
    });

    it('aceita replyTo opcional', async () => {
      mockSupabase.functions.invoke.mockResolvedValueOnce({ data: { success: true }, error: null });

      await emailService.sendEmail('a@b.com', 'Sub', 'Body', 'reply@b.com');
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('send-email', {
        body: { to: 'a@b.com', subject: 'Sub', content: 'Body', replyTo: 'reply@b.com' },
      });
    });

    it('lança erro quando envio falha', async () => {
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: null,
        error: { message: 'SMTP error' },
      });

      await expect(emailService.sendEmail('x@x.com', 'S', 'B')).rejects.toBeDefined();
    });
  });

  describe('sendBulk', () => {
    it('envia para múltiplos destinatários e contabiliza resultados', async () => {
      mockSupabase.functions.invoke
        .mockResolvedValueOnce({ data: { success: true }, error: null })
        .mockResolvedValueOnce({ data: null, error: { message: 'fail' } })
        .mockResolvedValueOnce({ data: { success: true }, error: null });

      const result = await emailService.sendBulk(
        ['a@a.com', 'b@b.com', 'c@c.com'],
        'Bulk Subject',
        'Bulk Body'
      );
      expect(result.sent).toBe(2);
      expect(result.failed).toBe(1);
    });

    it('retorna 0 enviados quando todos falham', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({ data: null, error: { message: 'fail' } });

      const result = await emailService.sendBulk(['a@a.com', 'b@b.com'], 'S', 'B');
      expect(result.sent).toBe(0);
      expect(result.failed).toBe(2);
    });

    it('lida com lista vazia', async () => {
      const result = await emailService.sendBulk([], 'S', 'B');
      expect(result.sent).toBe(0);
      expect(result.failed).toBe(0);
    });
  });

  describe('sendTemplated', () => {
    it('busca template e substitui variáveis', async () => {
      // Mock da query do template
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { assunto: 'Olá {{nome}}', conteudo: '<p>Bem-vindo, {{nome}}!</p>' },
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValueOnce(mockFrom as any);
      
      // Mock do envio
      mockSupabase.functions.invoke.mockResolvedValueOnce({ data: { success: true }, error: null });

      await emailService.sendTemplated('dest@test.com', 'tpl-1', { nome: 'Maria' });
      
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('send-email', {
        body: expect.objectContaining({
          to: 'dest@test.com',
          subject: 'Olá Maria',
          content: '<p>Bem-vindo, Maria!</p>',
        }),
      });
    });

    it('lança erro quando template não existe', async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
      mockSupabase.from.mockReturnValueOnce(mockFrom as any);

      await expect(emailService.sendTemplated('a@a.com', 'fake-id', {}))
        .rejects.toThrow('Template não encontrado');
    });
  });
});
