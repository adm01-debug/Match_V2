import { describe, it, expect, vi } from 'vitest';
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: vi.fn().mockReturnThis() } }));
describe('EntrevistaCard', () => { it('importable', async () => { expect(await import('./EntrevistaCard')).toBeDefined(); }); });
