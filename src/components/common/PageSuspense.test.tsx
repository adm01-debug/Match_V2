import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageSuspense } from './PageSuspense';

describe('PageSuspense', () => {
  it('renders children', () => {
    render(
      <PageSuspense>
        <div data-testid="content">Content</div>
      </PageSuspense>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders custom fallback', () => {
    render(
      <PageSuspense fallback={<div data-testid="loading">Loading...</div>}>
        <div>Content</div>
      </PageSuspense>
    );
    // Children should render immediately if not suspended
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('has displayName', () => {
    expect(PageSuspense.displayName).toBe('PageSuspense');
  });
});
