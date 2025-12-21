import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

describe('useToast', () => {
  it('should be importable', async () => {
    const module = await import('./use-toast');
    expect(module).toBeDefined();
    expect(module.useToast).toBeDefined();
  });

  it('should export toast function', async () => {
    const module = await import('./use-toast');
    expect(module.toast).toBeDefined();
  });
});
