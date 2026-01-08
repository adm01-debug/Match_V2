// Authentication - re-exported from AuthContext
export { useAuth } from '@/contexts/AuthContext';

// Page Title
export { usePageTitle, PAGE_TITLES } from './usePageTitle';

// Data Hooks - Real Supabase hooks
export { useCandidatos } from './useCandidatos';
export { useVagas } from './useVagas';
export { useEntrevistas } from './useEntrevistas';

// UI Hooks (re-exports from shadcn)
export { useToast } from './use-toast';
