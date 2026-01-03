import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress } from './progress';

describe('Progress', () => {
  it('renders without crashing', () => {
    render(<Progress value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders with correct value', () => {
    render(<Progress value={75} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '75');
  });

  it('handles 0 value', () => {
    render(<Progress value={0} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
  });

  it('handles 100 value', () => {
    render(<Progress value={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
  });

  it('handles undefined value', () => {
    render(<Progress />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Progress value={50} className="custom-class" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveClass('custom-class');
  });

  it('has correct base classes', () => {
    render(<Progress value={50} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveClass('relative', 'overflow-hidden', 'rounded-full');
  });

  it('contains indicator element', () => {
    render(<Progress value={50} data-testid="progress" />);
    const progressbar = screen.getByRole('progressbar');
    const indicator = progressbar.querySelector('[class*="bg-primary"]');
    expect(indicator).toBeInTheDocument();
  });

  it('indicator has correct transform for 50%', () => {
    render(<Progress value={50} />);
    const progressbar = screen.getByRole('progressbar');
    const indicator = progressbar.firstChild as HTMLElement;
    expect(indicator.style.transform).toBe('translateX(-50%)');
  });

  it('indicator has correct transform for 0%', () => {
    render(<Progress value={0} />);
    const progressbar = screen.getByRole('progressbar');
    const indicator = progressbar.firstChild as HTMLElement;
    expect(indicator.style.transform).toBe('translateX(-100%)');
  });

  it('indicator has correct transform for 100%', () => {
    render(<Progress value={100} />);
    const progressbar = screen.getByRole('progressbar');
    const indicator = progressbar.firstChild as HTMLElement;
    expect(indicator.style.transform).toBe('translateX(-0%)');
  });
});
