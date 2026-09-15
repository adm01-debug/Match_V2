import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

// vitest 5 inlined `expect` and changed Assertion to <R, T>.
// @testing-library/jest-dom@7 still augments the old <T> shape, so the
// matchers stop being visible to tsc. Re-augment with the current signature.
declare module 'vitest' {
  interface Assertion<R, T> extends TestingLibraryMatchers<unknown, R> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<unknown, unknown> {}
}
