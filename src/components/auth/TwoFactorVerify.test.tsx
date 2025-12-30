import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TwoFactorVerify } from './TwoFactorVerify';

describe('TwoFactorVerify', () => {
  const defaultProps = {
    onVerify: vi.fn().mockResolvedValue(true),
    onUseRecoveryCode: vi.fn(),
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

  it('calls onVerify with entered code', async () => {
    render(<TwoFactorVerify {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /verificar/i }));
    await waitFor(() => {
      expect(defaultProps.onVerify).toHaveBeenCalledWith('123456');
    });
  });

  it('shows recovery code option', () => {
    render(<TwoFactorVerify {...defaultProps} showRecoveryOption />);
    expect(screen.getByText(/código de recuperação/i)).toBeInTheDocument();
  });

  it('calls onUseRecoveryCode when clicked', () => {
    render(<TwoFactorVerify {...defaultProps} showRecoveryOption />);
    fireEvent.click(screen.getByText(/código de recuperação/i));
    expect(defaultProps.onUseRecoveryCode).toHaveBeenCalled();
  });

  it('shows error message on failed verification', async () => {
    const onVerify = vi.fn().mockResolvedValue(false);
    render(<TwoFactorVerify {...defaultProps} onVerify={onVerify} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '000000' } });
    fireEvent.click(screen.getByRole('button', { name: /verificar/i }));
    await waitFor(() => {
      expect(screen.getByText(/código inválido/i)).toBeInTheDocument();
    });
  });

  it('shows remaining attempts', () => {
    render(<TwoFactorVerify {...defaultProps} remainingAttempts={2} />);
    expect(screen.getByText(/2 tentativas/i)).toBeInTheDocument();
  });
});
