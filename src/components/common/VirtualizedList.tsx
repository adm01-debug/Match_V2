/**
 * @fileoverview VirtualizedList component for efficient rendering of large lists
 * @module VirtualizedList
 */

import { useRef, useState, useEffect, useCallback, useMemo, memo, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  overscan?: number;
  getItemKey?: (item: T, index: number) => string | number;
  emptyMessage?: string;
  role?: string;
  ariaLabel?: string;
}

function VirtualizedListComponent<T>({
  items,
  itemHeight,
  renderItem,
  className,
  overscan = 3,
  getItemKey,
  emptyMessage = "Nenhum item para exibir",
  role = "list",
  ariaLabel = "Lista virtualizada",
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // ResizeObserver for container height
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          setScrollTop(containerRef.current.scrollTop);
        }
      });
    }
  }, []);

  // Memoized calculations
  const { totalHeight, startIndex, offsetY, visibleItems } = useMemo(() => {
    const total = items.length * itemHeight;
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    const offset = start * itemHeight;
    const visible = items.slice(start, end);

    return {
      totalHeight: total,
      startIndex: start,
      endIndex: end,
      offsetY: offset,
      visibleItems: visible,
    };
  }, [items, itemHeight, scrollTop, containerHeight, overscan]);

  // Generate key for items
  const generateKey = useCallback(
    (item: T, index: number): string | number => {
      if (getItemKey) {
        return getItemKey(item, startIndex + index);
      }
      return startIndex + index;
    },
    [getItemKey, startIndex]
  );

  if (items.length === 0) {
    return (
      <div
        ref={containerRef}
        className={cn("overflow-auto", className)}
        role={role}
        aria-label={ariaLabel}
      >
        <p className="text-center text-muted-foreground py-8">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("overflow-auto", className)}
      onScroll={handleScroll}
      role={role}
      aria-label={ariaLabel}
      aria-rowcount={items.length}
    >
      <div 
        style={{ height: totalHeight, position: "relative" }}
        aria-hidden="true"
      >
        <div 
          style={{ 
            transform: `translateY(${offsetY}px)`,
            willChange: 'transform',
          }}
        >
          {visibleItems.map((item, localIndex) => {
            const globalIndex = startIndex + localIndex;
            return (
              <div 
                key={generateKey(item, localIndex)} 
                style={{ height: itemHeight }}
                role="listitem"
                aria-rowindex={globalIndex + 1}
              >
                {renderItem(item, globalIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

VirtualizedListComponent.displayName = "VirtualizedList";

// Memoized export with generic support
export const VirtualizedList = memo(VirtualizedListComponent) as typeof VirtualizedListComponent;
export default VirtualizedList;
