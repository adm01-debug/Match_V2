import { describe, it, expect, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDocumentTitle } from './useDocumentTitle';

describe('useDocumentTitle', () => {
  const originalTitle = document.title;

  afterEach(() => {
    document.title = originalTitle;
  });

  it('should set document title', () => {
    renderHook(() => useDocumentTitle('Test Page'));
    expect(document.title).toBe('Test Page | Match ATS');
  });

  it('should use custom suffix', () => {
    renderHook(() => useDocumentTitle('Test', ' - Custom'));
    expect(document.title).toBe('Test - Custom');
  });

  it('should restore previous title on unmount', () => {
    document.title = 'Original';
    const { unmount } = renderHook(() => useDocumentTitle('New Title'));
    expect(document.title).toBe('New Title | Match ATS');
    unmount();
    expect(document.title).toBe('Original');
  });

  it('should update title when value changes', () => {
    const { rerender } = renderHook(
      ({ title }) => useDocumentTitle(title),
      { initialProps: { title: 'First' } }
    );
    expect(document.title).toBe('First | Match ATS');
    
    rerender({ title: 'Second' });
    expect(document.title).toBe('Second | Match ATS');
  });
});
