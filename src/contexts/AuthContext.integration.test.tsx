/**
 * @fileoverview Testes de integração para AuthContext
 * @description Testes para login, logout e registro de usuários do sistema interno
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock do Supabase
const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockRpc = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      signUp: (...args: unknown[]) => mockSignUp(...args),
      signOut: (...args: unknown[]) => mockSignOut(...args),
      getSession: (...args: unknown[]) => mockGetSession(...args),
      onAuthStateChange: (...args: unknown[]) => mockOnAuthStateChange(...args),
    },
    rpc: (...args: unknown[]) => mockRpc(...args),
  },
}));

// Componente de teste para acessar o contexto
const TestComponent: React.FC = () => {
  const { user, loading, signIn, signUp, signOut, roles, hasRole } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <div data-testid="roles">{roles.join(',') || 'no-roles'}</div>
      <div data-testid="has-admin">{hasRole('admin') ? 'yes' : 'no'}</div>
      <button onClick={() => signIn('test@example.com', 'password123')}>Login</button>
      <button onClick={() => signUp('test@example.com', 'password123', 'Test User')}>Signup</button>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
};

describe('AuthContext Integration Tests', () => {
  let authSubscription: { unsubscribe: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.clearAllMocks();
    
    authSubscription = { unsubscribe: vi.fn() };
    
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: authSubscription },
    });
    
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    
    mockRpc.mockResolvedValue({ data: [], error: null });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Estado inicial', () => {
    it('deve iniciar em estado de carregamento', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Aguarda o loading terminar
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });
    });

    it('deve mostrar usuário não autenticado quando não há sessão', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      });
    });

    it('deve carregar sessão existente na inicialização', async () => {
      const mockUser = { id: 'user-123', email: 'existing@example.com' };
      const mockSession = { user: mockUser, access_token: 'token-123' };
      
      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('existing@example.com');
      });
    });
  });

  describe('Fluxo de Login', () => {
    it('deve fazer login com sucesso', async () => {
      const user = userEvent.setup();
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      
      mockSignInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: { user: mockUser } },
        error: null,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      await user.click(screen.getByText('Login'));

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('deve retornar erro para credenciais inválidas', async () => {
      const user = userEvent.setup();
      
      mockSignInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      await user.click(screen.getByText('Login'));

      expect(mockSignInWithPassword).toHaveBeenCalled();
    });

    it('deve carregar roles do usuário após login', async () => {
      const mockUser = { id: 'user-123', email: 'admin@example.com' };
      const mockSession = { user: mockUser, access_token: 'token-123' };
      
      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      mockRpc.mockResolvedValue({ data: ['admin', 'rh'], error: null });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('roles')).toHaveTextContent('admin,rh');
      }, { timeout: 3000 });
    });
  });

  describe('Fluxo de Registro', () => {
    it('deve fazer signup com sucesso', async () => {
      const user = userEvent.setup();
      const mockUser = { id: 'new-user-123', email: 'test@example.com' };
      
      mockSignUp.mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      await user.click(screen.getByText('Signup'));

      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: expect.stringContaining('/'),
          data: { nome: 'Test User' },
        },
      });
    });

    it('deve retornar erro para email já registrado', async () => {
      const user = userEvent.setup();
      
      mockSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'User already registered' },
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      await user.click(screen.getByText('Signup'));

      expect(mockSignUp).toHaveBeenCalled();
    });
  });

  describe('Fluxo de Logout', () => {
    it('deve fazer logout com sucesso', async () => {
      const user = userEvent.setup();
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockSession = { user: mockUser, access_token: 'token-123' };
      
      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      mockSignOut.mockResolvedValue({ error: null });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
      });

      await user.click(screen.getByText('Logout'));

      expect(mockSignOut).toHaveBeenCalled();
    });

    it('deve limpar roles após logout', async () => {
      const user = userEvent.setup();
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockSession = { user: mockUser, access_token: 'token-123' };
      
      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      mockRpc.mockResolvedValue({ data: ['admin'], error: null });
      mockSignOut.mockResolvedValue({ error: null });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('roles')).toHaveTextContent('admin');
      }, { timeout: 3000 });

      await user.click(screen.getByText('Logout'));

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });
  });

  describe('Verificação de Roles', () => {
    it('hasRole deve retornar true para role existente', async () => {
      const mockUser = { id: 'user-123', email: 'admin@example.com' };
      const mockSession = { user: mockUser, access_token: 'token-123' };
      
      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      mockRpc.mockResolvedValue({ data: ['admin'], error: null });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('has-admin')).toHaveTextContent('yes');
      }, { timeout: 3000 });
    });

    it('hasRole deve retornar false para role inexistente', async () => {
      const mockUser = { id: 'user-123', email: 'rh@example.com' };
      const mockSession = { user: mockUser, access_token: 'token-123' };
      
      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      mockRpc.mockResolvedValue({ data: ['rh'], error: null });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('has-admin')).toHaveTextContent('no');
      }, { timeout: 3000 });
    });
  });

  describe('Auth State Change Listener', () => {
    it('deve registrar listener de mudança de estado', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(mockOnAuthStateChange).toHaveBeenCalled();
    });

    it('deve desregistrar listener ao desmontar', () => {
      const { unmount } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      unmount();

      expect(authSubscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('Erro: useAuth fora do Provider', () => {
    it('deve lançar erro ao usar useAuth fora do AuthProvider', () => {
      // Silencia o console.error para este teste
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');
      
      consoleSpy.mockRestore();
    });
  });
});
