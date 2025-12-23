import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card';

describe('HoverCard', () => {
  it('renders trigger element', () => {
    render(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>Card content</HoverCardContent>
      </HoverCard>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <HoverCard>
        <HoverCardTrigger className="trigger-class">Trigger</HoverCardTrigger>
        <HoverCardContent>Content</HoverCardContent>
      </HoverCard>
    );
    expect(container.querySelector('.trigger-class')).toBeInTheDocument();
  });
});
