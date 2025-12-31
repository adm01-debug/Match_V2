import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TwoFactorVerify } from './TwoFactorVerify';

// Mock the use2FA hook
vi.mock('@/hooks/use2FA', () => ({
  use2FA: () => ({
    verify2FA: {
      mutateAsync: vi.fn().mockResolvedValue(true),
    },
  }),
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('TwoFactorVerify', () => {
  const defaultProps = {
    onSuccess: vi.fn(),
    onCancel: vi.fn(),
  };

  it('renders verification form', () => {
    render(<TwoFactorVerify {...defaultProps} />);
    expect(screen.getByText(/verificação/i)).toBeInTheDocument();
  });

  it('accepts code input', () => {
    render(<TwoFactorVerify {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '123456' } });
    expect(input).toHaveValue('123456');
  });

  it('shows recovery code option', () => {
    render(<TwoFactorVerify {...defaultProps} />);
    expect(screen.getByText(/código de recuperação/i)).toBeInTheDocument();
  });

  it('has verify button', () => {
    render(<TwoFactorVerify {...defaultProps} />);
    expect(screen.getByRole('button', { name: /verificar/i })).toBeInTheDocument();
  });

  it('shows cancel button when onCancel is provided', () => {
    render(<TwoFactorVerify {...defaultProps} />);
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<TwoFactorVerify {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
