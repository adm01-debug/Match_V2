import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn().mockReturnThis() },
}));

describe('AcoesPendentes', () => {
  it('should be importable', async () => {
    const module = await import('./AcoesPendentes');
    expect(module).toBeDefined();
  });
});
