/**
 * @fileoverview Custom Cursor Component (Optional Premium Feature)
 * Adds a custom animated cursor for enhanced UX
 */

import { memo, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CustomCursorProps {
  enabled?: boolean;
  size?: number;
  color?: string;
  mixBlendMode?: boolean;
  showRing?: boolean;
}

export const CustomCursor = memo(function CustomCursor({
  enabled = false,
  size = 20,
  color = "hsl(var(--primary))",
  mixBlendMode = true,
  showRing = true,
}: CustomCursorProps) {
  const [isPointer, setIsPointer] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState<string | null>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Ring follows with more delay
  const ringSpringConfig = { damping: 20, stiffness: 200, mass: 0.8 };
  const ringXSpring = useSpring(cursorX, ringSpringConfig);
  const ringYSpring = useSpring(cursorY, ringSpringConfig);

  const moveCursor = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  }, [cursorX, cursorY]);

  const handleMouseDown = useCallback(() => setIsPressed(true), []);
  const handleMouseUp = useCallback(() => setIsPressed(false), []);
  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  // Se o cursor customizado foi removido do app, pode sobrar um <style> no cache.
  // Este efeito garante que o cursor do browser volte ao normal.
  useEffect(() => {
    if (enabled) return;
    document.body.style.cursor = '';
    const existingStyle = document.getElementById('custom-cursor-style');
    existingStyle?.remove();
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Check if hovering over interactive elements
    const checkPointer = () => {
      const hoveredElements = document.querySelectorAll(':hover');
      let foundPointer = false;
      let hoverType: string | null = null;

      hoveredElements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        if (computed.cursor === 'pointer') {
          foundPointer = true;
          
          // Detect element type for custom states
          if (el.tagName === 'BUTTON') hoverType = 'button';
          else if (el.tagName === 'A') hoverType = 'link';
          else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') hoverType = 'input';
          else hoverType = 'interactive';
        }
      });

      setIsPointer(foundPointer);
      setIsHovering(hoverType);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousemove', checkPointer);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Add cursor:none to all interactive elements
    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    style.textContent = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousemove', checkPointer);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      
      document.body.style.cursor = '';
      const existingStyle = document.getElementById('custom-cursor-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [enabled, moveCursor, handleMouseDown, handleMouseUp, handleMouseEnter, handleMouseLeave]);

  if (!enabled) return null;

  const currentSize = isPointer ? size * 1.5 : isPressed ? size * 0.8 : size;

  return (
    <>
      {/* Main cursor dot */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={cn(
              "fixed top-0 left-0 rounded-full pointer-events-none z-[9999]",
              mixBlendMode && "mix-blend-difference"
            )}
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              width: currentSize,
              height: currentSize,
              marginLeft: -currentSize / 2,
              marginTop: -currentSize / 2,
              backgroundColor: isHovering ? 'white' : color,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: isPressed ? 0.8 : 1,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      {/* Ring */}
      {showRing && (
        <AnimatePresence>
          {isVisible && (
            <motion.div
              className={cn(
                "fixed top-0 left-0 rounded-full pointer-events-none z-[9998] border-2",
                mixBlendMode && "mix-blend-difference"
              )}
              style={{
                x: ringXSpring,
                y: ringYSpring,
                width: isPointer ? 50 : 40,
                height: isPointer ? 50 : 40,
                marginLeft: isPointer ? -25 : -20,
                marginTop: isPointer ? -25 : -20,
                borderColor: isHovering ? 'white' : color,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isPressed ? 0.9 : 1, 
                opacity: isPointer ? 0.6 : 0.3,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      )}

      {/* Hover label */}
      <AnimatePresence>
        {isVisible && isHovering && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9997] px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-medium"
            style={{
              x: ringXSpring,
              y: ringYSpring,
              marginLeft: 30,
              marginTop: -8,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {isHovering === 'button' && 'Clique'}
            {isHovering === 'link' && 'Abrir'}
            {isHovering === 'input' && 'Digite'}
            {isHovering === 'interactive' && 'Interagir'}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

// Hook to enable/disable custom cursor
export function useCustomCursor() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('custom-cursor-enabled');
    return stored === 'true';
  });

  const toggle = useCallback(() => {
    setEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('custom-cursor-enabled', String(newValue));
      return newValue;
    });
  }, []);

  const enable = useCallback(() => {
    setEnabled(true);
    localStorage.setItem('custom-cursor-enabled', 'true');
  }, []);

  const disable = useCallback(() => {
    setEnabled(false);
    localStorage.setItem('custom-cursor-enabled', 'false');
  }, []);

  return { enabled, toggle, enable, disable };
}

CustomCursor.displayName = 'CustomCursor';
