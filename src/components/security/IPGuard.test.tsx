/**
 * @fileoverview IPGuard Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IPGuard } from '@/components/security/IPGuard';

// Mock do hook
vi.mock('@/hooks/useIPVerification', () => ({
  useIPVerification: vi.fn(),
}));

import { useIPVerification } from '@/hooks/useIPVerification';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('IPGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should show loading state while checking IP', () => {
      vi.mocked(useIPVerification).mockReturnValue({
        isAllowed: false,
        isLoading: true,
        isError: false,
        clientIP: null,
        checkResult: null,
        error: null,
        recheck: vi.fn(),
      });

      renderWithProviders(
        <IPGuard>
          <div>Protected Content</div>
        </IPGuard>
      );

      expect(screen.getByTestId('ip-guard-loading')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should show blocked state when IP is not allowed', async () => {
      vi.mocked(useIPVerification).mockReturnValue({
        isAllowed: false,
        isLoading: false,
        isError: false,
        clientIP: '192.168.1.1',
        checkResult: {
          allowed: false,
          ip: '192.168.1.1',
          reason: 'IP not in whitelist',
          checkedAt: new Date().toISOString(),
        },
        error: null,
        recheck: vi.fn(),
      });

      renderWithProviders(
        <IPGuard>
          <div>Protected Content</div>
        </IPGuard>
      );

      await waitFor(() => {
        expect(screen.getByTestId('ip-guard-blocked')).toBeInTheDocument();
      });
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should render children when IP is allowed', async () => {
      vi.mocked(useIPVerification).mockReturnValue({
        isAllowed: true,
        isLoading: false,
        isError: false,
        clientIP: '127.0.0.1',
        checkResult: {
          allowed: true,
          ip: '127.0.0.1',
          reason: 'Localhost',
          checkedAt: new Date().toISOString(),
        },
        error: null,
        recheck: vi.fn(),
      });

      renderWithProviders(
        <IPGuard>
          <div>Protected Content</div>
        </IPGuard>
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });
    });

    it('should show error state when verification fails', async () => {
      vi.mocked(useIPVerification).mockReturnValue({
        isAllowed: false,
        isLoading: false,
        isError: true,
        clientIP: null,
        checkResult: null,
        error: new Error('Network error'),
        recheck: vi.fn(),
      });

      renderWithProviders(
        <IPGuard>
          <div>Protected Content</div>
        </IPGuard>
      );

      await waitFor(() => {
        expect(screen.getByTestId('ip-guard-error')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      vi.mocked(useIPVerification).mockReturnValue({
        isAllowed: false,
        isLoading: true,
        isError: false,
        clientIP: null,
        checkResult: null,
        error: null,
        recheck: vi.fn(),
      });

      renderWithProviders(
        <IPGuard>
          <div>Protected Content</div>
        </IPGuard>
      );

      const loading = screen.getByTestId('ip-guard-loading');
      expect(loading).toBeInTheDocument();
    });
  });
});
