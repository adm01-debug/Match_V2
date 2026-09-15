/**
 * @fileoverview Hook for Virtual Scrolling
 * @module useVirtualScroll
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface UseVirtualScrollOptions<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualItem<T> {
  item: T;
  index: number;
  style: React.CSSProperties;
}

interface UseVirtualScrollReturn<T> {
  virtualItems: VirtualItem<T>[];
  totalHeight: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
  isScrolling: boolean;
}

export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
}: UseVirtualScrollOptions<T>): UseVirtualScrollReturn<T> {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const totalHeight = items.length * itemHeight;

  const { startIndex, endIndex } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(items.length - 1, start + visibleCount + overscan * 2);
    
    return { startIndex: start, endIndex: end };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const virtualItems = useMemo(() => {
    const result: VirtualItem<T>[] = [];
    
    for (let i = startIndex; i <= endIndex; i++) {
      const item = items[i];
      if (item !== undefined) {
        result.push({
          item,
          index: i,
          style: {
            position: 'absolute',
            top: i * itemHeight,
            left: 0,
            right: 0,
            height: itemHeight,
          },
        });
      }
    }
    
    return result;
  }, [items, startIndex, endIndex, itemHeight]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
      setIsScrolling(true);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * itemHeight,
        behavior,
      });
    }
  }, [itemHeight]);

  return {
    virtualItems,
    totalHeight,
    containerRef,
    scrollToIndex,
    isScrolling,
  };
}

interface UseVirtualGridOptions<T> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  containerWidth: number;
  containerHeight: number;
  gap?: number;
  overscan?: number;
}

interface VirtualGridItem<T> {
  item: T;
  index: number;
  row: number;
  column: number;
  style: React.CSSProperties;
}

export function useVirtualGrid<T>({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  gap = 0,
  overscan = 2,
}: UseVirtualGridOptions<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const columnsCount = Math.max(1, Math.floor((containerWidth + gap) / (itemWidth + gap)));
  const rowsCount = Math.ceil(items.length / columnsCount);
  const totalHeight = rowsCount * (itemHeight + gap) - gap;

  const { startRow, endRow } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / (itemHeight + gap)) - overscan);
    const visibleRows = Math.ceil(containerHeight / (itemHeight + gap));
    const end = Math.min(rowsCount - 1, start + visibleRows + overscan * 2);
    
    return { startRow: start, endRow: end };
  }, [scrollTop, itemHeight, gap, containerHeight, rowsCount, overscan]);

  const virtualItems = useMemo(() => {
    const result: VirtualGridItem<T>[] = [];
    
    for (let row = startRow; row <= endRow; row++) {
      for (let col = 0; col < columnsCount; col++) {
        const index = row * columnsCount + col;
        const item = items[index];
        if (item !== undefined) {
          result.push({
            item,
            index,
            row,
            column: col,
            style: {
              position: 'absolute',
              top: row * (itemHeight + gap),
              left: col * (itemWidth + gap),
              width: itemWidth,
              height: itemHeight,
            },
          });
        }
      }
    }
    
    return result;
  }, [items, startRow, endRow, columnsCount, itemWidth, itemHeight, gap]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    virtualItems,
    totalHeight,
    containerRef,
    columnsCount,
  };
}
