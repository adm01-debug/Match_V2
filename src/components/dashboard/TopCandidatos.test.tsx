import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn().mockReturnThis() },
}));

describe('TopCandidatos', () => {
  it('should be importable', async () => {
    const module = await import('./TopCandidatos');
    expect(module).toBeDefined();
  });
});
