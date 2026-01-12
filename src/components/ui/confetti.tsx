/**
 * @fileoverview Confetti Component
 * Celebration confetti animations
 */

import { useCallback, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  colors?: string[];
  origin?: { x: number; y: number };
}

/**
 * Hook for triggering confetti effects
 */
export function useConfetti() {
  const fireConfetti = useCallback((options?: ConfettiOptions) => {
    const defaults: ConfettiOptions = {
      particleCount: 100,
      spread: 70,
      startVelocity: 30,
      decay: 0.9,
      gravity: 1,
      colors: ['#FFE066', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96E6A1', '#DDA0DD'],
      origin: { x: 0.5, y: 0.6 }
    };

    const config = { ...defaults, ...options };
    confetti(config);
  }, []);

  const fireCelebration = useCallback(() => {
    // Fire multiple bursts for a more dramatic effect
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Random position
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const fireFromElement = useCallback((element: HTMLElement, options?: ConfettiOptions) => {
    const rect = element.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    fireConfetti({
      ...options,
      origin: { x, y }
    });
  }, [fireConfetti]);

  const fireStars = useCallback(() => {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star' as const],
      colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
    };

    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star']
    });

    confetti({
      ...defaults,
      particleCount: 25,
      scalar: 0.75,
      shapes: ['circle']
    });
  }, []);

  const fireSchoolPride = useCallback((colors: string[] = ['#bb0000', '#ffffff']) => {
    const end = Date.now() + 1500;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const reset = useCallback(() => {
    confetti.reset();
  }, []);

  return {
    fireConfetti,
    fireCelebration,
    fireFromElement,
    fireStars,
    fireSchoolPride,
    reset
  };
}

/**
 * Confetti trigger component
 */
interface ConfettiTriggerProps {
  children: React.ReactNode;
  onTrigger?: () => void;
  type?: 'default' | 'celebration' | 'stars' | 'pride';
  colors?: string[];
  disabled?: boolean;
}

export function ConfettiTrigger({
  children,
  onTrigger,
  type = 'default',
  colors,
  disabled = false
}: ConfettiTriggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { fireConfetti, fireCelebration, fireStars, fireSchoolPride, fireFromElement } = useConfetti();

  const handleClick = useCallback(() => {
    if (disabled) return;

    switch (type) {
      case 'celebration':
        fireCelebration();
        break;
      case 'stars':
        fireStars();
        break;
      case 'pride':
        fireSchoolPride(colors);
        break;
      default:
        if (ref.current) {
          fireFromElement(ref.current, { colors });
        } else {
          fireConfetti({ colors });
        }
    }

    onTrigger?.();
  }, [disabled, type, colors, fireCelebration, fireStars, fireSchoolPride, fireFromElement, fireConfetti, onTrigger]);

  return (
    <div ref={ref} onClick={handleClick}>
      {children}
    </div>
  );
}

/**
 * Auto-trigger confetti on mount (for success screens)
 */
interface AutoConfettiProps {
  trigger?: boolean;
  type?: 'default' | 'celebration' | 'stars';
  delay?: number;
}

export function AutoConfetti({ trigger = true, type = 'celebration', delay = 0 }: AutoConfettiProps) {
  const { fireCelebration, fireConfetti, fireStars } = useConfetti();

  useEffect(() => {
    if (!trigger) return;

    const timeoutId = setTimeout(() => {
      switch (type) {
        case 'celebration':
          fireCelebration();
          break;
        case 'stars':
          fireStars();
          break;
        default:
          fireConfetti();
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [trigger, type, delay, fireCelebration, fireConfetti, fireStars]);

  return null;
}

export default useConfetti;
