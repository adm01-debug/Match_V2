import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn().mockReturnThis(), select: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ data: null, error: null }) },
}));

describe('useCandidatoPerfil', () => {
  it('should be importable', async () => {
    const module = await import('./useCandidatoPerfil');
    expect(module).toBeDefined();
  });
});
