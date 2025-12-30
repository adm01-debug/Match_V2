import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BulkSelectionBar } from './BulkSelectionBar';

describe('BulkSelectionBar', () => {
  const defaultProps = {
    selectedCount: 5,
    totalCount: 100,
    onClearSelection: vi.fn(),
    onSelectAll: vi.fn(),
    actions: [
      { label: 'Exportar', onClick: vi.fn() },
      { label: 'Deletar', onClick: vi.fn(), variant: 'destructive' as const },
    ],
  };

  it('renders selection bar', () => {
    render(<BulkSelectionBar {...defaultProps} />);
    expect(screen.getByText(/5 selecionados/i)).toBeInTheDocument();
  });

  it('shows action buttons', () => {
    render(<BulkSelectionBar {...defaultProps} />);
    expect(screen.getByRole('button', { name: /exportar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deletar/i })).toBeInTheDocument();
  });

  it('calls onClearSelection when clear clicked', () => {
    render(<BulkSelectionBar {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /limpar/i }));
    expect(defaultProps.onClearSelection).toHaveBeenCalled();
  });

  it('calls onSelectAll when select all clicked', () => {
    render(<BulkSelectionBar {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /selecionar todos/i }));
    expect(defaultProps.onSelectAll).toHaveBeenCalled();
  });

  it('calls action onClick when action clicked', () => {
    render(<BulkSelectionBar {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /exportar/i }));
    expect(defaultProps.actions[0].onClick).toHaveBeenCalled();
  });

  it('hides when no items selected', () => {
    render(<BulkSelectionBar {...defaultProps} selectedCount={0} />);
    expect(screen.queryByText(/selecionados/i)).not.toBeInTheDocument();
  });
});
