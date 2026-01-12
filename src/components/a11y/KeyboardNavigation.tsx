/**
 * @fileoverview Keyboard Navigation Components
 * Enhanced keyboard navigation for lists and grids
 */

import { useCallback, useRef, useState, ReactNode, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type NavigationDirection = 'horizontal' | 'vertical' | 'grid';

interface KeyboardNavigableListProps {
  children: ReactNode;
  direction?: NavigationDirection;
  loop?: boolean;
  columns?: number; // For grid navigation
  onItemSelect?: (index: number) => void;
  className?: string;
  role?: string;
  ariaLabel?: string;
}

export function KeyboardNavigableList({
  children,
  direction = 'vertical',
  loop = true,
  columns = 1,
  onItemSelect,
  className,
  role = 'listbox',
  ariaLabel
}: KeyboardNavigableListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const getItems = useCallback(() => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>('[data-nav-item]')
    );
  }, []);

  const focusItem = useCallback((index: number) => {
    const items = getItems();
    if (items[index]) {
      items[index].focus();
      setFocusedIndex(index);
    }
  }, [getItems]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const items = getItems();
    const count = items.length;
    if (count === 0) return;

    let newIndex = focusedIndex;
    let handled = false;

    const navigate = (delta: number) => {
      if (loop) {
        return (focusedIndex + delta + count) % count;
      } else {
        return Math.max(0, Math.min(count - 1, focusedIndex + delta));
      }
    };

    switch (event.key) {
      case 'ArrowDown':
        if (direction === 'vertical' || direction === 'grid') {
          newIndex = navigate(direction === 'grid' ? columns : 1);
          handled = true;
        }
        break;
      case 'ArrowUp':
        if (direction === 'vertical' || direction === 'grid') {
          newIndex = navigate(direction === 'grid' ? -columns : -1);
          handled = true;
        }
        break;
      case 'ArrowRight':
        if (direction === 'horizontal' || direction === 'grid') {
          newIndex = navigate(1);
          handled = true;
        }
        break;
      case 'ArrowLeft':
        if (direction === 'horizontal' || direction === 'grid') {
          newIndex = navigate(-1);
          handled = true;
        }
        break;
      case 'Home':
        newIndex = 0;
        handled = true;
        break;
      case 'End':
        newIndex = count - 1;
        handled = true;
        break;
      case 'Enter':
      case ' ':
        if (onItemSelect && focusedIndex >= 0) {
          event.preventDefault();
          onItemSelect(focusedIndex);
        }
        return;
    }

    if (handled) {
      event.preventDefault();
      focusItem(newIndex);
    }
  }, [focusedIndex, direction, columns, loop, getItems, focusItem, onItemSelect]);

  // Handle item focus
  const handleItemFocus = useCallback((index: number) => {
    setFocusedIndex(index);
  }, []);

  return (
    <div
      ref={containerRef}
      role={role}
      aria-label={ariaLabel}
      aria-activedescendant={focusedIndex >= 0 ? `nav-item-${focusedIndex}` : undefined}
      onKeyDown={handleKeyDown}
      className={className}
    >
      {/* Clone children to inject focus handlers */}
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <NavigableItem
              key={index}
              index={index}
              isFocused={focusedIndex === index}
              onFocus={() => handleItemFocus(index)}
            >
              {child}
            </NavigableItem>
          ))
        : children
      }
    </div>
  );
}

interface NavigableItemProps {
  children: ReactNode;
  index: number;
  isFocused: boolean;
  onFocus: () => void;
}

function NavigableItem({ children, index, isFocused, onFocus }: NavigableItemProps) {
  return (
    <div
      id={`nav-item-${index}`}
      data-nav-item
      tabIndex={isFocused ? 0 : -1}
      onFocus={onFocus}
      role="option"
      aria-selected={isFocused}
      className={cn(
        "outline-none transition-all duration-200",
        isFocused && "ring-2 ring-primary ring-offset-2 rounded-lg"
      )}
    >
      {children}
    </div>
  );
}

/**
 * Hook for roving tabindex pattern
 */
export function useRovingTabIndex(itemCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);

  const getTabIndex = useCallback((index: number) => {
    return index === activeIndex ? 0 : -1;
  }, [activeIndex]);

  const handleKeyDown = useCallback((event: KeyboardEvent, index: number) => {
    let newIndex = index;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        newIndex = (index + 1) % itemCount;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        newIndex = (index - 1 + itemCount) % itemCount;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = itemCount - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setActiveIndex(newIndex);
    return newIndex;
  }, [itemCount]);

  return {
    activeIndex,
    setActiveIndex,
    getTabIndex,
    handleKeyDown
  };
}

export default KeyboardNavigableList;
