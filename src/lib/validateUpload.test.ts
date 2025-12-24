import { describe, it, expect } from 'vitest';
import { validateUpload, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from './validateUpload';

describe('validateUpload', () => {
  describe('validateUpload', () => {
    it('accepts valid PDF file', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const result = validateUpload(file);
      expect(result.valid).toBe(true);
    });

    it('accepts valid image file', () => {
      const file = new File(['content'], 'test.png', { type: 'image/png' });
      const result = validateUpload(file);
      expect(result.valid).toBe(true);
    });

    it('rejects invalid file type', () => {
      const file = new File(['content'], 'test.exe', { type: 'application/x-msdownload' });
      const result = validateUpload(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('tipo');
    });

    it('rejects file exceeding size limit', () => {
      const largeContent = new Array(MAX_FILE_SIZE + 1).fill('a').join('');
      const file = new File([largeContent], 'large.pdf', { type: 'application/pdf' });
      const result = validateUpload(file);
      expect(result.valid).toBe(false);
    });

    it('handles empty file', () => {
      const file = new File([], 'empty.pdf', { type: 'application/pdf' });
      const result = validateUpload(file);
      expect(result.valid).toBe(true);
    });
  });

  describe('ALLOWED_FILE_TYPES', () => {
    it('includes PDF', () => {
      expect(ALLOWED_FILE_TYPES).toContain('application/pdf');
    });

    it('includes images', () => {
      expect(ALLOWED_FILE_TYPES).toContain('image/png');
      expect(ALLOWED_FILE_TYPES).toContain('image/jpeg');
    });
  });

  describe('MAX_FILE_SIZE', () => {
    it('is a positive number', () => {
      expect(MAX_FILE_SIZE).toBeGreaterThan(0);
    });
  });
});
