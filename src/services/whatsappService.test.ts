import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { functions: { invoke: vi.fn().mockResolvedValue({ data: null, error: null }) } },
}));

describe('whatsappService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should be importable', async () => {
    const module = await import('./whatsappService');
    expect(module).toBeDefined();
  });
});
