import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
  },
}));

describe('useViews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be importable', async () => {
    const module = await import('./useViews');
    expect(module).toBeDefined();
    expect(module.usePipelineView).toBeDefined();
    expect(module.useAgendaEntrevistasView).toBeDefined();
    expect(module.useVagasKpisView).toBeDefined();
    expect(module.useDashboardKPIs).toBeDefined();
  });
});
