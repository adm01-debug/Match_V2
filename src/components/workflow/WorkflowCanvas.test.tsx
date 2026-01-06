import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WorkflowCanvas } from './WorkflowCanvas';

describe('WorkflowCanvas', () => {
  it('renders workflow canvas', () => {
    render(<WorkflowCanvas />);
    expect(screen.getByText(/editor de workflow/i)).toBeInTheDocument();
  });

  it('shows default nodes when no initialNodes provided', () => {
    render(<WorkflowCanvas />);
    expect(screen.getByDisplayValue('Triagem')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Entrevista RH')).toBeInTheDocument();
  });

  it('renders with custom initial nodes', () => {
    const customNodes = [
      { id: '1', type: 'stage' as const, title: 'Custom Stage' },
    ];
    render(<WorkflowCanvas initialNodes={customNodes} />);
    expect(screen.getByDisplayValue('Custom Stage')).toBeInTheDocument();
  });

  it('shows add buttons for different node types', () => {
    render(<WorkflowCanvas />);
    expect(screen.getByRole('button', { name: /etapa/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ação/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /condição/i })).toBeInTheDocument();
  });

  it('shows empty state when no nodes', () => {
    render(<WorkflowCanvas initialNodes={[]} />);
    expect(screen.getByText(/nenhuma etapa definida/i)).toBeInTheDocument();
  });
});
