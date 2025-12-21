import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }) } },
}));

describe('CandidatoAuthContext', () => {
  it('should be importable', async () => {
    const module = await import('./CandidatoAuthContext');
    expect(module).toBeDefined();
  });
});
