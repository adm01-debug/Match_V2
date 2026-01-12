/**
 * @fileoverview Ripple Effect Component
 * Material Design inspired ripple effect for interactive elements
 */

import { useState, useCallback, useRef, MouseEvent as ReactMouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface RippleEffectProps {
  children: React.ReactNode;
  color?: string;
  duration?: number;
  disabled?: boolean;
  className?: string;
  onClick?: (e: ReactMouseEvent<HTMLDivElement>) => void;
}

export function RippleEffect({
  children,
  color = "currentColor",
  duration = 600,
  disabled = false,
  className,
  onClick
}: RippleEffectProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const createRipple = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (disabled || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Calculate ripple size based on container dimensions
    const size = Math.max(rect.width, rect.height) * 2;
    
    const newRipple: Ripple = {
      id: nextId.current++,
      x,
      y,
      size
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, duration);

    onClick?.(event);
  }, [disabled, duration, onClick]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onClick={createRipple}
    >
      {children}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: color,
            }}
            initial={{ scale: 0, opacity: 0.35 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration / 1000, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Hook for adding ripple effect to any element
 */
export function useRipple(options?: { 
  color?: string; 
  duration?: number;
}) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);
  const color = options?.color ?? "rgba(255, 255, 255, 0.3)";
  const duration = options?.duration ?? 600;

  const addRipple = useCallback((
    event: ReactMouseEvent<HTMLElement>,
    container: HTMLElement
  ) => {
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const newRipple: Ripple = {
      id: nextId.current++,
      x,
      y,
      size
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, duration);
  }, [duration]);

  const RippleContainer = useCallback(() => (
    <AnimatePresence>
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
          }}
          initial={{ scale: 0, opacity: 0.35 }}
          animate={{ scale: 1, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration / 1000, ease: "easeOut" }}
        />
      ))}
    </AnimatePresence>
  ), [ripples, color, duration]);

  return { addRipple, RippleContainer };
}

export default RippleEffect;
