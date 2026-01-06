import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }) } },
}));

describe('CandidatoAuthContext', () => {
  it('should be importable', async () => {
    const module = await import('./CandidatoAuthContext');
    expect(module).toBeDefined();
  });
});
