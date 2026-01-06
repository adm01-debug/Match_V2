import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn().mockReturnThis() },
}));

describe('KPICard', () => {
  it('should be importable', async () => {
    const module = await import('./KPICard');
    expect(module).toBeDefined();
  });
});
