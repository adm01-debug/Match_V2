import { describe, it, expect, vi } from 'vitest';
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: vi.fn().mockReturnThis() } }));
describe('AppSidebar', () => { it('importable', async () => { expect(await import('./AppSidebar')).toBeDefined(); }); });
