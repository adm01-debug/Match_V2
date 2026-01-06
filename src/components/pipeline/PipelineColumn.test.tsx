import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn().mockReturnThis() },
}));

describe('PipelineColumn', () => {
  it('should be importable', async () => {
    const module = await import('./PipelineColumn');
    expect(module).toBeDefined();
  });
});
