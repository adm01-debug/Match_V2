import { describe, it, expect } from 'vitest';
import { queryConfig, mutationConfig } from './queryConfig';

describe('queryConfig', () => {
  it('has default stale time', () => {
    expect(queryConfig.defaultStaleTime).toBe(5 * 60 * 1000);
  });

  it('has retry delay function', () => {
    expect(queryConfig.retryDelay(0)).toBe(1000);
    expect(queryConfig.retryDelay(1)).toBe(2000);
  });
});

describe('mutationConfig', () => {
  it('has retry count', () => {
    expect(mutationConfig.retryCount).toBe(2);
  });
});
