import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingOverlay } from './LoadingOverlay';

describe('LoadingOverlay', () => {
  it('renders when isLoading is true', () => {
    render(<LoadingOverlay isLoading={true} />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('does not render when isLoading is false', () => {
    render(<LoadingOverlay isLoading={false} />);
    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<LoadingOverlay isLoading={true} message="Salvando..." />);
    expect(screen.getByText('Salvando...')).toBeInTheDocument();
  });

  it('has displayName', () => {
    expect(LoadingOverlay.displayName).toBe('LoadingOverlay');
  });
});

