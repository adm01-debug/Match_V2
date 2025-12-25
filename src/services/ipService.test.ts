/**
 * @fileoverview IP Service Tests
 * @module services/ipService.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  getClientIP, 
  isIPAllowed, 
  addIPToWhitelist, 
  removeIPFromWhitelist,
  clearIPCache,
  logBlockedAttempt
} from './ipService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      insert: vi.fn(),
      update: vi.fn(() => ({
        eq: vi.fn(),
      })),
    })),
  },
}));

global.fetch = vi.fn();
global.navigator = { userAgent: 'test-agent' } as Navigator;

describe('ipService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearIPCache();
  });

  describe('getClientIP', () => {
    it('should fetch IP from external API', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        json: () => Promise.resolve({ ip: '203.0.113.50' }),
      });

      const ip = await getClientIP();
      
      expect(ip).toBe('203.0.113.50');
      expect(global.fetch).toHaveBeenCalledWith('https://api.ipify.org?format=json');
    });

    it('should fallback to localhost on error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

      const ip = await getClientIP();
      
      expect(ip).toBe('127.0.0.1');
    });
  });

  describe('isIPAllowed', () => {
    it('should allow localhost in development', async () => {
      const result = await isIPAllowed('127.0.0.1');
      
      expect(result.allowed).toBe(true);
      expect(result.ip).toBe('127.0.0.1');
    });

    it('should allow IPv6 localhost', async () => {
      const result = await isIPAllowed('::1');
      
      expect(result.allowed).toBe(true);
    });

    it('should check database for unknown IPs', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          data: [{ ip: '10.0.0.1', description: 'Office', is_active: true }],
          error: null,
        }),
      });
      
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: mockSelect,
      });

      const result = await isIPAllowed('10.0.0.1');
      
      expect(result.ip).toBe('10.0.0.1');
    });

    it('should block and log unknown IPs', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            data: [],
            error: null,
          }),
        }),
        insert: mockInsert,
      });

      const result = await isIPAllowed('192.168.1.100');
      
      expect(result.allowed).toBe(false);
    });

    it('should use cache for repeated checks', async () => {
      const result1 = await isIPAllowed('127.0.0.1');
      const result2 = await isIPAllowed('127.0.0.1');
      
      expect(result1.checkedAt).toBe(result2.checkedAt);
    });
  });

  describe('addIPToWhitelist', () => {
    it('should add IP to database', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        insert: mockInsert,
      });

      const success = await addIPToWhitelist('10.0.0.50', 'New Office', 'admin');
      
      expect(success).toBe(true);
      expect(mockInsert).toHaveBeenCalled();
    });

    it('should return false on database error', async () => {
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: new Error('DB Error') }),
      });

      const success = await addIPToWhitelist('10.0.0.50', 'Test', 'admin');
      
      expect(success).toBe(false);
    });
  });

  describe('removeIPFromWhitelist', () => {
    it('should deactivate IP in database', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        update: mockUpdate,
      });

      const success = await removeIPFromWhitelist('10.0.0.50');
      
      expect(success).toBe(true);
    });
  });

  describe('logBlockedAttempt', () => {
    it('should log blocked attempt to database', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        insert: mockInsert,
      });

      await logBlockedAttempt('192.168.1.1', 'Test block');
      
      expect(mockInsert).toHaveBeenCalled();
    });
  });
});
