import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No items" />);
    expect(screen.getByText('No items')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<EmptyState title="No items" description="Add some items" />);
    expect(screen.getByText('Add some items')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<EmptyState title="No items" icon={<span data-testid="icon">📭</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders action', () => {
    render(
      <EmptyState
        title="No items"
        action={<button>Add Item</button>}
      />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
