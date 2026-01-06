import { describe, it, expect } from 'vitest';
import { validateUpload } from './validateUpload';

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

    it('handles empty file', () => {
      const file = new File([], 'empty.pdf', { type: 'application/pdf' });
      const result = validateUpload(file);
      expect(result.valid).toBe(true);
    });
  });
});
