/**
 * @fileoverview Premium Animated Routes Wrapper
 * @description Wrapper para animar transições entre rotas com efeitos premium
 */

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface AnimatedRoutesProps {
  children: ReactNode;
}

// Different animation variants for various transition styles
const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const slideRight = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const scale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
};

const slideUpScale = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.99 },
};

// Route categories for different animations
const getAnimationVariant = (pathname: string) => {
  // Dashboard - fade with scale for main entry
  if (pathname === '/') return slideUpScale;
  
  // Detail pages - slide from right
  if (pathname.includes('/vagas/') || pathname.includes('/candidato/')) return slideRight;
  
  // Auth pages - simple fade
  if (pathname.startsWith('/auth') || pathname.startsWith('/portal')) return fade;
  
  // Form pages - scale effect
  if (pathname.includes('/nova') || pathname.includes('/editar')) return scale;
  
  // Default - slide up
  return slideUp;
};

// Spring configuration for smooth, natural motion
const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

// Tween configuration for snappier transitions
const tweenTransition = {
  type: 'tween' as const,
  duration: 0.25,
  ease: [0.25, 0.46, 0.45, 0.94] as const, // Custom easing
};

export function AnimatedRoutes({ children }: AnimatedRoutesProps) {
  const location = useLocation();

  const variants = useMemo(() => getAnimationVariant(location.pathname), [location.pathname]);

  // Use spring for main routes, tween for auth/detail
  const isDetailOrAuth = location.pathname.startsWith('/auth') || 
                         location.pathname.startsWith('/portal') ||
                         location.pathname.includes('/vagas/') ||
                         location.pathname.includes('/candidato/');

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={isDetailOrAuth ? tweenTransition : springTransition}
        className="h-full w-full"
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
