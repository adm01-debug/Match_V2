/**
 * @fileoverview Virtual List Components for Performance
 * @module VirtualList
 */

import { ReactNode, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVirtualScroll, useVirtualGrid } from '@/hooks/useVirtualScroll';
import { useInfiniteScroll } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { Loader2, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  overscan?: number;
  showScrollToTop?: boolean;
  scrollToTopThreshold?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  overscan = 3,
  showScrollToTop = true,
  scrollToTopThreshold = 500,
}: VirtualListProps<T>) {
  const {
    virtualItems,
    totalHeight,
    containerRef,
    scrollToIndex,
    isScrolling,
  } = useVirtualScroll({
    items,
    itemHeight,
    containerHeight,
    overscan,
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > scrollToTopThreshold);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollToTopThreshold]);

  return (
    <div className={cn('relative', className)}>
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: containerHeight }}
      >
        <div
          className="relative"
          style={{ height: totalHeight }}
        >
          {virtualItems.map(({ item, index, style }) => (
            <div
              key={index}
              style={style}
              className={cn(
                'transition-opacity duration-150',
                isScrolling && 'opacity-90'
              )}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showScrollToTop && showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-4 right-4"
          >
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow-lg"
              onClick={() => scrollToIndex(0)}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface VirtualGridProps<T> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  gap?: number;
  overscan?: number;
}

export function VirtualGrid<T>({
  items,
  itemWidth,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  gap = 16,
  overscan = 2,
}: VirtualGridProps<T>) {
  const [containerWidth, setContainerWidth] = useState(0);
  const measureRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setContainerWidth(entry.contentRect.width);
        }
      });
      resizeObserver.observe(node);
    }
  }, []);

  const {
    virtualItems,
    totalHeight,
    containerRef,
  } = useVirtualGrid({
    items,
    itemWidth,
    itemHeight,
    containerWidth,
    containerHeight,
    gap,
    overscan,
  });

  return (
    <div ref={measureRef} className={cn('relative w-full', className)}>
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: containerHeight }}
      >
        <div
          className="relative"
          style={{ height: totalHeight }}
        >
          {virtualItems.map(({ item, index, style }) => (
            <div key={index} style={style}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface InfiniteListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  className?: string;
  loadingComponent?: ReactNode;
  endMessage?: ReactNode;
  emptyMessage?: ReactNode;
  threshold?: number;
}

export function InfiniteList<T>({
  items,
  renderItem,
  hasMore,
  isLoading,
  onLoadMore,
  className,
  loadingComponent,
  endMessage,
  emptyMessage,
  threshold = 0.1,
}: InfiniteListProps<T>) {
  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore,
    threshold,
  });

  const defaultLoadingComponent = (
    <div className="flex items-center justify-center py-6 gap-2">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">Carregando mais...</span>
    </div>
  );

  const defaultEndMessage = (
    <div className="text-center py-6">
      <p className="text-sm text-muted-foreground">
        Você chegou ao final da lista
      </p>
    </div>
  );

  const defaultEmptyMessage = (
    <div className="text-center py-12">
      <p className="text-muted-foreground">Nenhum item encontrado</p>
    </div>
  );

  if (items.length === 0 && !isLoading) {
    return <>{emptyMessage || defaultEmptyMessage}</>;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index * 0.02, 0.3) }}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}

      <div ref={loadMoreRef} data-testid="loading-more">
        {isLoading && (loadingComponent || defaultLoadingComponent)}
      </div>

      {!hasMore && items.length > 0 && (endMessage || defaultEndMessage)}
    </div>
  );
}

interface WindowedListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  maxHeight?: number;
  estimatedItemCount?: number;
}

export function WindowedList<T>({
  items,
  itemHeight,
  renderItem,
  className,
  maxHeight = 400,
  estimatedItemCount = 10,
}: WindowedListProps<T>) {
  const containerHeight = Math.min(
    maxHeight,
    items.length * itemHeight
  );

  if (items.length <= estimatedItemCount) {
    return (
      <ScrollArea className={cn('w-full', className)} style={{ maxHeight }}>
        <div className="space-y-1">
          {items.map((item, index) => (
            <div key={index}>{renderItem(item, index)}</div>
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <VirtualList
      items={items}
      itemHeight={itemHeight}
      containerHeight={containerHeight}
      renderItem={renderItem}
      className={className}
    />
  );
}

VirtualList.displayName = 'VirtualList';
VirtualGrid.displayName = 'VirtualGrid';
InfiniteList.displayName = 'InfiniteList';
WindowedList.displayName = 'WindowedList';
