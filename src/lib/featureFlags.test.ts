import { describe, it, expect } from 'vitest';
import { FeatureFlags, useFeatureFlag } from './featureFlags';

describe('featureFlags', () => {
  it('should have all feature flags defined', () => {
    expect(FeatureFlags).toBeDefined();
    expect(typeof FeatureFlags.NEW_DASHBOARD).toBe('boolean');
    expect(typeof FeatureFlags.BETA_FEATURES).toBe('boolean');
  });

  it('should return boolean for useFeatureFlag', () => {
    const result = useFeatureFlag('NEW_DASHBOARD');
    expect(typeof result).toBe('boolean');
  });

  it('should have DEBUG_MODE in dev environment', () => {
    expect(typeof FeatureFlags.DEBUG_MODE).toBe('boolean');
  });
});
