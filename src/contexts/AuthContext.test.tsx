import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }) } },
}));

describe('AuthContext', () => {
  it('should be importable', async () => {
    const module = await import('./AuthContext');
    expect(module).toBeDefined();
  });
});
