/**
 * Security headers configuration
 */

export const securityHeaders: Record<string, string> = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

export const CSP_DIRECTIVES: Record<string, string> = {
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline' 'unsafe-eval'",
  'style-src': "'self' 'unsafe-inline'",
  'img-src': "'self' data: https:",
  'font-src': "'self'",
  'connect-src': "'self' https://*.supabase.co wss://*.supabase.co",
  'frame-ancestors': "'none'",
};

export const getSecurityHeaders = (): Record<string, string> => securityHeaders;

export function applySecurityHeaders(response?: { setHeader: (key: string, value: string) => void }): Record<string, string> {
  if (response) {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.setHeader(key, value);
    });
  }
  return { ...securityHeaders };
}
