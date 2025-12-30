import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BulkProgressModal } from './BulkProgressModal';

describe('BulkProgressModal', () => {
  const defaultProps = {
    open: true,
    title: 'Processando',
    progress: 50,
    total: 100,
    current: 50,
  };

  it('renders modal when open', () => {
    render(<BulkProgressModal {...defaultProps} />);
    expect(screen.getByText(/processando/i)).toBeInTheDocument();
  });

  it('shows progress bar', () => {
    render(<BulkProgressModal {...defaultProps} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows progress percentage', () => {
    render(<BulkProgressModal {...defaultProps} />);
    expect(screen.getByText(/50%/i)).toBeInTheDocument();
  });

  it('shows current/total count', () => {
    render(<BulkProgressModal {...defaultProps} />);
    expect(screen.getByText(/50 de 100/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<BulkProgressModal {...defaultProps} open={false} />);
    expect(screen.queryByText(/processando/i)).not.toBeInTheDocument();
  });

  it('shows completion state', () => {
    render(<BulkProgressModal {...defaultProps} progress={100} current={100} />);
    expect(screen.getByText(/concluído/i)).toBeInTheDocument();
  });

  it('shows error count if provided', () => {
    render(<BulkProgressModal {...defaultProps} errors={3} />);
    expect(screen.getByText(/3 erros/i)).toBeInTheDocument();
  });
});
