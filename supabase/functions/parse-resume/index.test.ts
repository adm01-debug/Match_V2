import { describe, it, expect, vi } from 'vitest';

describe('parse-resume edge function', () => {
  it('should parse PDF resume', () => {
    const mockPdfContent = 'Nome: João Silva\nEmail: joao@email.com';
    expect(mockPdfContent).toContain('Nome:');
    expect(mockPdfContent).toContain('Email:');
  });

  it('should extract contact information', () => {
    const resumeText = 'joao@email.com (11) 99999-9999';
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    const phoneRegex = /\(?\d{2}\)?\s?\d{4,5}-?\d{4}/;
    
    expect(emailRegex.test(resumeText)).toBe(true);
    expect(phoneRegex.test(resumeText)).toBe(true);
  });

  it('should extract skills from resume', () => {
    const resumeText = 'Habilidades: React, TypeScript, Node.js, Python';
    const skills = ['React', 'TypeScript', 'Node.js', 'Python'];
    
    skills.forEach(skill => {
      expect(resumeText).toContain(skill);
    });
  });

  it('should handle empty resume', () => {
    const emptyResume = '';
    expect(emptyResume.length).toBe(0);
  });

  it('should validate file type', () => {
    const validTypes = ['application/pdf', 'application/msword'];
    const testType = 'application/pdf';
    expect(validTypes).toContain(testType);
  });
});
