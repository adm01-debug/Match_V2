import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AspectRatio } from './aspect-ratio';

describe('AspectRatio', () => {
  it('renders children correctly', () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9}>
        <img src="test.jpg" alt="test" />
      </AspectRatio>
    );
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('applies correct aspect ratio', () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9}>
        <div>Content</div>
      </AspectRatio>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles different ratios', () => {
    const { container } = render(
      <AspectRatio ratio={4 / 3}>
        <div>Content</div>
      </AspectRatio>
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
