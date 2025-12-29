// Redis Cache Service using Upstash
const UPSTASH_REDIS_URL = import.meta.env.VITE_UPSTASH_REDIS_URL;
const UPSTASH_REDIS_TOKEN = import.meta.env.VITE_UPSTASH_REDIS_TOKEN;

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

const DEFAULT_TTL = 3600; // 1 hour

class CacheService {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = UPSTASH_REDIS_URL || '';
    this.token = UPSTASH_REDIS_TOKEN || '';
  }

  private async execute(command: string[]): Promise<any> {
    if (!this.baseUrl || !this.token) {
      // Redis not configured, using memory fallback
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      // Silently handle Redis errors
      return null;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const result = await this.execute(['GET', key]);
    if (!result) return null;
    try {
      return JSON.parse(result) as T;
    } catch {
      return result as T;
    }
  }

  async set(key: string, value: any, options?: CacheOptions): Promise<boolean> {
    const ttl = options?.ttl || DEFAULT_TTL;
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    const result = await this.execute(['SET', key, serialized, 'EX', ttl.toString()]);
    return result === 'OK';
  }

  async del(key: string): Promise<boolean> {
    const result = await this.execute(['DEL', key]);
    return result > 0;
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.execute(['EXISTS', key]);
    return result === 1;
  }

  async ttl(key: string): Promise<number> {
    return await this.execute(['TTL', key]);
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.execute(['KEYS', pattern]) || [];
  }

  async invalidatePattern(pattern: string): Promise<number> {
    const keys = await this.keys(pattern);
    if (keys.length === 0) return 0;
    const result = await this.execute(['DEL', ...keys]);
    return result;
  }

  // Helper for caching function results
  async cached<T>(
    key: string,
    fn: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const result = await fn();
    await this.set(key, result, options);
    return result;
  }

  // Generate cache key with prefix
  generateKey(prefix: string, ...parts: (string | number)[]): string {
    return [prefix, ...parts].join(':');
  }
}

export const cacheService = new CacheService();

// Cache keys helpers
export const CacheKeys = {
  matchScore: (candidatoId: string, vagaId: string) => 
    `match:${candidatoId}:${vagaId}`,
  candidato: (id: string) => `candidato:${id}`,
  vaga: (id: string) => `vaga:${id}`,
  dashboard: (userId: string) => `dashboard:${userId}`,
  vagas: (filters: string) => `vagas:${filters}`,
};

export default cacheService;

