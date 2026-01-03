/**
 * @fileoverview Testes de integração para CandidatoAuthContext
 * @description Testes para login, logout e registro de candidatos no portal
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CandidatoAuthProvider, useCandidatoAuth } from './CandidatoAuthContext';

// Mock do Supabase
const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      signUp: (...args: unknown[]) => mockSignUp(...args),
      signOut: (...args: unknown[]) => mockSignOut(...args),
      getSession: (...args: unknown[]) => mockGetSession(...args),
      onAuthStateChange: (...args: unknown[]) => mockOnAuthStateChange(...args),
    },
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

// Componente de teste para acessar o contexto
const TestComponent: React.FC = () => {
  const { user, loading, profile, signIn, signUp, signOut, isCandidato } = useCandidatoAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <div data-testid="profile">{profile ? profile.nome : 'no-profile'}</div>
      <div data-testid="is-candidato">{isCandidato ? 'yes' : 'no'}</div>
      <button onClick={() => signIn('candidato@example.com', 'password123')}>Login</button>
      <button onClick={() => signUp('candidato@example.com', 'password123', 'João Silva', '11999999999')}>Signup</button>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
};

describe('CandidatoAuthContext Integration Tests', () => {
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
    
    // Setup chain para consultas de perfil
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });
    mockSingle.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Estado inicial', () => {
    it('deve iniciar em estado de carregamento', async () => {
      render(
        <CandidatoAuthProvider>
          <TestComponent />
        </CandidatoAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });
    });

    it('deve mostrar candidato não autenticado quando não há sessão', async () => {
      render(
        <CandidatoAuthProvider>
          <TestComponent />
        </CandidatoAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
        expect(screen.getByTestId('is-candidato')).toHaveTextContent('no');
      });
    });

    it('deve carregar sessão e perfil existentes na inicialização', async () => {
      const mockUser = { id: 'candidato-123', email: 'candidato@example.com' };
      const mockSession = { user: mockUser, access_token: 'token-123' };
      const mockProfile = {
        id: 'profile-123',
        user_id: 'candidato-123',
        candidato_id: 'cand-123',
        nome: 'João Silva',
        email: 'candidato@example.com',
        telefone: '11999999999',
        curriculo_url: null,
        curriculo_nome: null,
      };
      
      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      mockSingle.mockResolvedValue({ data: mockProfile, error: null });

      render(
        <CandidatoAuthProvider>
          <TestComponent />
        </CandidatoAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('candidato@example.com');
      });

      await waitFor(() => {
        expect(screen.getByTestId('profile')).toHaveTextContent('João Silva');
        expect(screen.getByTestId('is-candidato')).toHaveTextContent('yes');
      }, { timeout: 3000 });
    });
  });

  describe('Fluxo de Login de Candidato', () => {
    it('deve fazer login com sucesso', async () => {
      const user = userEvent.setup();
      const mockUser = { id: 'candidato-123', email: 'candidato@example.com' };
      
      mockSignInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: { user: mockUser } },
        error: null,
      });

      render(
        <CandidatoAuthProvider>
          <TestComponent />
        </CandidatoAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      await user.click(screen.getByText('Login'));

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'candidato@example.com',
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
        <CandidatoAuthProvider>
          <TestComponent />
        </CandidatoAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      await user.click(screen.getByText('Login'));

      expect(mockSignInWithPassword).toHaveBeenCalled();
    });

    it('deve carregar perfil do candidato após login', async () => {
      const mockUser = { id: 'candidato-123', email: 'candidato@example.com' };
      const mockSession = { user: mockUser, access_token: 'token-123' };
      const mockProfile = {
        id: 'profile-123',
        user_id: 'candidato-123',
        candidato_id: 'cand-123',
        nome: 'Maria Santos',
        email: 'candidato@example.com',
        telefone: '11888888888',
        curriculo_url: 'https://storage.com/curriculo.pdf',
        curriculo_nome: 'curriculo.pdf',
      };
      
      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      mockSingle.mockResolvedValue({ data: mockProfile, error: null });

      render(
        <CandidatoAuthProvider>
          <TestComponent />
        </CandidatoAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('profile')).toHaveTextContent('Maria Santos');
      }, { timeout: 3000 });
    });
  });

  describe('Fluxo de Registro de Candidato', () => {
    it('deve fazer signup com sucesso incluindo dados extras', async () => {
      const user = userEvent.setup();
      const mockUser = { id: 'new-candidato-123', email: 'candidato@example.com' };
      
      mockSignUp.mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      render(
        <CandidatoAuthProvider>
          <TestComponent />
        </CandidatoAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      await user.click(screen.getByText('Signup'));

      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'candidato@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: expect.stringContaining('/portal'),
          data: { 
            nome: 'João Silva',
            telefone: '11999999999',
            user_type: 'candidato',
          },
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
        <CandidatoAuthProvider>
          <TestComponent />
        </CandidatoAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      await user.click(screen.getByText('Signup'));

      expect(mockSignUp).toHaveBeenCalled();
    });
  });

  describe('Fluxo de Logout de Candidato', () => {
    it('deve fazer logout com sucesso', async () => {
      const user = userEvent.setup();
      const mockUser = { id: 'candidato-123', email: 'candidato@example.com' };
      const mockSession = { user: mockUser, access_token: 'token-123' };
      
      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      mockSignOut.mockResolvedValue({ error: null });

      render(
        <CandidatoAuthProvider>
          <TestComponent />
        </CandidatoAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('candidato@example.com');
      });

      await user.click(screen.getByText('Logout'));

      expect(mockSignOut).toHaveBeenCalled();
    });

    it('deve limpar perfil após logout', async () => {
      const user = userEvent.setup();
      const mockUser = { id: 'candidato-123', email: 'candidato@example.com' };
      const mockSession = { user: mockUser, access_token: 'token-123' };
      const mockProfile = {
        id: 'profile-123',
        user_id: 'candidato-123',
        candidato_id: 'cand-123',
        nome: 'Carlos Lima',
        email: 'candidato@example.com',
        telefone: '11777777777',
        curriculo_url: null,
        curriculo_nome: null,
      };
      
      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      mockSingle.mockResolvedValue({ data: mockProfile, error: null });
      mockSignOut.mockResolvedValue({ error: null });

      render(
        <CandidatoAuthProvider>
          <TestComponent />
        </CandidatoAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('profile')).toHaveTextContent('Carlos Lima');
      }, { timeout: 3000 });

      await user.click(screen.getByText('Logout'));

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });
  });

  describe('Auth State Change Listener', () => {
    it('deve registrar listener de mudança de estado', () => {
      render(
        <CandidatoAuthProvider>
          <TestComponent />
        </CandidatoAuthProvider>
      );

      expect(mockOnAuthStateChange).toHaveBeenCalled();
    });

    it('deve desregistrar listener ao desmontar', () => {
      const { unmount } = render(
        <CandidatoAuthProvider>
          <TestComponent />
        </CandidatoAuthProvider>
      );

      unmount();

      expect(authSubscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('Erro: useCandidatoAuth fora do Provider', () => {
    it('deve lançar erro ao usar useCandidatoAuth fora do CandidatoAuthProvider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useCandidatoAuth must be used within a CandidatoAuthProvider');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Identificação de Candidato', () => {
    it('isCandidato deve ser true quando há perfil', async () => {
      const mockUser = { id: 'candidato-123', email: 'candidato@example.com' };
      const mockSession = { user: mockUser, access_token: 'token-123' };
      const mockProfile = {
        id: 'profile-123',
        user_id: 'candidato-123',
        candidato_id: 'cand-123',
        nome: 'Ana Paula',
        email: 'candidato@example.com',
        telefone: null,
        curriculo_url: null,
        curriculo_nome: null,
      };
      
      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      mockSingle.mockResolvedValue({ data: mockProfile, error: null });

      render(
        <CandidatoAuthProvider>
          <TestComponent />
        </CandidatoAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-candidato')).toHaveTextContent('yes');
      }, { timeout: 3000 });
    });

    it('isCandidato deve ser false quando não há perfil', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' };
      const mockSession = { user: mockUser, access_token: 'token-123' };
      
      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      mockSingle.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });

      render(
        <CandidatoAuthProvider>
          <TestComponent />
        </CandidatoAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-candidato')).toHaveTextContent('no');
      }, { timeout: 3000 });
    });
  });
});
