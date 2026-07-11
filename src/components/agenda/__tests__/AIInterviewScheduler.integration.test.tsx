/**
 * @fileoverview Integration tests para AIInterviewScheduler
 */
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/utils/test-utils';

vi.mock('@/hooks/useEntrevistas', () => ({
  useEntrevistas: () => ({ data: [] }),
}));

import { AIInterviewScheduler } from '@/components/agenda/AIInterviewScheduler';

describe('AIInterviewScheduler (integration)', () => {
  it('renderiza intro e permite acionar análise', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <AIInterviewScheduler onSelectSlot={onSelect} candidatoNome="Ana Souza" />,
    );

    expect(screen.getByText(/Agendar entrevista para Ana Souza/i)).toBeInTheDocument();
    const analyzeBtn = screen.getByRole('button', { name: /encontrar melhores horários/i });
    await user.click(analyzeBtn);

    // Após ~1.5s a IA "termina"
    await waitFor(
      () => expect(screen.getByText(/horários encontrados/i)).toBeInTheDocument(),
      { timeout: 3000 },
    );

    const slots = screen.getAllByTestId('suggested-slot');
    expect(slots.length).toBeGreaterThan(0);

    await user.click(slots[0]!);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
