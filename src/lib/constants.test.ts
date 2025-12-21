import { describe, it, expect, vi } from 'vitest';

describe('constants', () => {
  it('should be importable', async () => {
    const module = await import('./constants');
    expect(module).toBeDefined();
  });

  it('should export functions/constants', async () => {
    const module = await import('./constants');
    expect(Object.keys(module).length).toBeGreaterThan(0);
  });
});
