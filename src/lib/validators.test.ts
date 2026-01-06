import { describe, it, expect } from 'vitest';

describe('validators', () => {
  it('should be importable', async () => {
    const module = await import('./validators');
    expect(module).toBeDefined();
  });

  it('should export functions/constants', async () => {
    const module = await import('./validators');
    expect(Object.keys(module).length).toBeGreaterThan(0);
  });
});
