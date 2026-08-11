/**
 * @fileoverview Hook for Intersection Observer API
 * @module useIntersectionObserver
 */

import { useState, useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
  enabled?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLElement>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0px',
  triggerOnce = false,
  enabled = true,
}: UseIntersectionObserverOptions = {}): UseIntersectionObserverReturn {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setEntry(entry);
          setIsIntersecting(entry.isIntersecting);

          if (entry.isIntersecting && triggerOnce) {
            hasTriggered.current = true;
            observer.disconnect();
          }
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin, triggerOnce, enabled]);

  return { ref: ref as React.RefObject<HTMLElement>, isIntersecting, entry };
}

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px',
}: UseInfiniteScrollOptions) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore, threshold, rootMargin]);

  return { loadMoreRef };
}

interface UseLazyImageOptions {
  src: string;
  placeholder?: string;
  rootMargin?: string;
}

export function useLazyImage({
  src,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E',
  rootMargin = '200px',
}: UseLazyImageOptions) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    triggerOnce: true,
    rootMargin,
  });

  useEffect(() => {
    if (!isIntersecting || isLoaded) return;

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setError(true);
    };
  }, [isIntersecting, src, isLoaded]);

  return { ref, imageSrc, isLoaded, error, isIntersecting };
}
