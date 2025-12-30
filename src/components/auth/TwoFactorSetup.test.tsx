import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TwoFactorSetup } from './TwoFactorSetup';

// Mock hooks
const mockGenerateSecret = vi.fn();
const mockEnable2FA = vi.fn();
const mockGenerateRecoveryCodes = vi.fn();
const mockToast = vi.fn();

vi.mock('@/hooks/use2FA', () => ({
  use2FA: () => ({
    isEnabled: false,
    isLoading: false,
    qrCodeUrl: 'data:image/png;base64,mockQRCode',
    secret: 'JBSWY3DPEHPK3PXP',
    recoveryCodes: ['CODE1', 'CODE2', 'CODE3', 'CODE4', 'CODE5', 'CODE6', 'CODE7', 'CODE8'],
    generateSecret: mockGenerateSecret,
    enable2FA: mockEnable2FA,
    generateRecoveryCodes: mockGenerateRecoveryCodes,
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('TwoFactorSetup', () => {
  const defaultProps = {
    onComplete: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockEnable2FA.mockResolvedValue(true);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Rendering', () => {
    it('renders QR code section on generate step', () => {
      render(<TwoFactorSetup {...defaultProps} />);
      expect(screen.getByText(/Configurar 2FA/i)).toBeInTheDocument();
      expect(screen.getByAltText(/QR Code 2FA/i)).toBeInTheDocument();
    });

    it('shows manual code input option with secret', () => {
      render(<TwoFactorSetup {...defaultProps} />);
      expect(screen.getByText(/insira manualmente/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('JBSWY3DPEHPK3PXP')).toBeInTheDocument();
    });

    it('displays cancel button when onCancel is provided', () => {
      render(<TwoFactorSetup {...defaultProps} />);
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    });

    it('calls generateSecret on mount', () => {
      render(<TwoFactorSetup {...defaultProps} />);
      expect(mockGenerateSecret).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('navigates to verify step when clicking next', async () => {
      render(<TwoFactorSetup {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Verifique o código/i)).toBeInTheDocument();
      });
    });

    it('navigates back to generate step from verify', async () => {
      render(<TwoFactorSetup {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
      await waitFor(() => screen.getByText(/Verifique o código/i));
      
      fireEvent.click(screen.getByRole('button', { name: /voltar/i }));
      
      await waitFor(() => {
        expect(screen.getByAltText(/QR Code 2FA/i)).toBeInTheDocument();
      });
    });
  });

  describe('Code Verification', () => {
    it('accepts verification code input', async () => {
      const user = userEvent.setup();
      render(<TwoFactorSetup {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
      await waitFor(() => screen.getByLabelText(/código de verificação/i));
      
      const input = screen.getByRole('textbox');
      await user.type(input, '123456');
      
      expect(input).toHaveValue('123456');
    });

    it('only accepts numeric input', async () => {
      const user = userEvent.setup();
      render(<TwoFactorSetup {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
      await waitFor(() => screen.getByRole('textbox'));
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'abc123def');
      
      expect(input).toHaveValue('123');
    });

    it('calls enable2FA when code is submitted', async () => {
      const user = userEvent.setup();
      render(<TwoFactorSetup {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
      await waitFor(() => screen.getByRole('textbox'));
      
      const input = screen.getByRole('textbox');
      await user.type(input, '123456');
      
      fireEvent.click(screen.getByRole('button', { name: /verificar/i }));
      
      await waitFor(() => {
        expect(mockEnable2FA).toHaveBeenCalledWith('123456');
      });
    });

    it('shows error on invalid code', async () => {
      mockEnable2FA.mockResolvedValue(false);
      const user = userEvent.setup();
      render(<TwoFactorSetup {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
      await waitFor(() => screen.getByRole('textbox'));
      
      await user.type(screen.getByRole('textbox'), '000000');
      fireEvent.click(screen.getByRole('button', { name: /verificar/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/código inválido/i)).toBeInTheDocument();
      });
    });

    it('shows error when code is not 6 digits', async () => {
      const user = userEvent.setup();
      render(<TwoFactorSetup {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
      await waitFor(() => screen.getByRole('textbox'));
      
      await user.type(screen.getByRole('textbox'), '123');
      fireEvent.click(screen.getByRole('button', { name: /verificar/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/deve ter 6 dígitos/i)).toBeInTheDocument();
      });
    });
  });

  describe('Recovery Codes', () => {
    it('shows recovery codes after successful verification', async () => {
      const user = userEvent.setup();
      render(<TwoFactorSetup {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
      await waitFor(() => screen.getByRole('textbox'));
      
      await user.type(screen.getByRole('textbox'), '123456');
      fireEvent.click(screen.getByRole('button', { name: /verificar/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Salve seus códigos/i)).toBeInTheDocument();
        expect(screen.getByText('CODE1')).toBeInTheDocument();
      });
    });

    it('allows downloading recovery codes', async () => {
      const user = userEvent.setup();
      render(<TwoFactorSetup {...defaultProps} />);
      
      // Navigate to recovery step
      fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
      await waitFor(() => screen.getByRole('textbox'));
      await user.type(screen.getByRole('textbox'), '123456');
      fireEvent.click(screen.getByRole('button', { name: /verificar/i }));
      
      await waitFor(() => screen.getByText(/Baixar Códigos/i));
      
      fireEvent.click(screen.getByRole('button', { name: /baixar/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/códigos baixados/i)).toBeInTheDocument();
      });
    });
  });

  describe('Copy Secret', () => {
    it('copies secret to clipboard when copy button is clicked', async () => {
      render(<TwoFactorSetup {...defaultProps} />);
      
      const copyButton = screen.getByLabelText(/copiar chave secreta/i);
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('JBSWY3DPEHPK3PXP');
      });
    });
  });

  describe('Completion', () => {
    it('calls onComplete after downloading codes and completing', async () => {
      const user = userEvent.setup();
      render(<TwoFactorSetup {...defaultProps} />);
      
      // Navigate through all steps
      fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
      await waitFor(() => screen.getByRole('textbox'));
      await user.type(screen.getByRole('textbox'), '123456');
      fireEvent.click(screen.getByRole('button', { name: /verificar/i }));
      
      await waitFor(() => screen.getByText(/Baixar Códigos/i));
      fireEvent.click(screen.getByRole('button', { name: /baixar/i }));
      
      await waitFor(() => screen.getByText(/concluir configuração/i));
      fireEvent.click(screen.getByRole('button', { name: /concluir/i }));
      
      await waitFor(() => {
        expect(defaultProps.onComplete).toHaveBeenCalled();
      });
    });

    it('shows warning when trying to complete without downloading codes', async () => {
      const user = userEvent.setup();
      render(<TwoFactorSetup {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
      await waitFor(() => screen.getByRole('textbox'));
      await user.type(screen.getByRole('textbox'), '123456');
      fireEvent.click(screen.getByRole('button', { name: /verificar/i }));
      
      await waitFor(() => screen.getByText(/pular/i));
      fireEvent.click(screen.getByRole('button', { name: /pular/i }));
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            variant: 'destructive',
          })
        );
      });
    });
  });

  describe('Cancel', () => {
    it('calls onCancel when cancel button is clicked', () => {
      render(<TwoFactorSetup {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
      
      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });
});
