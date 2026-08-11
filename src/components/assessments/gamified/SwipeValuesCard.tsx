/**
 * @fileoverview Swipe Cards estilo Tinder para avaliação de valores
 * Interface de swipe para match de valores culturais
 */

import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, X, Star, Sparkles, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

export interface ValueCard {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  category: string;
}

interface SwipeValuesCardProps {
  cards: ValueCard[];
  onComplete: (liked: string[], passed: string[], superLiked: string[]) => void;
  onSwipe?: (cardId: string, direction: 'left' | 'right' | 'up') => void;
  title?: string;
}

const SWIPE_THRESHOLD = 100;

export const SwipeValuesCard = memo(function SwipeValuesCard({
  cards,
  onComplete,
  onSwipe,
  title = "Quais valores combinam com você?",
}: SwipeValuesCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [passed, setPassed] = useState<string[]>([]);
  const [superLiked, setSuperLiked] = useState<string[]>([]);
  const [history, setHistory] = useState<{ cardId: string; action: 'like' | 'pass' | 'super' }[]>([]);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'up' | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const opacity = useTransform(
    x,
    [-300, -100, 0, 100, 300],
    [0.5, 1, 1, 1, 0.5]
  );

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex) / cards.length) * 100;

  const triggerConfetti = useCallback((type: 'like' | 'super') => {
    if (type === 'super') {
      confetti({
        particleCount: 100,
        spread: 100,
        colors: ['#f59e0b', '#fbbf24', '#fcd34d'],
        origin: { y: 0.6 }
      });
    } else {
      confetti({
        particleCount: 30,
        spread: 60,
        colors: ['#22c55e', '#4ade80'],
        origin: { y: 0.7 }
      });
    }
  }, []);

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
    if (!currentCard) return;

    setExitDirection(direction);
    
    // Calculate new arrays including the current card
    let newLiked = liked;
    let newPassed = passed;
    let newSuperLiked = superLiked;
    
    if (direction === 'right') {
      newLiked = [...liked, currentCard.id];
      setLiked(newLiked);
      setHistory(prev => [...prev, { cardId: currentCard.id, action: 'like' }]);
      triggerConfetti('like');
    } else if (direction === 'left') {
      newPassed = [...passed, currentCard.id];
      setPassed(newPassed);
      setHistory(prev => [...prev, { cardId: currentCard.id, action: 'pass' }]);
    } else if (direction === 'up') {
      newSuperLiked = [...superLiked, currentCard.id];
      setSuperLiked(newSuperLiked);
      setHistory(prev => [...prev, { cardId: currentCard.id, action: 'super' }]);
      triggerConfetti('super');
    }

    onSwipe?.(currentCard.id, direction);

    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setExitDirection(null);
        x.set(0);
        y.set(0);
      } else {
        // Use the updated arrays for completion
        onComplete(newLiked, newPassed, newSuperLiked);
      }
    }, 300);
  }, [currentCard, currentIndex, cards.length, liked, passed, superLiked, onComplete, onSwipe, triggerConfetti, x, y]);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    
    if (Math.abs(offset.x) > SWIPE_THRESHOLD || Math.abs(velocity.x) > 500) {
      handleSwipe(offset.x > 0 ? 'right' : 'left');
    } else if (offset.y < -SWIPE_THRESHOLD || velocity.y < -500) {
      handleSwipe('up');
    } else {
      // Reset position
      x.set(0);
      y.set(0);
    }
  }, [handleSwipe, x, y]);

  const handleUndo = useCallback(() => {
    if (history.length === 0 || currentIndex === 0) return;

    const lastAction = history[history.length - 1];
    if (!lastAction) return;

    if (lastAction.action === 'like') {
      setLiked(prev => prev.filter(id => id !== lastAction.cardId));
    } else if (lastAction.action === 'pass') {
      setPassed(prev => prev.filter(id => id !== lastAction.cardId));
    } else {
      setSuperLiked(prev => prev.filter(id => id !== lastAction.cardId));
    }

    setHistory(prev => prev.slice(0, -1));
    setCurrentIndex(prev => prev - 1);
  }, [history, currentIndex]);

  // Overlay indicators
  const likeIndicatorOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeIndicatorOpacity = useTransform(x, [-100, 0], [1, 0]);
  const superIndicatorOpacity = useTransform(y, [-100, 0], [1, 0]);

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-success to-success/80 flex items-center justify-center mx-auto mb-4"
          >
            <Heart className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Pronto!</h2>
          <p className="text-muted-foreground">
            Você curtiu {liked.length + superLiked.length} valores
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-md mb-6">
        <h2 className="text-xl font-bold text-center mb-2">{title}</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1}/{cards.length}
          </span>
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative w-80 h-[450px]">
        {/* Background cards */}
        {cards.slice(currentIndex + 1, currentIndex + 3).map((card, index) => (
          <motion.div
            key={card.id}
            className="absolute inset-0 rounded-3xl border bg-card shadow-lg"
            style={{
              zIndex: 10 - index,
              scale: 1 - (index + 1) * 0.05,
              y: (index + 1) * 8,
            }}
          />
        ))}

        {/* Current Card */}
        <AnimatePresence>
          <motion.div
            key={currentCard.id}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            style={{ x, y, rotate, opacity }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: exitDirection === 'left' ? -500 : exitDirection === 'right' ? 500 : 0,
              y: exitDirection === 'up' ? -500 : 0,
            }}
            exit={{ 
              x: exitDirection === 'left' ? -500 : exitDirection === 'right' ? 500 : 0,
              y: exitDirection === 'up' ? -500 : 0,
              opacity: 0 
            }}
            transition={{ type: 'spring', damping: 20 }}
            className={cn(
              "absolute inset-0 rounded-3xl border-2 shadow-2xl cursor-grab active:cursor-grabbing",
              "overflow-hidden",
              currentCard.color
            )}
          >
            {/* Card Content */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <motion.span 
                className="text-8xl mb-6"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentCard.emoji}
              </motion.span>
              <h3 className="text-3xl font-bold text-white mb-3 text-center drop-shadow-lg">
                {currentCard.title}
              </h3>
              <p className="text-white/90 text-center max-w-xs drop-shadow-md">
                {currentCard.description}
              </p>
              <span className="mt-4 px-3 py-1 rounded-full bg-white/20 text-white text-sm backdrop-blur-sm">
                {currentCard.category}
              </span>
            </div>

            {/* LIKE Indicator */}
            <motion.div
              style={{ opacity: likeIndicatorOpacity }}
              className="absolute top-8 left-8 -rotate-12"
            >
              <div className="px-4 py-2 border-4 border-success rounded-lg">
                <span className="text-success font-bold text-2xl">LIKE</span>
              </div>
            </motion.div>

            {/* NOPE Indicator */}
            <motion.div
              style={{ opacity: nopeIndicatorOpacity }}
              className="absolute top-8 right-8 rotate-12"
            >
              <div className="px-4 py-2 border-4 border-destructive rounded-lg">
                <span className="text-destructive font-bold text-2xl">NOPE</span>
              </div>
            </motion.div>

            {/* SUPER Indicator */}
            <motion.div
              style={{ opacity: superIndicatorOpacity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="px-4 py-2 border-4 border-warning rounded-lg bg-warning/20 backdrop-blur-sm">
                <span className="text-warning font-bold text-2xl flex items-center gap-2">
                  <Star className="h-6 w-6" /> SUPER
                </span>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-6 mt-8">
        {/* Undo */}
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
          onClick={handleUndo}
          disabled={history.length === 0}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>

        {/* Nope */}
        <Button
          variant="outline"
          size="icon"
          className="w-16 h-16 rounded-full border-2 border-destructive hover:bg-destructive/10"
          onClick={() => handleSwipe('left')}
        >
          <X className="h-8 w-8 text-destructive" />
        </Button>

        {/* Super Like */}
        <Button
          variant="outline"
          size="icon"
          className="w-14 h-14 rounded-full border-2 border-warning hover:bg-warning/10"
          onClick={() => handleSwipe('up')}
        >
          <Star className="h-7 w-7 text-warning" />
        </Button>

        {/* Like */}
        <Button
          variant="outline"
          size="icon"
          className="w-16 h-16 rounded-full border-2 border-success hover:bg-success/10"
          onClick={() => handleSwipe('right')}
        >
          <Heart className="h-8 w-8 text-success" />
        </Button>

        {/* Info */}
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
        >
          <Sparkles className="h-5 w-5 text-primary" />
        </Button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4 text-success" />
          <span>{liked.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-warning" />
          <span>{superLiked.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <X className="h-4 w-4 text-destructive" />
          <span>{passed.length}</span>
        </div>
      </div>
    </div>
  );
});

SwipeValuesCard.displayName = 'SwipeValuesCard';
