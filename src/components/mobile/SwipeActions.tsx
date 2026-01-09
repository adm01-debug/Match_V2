/**
 * @fileoverview Swipe Actions Component for Mobile
 * @module SwipeActions
 */

import { memo, ReactNode, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Trash2, Star, Check, X } from 'lucide-react';

interface SwipeAction {
  id: string;
  icon: ReactNode;
  label: string;
  color: string;
  bgColor: string;
  onAction: () => void;
}

interface SwipeActionsProps {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  threshold?: number;
  className?: string;
  disabled?: boolean;
}

const defaultLeftActions: SwipeAction[] = [
  {
    id: 'star',
    icon: <Star className="h-5 w-5" />,
    label: 'Favoritar',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/20',
    onAction: () => {},
  },
];

const defaultRightActions: SwipeAction[] = [
  {
    id: 'delete',
    icon: <Trash2 className="h-5 w-5" />,
    label: 'Excluir',
    color: 'text-destructive',
    bgColor: 'bg-destructive/20',
    onAction: () => {},
  },
];

export const SwipeActions = memo(function SwipeActions({
  children,
  leftActions = defaultLeftActions,
  rightActions = defaultRightActions,
  threshold = 80,
  className,
  disabled = false,
}: SwipeActionsProps) {
  const x = useMotionValue(0);
  const [isOpen, setIsOpen] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const leftOpacity = useTransform(x, [0, threshold], [0, 1]);
  const rightOpacity = useTransform(x, [-threshold, 0], [1, 0]);
  const leftScale = useTransform(x, [0, threshold], [0.8, 1]);
  const rightScale = useTransform(x, [-threshold, 0], [1, 0.8]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > threshold || velocity > 500) {
      setIsOpen('left');
    } else if (offset < -threshold || velocity < -500) {
      setIsOpen('right');
    } else {
      setIsOpen(null);
    }
  };

  const handleAction = (action: SwipeAction) => {
    action.onAction();
    setIsOpen(null);
  };

  const getXPosition = () => {
    if (isOpen === 'left') return threshold;
    if (isOpen === 'right') return -threshold;
    return 0;
  };

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
      {/* Left Actions */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 flex items-center gap-2 px-3"
        style={{ opacity: leftOpacity, scale: leftScale }}
      >
        {leftActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action)}
            className={cn(
              'flex flex-col items-center justify-center p-2 rounded-lg transition-colors',
              action.bgColor,
              action.color
            )}
          >
            {action.icon}
            <span className="text-xs mt-1">{action.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Right Actions */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 flex items-center gap-2 px-3"
        style={{ opacity: rightOpacity, scale: rightScale }}
      >
        {rightActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action)}
            className={cn(
              'flex flex-col items-center justify-center p-2 rounded-lg transition-colors',
              action.bgColor,
              action.color
            )}
          >
            {action.icon}
            <span className="text-xs mt-1">{action.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -threshold * 1.5, right: threshold * 1.5 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: getXPosition() }}
        style={{ x }}
        className="relative bg-background z-10 touch-pan-y"
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
});

interface SwipeToConfirmProps {
  onConfirm: () => void;
  confirmText?: string;
  confirmColor?: string;
  children: ReactNode;
  className?: string;
}

export const SwipeToConfirm = memo(function SwipeToConfirm({
  onConfirm,
  confirmText = 'Deslize para confirmar',
  confirmColor = 'bg-primary',
  children,
  className,
}: SwipeToConfirmProps) {
  const x = useMotionValue(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = containerRef.current?.offsetWidth || 300;
  const threshold = containerWidth - 80;

  const checkOpacity = useTransform(x, [threshold - 20, threshold], [0, 1]);
  const bgOpacity = useTransform(x, [0, threshold], [0.3, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x >= threshold) {
      setIsConfirmed(true);
      onConfirm();
    }
  };

  if (isConfirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('flex items-center justify-center gap-2 p-4 rounded-lg', confirmColor, className)}
      >
        <Check className="h-5 w-5 text-primary-foreground" />
        <span className="text-primary-foreground font-medium">Confirmado!</span>
      </motion.div>
    );
  }

  return (
    <div ref={containerRef} className={cn('relative h-14 rounded-lg overflow-hidden', className)}>
      <motion.div
        className={cn('absolute inset-0', confirmColor)}
        style={{ opacity: bgOpacity }}
      />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm text-muted-foreground">{confirmText}</span>
      </div>

      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2"
        style={{ opacity: checkOpacity }}
      >
        <Check className="h-5 w-5 text-primary-foreground" />
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: threshold }}
        dragElastic={0}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="absolute left-1 top-1 bottom-1 w-12 bg-primary rounded-md flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg"
      >
        {children}
      </motion.div>
    </div>
  );
});

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

export const SwipeableCard = memo(function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftLabel = 'Rejeitar',
  rightLabel = 'Aprovar',
  className,
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const leftOpacity = useTransform(x, [-200, -50], [1, 0]);
  const rightOpacity = useTransform(x, [50, 200], [0, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 150 && onSwipeRight) {
      onSwipeRight();
    } else if (info.offset.x < -150 && onSwipeLeft) {
      onSwipeLeft();
    }
  };

  return (
    <div className="relative">
      {/* Labels */}
      <motion.div
        className="absolute left-4 top-4 px-3 py-1 bg-destructive text-destructive-foreground rounded-full text-sm font-medium z-20"
        style={{ opacity: leftOpacity }}
      >
        <X className="h-4 w-4 inline mr-1" />
        {leftLabel}
      </motion.div>
      
      <motion.div
        className="absolute right-4 top-4 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium z-20"
        style={{ opacity: rightOpacity }}
      >
        <Check className="h-4 w-4 inline mr-1" />
        {rightLabel}
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        style={{ x, rotate }}
        className={cn('cursor-grab active:cursor-grabbing', className)}
        whileTap={{ scale: 1.02 }}
      >
        {children}
      </motion.div>
    </div>
  );
});

SwipeActions.displayName = 'SwipeActions';
SwipeToConfirm.displayName = 'SwipeToConfirm';
SwipeableCard.displayName = 'SwipeableCard';

export { type SwipeAction };
