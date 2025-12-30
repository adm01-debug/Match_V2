import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LanguageSelector } from './LanguageSelector';

describe('LanguageSelector', () => {
  const defaultProps = {
    currentLanguage: 'pt-BR',
    onLanguageChange: vi.fn(),
  };

  it('renders language selector', () => {
    render(<LanguageSelector {...defaultProps} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows current language', () => {
    render(<LanguageSelector {...defaultProps} />);
    expect(screen.getByText(/português/i)).toBeInTheDocument();
  });

  it('shows language options on click', async () => {
    render(<LanguageSelector {...defaultProps} />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText(/english/i)).toBeInTheDocument();
    expect(screen.getByText(/español/i)).toBeInTheDocument();
  });

  it('calls onLanguageChange when language selected', () => {
    render(<LanguageSelector {...defaultProps} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText(/english/i));
    expect(defaultProps.onLanguageChange).toHaveBeenCalledWith('en');
  });

  it('shows flags when enabled', () => {
    render(<LanguageSelector {...defaultProps} showFlags />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
