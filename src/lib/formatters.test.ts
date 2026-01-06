import { describe, it, expect } from 'vitest';

describe('formatters', () => {
  it('should be importable', async () => {
    const module = await import('./formatters');
    expect(module).toBeDefined();
  });

  it('should export functions/constants', async () => {
    const module = await import('./formatters');
    expect(Object.keys(module).length).toBeGreaterThan(0);
  });
});
