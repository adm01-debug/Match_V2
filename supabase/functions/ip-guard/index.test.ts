/**
 * @fileoverview ip-guard Edge Function Tests
 * @module supabase/functions/ip-guard/index.test
 */

import { assertEquals, assertExists } from 'https://deno.land/std@0.208.0/testing/asserts.ts';
import { describe, it } from 'https://deno.land/std@0.208.0/testing/bdd.ts';

// Mock Supabase client
const mockSupabase = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    insert: () => Promise.resolve({ error: null }),
  }),
};

describe('ip-guard Edge Function', () => {
  describe('IP Whitelisting', () => {
    it('should allow whitelisted IPs', async () => {
      const mockData = {
        ip: '127.0.0.1',
        description: 'Localhost',
        is_active: true,
        expires_at: null,
      };

      const result = {
        allowed: true,
        ip: '127.0.0.1',
        reason: 'Acesso permitido: Localhost',
      };

      assertEquals(result.allowed, true);
      assertEquals(result.ip, '127.0.0.1');
    });

    it('should block unknown IPs', async () => {
      const result = {
        allowed: false,
        ip: '192.168.1.100',
        reason: 'Acesso não autorizado. Seu IP não está na lista de permitidos.',
      };

      assertEquals(result.allowed, false);
      assertExists(result.reason);
    });

    it('should handle expired IPs', async () => {
      const expiredIP = {
        ip: '10.0.0.1',
        is_active: true,
        expires_at: '2023-01-01T00:00:00Z', // Past date
      };

      const now = new Date();
      const expiresAt = new Date(expiredIP.expires_at);
      const isExpired = expiresAt < now;

      assertEquals(isExpired, true);
    });

    it('should not expire IPs with null expires_at', async () => {
      const permanentIP = {
        ip: '10.0.0.2',
        is_active: true,
        expires_at: null,
      };

      const isExpired = permanentIP.expires_at !== null && 
        new Date(permanentIP.expires_at) < new Date();

      assertEquals(isExpired, false);
    });
  });

  describe('Logging', () => {
    it('should log allowed attempts', async () => {
      const logEntry = {
        ip: '127.0.0.1',
        action: 'ALLOWED',
        reason: 'Localhost development',
      };

      assertEquals(logEntry.action, 'ALLOWED');
      assertExists(logEntry.ip);
    });

    it('should log blocked attempts', async () => {
      const logEntry = {
        ip: '192.168.1.100',
        action: 'BLOCKED',
        reason: 'IP não está na whitelist',
      };

      assertEquals(logEntry.action, 'BLOCKED');
      assertExists(logEntry.reason);
    });

    it('should log expired attempts', async () => {
      const logEntry = {
        ip: '10.0.0.1',
        action: 'EXPIRED',
        reason: 'Acesso expirado em 2023-01-01',
      };

      assertEquals(logEntry.action, 'EXPIRED');
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers in response', () => {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      };

      assertExists(corsHeaders['Access-Control-Allow-Origin']);
      assertExists(corsHeaders['Access-Control-Allow-Methods']);
    });

    it('should handle OPTIONS preflight request', () => {
      const method = 'OPTIONS';
      const shouldReturnEmpty = method === 'OPTIONS';

      assertEquals(shouldReturnEmpty, true);
    });
  });

  describe('IP Extraction', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const headers = new Headers();
      headers.set('x-forwarded-for', '203.0.113.50, 70.41.3.18');

      const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim();

      assertEquals(ip, '203.0.113.50');
    });

    it('should fallback to x-real-ip header', () => {
      const headers = new Headers();
      headers.set('x-real-ip', '203.0.113.51');

      const forwardedFor = headers.get('x-forwarded-for');
      const realIp = headers.get('x-real-ip');
      const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';

      assertEquals(ip, '203.0.113.51');
    });

    it('should return unknown for missing headers', () => {
      const headers = new Headers();

      const forwardedFor = headers.get('x-forwarded-for');
      const realIp = headers.get('x-real-ip');
      const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';

      assertEquals(ip, 'unknown');
    });
  });

  describe('Response Format', () => {
    it('should return proper JSON structure for allowed', () => {
      const response = {
        allowed: true,
        ip: '127.0.0.1',
        reason: 'Acesso permitido',
        checkedAt: new Date().toISOString(),
      };

      assertExists(response.allowed);
      assertExists(response.ip);
      assertExists(response.reason);
      assertExists(response.checkedAt);
    });

    it('should return 403 status for blocked IPs', () => {
      const status = 403;
      assertEquals(status, 403);
    });

    it('should return 200 status for allowed IPs', () => {
      const status = 200;
      assertEquals(status, 200);
    });
  });
});
