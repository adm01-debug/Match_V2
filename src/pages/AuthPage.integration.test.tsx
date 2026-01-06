/**
 * @fileoverview Testes de integração para AuthPage
 * @description Testes do componente de página de autenticação
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Mock do contexto de autenticação
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock do toast
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock dos hooks de título
vi.mock('@/hooks/useDocumentTitle', () => ({
  useDocumentTitle: () => {},
}));

vi.mock('@/hooks/usePageTitle', () => ({
  usePageTitle: () => {},
}));

describe('AuthPage Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: mockSignIn,
      signUp: mockSignUp,
    });
  });

  const renderAuthPage = async () => {
    const AuthPage = (await import('./AuthPage')).default;
    return render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );
  };

  describe('Renderização inicial', () => {
    it('deve renderizar a página de login', async () => {
      await renderAuthPage();

      expect(screen.getByText('Sistema de Recrutamento')).toBeInTheDocument();
      expect(screen.getByText('Entrar')).toBeInTheDocument();
      expect(screen.getByText('Cadastrar')).toBeInTheDocument();
    });

    it('deve mostrar loading quando authLoading é true', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        signIn: mockSignIn,
        signUp: mockSignUp,
      });

      await renderAuthPage();

      // Verifica se o loader está presente
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('deve redirecionar para home se usuário já logado', async () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'user-123', email: 'test@example.com' },
        loading: false,
        signIn: mockSignIn,
        signUp: mockSignUp,
      });

      await renderAuthPage();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('Formulário de Login', () => {
    it('deve mostrar erro de validação para email inválido', async () => {
      const user = userEvent.setup();
      await renderAuthPage();

      const emailInput = screen.getByPlaceholderText('seu@email.com');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      const passwordInput = passwordInputs[0];
      const submitButtons = screen.getAllByRole('button', { name: /entrar/i });
      const submitButton = submitButtons[0];

      if (emailInput && passwordInput && submitButton) {
        await user.type(emailInput, 'email-invalido');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        await waitFor(() => {
          expect(screen.getByText('Email inválido')).toBeInTheDocument();
        });
      }
    });

    it('deve mostrar erro de validação para senha curta', async () => {
      const user = userEvent.setup();
      await renderAuthPage();

      const emailInput = screen.getByPlaceholderText('seu@email.com');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      const passwordInput = passwordInputs[0];
      const submitButtons = screen.getAllByRole('button', { name: /entrar/i });
      const submitButton = submitButtons[0];

      if (emailInput && passwordInput && submitButton) {
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, '12345');
        await user.click(submitButton);

        await waitFor(() => {
          expect(screen.getByText('Senha deve ter pelo menos 6 caracteres')).toBeInTheDocument();
        });
      }
    });

    it('deve chamar signIn com credenciais válidas', async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValue({ error: null });
      
      await renderAuthPage();

      const emailInput = screen.getByPlaceholderText('seu@email.com');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      const passwordInput = passwordInputs[0];
      const submitButtons = screen.getAllByRole('button', { name: /entrar/i });
      const submitButton = submitButtons[0];

      if (emailInput && passwordInput && submitButton) {
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        await waitFor(() => {
          expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
        });
      }
    });

    it('deve mostrar toast de sucesso após login', async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValue({ error: null });
      
      await renderAuthPage();

      const emailInput = screen.getByPlaceholderText('seu@email.com');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      const passwordInput = passwordInputs[0];
      const submitButtons = screen.getAllByRole('button', { name: /entrar/i });
      const submitButton = submitButtons[0];

      if (emailInput && passwordInput && submitButton) {
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith({
            title: 'Bem-vindo!',
            description: 'Login realizado com sucesso.',
          });
        });
      }
    });

    it('deve mostrar toast de erro para credenciais inválidas', async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValue({ 
        error: { message: 'Invalid login credentials' } 
      });
      
      await renderAuthPage();

      const emailInput = screen.getByPlaceholderText('seu@email.com');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      const passwordInput = passwordInputs[0];
      const submitButtons = screen.getAllByRole('button', { name: /entrar/i });
      const submitButton = submitButtons[0];

      if (emailInput && passwordInput && submitButton) {
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(submitButton);

        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith({
            variant: 'destructive',
            title: 'Erro ao entrar',
            description: 'Email ou senha incorretos',
          });
        });
      }
    });
  });

  describe('Formulário de Cadastro', () => {
    it('deve alternar para aba de cadastro', async () => {
      const user = userEvent.setup();
      await renderAuthPage();

      const cadastrarTab = screen.getByRole('tab', { name: /cadastrar/i });
      await user.click(cadastrarTab);

      expect(screen.getByText('Criar conta')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Seu nome')).toBeInTheDocument();
    });
  });

  describe('Estados de Loading', () => {
    it('deve mostrar loading durante login', async () => {
      const user = userEvent.setup();
      mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100)));
      
      await renderAuthPage();

      const emailInput = screen.getByPlaceholderText('seu@email.com');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      const passwordInput = passwordInputs[0];
      const submitButtons = screen.getAllByRole('button', { name: /entrar/i });
      const submitButton = submitButtons[0];

      if (emailInput && passwordInput && submitButton) {
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        expect(screen.getByText('Entrando...')).toBeInTheDocument();
      }
    });
  });
});
