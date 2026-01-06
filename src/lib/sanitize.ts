/**
 * Sanitization utilities for input validation
 */

export const sanitize = {
  /**
   * Sanitize HTML to prevent XSS
   */
  html: (input: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    return input.replace(/[&<>"'/]/g, char => map[char] ?? char);
  },

  /**
   * Sanitize string for SQL
   */
  sql: (input: string): string => {
    return input.replace(/['";\\]/g, '');
  },

  /**
   * Sanitize email
   */
  email: (input: string): string => {
    return input.toLowerCase().trim();
  },

  /**
   * Sanitize phone number
   */
  phone: (input: string): string => {
    return input.replace(/[^\d+]/g, '');
  },

  /**
   * Sanitize file name
   */
  fileName: (input: string): string => {
    return input.replace(/[^a-zA-Z0-9._-]/g, '_');
  },
};

// Named exports for compatibility
export const sanitizeHtml = sanitize.html;
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
