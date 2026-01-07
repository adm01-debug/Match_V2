/**
 * @fileoverview Animated Routes Wrapper
 * @description Wrapper para animar transições entre rotas
 */

import { motion, AnimatePresence, Transition } from 'framer-motion';
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface AnimatedRoutesProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
};

const pageTransition: Transition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 35,
};

export function AnimatedRoutes({ children }: AnimatedRoutesProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
