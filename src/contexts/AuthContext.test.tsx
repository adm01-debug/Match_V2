import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }) } },
}));

describe('AuthContext', () => {
  it('should be importable', async () => {
    const module = await import('./AuthContext');
    expect(module).toBeDefined();
  });
});
