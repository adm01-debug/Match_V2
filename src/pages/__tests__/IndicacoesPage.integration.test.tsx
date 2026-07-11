/**
 * @fileoverview Integration tests para IndicacoesPage
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/utils/test-utils';

// Mocks
vi.mock('@/hooks/usePageTitle', () => ({ usePageTitle: vi.fn() }));
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u1', email: 'me@test.com', user_metadata: { nome: 'Tester' } },
  }),
}));

const mockVagas = [
  { id: 'v1', titulo: 'Dev Sênior', status: 'publicada' },
  { id: 'v2', titulo: 'PM', status: 'publicada' },
];
vi.mock('@/hooks/useVagas', () => ({
  useVagas: () => ({ data: mockVagas }),
}));

vi.mock('@/components/layout/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockIndicacoes = [
  {
    id: 'i1',
    indicador_user_id: 'u1',
    indicador_nome: 'Tester',
    indicador_email: 'me@test.com',
    candidato_nome: 'João da Silva',
    candidato_email: 'joao@test.com',
    candidato_telefone: null,
    vaga_id: 'v1',
    vaga_titulo: 'Dev Sênior',
    observacao: null,
    status: 'pendente',
    bonus: 0,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

const insertMock = vi.fn().mockResolvedValue({ error: null });
const updateEqMock = vi.fn().mockResolvedValue({ error: null });

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: mockIndicacoes, error: null }),
      }),
      insert: (payload: unknown) => {
        insertMock(payload);
        return Promise.resolve({ error: null });
      },
      update: (payload: unknown) => ({
        eq: (col: string, val: string) => {
          updateEqMock(payload, col, val);
          return Promise.resolve({ error: null });
        },
      }),
    })),
  },
}));

import IndicacoesPage from '@/pages/IndicacoesPage';

describe('IndicacoesPage (integration)', () => {
  beforeEach(() => {
    insertMock.mockClear();
    updateEqMock.mockClear();
  });

  it('renderiza header e KPIs após carregar', async () => {
    render(<IndicacoesPage />);
    expect(await screen.findByText('Programa de Indicações')).toBeInTheDocument();
    expect(await screen.findByText('João da Silva')).toBeInTheDocument();
    expect(screen.getByText('Total Indicações')).toBeInTheDocument();
  });

  it('valida campos obrigatórios ao registrar indicação', async () => {
    const user = userEvent.setup();
    render(<IndicacoesPage />);
    await screen.findByText('João da Silva');

    await user.click(screen.getByRole('button', { name: /nova indicação/i }));
    const dialog = await screen.findByRole('dialog');
    const submit = await screen.findByRole('button', { name: /registrar indicação/i });
    await user.click(submit);

    // Não deve chamar insert quando faltam campos
    await waitFor(() => expect(insertMock).not.toHaveBeenCalled());
    expect(dialog).toBeInTheDocument();
  });

  it('registra indicação quando os campos obrigatórios estão preenchidos', async () => {
    const user = userEvent.setup();
    render(<IndicacoesPage />);
    await screen.findByText('João da Silva');

    await user.click(screen.getByRole('button', { name: /nova indicação/i }));
    await screen.findByRole('dialog');

    await user.type(screen.getByLabelText(/nome do candidato/i), 'Maria');
    await user.type(screen.getByLabelText(/e-mail/i), 'maria@test.com');

    // Seleciona vaga
    await user.click(screen.getByRole('combobox', { name: /vaga de interesse/i }));
    await user.click(await screen.findByRole('option', { name: 'Dev Sênior' }));

    await user.click(screen.getByRole('button', { name: /registrar indicação/i }));

    await waitFor(() => expect(insertMock).toHaveBeenCalledTimes(1));
    expect(insertMock.mock.calls[0]?.[0]).toMatchObject({
      candidato_nome: 'Maria',
      candidato_email: 'maria@test.com',
      vaga_id: 'v1',
      status: 'pendente',
    });
  });
});
