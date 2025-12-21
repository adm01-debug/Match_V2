import { memo, ReactNode } from 'react';

interface LiveRegionProps {
  children: ReactNode;
  mode?: 'polite' | 'assertive';
}

export const LiveRegion = memo(({ children, mode = 'polite' }: LiveRegionProps) => (
  <div
    role="status"
    aria-live={mode}
    aria-atomic="true"
    className="sr-only"
  >
    {children}
  </div>
));

LiveRegion.displayName = 'LiveRegion';
