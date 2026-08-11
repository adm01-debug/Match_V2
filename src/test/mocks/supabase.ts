/**
 * @fileoverview Mock completo do Supabase client para testes
 */
import { vi } from 'vitest';

const mockQueryBuilder = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  upsert: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  neq: vi.fn().mockReturnThis(),
  gt: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  lt: vi.fn().mockReturnThis(),
  lte: vi.fn().mockReturnThis(),
  like: vi.fn().mockReturnThis(),
  ilike: vi.fn().mockReturnThis(),
  is: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  or: vi.fn().mockReturnThis(),
  and: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ data: null, error: null }),
  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  then: vi.fn(),
};

// Make chainable methods resolve with data/error
const createChainableQuery = (defaultData: unknown = [], defaultError: unknown = null) => {
  const builder = { ...mockQueryBuilder };
  // Override terminal method
  const terminalPromise = Promise.resolve({ data: defaultData, error: defaultError, count: null });
  Object.setPrototypeOf(builder, {
    then: (resolve: (v: unknown) => void, reject: (e: unknown) => void) => terminalPromise.then(resolve, reject),
  });
  return builder;
};

export const mockSupabase = {
  from: vi.fn(() => createChainableQuery()),
  rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({ data: {}, error: null }),
  },
  functions: {
    invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
  },
  storage: {
    from: vi.fn().mockReturnValue({
      upload: vi.fn().mockResolvedValue({ data: { path: 'test.pdf' }, error: null }),
      download: vi.fn().mockResolvedValue({ data: new Blob(), error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://test.com/file.pdf' } }),
      remove: vi.fn().mockResolvedValue({ data: [], error: null }),
      list: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  },
  channel: vi.fn().mockReturnValue({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
    unsubscribe: vi.fn(),
  }),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

export { createChainableQuery };
