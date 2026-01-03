import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Pre-configured lazy pages
export const LazyDashboard = lazy(() => import("@/pages/Dashboard"));
export const LazyCandidatosPage = lazy(() => import("@/pages/CandidatosPage"));
export const LazyVagasList = lazy(() => import("@/pages/VagasList"));
export const LazyPipeline = lazy(() => import("@/pages/Pipeline"));
export const LazyReportsPage = lazy(() => import("@/pages/ReportsPage"));
export const LazyAnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));
export const LazyAgendaPage = lazy(() => import("@/pages/AgendaPage"));
export const LazyAdminPage = lazy(() => import("@/pages/AdminPage"));
export const LazyWorkflowEditorPage = lazy(() => import("@/pages/WorkflowEditorPage"));
export const LazyTalentPoolPage = lazy(() => import("@/pages/TalentPoolPage"));

// Page wrapper with loading state
export function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  );
}
