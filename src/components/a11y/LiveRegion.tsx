import { memo, ReactNode } from 'react';

interface LiveRegionProps {
  children: ReactNode;
  mode?: 'polite' | 'assertive';
}

export const LiveRegion = memo(({ children, mode = 'polite' }: LiveRegionProps) => (
  <div data-testid="live-region" role="status"
    aria-live={mode}
    aria-atomic="true"
    className="sr-only"
  >
    {children}
  </div>
));

LiveRegion.displayName = 'LiveRegion';
