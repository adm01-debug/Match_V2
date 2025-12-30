import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'recruiter' | 'hiring_manager' | 'viewer';
  avatar?: string;
  company?: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface TwoFactorData {
  code: string;
  recoveryCode?: string;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const navigate = useNavigate();

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // In production, validate token with API
          const userData = localStorage.getItem('user_data');
          if (userData) {
            setState({
              user: JSON.parse(userData),
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return;
          }
        }
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
      setState((prev) => ({ ...prev, isLoading: false }));
    };
    checkSession();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<{ requires2FA: boolean }> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      // Mock API call - in production, call real auth endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate 2FA requirement for certain users
      if (credentials.email.includes('admin')) {
        return { requires2FA: true };
      }

      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
        role: 'recruiter',
        permissions: ['read:candidates', 'write:candidates', 'read:jobs'],
      };

      localStorage.setItem('auth_token', 'mock_token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));

      setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { requires2FA: false };
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Credenciais inválidas',
      }));
      throw error;
    }
  }, []);

  const verify2FA = useCallback(async (data: TwoFactorData): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // Mock verification
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (data.code !== '123456' && !data.recoveryCode) {
        throw new Error('Código inválido');
      }

      const mockUser: User = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin',
        role: 'admin',
        permissions: ['*'],
      };

      localStorage.setItem('auth_token', 'mock_token_2fa');
      localStorage.setItem('user_data', JSON.stringify(mockUser));

      setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Código 2FA inválido',
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    navigate('/login');
  }, [navigate]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!state.user) return false;
    if (state.user.permissions.includes('*')) return true;
    return state.user.permissions.includes(permission);
  }, [state.user]);

  const hasRole = useCallback((roles: User['role'] | User['role'][]): boolean => {
    if (!state.user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(state.user.role);
  }, [state.user]);

  return {
    ...state,
    login,
    logout,
    verify2FA,
    hasPermission,
    hasRole,
  };
}
