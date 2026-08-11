// Resilience helpers para chamadas a APIs externas em Edge Functions.
// - retryWithBackoff: retry com exponential backoff + jitter
// - CircuitBreaker: circuit breaker em memória (por instância da função)
//
// Uso típico:
//   const breaker = getBreaker("evolution-api");
//   const data = await breaker.execute(() =>
//     retryWithBackoff(() => fetch(url, init).then(r => {
//       if (!r.ok) throw new Error(`HTTP ${r.status}`);
//       return r.json();
//     }), { retries: 3 })
//   );

export interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  factor?: number;
  shouldRetry?: (err: unknown, attempt: number) => boolean;
  onRetry?: (err: unknown, attempt: number, delayMs: number) => void;
}

const DEFAULT_RETRY: Required<Omit<RetryOptions, "shouldRetry" | "onRetry">> = {
  retries: 3,
  baseDelayMs: 250,
  maxDelayMs: 4_000,
  factor: 2,
};

/**
 * Executa `fn` com retry + exponential backoff + jitter.
 * Falha aberta ao final: relança o último erro se todos os retries falharem.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  opts: RetryOptions = {},
): Promise<T> {
  const cfg = { ...DEFAULT_RETRY, ...opts };
  const shouldRetry = opts.shouldRetry ?? (() => true);
  let lastErr: unknown;

  for (let attempt = 0; attempt <= cfg.retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt === cfg.retries || !shouldRetry(err, attempt)) break;

      const exp = Math.min(cfg.maxDelayMs, cfg.baseDelayMs * Math.pow(cfg.factor, attempt));
      const jitter = Math.random() * exp * 0.25;
      const delay = Math.floor(exp + jitter);

      opts.onRetry?.(err, attempt + 1, delay);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

// ---------- Circuit Breaker ----------

type State = "closed" | "open" | "half-open";

export interface CircuitBreakerOptions {
  failureThreshold?: number; // falhas consecutivas antes de abrir
  cooldownMs?: number; // tempo em open antes de tentar half-open
  halfOpenMaxCalls?: number; // chamadas de teste em half-open
  onStateChange?: (name: string, from: State, to: State) => void;
}

export class CircuitBreaker {
  private state: State = "closed";
  private failures = 0;
  private openedAt = 0;
  private halfOpenInFlight = 0;

  constructor(
    public readonly name: string,
    private readonly opts: Required<Omit<CircuitBreakerOptions, "onStateChange">> & {
      onStateChange?: (name: string, from: State, to: State) => void;
    } = {
      failureThreshold: 5,
      cooldownMs: 30_000,
      halfOpenMaxCalls: 1,
    },
  ) {}

  private transition(to: State) {
    const from = this.state;
    if (from === to) return;
    this.state = to;
    try {
      this.opts.onStateChange?.(this.name, from, to);
    } catch {
      /* observer não deve quebrar o breaker */
    }
  }

  getState(): State {
    if (this.state === "open" && Date.now() - this.openedAt >= this.opts.cooldownMs) {
      this.transition("half-open");
      this.halfOpenInFlight = 0;
    }
    return this.state;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const state = this.getState();
    if (state === "open") {
      throw new Error(`Circuit breaker '${this.name}' está OPEN — chamada rejeitada`);
    }
    if (state === "half-open") {
      if (this.halfOpenInFlight >= this.opts.halfOpenMaxCalls) {
        throw new Error(`Circuit breaker '${this.name}' half-open saturado`);
      }
      this.halfOpenInFlight++;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.halfOpenInFlight = 0;
    this.transition("closed");
  }

  private onFailure() {
    this.failures++;
    this.halfOpenInFlight = Math.max(0, this.halfOpenInFlight - 1);
    if (this.failures >= this.opts.failureThreshold) {
      this.openedAt = Date.now();
      this.transition("open");
    }
  }
}

const registry = new Map<string, CircuitBreaker>();

export function getBreaker(name: string, opts?: CircuitBreakerOptions): CircuitBreaker {
  let b = registry.get(name);
  if (!b) {
    b = new CircuitBreaker(name, {
      failureThreshold: opts?.failureThreshold ?? 5,
      cooldownMs: opts?.cooldownMs ?? 30_000,
      halfOpenMaxCalls: opts?.halfOpenMaxCalls ?? 1,
      onStateChange: opts?.onStateChange,
    });
    registry.set(name, b);
  }
  return b;
}
