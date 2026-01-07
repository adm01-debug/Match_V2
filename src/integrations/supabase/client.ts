// Supabase client with fallback configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Fallback values for when environment variables are not available
const FALLBACK_URL = 'https://gwopzfulndgjtujbmxzj.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3b3B6ZnVsbmRnanR1amJteHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTY3ODUsImV4cCI6MjA4MTQ3Mjc4NX0.kPr8MyvdSJVXTib-2qyYv7wMhUV_lKcxlknEgZQbYn0';

const SUPABASE_URL = import.meta.env['VITE_SUPABASE_URL'] || FALLBACK_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] || FALLBACK_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});
