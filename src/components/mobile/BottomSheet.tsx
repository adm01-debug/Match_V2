/**
 * @fileoverview Bottom Sheet Modal Components for Mobile
 * @module BottomSheet
 */

import { memo, ReactNode, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SnapPoint = 'closed' | 'peek' | 'half' | 'full';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  snapPoints?: SnapPoint[];
  initialSnap?: SnapPoint;
  showHandle?: boolean;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
  peekHeight?: number;
}

const snapHeights: Record<SnapPoint, number | string> = {
  closed: 0,
  peek: 120,
  half: '50vh',
  full: '90vh',
};

export const BottomSheet = memo(function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  description,
  snapPoints = ['closed', 'half', 'full'],
  initialSnap = 'half',
  showHandle = true,
  showCloseButton = true,
  className,
  contentClassName,
  peekHeight = 120,
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState<SnapPoint>(initialSnap);
  const y = useMotionValue(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentSnap(initialSnap);
    }
  }, [isOpen, initialSnap]);

  const getSnapHeight = useCallback((snap: SnapPoint): number => {
    if (snap === 'peek') return peekHeight;
    if (snap === 'half') return window.innerHeight * 0.5;
    if (snap === 'full') return window.innerHeight * 0.9;
    return 0;
  }, [peekHeight]);

  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;
    const currentHeight = getSnapHeight(currentSnap);
    
    if (velocity > 500 || offset > 100) {
      // Swiping down
      const lowerSnaps = snapPoints.filter(s => getSnapHeight(s) < currentHeight);
      const nextSnap = lowerSnaps[lowerSnaps.length - 1] || 'closed';
      
      if (nextSnap === 'closed') {
        onClose();
      } else {
        setCurrentSnap(nextSnap);
      }
    } else if (velocity < -500 || offset < -100) {
      // Swiping up
      const higherSnaps = snapPoints.filter(s => getSnapHeight(s) > currentHeight);
      const nextSnap = higherSnaps[0] || currentSnap;
      setCurrentSnap(nextSnap);
    }
  }, [currentSnap, snapPoints, getSnapHeight, onClose]);

  const handleClose = () => {
    setCurrentSnap('closed');
    onClose();
  };

  const getCurrentHeight = () => {
    const height = snapHeights[currentSnap];
    if (currentSnap === 'peek') return peekHeight;
    return height;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0, height: getCurrentHeight() }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.1, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            style={{ y }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'bg-background rounded-t-3xl shadow-2xl',
              'flex flex-col',
              className
            )}
          >
            {/* Handle */}
            {showHandle && (
              <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
              </div>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <div>
                  {title && (
                    <h3 className="text-lg font-semibold">{title}</h3>
                  )}
                  {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                  )}
                </div>
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={cn('flex-1 overflow-auto p-4', contentClassName)}>
              {children}
            </div>

            {/* Snap Indicators */}
            {snapPoints.length > 2 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                {snapPoints.filter(s => s !== 'closed').map((snap) => (
                  <button
                    key={snap}
                    onClick={() => setCurrentSnap(snap)}
                    className={cn(
                      'w-1.5 h-4 rounded-full transition-colors',
                      snap === currentSnap ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actions: {
    id: string;
    label: string;
    icon?: ReactNode;
    destructive?: boolean;
    disabled?: boolean;
    onAction: () => void;
  }[];
  cancelLabel?: string;
}

export const ActionSheet = memo(function ActionSheet({
  isOpen,
  onClose,
  title,
  actions,
  cancelLabel = 'Cancelar',
}: ActionSheetProps) {
  const handleAction = (action: typeof actions[0]) => {
    if (!action.disabled) {
      action.onAction();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8"
          >
            <div className="bg-background rounded-2xl overflow-hidden shadow-2xl">
              {title && (
                <div className="px-4 py-3 text-center border-b">
                  <p className="text-sm text-muted-foreground">{title}</p>
                </div>
              )}

              {actions.map((action, index) => (
                <button
                  key={action.id}
                  onClick={() => handleAction(action)}
                  disabled={action.disabled}
                  className={cn(
                    'w-full px-4 py-3.5 flex items-center justify-center gap-3',
                    'text-base font-medium transition-colors',
                    'hover:bg-muted/50 active:bg-muted',
                    index < actions.length - 1 && 'border-b',
                    action.destructive && 'text-destructive',
                    action.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full mt-2 px-4 py-3.5 bg-background rounded-2xl text-base font-semibold text-primary hover:bg-muted/50 active:bg-muted transition-colors"
            >
              {cancelLabel}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

interface ExpandableBottomBarProps {
  children: ReactNode;
  expandedContent: ReactNode;
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  className?: string;
}

export const ExpandableBottomBar = memo(function ExpandableBottomBar({
  children,
  expandedContent,
  isExpanded: controlledExpanded,
  onExpandChange,
  className,
}: ExpandableBottomBarProps) {
  const [isExpanded, setIsExpanded] = useState(controlledExpanded ?? false);
  const y = useMotionValue(0);

  useEffect(() => {
    if (controlledExpanded !== undefined) {
      setIsExpanded(controlledExpanded);
    }
  }, [controlledExpanded]);

  const toggleExpanded = () => {
    const newValue = !isExpanded;
    setIsExpanded(newValue);
    onExpandChange?.(newValue);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -50) {
      setIsExpanded(true);
      onExpandChange?.(true);
    } else if (info.offset.y > 50) {
      setIsExpanded(false);
      onExpandChange?.(false);
    }
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ y }}
      animate={{ height: isExpanded ? 'auto' : 'auto' }}
      className={cn(
        'fixed bottom-0 left-0 right-0',
        'bg-background border-t shadow-lg',
        'rounded-t-2xl z-40',
        className
      )}
    >
      {/* Drag Handle */}
      <button
        onClick={toggleExpanded}
        className="w-full flex justify-center pt-2 pb-1"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Collapsed Content */}
      <div className="px-4 pb-4">
        {children}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t"
          >
            <div className="p-4">
              {expandedContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

BottomSheet.displayName = 'BottomSheet';
ActionSheet.displayName = 'ActionSheet';
ExpandableBottomBar.displayName = 'ExpandableBottomBar';
