/**
 * @fileoverview Lazy Load Components
 * @module LazyLoad
 */

import React, { memo, ReactNode, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver, useLazyImage } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { PremiumSkeleton } from '@/components/ui/premium-skeleton';
import { ImageOff, Loader2 } from 'lucide-react';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  animateIn?: boolean;
  once?: boolean;
}

export const LazyLoad = memo(function LazyLoad({
  children,
  fallback,
  rootMargin = '100px',
  threshold = 0.1,
  className,
  animateIn = true,
  once = true,
}: LazyLoadProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin,
    threshold,
    triggerOnce: once,
  });

  const defaultFallback = (
    <div className="w-full h-32 flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      <AnimatePresence mode="wait">
        {isIntersecting ? (
          animateIn ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          ) : (
            children
          )
        ) : (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {fallback || defaultFallback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  placeholderClassName?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  rootMargin?: string;
  blurPreview?: boolean;
}

export const LazyImage = memo(function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  placeholderClassName,
  objectFit = 'cover',
  rootMargin = '200px',
  blurPreview = true,
}: LazyImageProps) {
  const { ref, imageSrc, isLoaded, error } = useLazyImage({
    src,
    rootMargin,
  });

  if (error) {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={cn(
          'flex items-center justify-center bg-muted rounded-lg',
          className
        )}
        style={{ width, height }}
      >
        <ImageOff className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      <AnimatePresence mode="wait">
        {!isLoaded && (
          <motion.div
            key="placeholder"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'absolute inset-0 bg-muted animate-pulse',
              placeholderClassName
            )}
          />
        )}
      </AnimatePresence>
      
      <motion.img
        src={imageSrc}
        alt={alt}
        className={cn(
          'w-full h-full transition-all duration-500',
          blurPreview && !isLoaded && 'blur-sm scale-105',
          isLoaded && 'blur-0 scale-100'
        )}
        style={{ objectFit }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
});

interface LazyComponentProps {
  component: React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>;
  fallback?: ReactNode;
  props?: Record<string, unknown>;
}

export const LazyComponent = memo(function LazyComponent({
  component: Component,
  fallback,
  props = {},
}: LazyComponentProps) {
  const defaultFallback = (
    <div className="w-full p-4">
      <PremiumSkeleton variant="card" className="w-full h-48" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <Component {...props} />
    </Suspense>
  );
});

interface FadeInOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  once?: boolean;
}

export const FadeInOnScroll = memo(function FadeInOnScroll({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 30,
  once = true,
}: FadeInOnScrollProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: once,
  });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
    }
  };

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={isIntersecting ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
    >
      {children}
    </motion.div>
  );
});

interface StaggerChildrenProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export const StaggerChildren = memo(function StaggerChildren({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
}: StaggerChildrenProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: once,
  });

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      initial="hidden"
      animate={isIntersecting ? 'visible' : 'hidden'}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
});

LazyLoad.displayName = 'LazyLoad';
LazyImage.displayName = 'LazyImage';
LazyComponent.displayName = 'LazyComponent';
FadeInOnScroll.displayName = 'FadeInOnScroll';
StaggerChildren.displayName = 'StaggerChildren';
