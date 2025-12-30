import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InstallPrompt } from './InstallPrompt';

describe('InstallPrompt', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders install prompt', () => {
    render(<InstallPrompt />);
    expect(screen.getByText(/instalar/i)).toBeInTheDocument();
  });

  it('shows install button', () => {
    render(<InstallPrompt />);
    expect(screen.getByRole('button', { name: /instalar/i })).toBeInTheDocument();
  });

  it('shows dismiss button', () => {
    render(<InstallPrompt />);
    expect(screen.getByRole('button', { name: /agora não/i })).toBeInTheDocument();
  });

  it('hides when dismissed', () => {
    render(<InstallPrompt />);
    fireEvent.click(screen.getByRole('button', { name: /agora não/i }));
    expect(screen.queryByText(/instalar/i)).not.toBeInTheDocument();
  });

  it('persists dismissal in localStorage', () => {
    render(<InstallPrompt />);
    fireEvent.click(screen.getByRole('button', { name: /agora não/i }));
    expect(localStorage.getItem('pwa-install-dismissed')).toBe('true');
  });

  it('does not show if already dismissed', () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    render(<InstallPrompt />);
    expect(screen.queryByText(/instalar/i)).not.toBeInTheDocument();
  });

  it('calls onInstall when install clicked', () => {
    const onInstall = vi.fn();
    render(<InstallPrompt onInstall={onInstall} />);
    fireEvent.click(screen.getByRole('button', { name: /instalar/i }));
    expect(onInstall).toHaveBeenCalled();
  });
});
