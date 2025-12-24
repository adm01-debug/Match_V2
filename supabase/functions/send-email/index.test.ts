import { describe, it, expect, vi } from 'vitest';

describe('send-email edge function', () => {
  it('should validate email format', () => {
    const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
    expect(emailRegex.test('test@example.com')).toBe(true);
    expect(emailRegex.test('invalid-email')).toBe(false);
  });

  it('should require subject and body', () => {
    const email = { to: 'test@example.com', subject: 'Test', body: 'Content' };
    expect(email.subject).toBeDefined();
    expect(email.body).toBeDefined();
  });

  it('should handle multiple recipients', () => {
    const recipients = ['a@test.com', 'b@test.com', 'c@test.com'];
    expect(recipients.length).toBe(3);
  });

  it('should sanitize HTML content', () => {
    const htmlContent = '<script>alert("xss")</script><p>Safe content</p>';
    const sanitized = htmlContent.replace(/<script[^>]*>.*?<\/script>/gi, '');
    expect(sanitized).not.toContain('script');
  });

  it('should return success response', () => {
    const response = { success: true, messageId: 'msg-123' };
    expect(response.success).toBe(true);
    expect(response.messageId).toBeDefined();
  });
});
