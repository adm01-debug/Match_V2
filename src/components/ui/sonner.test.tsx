import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Toaster } from './sonner';

describe('Sonner Toaster', () => {
  it('renders toaster component', () => {
    const { container } = render(<Toaster />);
    expect(container).toBeInTheDocument();
  });

  it('renders with custom theme', () => {
    const { container } = render(<Toaster theme="dark" />);
    expect(container).toBeInTheDocument();
  });

  it('renders with position', () => {
    const { container } = render(<Toaster position="top-right" />);
    expect(container).toBeInTheDocument();
  });
});
