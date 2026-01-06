import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { WorkflowEditor } from './WorkflowEditor';
import type { Workflow } from '@/types/workflow';

vi.mock('reactflow', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="react-flow">{children}</div>,
  ReactFlow: ({ children }: { children: React.ReactNode }) => <div data-testid="react-flow">{children}</div>,
  Background: () => null,
  Controls: () => null,
  MiniMap: () => null,
  addEdge: vi.fn((params, edges) => [...edges, params]),
  useNodesState: () => [[], vi.fn(), vi.fn()],
  useEdgesState: () => [[], vi.fn(), vi.fn()],
  ReactFlowProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockWorkflow: Workflow = {
  id: '1',
  name: 'Test Workflow',
  description: 'Test description',
  isActive: false,
  nodes: [],
  edges: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('WorkflowEditor', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <WorkflowEditor workflow={mockWorkflow} onSave={mockOnSave} {...props} />
      </BrowserRouter>
    );
  };

  it('renders workflow editor', () => {
    renderComponent();
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  it('shows save button', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
  });

  it('calls onSave when save button clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    expect(mockOnSave).toHaveBeenCalled();
  });
});
