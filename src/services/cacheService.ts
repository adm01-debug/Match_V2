// Cache Service

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

export const cacheService = {
  get<T>(key: string): T | null {
    const entry = cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      cache.delete(key);
      return null;
    }
    return entry.data;
  },

  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000) {
    cache.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
  },

  invalidate(key: string) {
    cache.delete(key);
  },

  invalidatePattern(pattern: string) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) cache.delete(key);
    }
  },

  clear() {
    cache.clear();
  },

  size(): number {
    return cache.size;
  },
};
