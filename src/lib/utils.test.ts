import { describe, it, expect, vi } from 'vitest';

describe('utils', () => {
  it('should be importable', async () => {
    const module = await import('./utils');
    expect(module).toBeDefined();
  });

  it('should export functions/constants', async () => {
    const module = await import('./utils');
    expect(Object.keys(module).length).toBeGreaterThan(0);
  });
});
