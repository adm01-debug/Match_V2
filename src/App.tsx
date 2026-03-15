import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { CandidatoAuthProvider } from "./contexts/CandidatoAuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AnalyticsProvider } from "./contexts/AnalyticsProvider";
import { AnimatedRoutes } from "./components/layout/AnimatedRoutes";
import { GlobalShortcutsProvider } from "./components/common/GlobalShortcutsProvider";


import ProtectedRoute from "./components/auth/ProtectedRoute";
import PortalProtectedRoute from "./components/portal/PortalProtectedRoute";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { NewDeviceDetector } from "./components/auth/NewDeviceDetector";
import { OnboardingProvider } from "./components/onboarding/OnboardingProvider";

// Lazy loaded pages - Code splitting para melhor performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const VagasList = lazy(() => import("./pages/VagasList"));
const VagaForm = lazy(() => import("./pages/VagaForm"));
const VagaDetalhes = lazy(() => import("./pages/VagaDetalhes"));
const Pipeline = lazy(() => import("./pages/Pipeline"));
const AvaliacaoForm = lazy(() => import("./pages/AvaliacaoForm"));
const AvaliacoesPage = lazy(() => import("./pages/AvaliacoesPage"));
const TestsPage = lazy(() => import("./pages/TestsPage"));
const ProvaEditor = lazy(() => import("./pages/ProvaEditor"));
const ProvaAplicacao = lazy(() => import("./pages/ProvaAplicacao"));
const ResumeParserPage = lazy(() => import("./pages/ResumeParserPage"));
const CandidatosPage = lazy(() => import("./pages/CandidatosPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const ComunicacaoPage = lazy(() => import("./pages/ComunicacaoPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const CandidatoPerfilPage = lazy(() => import("./pages/CandidatoPerfilPage"));
const AgendaPage = lazy(() => import("./pages/AgendaPage"));
const IndicacoesPage = lazy(() => import("./pages/IndicacoesPage"));
const DiagnosticoPage = lazy(() => import("./pages/DiagnosticoPage"));
const EdgeFunctionTestPage = lazy(() => import("./pages/EdgeFunctionTestPage"));
const BehavioralAssessmentsPage = lazy(() => import("./pages/BehavioralAssessmentsPage"));
const BehavioralAssessmentPage = lazy(() => import("./pages/BehavioralAssessmentPage"));
const GamificationPage = lazy(() => import("./pages/GamificationPage"));
const OfferManagementPage = lazy(() => import("./pages/OfferManagementPage"));
const HiringManagerPortalPage = lazy(() => import("./pages/HiringManagerPortalPage"));
const AdvancedAnalyticsPage = lazy(() => import("./pages/AdvancedAnalyticsPage"));
const WorkflowEditorPage = lazy(() => import("./pages/WorkflowEditorPage"));
const PortalAuthPage = lazy(() => import("./pages/portal/PortalAuthPage"));
const PortalDashboard = lazy(() => import("./pages/portal/PortalDashboard"));
const PortalVagas = lazy(() => import("./pages/portal/PortalVagas"));
const PortalPerfil = lazy(() => import("./pages/portal/PortalPerfil"));
const DeuMatchPage = lazy(() => import("./pages/DeuMatchPage"));
const TalentPoolPage = lazy(() => import("./pages/TalentPoolPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Auth pages
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const TwoFactorAuthPage = lazy(() => import("./pages/auth/TwoFactorAuthPage"));

// Security pages
const RolesPage = lazy(() => import("./pages/security/RolesPage"));
const RateLimitDashboard = lazy(() => import("./pages/security/RateLimitDashboard"));
const SecuritySettingsPage = lazy(() => import("./pages/settings/SecuritySettingsPage"));
// Note: PermissionsPage is accessed via admin routes

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// QueryClient criado FORA do componente para evitar recriação
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <BrowserRouter>
            <AnalyticsProvider>
              <AuthProvider>
                <CandidatoAuthProvider>
                  <NotificationProvider>
                    <OnboardingProvider>
                      <ErrorBoundary>
                        <GlobalShortcutsProvider>
                          <NewDeviceDetector />
                          <Suspense fallback={<PageLoader />}>
                            <AnimatedRoutes>
                              <Routes>
                                {/* Portal do Candidato - Rotas Públicas */}
                                <Route path="/portal" element={<PortalAuthPage />} />
                                <Route
                                  path="/portal/dashboard"
                                  element={
                                    <PortalProtectedRoute>
                                      <PortalDashboard />
                                    </PortalProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/portal/vagas"
                                  element={
                                    <PortalProtectedRoute>
                                      <PortalVagas />
                                    </PortalProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/portal/perfil"
                                  element={
                                    <PortalProtectedRoute>
                                      <PortalPerfil />
                                    </PortalProtectedRoute>
                                  }
                                />

                                {/* Autenticação */}
                                <Route path="/auth" element={<AuthPage />} />
                                <Route path="/auth/login" element={<LoginPage />} />
                                <Route path="/auth/register" element={<RegisterPage />} />
                                <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                                <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
                                <Route
                                  path="/auth/2fa"
                                  element={
                                    <ProtectedRoute>
                                      <TwoFactorAuthPage />
                                    </ProtectedRoute>
                                  }
                                />

                                {/* Segurança - Admin Only */}
                                <Route
                                  path="/security/roles"
                                  element={
                                    <ProtectedRoute requiredRoles={["admin"]}>
                                      <RolesPage />
                                    </ProtectedRoute>
                                  }
                                />

                                {/* Configurações do Usuário */}
                                <Route
                                  path="/configuracoes/seguranca"
                                  element={
                                    <ProtectedRoute>
                                      <SecuritySettingsPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/security/rate-limit"
                                  element={
                                    <ProtectedRoute requiredRoles={["admin"]}>
                                      <RateLimitDashboard />
                                    </ProtectedRoute>
                                  }
                                />

                                {/* Diagnóstico - Rota Pública */}
                                <Route path="/diagnostico" element={<DiagnosticoPage />} />
                                <Route path="/edge-functions-test" element={<EdgeFunctionTestPage />} />

                                {/* Rotas Protegidas - Sistema Interno */}
                                <Route
                                  path="/"
                                  element={
                                    <ProtectedRoute>
                                      <Dashboard />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/vagas"
                                  element={
                                    <ProtectedRoute>
                                      <VagasList />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/vagas/nova"
                                  element={
                                    <ProtectedRoute>
                                      <VagaForm />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/vagas/:id"
                                  element={
                                    <ProtectedRoute>
                                      <VagaDetalhes />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/vagas/:id/editar"
                                  element={
                                    <ProtectedRoute>
                                      <VagaForm />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/pipeline"
                                  element={
                                    <ProtectedRoute>
                                      <Pipeline />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/avaliacao/:processoId"
                                  element={
                                    <ProtectedRoute>
                                      <AvaliacaoForm />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/testes"
                                  element={
                                    <ProtectedRoute>
                                      <TestsPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/testes/nova"
                                  element={
                                    <ProtectedRoute>
                                      <ProvaEditor />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/testes/:id/editar"
                                  element={
                                    <ProtectedRoute>
                                      <ProvaEditor />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/testes/:provaId/aplicar"
                                  element={
                                    <ProtectedRoute>
                                      <ProvaAplicacao />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/parser-curriculo"
                                  element={
                                    <ProtectedRoute>
                                      <ResumeParserPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/talentos"
                                  element={
                                    <ProtectedRoute>
                                      <CandidatosPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/candidato/:id"
                                  element={
                                    <ProtectedRoute>
                                      <CandidatoPerfilPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/relatorios"
                                  element={
                                    <ProtectedRoute>
                                      <ReportsPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/analytics-basico"
                                  element={
                                    <ProtectedRoute>
                                      <AnalyticsPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/comunicacao"
                                  element={
                                    <ProtectedRoute>
                                      <ComunicacaoPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/agenda"
                                  element={
                                    <ProtectedRoute>
                                      <AgendaPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/indicacoes"
                                  element={
                                    <ProtectedRoute>
                                      <IndicacoesPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/avaliacoes-comportamentais"
                                  element={
                                    <ProtectedRoute>
                                      <BehavioralAssessmentsPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/avaliacao-comportamental"
                                  element={
                                    <ProtectedRoute>
                                      <BehavioralAssessmentPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/gamification"
                                  element={
                                    <ProtectedRoute>
                                      <GamificationPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/ofertas"
                                  element={
                                    <ProtectedRoute>
                                      <OfferManagementPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/gestor"
                                  element={
                                    <ProtectedRoute requiredRoles={["gestor", "admin"]}>
                                      <HiringManagerPortalPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/analytics"
                                  element={
                                    <ProtectedRoute requiredRoles={["admin", "rh"]}>
                                      <AdvancedAnalyticsPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/admin"
                                  element={
                                    <ProtectedRoute requiredRoles={["admin"]}>
                                      <AdminPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/avaliacoes"
                                  element={
                                    <ProtectedRoute>
                                      <AvaliacoesPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/deu-match"
                                  element={
                                    <ProtectedRoute>
                                      <DeuMatchPage />
                                    </ProtectedRoute>
                                  }
                                />

                                <Route
                                  path="/workflows"
                                  element={
                                    <ProtectedRoute>
                                      <WorkflowEditorPage />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/banco-talentos"
                                  element={
                                    <ProtectedRoute>
                                      <TalentPoolPage />
                                    </ProtectedRoute>
                                  }
                                />

                                {/* 404 */}
                                <Route path="*" element={<NotFound />} />
                              </Routes>
                            </AnimatedRoutes>
                          </Suspense>
                        </GlobalShortcutsProvider>
                      </ErrorBoundary>
                    </OnboardingProvider>
                    
                    <Toaster />
                    <Sonner />
                  </NotificationProvider>
                </CandidatoAuthProvider>
              </AuthProvider>
            </AnalyticsProvider>
          </BrowserRouter>
          <SpeedInsights />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

