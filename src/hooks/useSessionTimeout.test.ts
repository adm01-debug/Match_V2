import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSessionTimeout } from './useSessionTimeout';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('useSessionTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockNavigate.mockClear();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns expected interface', () => {
    const { result } = renderHook(() => useSessionTimeout({ disabled: true }));

    expect(result.current).toHaveProperty('resetTimeout');
    expect(result.current).toHaveProperty('extendSession');
    expect(result.current).toHaveProperty('isWarningVisible');
    expect(result.current).toHaveProperty('remainingTime');
    expect(result.current).toHaveProperty('isActive');
  });

  it('is inactive when disabled', () => {
    const { result } = renderHook(() => 
      useSessionTimeout({ disabled: true })
    );

    expect(result.current.isActive).toBe(false);
  });

  it('shows warning before timeout', () => {
    const onWarning = vi.fn();
    const { result } = renderHook(() => 
      useSessionTimeout({
        timeout: 10000,
        warningBefore: 3000,
        onWarning,
      })
    );

    expect(result.current.isWarningVisible).toBe(false);

    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(result.current.isWarningVisible).toBe(true);
    expect(onWarning).toHaveBeenCalled();
  });

  it('calls onTimeout when session expires', () => {
    const onTimeout = vi.fn();
    renderHook(() => 
      useSessionTimeout({
        timeout: 5000,
        warningBefore: 1000,
        onTimeout,
      })
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onTimeout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });

  it('navigates to custom redirect path', () => {
    const onTimeout = vi.fn();
    renderHook(() => 
      useSessionTimeout({
        timeout: 5000,
        warningBefore: 0,
        onTimeout,
        redirectTo: '/login',
      })
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('extendSession resets the timer', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() => 
      useSessionTimeout({
        timeout: 5000,
        warningBefore: 2000,
        onTimeout,
      })
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.isWarningVisible).toBe(true);

    act(() => {
      result.current.extendSession();
    });

    expect(result.current.isWarningVisible).toBe(false);

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('resetTimeout can be called manually', () => {
    const { result } = renderHook(() => 
      useSessionTimeout({
        timeout: 10000,
        warningBefore: 2000,
      })
    );

    act(() => {
      vi.advanceTimersByTime(8000);
    });

    expect(result.current.isWarningVisible).toBe(true);

    act(() => {
      result.current.resetTimeout();
    });

    expect(result.current.isWarningVisible).toBe(false);
  });

  it('counts down remaining time', () => {
    const { result } = renderHook(() => 
      useSessionTimeout({
        timeout: 10000,
        warningBefore: 5000,
      })
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.isWarningVisible).toBe(true);
    expect(result.current.remainingTime).toBe(5000);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.remainingTime).toBe(4000);
  });

  it('cleans up on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => 
      useSessionTimeout({ timeout: 10000 })
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
    clearIntervalSpy.mockRestore();
  });
});
