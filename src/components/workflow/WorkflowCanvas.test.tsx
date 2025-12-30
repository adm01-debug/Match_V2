import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WorkflowCanvas } from './WorkflowCanvas';

vi.mock('reactflow', () => ({
  ReactFlow: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  Background: () => <div data-testid="background" />,
  Controls: () => <div data-testid="controls" />,
  MiniMap: () => <div data-testid="minimap" />,
  useNodesState: () => [[], vi.fn(), vi.fn()],
  useEdgesState: () => [[], vi.fn(), vi.fn()],
}));

describe('WorkflowCanvas', () => {
  const defaultProps = {
    nodes: [],
    edges: [],
    onNodesChange: vi.fn(),
    onEdgesChange: vi.fn(),
    onConnect: vi.fn(),
  };

  it('renders canvas', () => {
    render(<WorkflowCanvas {...defaultProps} />);
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('shows background grid', () => {
    render(<WorkflowCanvas {...defaultProps} />);
    expect(screen.getByTestId('background')).toBeInTheDocument();
  });

  it('shows controls', () => {
    render(<WorkflowCanvas {...defaultProps} />);
    expect(screen.getByTestId('controls')).toBeInTheDocument();
  });

  it('shows minimap', () => {
    render(<WorkflowCanvas {...defaultProps} showMinimap />);
    expect(screen.getByTestId('minimap')).toBeInTheDocument();
  });

  it('renders nodes', () => {
    const nodes = [{ id: '1', type: 'trigger', position: { x: 0, y: 0 }, data: {} }];
    render(<WorkflowCanvas {...defaultProps} nodes={nodes} />);
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });
});
