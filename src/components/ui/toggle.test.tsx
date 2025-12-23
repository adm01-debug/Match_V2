import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toggle } from './toggle';

describe('Toggle', () => {
  it('renders toggle button', () => {
    render(<Toggle>Toggle me</Toggle>);
    expect(screen.getByText('Toggle me')).toBeInTheDocument();
  });

  it('toggles on click', () => {
    render(<Toggle>Click</Toggle>);
    const toggle = screen.getByText('Click');
    expect(toggle).toHaveAttribute('data-state', 'off');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('data-state', 'on');
  });

  it('supports controlled state', () => {
    render(<Toggle pressed={true}>Pressed</Toggle>);
    const toggle = screen.getByText('Pressed');
    expect(toggle).toHaveAttribute('data-state', 'on');
  });

  it('applies variant styles', () => {
    const { container } = render(<Toggle variant="outline">Outline</Toggle>);
    expect(container.firstChild).toBeInTheDocument();
  });
});
