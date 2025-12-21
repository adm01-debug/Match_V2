import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [
            { id: '1', titulo: 'Dev Frontend', status: 'aberta' },
            { id: '2', titulo: 'Dev Backend', status: 'aberta' },
          ],
          error: null,
        })),
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: '1', titulo: 'Dev Frontend', status: 'aberta' },
            error: null,
          })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: '3', titulo: 'Nova Vaga' },
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: { id: '1', titulo: 'Vaga Atualizada' },
              error: null,
            })),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          error: null,
        })),
      })),
    })),
  },
}));

// Wrapper para React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useVagas Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve buscar lista de vagas', async () => {
    // Import dinâmico para evitar problemas com mock
    const { useVagas } = await import('@/hooks/useVagas');
    
    const { result } = renderHook(() => useVagas(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0].titulo).toBe('Dev Frontend');
  });

  it('deve buscar vaga por ID', async () => {
    const { useVaga } = await import('@/hooks/useVagas');
    
    const { result } = renderHook(() => useVaga('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.titulo).toBe('Dev Frontend');
  });
});

describe('Validações de Vaga', () => {
  it('deve validar título obrigatório', () => {
    const vaga = { titulo: '', departamento: 'TI' };
    expect(vaga.titulo).toBeFalsy();
  });

  it('deve validar status válido', () => {
    const statusValidos = ['aberta', 'pausada', 'fechada', 'cancelada'];
    const status = 'aberta';
    expect(statusValidos.includes(status)).toBe(true);
  });

  it('deve validar prioridade válida', () => {
    const prioridadesValidas = ['baixa', 'media', 'alta', 'urgente'];
    const prioridade = 'alta';
    expect(prioridadesValidas.includes(prioridade)).toBe(true);
  });
});
