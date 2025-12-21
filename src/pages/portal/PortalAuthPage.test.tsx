import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn().mockReturnThis(), select: vi.fn().mockResolvedValue({ data: [], error: null }) },
}));

describe('portal/PortalAuthPage', () => {
  it('should be importable', async () => {
    const module = await import('./portal/PortalAuthPage');
    expect(module).toBeDefined();
  });
});
