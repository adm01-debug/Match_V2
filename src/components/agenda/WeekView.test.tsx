import { describe, it, expect, vi } from 'vitest';
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: vi.fn().mockReturnThis() } }));
describe('WeekView', () => { it('importable', async () => { expect(await import('./WeekView')).toBeDefined(); }); });
