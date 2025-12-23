import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea, ScrollBar } from './scroll-area';

describe('ScrollArea', () => {
  it('renders scrollable content', () => {
    render(
      <ScrollArea className="h-[200px] w-[350px]">
        <div>Scrollable content here</div>
      </ScrollArea>
    );
    expect(screen.getByText('Scrollable content here')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <ScrollArea className="custom-scroll">
        <div>Content</div>
      </ScrollArea>
    );
    expect(container.querySelector('.custom-scroll')).toBeInTheDocument();
  });

  it('renders ScrollBar', () => {
    const { container } = render(
      <ScrollArea>
        <div>Content</div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    );
    expect(container).toBeInTheDocument();
  });
});
