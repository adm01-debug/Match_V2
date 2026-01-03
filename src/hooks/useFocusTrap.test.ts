import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap';

describe('useFocusTrap', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns a ref object', () => {
    const { result } = renderHook(() => useFocusTrap(false));
    expect(result.current).toHaveProperty('current');
  });

  it('ref is initially null', () => {
    const { result } = renderHook(() => useFocusTrap(true));
    expect(result.current.current).toBeNull();
  });

  it('accepts options parameter', () => {
    const { result } = renderHook(() => 
      useFocusTrap(true, { 
        autoFocus: false, 
        restoreFocus: false 
      })
    );
    expect(result.current).toBeDefined();
  });

  it('handles inactive state', () => {
    const { result, rerender } = renderHook(
      ({ isActive }) => useFocusTrap(isActive),
      { initialProps: { isActive: false } }
    );

    expect(result.current.current).toBeNull();

    rerender({ isActive: true });
    expect(result.current.current).toBeNull();
  });

  it('accepts initialFocus option', () => {
    const initialFocusRef = { current: null as HTMLElement | null };
    const { result } = renderHook(() => 
      useFocusTrap(true, { initialFocus: initialFocusRef })
    );
    expect(result.current).toBeDefined();
  });

  it('can toggle active state', () => {
    const { result, rerender } = renderHook(
      ({ isActive }) => useFocusTrap(isActive),
      { initialProps: { isActive: true } }
    );

    rerender({ isActive: false });
    expect(result.current).toBeDefined();

    rerender({ isActive: true });
    expect(result.current).toBeDefined();
  });
});
