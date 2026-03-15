/**
 * @fileoverview Testes do ProtectedRoute
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock useAuth
const mockUseAuth = vi.fn();
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import ProtectedRoute from '../ProtectedRoute';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderWithRouter = (
  path: string,
  requiredRoles?: ('admin' | 'rh' | 'gestor')[]
) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route
            path={path}
            element={
              <ProtectedRoute requiredRoles={requiredRoles}>
                <div data-testid="protected-content">Conteúdo Protegido</div>
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<div data-testid="auth-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mostra loading spinner quando carregando', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      roles: [],
      hasRole: () => false,
    });

    renderWithRouter('/dashboard');
    expect(screen.getByRole('region', { name: 'Rota protegida' })).toBeDefined();
  });

  it('redireciona para /auth quando não autenticado', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      roles: [],
      hasRole: () => false,
    });

    renderWithRouter('/dashboard');
    expect(screen.getByTestId('auth-page')).toBeDefined();
  });

  it('renderiza conteúdo quando autenticado sem roles requeridas', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', email: 'test@test.com' },
      loading: false,
      roles: ['rh'],
      hasRole: (r: string) => r === 'rh',
    });

    renderWithRouter('/dashboard');
    expect(screen.getByTestId('protected-content')).toBeDefined();
  });

  it('mostra acesso negado quando role não corresponde', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', email: 'test@test.com' },
      loading: false,
      roles: ['gestor'],
      hasRole: (r: string) => r === 'gestor',
    });

    renderWithRouter('/admin', ['admin']);
    expect(screen.getByText('Acesso Negado')).toBeDefined();
  });

  it('renderiza conteúdo quando user tem role requerida', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', email: 'test@test.com' },
      loading: false,
      roles: ['admin'],
      hasRole: (r: string) => r === 'admin',
    });

    renderWithRouter('/admin', ['admin']);
    expect(screen.getByTestId('protected-content')).toBeDefined();
  });

  it('aceita qualquer uma das roles requeridas', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', email: 'test@test.com' },
      loading: false,
      roles: ['rh'],
      hasRole: (r: string) => r === 'rh',
    });

    renderWithRouter('/reports', ['admin', 'rh']);
    expect(screen.getByTestId('protected-content')).toBeDefined();
  });
});
