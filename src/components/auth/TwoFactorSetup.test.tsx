import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TwoFactorSetup } from './TwoFactorSetup';

describe('TwoFactorSetup', () => {
  const defaultProps = {
    secret: 'JBSWY3DPEHPK3PXP',
    accountName: 'test@example.com',
    issuer: 'Match ATS',
    onVerify: vi.fn().mockResolvedValue(true),
    onComplete: vi.fn(),
  };

  it('renders QR code section', () => {
    render(<TwoFactorSetup {...defaultProps} />);
    expect(screen.getByText(/configurar autenticador/i)).toBeInTheDocument();
  });

  it('shows manual code option', () => {
    render(<TwoFactorSetup {...defaultProps} />);
    expect(screen.getByText(/código manualmente/i)).toBeInTheDocument();
  });

  it('accepts verification code input', () => {
    render(<TwoFactorSetup {...defaultProps} />);
    const input = screen.getByPlaceholderText(/000000/i);
    fireEvent.change(input, { target: { value: '123456' } });
    expect(input).toHaveValue('123456');
  });

  it('calls onVerify when code is submitted', async () => {
    render(<TwoFactorSetup {...defaultProps} />);
    const input = screen.getByPlaceholderText(/000000/i);
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /verificar/i }));
    await waitFor(() => {
      expect(defaultProps.onVerify).toHaveBeenCalledWith('123456');
    });
  });

  it('shows error on invalid code', async () => {
    const onVerify = vi.fn().mockResolvedValue(false);
    render(<TwoFactorSetup {...defaultProps} onVerify={onVerify} />);
    const input = screen.getByPlaceholderText(/000000/i);
    fireEvent.change(input, { target: { value: '000000' } });
    fireEvent.click(screen.getByRole('button', { name: /verificar/i }));
    await waitFor(() => {
      expect(screen.getByText(/código incorreto/i)).toBeInTheDocument();
    });
  });

  it('calls onComplete after successful verification', async () => {
    render(<TwoFactorSetup {...defaultProps} />);
    const input = screen.getByPlaceholderText(/000000/i);
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /verificar/i }));
    await waitFor(() => {
      expect(defaultProps.onComplete).toHaveBeenCalled();
    });
  });

  it('only accepts numeric input', () => {
    render(<TwoFactorSetup {...defaultProps} />);
    const input = screen.getByPlaceholderText(/000000/i);
    fireEvent.change(input, { target: { value: 'abc123' } });
    expect(input).toHaveValue('123');
  });
});
