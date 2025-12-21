import { memo, ReactNode } from 'react';

interface VisuallyHiddenProps {
  children: ReactNode;
}

export const VisuallyHidden = memo(({ children }: VisuallyHiddenProps) => (
  <span className="absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0 clip-[rect(0,0,0,0)]">
    {children}
  </span>
));

VisuallyHidden.displayName = 'VisuallyHidden';
