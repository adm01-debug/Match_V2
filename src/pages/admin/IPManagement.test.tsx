/**
 * @fileoverview IPManagement Page Tests
 * @module pages/admin/IPManagement.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import IPManagement from './IPManagement';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [
            { id: '1', ip: '127.0.0.1', description: 'Localhost', added_by: 'system', is_active: true, created_at: '2024-01-01' },
            { id: '2', ip: '10.0.0.1', description: 'Office', added_by: 'admin', is_active: true, created_at: '2024-01-02' },
          ],
          error: null,
        })),
        gte: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              data: [
                { id: '1', ip: '192.168.1.1', action: 'BLOCKED', reason: 'Not in whitelist', timestamp: '2024-01-01T10:00:00' },
              ],
              error: null,
            })),
          })),
        })),
      })),
      insert: vi.fn(() => ({ error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({ error: null })),
      })),
    })),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('IPManagement Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render page title', async () => {
      render(<IPManagement />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByText(/gerenciamento de ips/i)).toBeInTheDocument();
      });
    });

    it('should render IP list table', async () => {
      render(<IPManagement />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByText('127.0.0.1')).toBeInTheDocument();
        expect(screen.getByText('10.0.0.1')).toBeInTheDocument();
      });
    });

    it('should show stats cards', async () => {
      render(<IPManagement />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByText(/ips ativos/i)).toBeInTheDocument();
        expect(screen.getByText(/ips inativos/i)).toBeInTheDocument();
      });
    });

    it('should display access logs section', async () => {
      render(<IPManagement />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByText(/logs de acesso/i)).toBeInTheDocument();
      });
    });

    it('should show add IP button', async () => {
      render(<IPManagement />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /adicionar ip/i })).toBeInTheDocument();
      });
    });
  });

  describe('Actions', () => {
    it('should open add IP dialog when button clicked', async () => {
      const user = userEvent.setup();
      render(<IPManagement />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /adicionar ip/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /adicionar ip/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/adicionar novo ip/i)).toBeInTheDocument();
      });
    });

    it('should show IP input field in dialog', async () => {
      const user = userEvent.setup();
      render(<IPManagement />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /adicionar ip/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /adicionar ip/i }));
      
      await waitFor(() => {
        expect(screen.getByLabelText(/endereço ip/i)).toBeInTheDocument();
      });
    });

    it('should show description field in dialog', async () => {
      const user = userEvent.setup();
      render(<IPManagement />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /adicionar ip/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /adicionar ip/i }));
      
      await waitFor(() => {
        expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', async () => {
      render(<IPManagement />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
      });
    });

    it('should have accessible table', async () => {
      render(<IPManagement />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
    });
  });
});
