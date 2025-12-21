import { describe, it, expect, vi } from 'vitest';

describe('sentry', () => {
  it('should be importable', async () => {
    const module = await import('./sentry');
    expect(module).toBeDefined();
  });

  it('should export functions/constants', async () => {
    const module = await import('./sentry');
    expect(Object.keys(module).length).toBeGreaterThan(0);
  });
});
