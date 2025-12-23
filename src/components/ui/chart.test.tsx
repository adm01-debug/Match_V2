import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from './chart';

describe('Chart', () => {
  const mockConfig = {
    desktop: { label: 'Desktop', color: '#000' },
    mobile: { label: 'Mobile', color: '#fff' },
  };

  it('renders ChartContainer', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <div>Chart content</div>
      </ChartContainer>
    );
    expect(container).toBeInTheDocument();
  });

  it('renders ChartTooltipContent', () => {
    const { container } = render(
      <ChartTooltipContent />
    );
    expect(container).toBeInTheDocument();
  });

  it('renders ChartLegendContent', () => {
    const { container } = render(
      <ChartLegendContent payload={[]} />
    );
    expect(container).toBeInTheDocument();
  });
});
