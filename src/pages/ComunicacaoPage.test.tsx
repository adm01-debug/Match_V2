import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({ data: [], error: null }),
  },
}));

describe('ComunicacaoPage', () => {
  it('should be importable', async () => {
    const module = await import('./ComunicacaoPage');
    expect(module).toBeDefined();
  });
});
