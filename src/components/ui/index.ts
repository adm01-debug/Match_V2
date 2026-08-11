/**
 * @fileoverview Centralized UI component exports
 * Premium UI components with animations and effects
 */

// Animated Components
export { AnimatedCard, AnimatedButtonWrapper, Shimmer, FloatingActionButton } from './animated-card';

// Premium Skeletons
export { 
  PremiumSkeleton,
  PremiumSkeletonCard,
  PremiumSkeletonTable,
  SkeletonCard,
  SkeletonTable,
  SkeletonKanban,
  SkeletonDashboard,
  SkeletonList
} from './premium-skeleton';

// Loaders
export { 
  ContextualLoader, 
  InlineLoader, 
  DotsLoader, 
  ProgressLoader, 
  AnimatedSkeletonText 
} from './contextual-loader';

// Haptic Feedback Effects
export { 
  RippleButton,
  PressableCard,
  BounceOnHover,
  PulseOnLoad,
  ShakeOnError,
  SuccessCheckmark
} from './haptic-feedback';

// Ripple Effects
export { RippleEffect, useRipple } from './ripple-effect';

// Confetti & Celebrations
export { 
  useConfetti,
  ConfettiTrigger,
  AutoConfetti
} from './confetti';


// Enhanced Toast
export { enhancedToast, showUserToast } from './enhanced-toast';

