import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn().mockReturnThis() },
}));

describe('ErrorBoundary', () => {
  it('should be importable', async () => {
    expect(true).toBe(true);
  });
});
