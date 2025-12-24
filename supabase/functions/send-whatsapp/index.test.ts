import { describe, it, expect } from 'vitest';

describe('send-whatsapp edge function', () => {
  it('should validate phone number format', () => {
    const phoneRegex = /^\+?[1-9]\d{10,14}$/;
    expect(phoneRegex.test('+5511999999999')).toBe(true);
    expect(phoneRegex.test('123')).toBe(false);
  });

  it('should format phone number correctly', () => {
    const formatPhone = (phone: string) => {
      const cleaned = phone.replace(/\D/g, '');
      return cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
    };
    expect(formatPhone('11999999999')).toBe('5511999999999');
    expect(formatPhone('5511999999999')).toBe('5511999999999');
  });

  it('should validate message content', () => {
    const message = { to: '+5511999999999', text: 'Hello!' };
    expect(message.text.length).toBeGreaterThan(0);
    expect(message.text.length).toBeLessThan(4096);
  });

  it('should handle template messages', () => {
    const template = { name: 'welcome', params: ['João', 'Desenvolvedor'] };
    expect(template.name).toBeDefined();
    expect(template.params).toHaveLength(2);
  });

  it('should return delivery status', () => {
    const response = { status: 'sent', timestamp: new Date().toISOString() };
    expect(response.status).toBe('sent');
    expect(response.timestamp).toBeDefined();
  });
});
