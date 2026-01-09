/**
 * @fileoverview Gesture Navigation Components for Mobile
 * @module GestureNavigation
 */

import { memo, ReactNode, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GestureNavigationProps {
  children: ReactNode[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
  showIndicators?: boolean;
  showArrows?: boolean;
  loop?: boolean;
}

export const GestureNavigation = memo(function GestureNavigation({
  children,
  currentIndex = 0,
  onIndexChange,
  className,
  showIndicators = true,
  showArrows = false,
  loop = false,
}: GestureNavigationProps) {
  const [index, setIndex] = useState(currentIndex);
  const x = useMotionValue(0);
  const total = children.length;

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    let newIndex = index;

    if (offset < -threshold || velocity < -500) {
      newIndex = loop ? (index + 1) % total : Math.min(index + 1, total - 1);
    } else if (offset > threshold || velocity > 500) {
      newIndex = loop ? (index - 1 + total) % total : Math.max(index - 1, 0);
    }

    if (newIndex !== index) {
      setIndex(newIndex);
      onIndexChange?.(newIndex);
    }
  }, [index, total, loop, onIndexChange]);

  const goToIndex = (newIndex: number) => {
    setIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  const goNext = () => {
    const newIndex = loop ? (index + 1) % total : Math.min(index + 1, total - 1);
    goToIndex(newIndex);
  };

  const goPrev = () => {
    const newIndex = loop ? (index - 1 + total) % total : Math.max(index - 1, 0);
    goToIndex(newIndex);
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            onClick={goPrev}
            disabled={!loop && index === 0}
            className={cn(
              'absolute left-2 top-1/2 -translate-y-1/2 z-10',
              'p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-lg',
              'transition-opacity hover:bg-background',
              !loop && index === 0 && 'opacity-30 cursor-not-allowed'
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goNext}
            disabled={!loop && index === total - 1}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 z-10',
              'p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-lg',
              'transition-opacity hover:bg-background',
              !loop && index === total - 1 && 'opacity-30 cursor-not-allowed'
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="flex touch-pan-y"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full flex-shrink-0"
          >
            {children[index]}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Indicators */}
      {showIndicators && total > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {children.map((_, i) => (
            <button
              key={i}
              onClick={() => goToIndex(i)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                i === index
                  ? 'w-6 bg-primary'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
});

interface SwipeableTabsProps {
  tabs: { id: string; label: string; content: ReactNode }[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export const SwipeableTabs = memo(function SwipeableTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: SwipeableTabsProps) {
  const [currentTab, setCurrentTab] = useState(activeTab || tabs[0]?.id);
  const currentIndex = tabs.findIndex(t => t.id === currentTab);

  const handleIndexChange = (index: number) => {
    const tab = tabs[index];
    if (tab) {
      setCurrentTab(tab.id);
      onTabChange?.(tab.id);
    }
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Tab Headers */}
      <div className="relative flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => handleIndexChange(index)}
            className={cn(
              'flex-1 py-3 text-sm font-medium transition-colors',
              tab.id === currentTab
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
        
        {/* Active Indicator */}
        <motion.div
          className="absolute bottom-0 h-0.5 bg-primary"
          animate={{
            left: `${(currentIndex / tabs.length) * 100}%`,
            width: `${100 / tabs.length}%`,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>

      {/* Tab Content with Swipe */}
      <GestureNavigation
        currentIndex={currentIndex}
        onIndexChange={handleIndexChange}
        showIndicators={false}
        className="flex-1"
      >
        {tabs.map(tab => (
          <div key={tab.id} className="py-4">
            {tab.content}
          </div>
        ))}
      </GestureNavigation>
    </div>
  );
});

interface EdgeSwipeNavigationProps {
  onSwipeBack?: () => void;
  onSwipeForward?: () => void;
  children: ReactNode;
  edgeWidth?: number;
  className?: string;
}

export const EdgeSwipeNavigation = memo(function EdgeSwipeNavigation({
  onSwipeBack,
  onSwipeForward,
  children,
  className,
}: EdgeSwipeNavigationProps) {
  const [showBackIndicator, setShowBackIndicator] = useState(false);
  const [showForwardIndicator, setShowForwardIndicator] = useState(false);
  const x = useMotionValue(0);

  const backOpacity = useTransform(x, [0, 100], [0, 1]);
  const forwardOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100 && onSwipeBack) {
      onSwipeBack();
    } else if (info.offset.x < -100 && onSwipeForward) {
      onSwipeForward();
    }
    setShowBackIndicator(false);
    setShowForwardIndicator(false);
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Back Indicator */}
      <AnimatePresence>
        {showBackIndicator && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center bg-gradient-to-r from-primary/20 to-transparent z-10"
            style={{ opacity: backOpacity }}
          >
            <ChevronLeft className="h-6 w-6 text-primary" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forward Indicator */}
      <AnimatePresence>
        {showForwardIndicator && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center bg-gradient-to-l from-primary/20 to-transparent z-10"
            style={{ opacity: forwardOpacity }}
          >
            <ChevronRight className="h-6 w-6 text-primary" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={(_, info) => {
          setShowBackIndicator(info.offset.x > 20);
          setShowForwardIndicator(info.offset.x < -20);
        }}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  );
});

GestureNavigation.displayName = 'GestureNavigation';
SwipeableTabs.displayName = 'SwipeableTabs';
EdgeSwipeNavigation.displayName = 'EdgeSwipeNavigation';
