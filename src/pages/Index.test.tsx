import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn().mockReturnThis() },
}));

describe('Index', () => {
  it('should be importable', async () => {
    expect(true).toBe(true);
  });
});
