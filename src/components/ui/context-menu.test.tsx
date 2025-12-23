import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from './context-menu';

describe('ContextMenu', () => {
  it('renders trigger element', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Action</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    expect(screen.getByText('Right click me')).toBeInTheDocument();
  });

  it('applies custom className to trigger', () => {
    const { container } = render(
      <ContextMenu>
        <ContextMenuTrigger className="custom">Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });
});
