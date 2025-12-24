import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeInput, escapeRegex } from './sanitize';

describe('sanitize', () => {
  describe('sanitizeHtml', () => {
    it('removes script tags', () => {
      const input = '<script>alert("xss")</script><p>Hello</p>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain('<script>');
    });

    it('preserves safe tags', () => {
      const input = '<p><strong>Bold</strong></p>';
      const result = sanitizeHtml(input);
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
    });

    it('removes event handlers', () => {
      const input = '<img onerror="alert(1)" src="x">';
      const result = sanitizeHtml(input);
      expect(result).not.toContain('onerror');
    });

    it('handles empty input', () => {
      expect(sanitizeHtml('')).toBe('');
    });
  });

  describe('sanitizeInput', () => {
    it('trims whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('removes special characters', () => {
      const result = sanitizeInput('hello<>world');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('handles null/undefined', () => {
      expect(sanitizeInput(null as any)).toBe('');
      expect(sanitizeInput(undefined as any)).toBe('');
    });
  });

  describe('escapeRegex', () => {
    it('escapes special regex characters', () => {
      const input = 'hello.*world?';
      const result = escapeRegex(input);
      expect(result).toContain('\\.');
      expect(result).toContain('\\*');
      expect(result).toContain('\\?');
    });

    it('handles empty string', () => {
      expect(escapeRegex('')).toBe('');
    });
  });
});
