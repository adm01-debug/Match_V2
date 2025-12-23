import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './carousel';

describe('Carousel', () => {
  it('renders carousel with items', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Item 1</CarouselItem>
          <CarouselItem>Item 2</CarouselItem>
        </CarouselContent>
      </Carousel>
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Item</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Carousel className="custom-class">
        <CarouselContent>
          <CarouselItem>Item</CarouselItem>
        </CarouselContent>
      </Carousel>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
