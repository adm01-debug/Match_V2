import type { Transition } from 'framer-motion';

export interface IllustrationProps {
  className?: string;
}

export const pulseTransition: Transition = {
  duration: 2,
  repeat: Infinity,
  ease: 'easeInOut',
};

export const floatTransition: Transition = {
  duration: 3,
  repeat: Infinity,
  ease: 'easeInOut',
};

export const shimmerTransition: Transition = {
  duration: 1.5,
  repeat: Infinity,
  ease: 'easeInOut',
};
