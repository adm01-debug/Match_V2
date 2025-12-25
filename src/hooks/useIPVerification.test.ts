/**
 * @fileoverview useIPVerification Hook Tests
 * @module hooks/useIPVerification.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIPVerification } from './useIPVerification';
import * as ipService from '@/services/ipService';

vi.mock('@/services/ipService');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useIPVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('IP Checking', () => {
    it('should return allowed for whitelisted IP', async () => {
      vi.mocked(ipService.getClientIP).mockResolvedValue('127.0.0.1');
      vi.mocked(ipService.isIPAllowed).mockResolvedValue({
        allowed: true,
        ip: '127.0.0.1',
        reason: 'Localhost',
        checkedAt: new Date().toISOString(),
      });

      const { result } = renderHook(() => useIPVerification(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.isAllowed).toBe(true);
      expect(result.current.clientIP).toBe('127.0.0.1');
    });

    it('should return blocked for unknown IP', async () => {
      vi.mocked(ipService.getClientIP).mockResolvedValue('192.168.1.100');
      vi.mocked(ipService.isIPAllowed).mockResolvedValue({
        allowed: false,
        ip: '192.168.1.100',
        reason: 'IP not in whitelist',
        checkedAt: new Date().toISOString(),
      });

      const { result } = renderHook(() => useIPVerification(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.isAllowed).toBe(false);
    });

    it('should handle network errors gracefully', async () => {
      vi.mocked(ipService.getClientIP).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useIPVerification(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBeDefined();
    });

    it('should cache results based on config timeout', async () => {
      vi.mocked(ipService.getClientIP).mockResolvedValue('127.0.0.1');
      vi.mocked(ipService.isIPAllowed).mockResolvedValue({
        allowed: true,
        ip: '127.0.0.1',
        reason: 'Cached',
        checkedAt: new Date().toISOString(),
      });

      const { result, rerender } = renderHook(() => useIPVerification(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      rerender();
      
      expect(ipService.getClientIP).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading States', () => {
    it('should show loading while checking IP', () => {
      vi.mocked(ipService.getClientIP).mockImplementation(
        () => new Promise(() => {})
      );

      const { result } = renderHook(() => useIPVerification(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAllowed).toBe(false);
    });

    it('should update state after check completes', async () => {
      vi.mocked(ipService.getClientIP).mockResolvedValue('10.0.0.1');
      vi.mocked(ipService.isIPAllowed).mockResolvedValue({
        allowed: true,
        ip: '10.0.0.1',
        reason: 'Office IP',
        checkedAt: new Date().toISOString(),
      });

      const { result } = renderHook(() => useIPVerification(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.checkResult).not.toBeNull();
      });
    });
  });

  describe('Recheck Functionality', () => {
    it('should allow manual recheck', async () => {
      vi.mocked(ipService.getClientIP).mockResolvedValue('127.0.0.1');
      vi.mocked(ipService.isIPAllowed).mockResolvedValue({
        allowed: true,
        ip: '127.0.0.1',
        reason: 'Test',
        checkedAt: new Date().toISOString(),
      });

      const { result } = renderHook(() => useIPVerification(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      
      result.current.recheck();
      
      await waitFor(() => {
        expect(ipService.getClientIP).toHaveBeenCalled();
      });
    });
  });
});
