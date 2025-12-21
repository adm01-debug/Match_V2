import { describe, it, expect, vi } from 'vitest';
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: vi.fn().mockReturnThis() } }));
describe('DayView', () => { it('importable', async () => { expect(await import('./DayView')).toBeDefined(); }); });
