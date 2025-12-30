import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WorkflowEditor } from './WorkflowEditor';

vi.mock('reactflow', () => ({
  ReactFlow: ({ children }: { children: React.ReactNode }) => <div data-testid="react-flow">{children}</div>,
  Background: () => null,
  Controls: () => null,
  MiniMap: () => null,
  useNodesState: () => [[], vi.fn(), vi.fn()],
  useEdgesState: () => [[], vi.fn(), vi.fn()],
  ReactFlowProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('WorkflowEditor', () => {
  const defaultProps = {
    nodes: [],
    edges: [],
    onSave: vi.fn(),
  };

  it('renders workflow editor', () => {
    render(<WorkflowEditor {...defaultProps} />);
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  it('shows node palette', () => {
    render(<WorkflowEditor {...defaultProps} />);
    expect(screen.getByText(/nós/i)).toBeInTheDocument();
  });

  it('shows save button', () => {
    render(<WorkflowEditor {...defaultProps} />);
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
  });

  it('calls onSave when save button clicked', () => {
    render(<WorkflowEditor {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    expect(defaultProps.onSave).toHaveBeenCalled();
  });

  it('shows properties panel', () => {
    render(<WorkflowEditor {...defaultProps} />);
    expect(screen.getByText(/propriedades/i)).toBeInTheDocument();
  });

  it('disables save in read-only mode', () => {
    render(<WorkflowEditor {...defaultProps} readOnly />);
    expect(screen.queryByRole('button', { name: /salvar/i })).not.toBeInTheDocument();
  });
});
