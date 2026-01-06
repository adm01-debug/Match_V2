import { useState, useCallback, useEffect, useRef } from 'react';
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

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';
const TOKEN_EXPIRY_KEY = 'token_expiry';

// Token expiry (24 hours)
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

// Secure storage helpers
function setSecureStorage(key: string, value: string, rememberMe = false): void {
  try {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(key, value);
  } catch (error) {
    console.error('[useAuth] Storage error:', error);
  }
}

function getSecureStorage(key: string): string | null {
  try {
    return sessionStorage.getItem(key) ?? localStorage.getItem(key);
  } catch {
    return null;
  }
}

function clearSecureStorage(): void {
  try {
    [AUTH_TOKEN_KEY, USER_DATA_KEY, TOKEN_EXPIRY_KEY].forEach(key => {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('[useAuth] Clear storage error:', error);
  }
}

function isTokenExpired(): boolean {
  const expiry = getSecureStorage(TOKEN_EXPIRY_KEY);
  if (!expiry) return true;
  return Date.now() > parseInt(expiry, 10);
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const navigate = useNavigate();
  const isMountedRef = useRef(true);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Safe state update
  const safeSetState = useCallback((update: Partial<AuthState> | ((prev: AuthState) => AuthState)) => {
    if (isMountedRef.current) {
      setState(prev => typeof update === 'function' ? update(prev) : { ...prev, ...update });
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    isMountedRef.current = true;

    const checkSession = async () => {
      try {
        const token = getSecureStorage(AUTH_TOKEN_KEY);
        
        if (token && !isTokenExpired()) {
          const userData = getSecureStorage(USER_DATA_KEY);
          if (userData) {
            const user = JSON.parse(userData);
            safeSetState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            scheduleTokenRefresh();
            return;
          }
        } else if (token) {
          // Token expired, clear storage
          clearSecureStorage();
        }
      } catch (error) {
        console.error('[useAuth] Session check error:', error);
        clearSecureStorage();
      }
      
      safeSetState({ isLoading: false });
    };

    checkSession();

    // Listen for storage changes (logout from other tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_TOKEN_KEY && !e.newValue) {
        safeSetState({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('storage', handleStorageChange);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [safeSetState]);

  // Schedule token refresh
  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Refresh 5 minutes before expiry
    const refreshIn = TOKEN_EXPIRY_MS - (5 * 60 * 1000);
    
    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        // In production, call refresh token endpoint
        const newExpiry = Date.now() + TOKEN_EXPIRY_MS;
        const storage = localStorage.getItem(AUTH_TOKEN_KEY) ? localStorage : sessionStorage;
        storage.setItem(TOKEN_EXPIRY_KEY, newExpiry.toString());
        
        scheduleTokenRefresh();
      } catch (error) {
        console.error('[useAuth] Token refresh error:', error);
      }
    }, refreshIn);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<{ requires2FA: boolean }> => {
    safeSetState({ isLoading: true, error: null });
    
    try {
      // Validate credentials
      if (!credentials.email?.trim() || !credentials.password) {
        throw new Error('Email e senha são obrigatórios');
      }

      // Mock API call - in production, call real auth endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate 2FA requirement for admin users
      if (credentials.email.toLowerCase().includes('admin')) {
        return { requires2FA: true };
      }

      const emailPrefix = credentials.email.split('@')[0] || 'user';
      const mockUser: User = {
        id: crypto.randomUUID?.() || `user-${Date.now()}`,
        email: credentials.email,
        name: emailPrefix,
        role: 'recruiter',
        permissions: ['read:candidates', 'write:candidates', 'read:jobs'],
      };

      const expiry = Date.now() + TOKEN_EXPIRY_MS;
      const mockToken = btoa(`${mockUser.id}:${expiry}`);

      setSecureStorage(AUTH_TOKEN_KEY, mockToken, credentials.rememberMe);
      setSecureStorage(USER_DATA_KEY, JSON.stringify(mockUser), credentials.rememberMe);
      setSecureStorage(TOKEN_EXPIRY_KEY, expiry.toString(), credentials.rememberMe);

      safeSetState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      scheduleTokenRefresh();
      return { requires2FA: false };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Credenciais inválidas';
      safeSetState({
        isLoading: false,
        error: message,
      });
      throw error;
    }
  }, [safeSetState, scheduleTokenRefresh]);

  const verify2FA = useCallback(async (data: TwoFactorData): Promise<void> => {
    safeSetState({ isLoading: true, error: null });
    
    try {
      if (!data.code?.trim() && !data.recoveryCode?.trim()) {
        throw new Error('Código de verificação é obrigatório');
      }

      // Mock verification - in production, validate with API
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Validate code format (6 digits)
      if (data.code && !/^\d{6}$/.test(data.code)) {
        throw new Error('Código deve ter 6 dígitos');
      }

      const mockUser: User = {
        id: crypto.randomUUID?.() || `admin-${Date.now()}`,
        email: 'admin@example.com',
        name: 'Admin',
        role: 'admin',
        permissions: ['*'],
      };

      const expiry = Date.now() + TOKEN_EXPIRY_MS;
      const mockToken = btoa(`${mockUser.id}:${expiry}:2fa`);

      setSecureStorage(AUTH_TOKEN_KEY, mockToken, true);
      setSecureStorage(USER_DATA_KEY, JSON.stringify(mockUser), true);
      setSecureStorage(TOKEN_EXPIRY_KEY, expiry.toString(), true);

      safeSetState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      scheduleTokenRefresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Código 2FA inválido';
      safeSetState({
        isLoading: false,
        error: message,
      });
      throw error;
    }
  }, [safeSetState, scheduleTokenRefresh]);

  const logout = useCallback(async () => {
    try {
      // In production, call logout endpoint to invalidate token
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error('[useAuth] Logout error:', error);
    } finally {
      clearSecureStorage();
      
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      safeSetState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      navigate('/login');
    }
  }, [navigate, safeSetState]);

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

  const clearError = useCallback(() => {
    safeSetState({ error: null });
  }, [safeSetState]);

  return {
    ...state,
    login,
    logout,
    verify2FA,
    hasPermission,
    hasRole,
    clearError,
  };
}

export default useAuth;
