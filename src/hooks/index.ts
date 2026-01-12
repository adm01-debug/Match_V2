/**
 * @fileoverview Centralized exports for all hooks
 * @module hooks
 */

// Authentication - re-exported from AuthContext
export { useAuth } from '@/contexts/AuthContext';

// Page Title
export { usePageTitle, PAGE_TITLES } from './usePageTitle';

// Data Hooks - Real Supabase hooks
export { useCandidatos, useCandidato, useCandidatosStats, useCreateCandidato, useUpdateCandidato, useDeleteCandidato, useCandidatosSelect } from './useCandidatos';
export { useVagas, useVaga, useVagasSelect, useVagasUrgentes, useCreateVaga, useUpdateVaga, useDeleteVaga } from './useVagas';
export { useEntrevistas, useEntrevistasStats, useEntrevistasEvolucao, useEntrevistasPizza, useCreateEntrevista, useUpdateEntrevista, useCandidatosDisponiveis } from './useEntrevistas';
export { useProcessosSeletivos, useProcessosByVaga, useUpdateProcessoEtapa, useUpdateProcessoStatus, useCreateProcesso, useDeleteProcesso } from './useProcessosSeletivos';
export { useAvaliacoes, useAvaliacoesProcesso, useAvaliacao } from './useAvaliacoes';
export { useProvas, useProva, useCreateProva, useUpdateProva, useDeleteProva, useDuplicateProva } from './useProvas';
export { useComunicacoes } from './useComunicacoes';
export { useDashboardData } from './useDashboardData';

// Selection & Assessment Hooks
export { useAssessments, useAssessment, useSubmitAssessment, useCandidateAssessments } from './useAssessments';

// UI Hooks (re-exports from shadcn)
export { useToast } from './use-toast';
export { useIsMobile } from './use-mobile';
export { useDebounce } from './useDebounce';

// Auth & Security Hooks
export { use2FA } from './use2FA';
export { useReauth } from './useReauth';
export { useTrustedDevices } from './useTrustedDevices';
export { useNewDeviceDetection } from './useNewDeviceDetection';
export { useSessionTimeout } from './useSessionTimeout';
export { useIPVerification } from './useIPVerification';
export { useWebAuthn } from './useWebAuthn';
export { usePasswordBreachCheck } from './usePasswordBreachCheck';
export { usePushNotifications } from './usePushNotifications';
export { useRealtimeNotifications } from './useRealtimeNotifications';
export { useInterviewReminders } from './useInterviewReminders';

// Utility Hooks
export { useBulkActions } from './useBulkActions';
export { useSavedFilters } from './useSavedFilters';
export { useOnboarding } from './useOnboarding';
export { useCandidatoPerfil } from './useCandidatoPerfil';
export { useImportData } from './useImportData';
export { useSoundPreferences } from './useSoundPreferences';

// Performance Hooks
export { useIntersectionObserver, useInfiniteScroll, useLazyImage } from './useIntersectionObserver';
export { useVirtualScroll, useVirtualGrid } from './useVirtualScroll';
