import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CandidatoAuthProvider } from "./contexts/CandidatoAuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AnalyticsProvider } from "./contexts/AnalyticsProvider";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import PortalProtectedRoute from "./components/portal/PortalProtectedRoute";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Lazy loaded pages - Code splitting para melhor performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const VagasList = lazy(() => import("./pages/VagasList"));
const VagaForm = lazy(() => import("./pages/VagaForm"));
const VagaDetalhes = lazy(() => import("./pages/VagaDetalhes"));
const Pipeline = lazy(() => import("./pages/Pipeline"));
const AvaliacaoForm = lazy(() => import("./pages/AvaliacaoForm"));
const TestsPage = lazy(() => import("./pages/TestsPage"));
const ProvaEditor = lazy(() => import("./pages/ProvaEditor"));
const ProvaAplicacao = lazy(() => import("./pages/ProvaAplicacao"));
const ResumeParserPage = lazy(() => import("./pages/ResumeParserPage"));
const CandidatosPage = lazy(() => import("./pages/CandidatosPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const ComunicacaoPage = lazy(() => import("./pages/ComunicacaoPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const CandidatoPerfilPage = lazy(() => import("./pages/CandidatoPerfilPage"));
const AgendaPage = lazy(() => import("./pages/AgendaPage"));
const IndicacoesPage = lazy(() => import("./pages/IndicacoesPage"));
const DiagnosticoPage = lazy(() => import("./pages/DiagnosticoPage"));
const PortalAuthPage = lazy(() => import("./pages/portal/PortalAuthPage"));
const PortalDashboard = lazy(() => import("./pages/portal/PortalDashboard"));
const PortalVagas = lazy(() => import("./pages/portal/PortalVagas"));
const PortalPerfil = lazy(() => import("./pages/portal/PortalPerfil"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
      <TooltipProvider>
        <BrowserRouter>
          <AnalyticsProvider>
            <AuthProvider>
              <CandidatoAuthProvider>
                <NotificationProvider>
                  <ErrorBoundary>
                    <Suspense fallback={<PageLoader />}>
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

                        {/* Diagnóstico - Rota Pública */}
                        <Route path="/diagnostico" element={<DiagnosticoPage />} />

                        {/* Rotas Protegidas - Sistema Interno */}
                        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/vagas" element={<ProtectedRoute><VagasList /></ProtectedRoute>} />
                        <Route path="/vagas/nova" element={<ProtectedRoute><VagaForm /></ProtectedRoute>} />
                        <Route path="/vagas/:id" element={<ProtectedRoute><VagaDetalhes /></ProtectedRoute>} />
                        <Route path="/vagas/:id/editar" element={<ProtectedRoute><VagaForm /></ProtectedRoute>} />
                        <Route path="/pipeline" element={<ProtectedRoute><Pipeline /></ProtectedRoute>} />
                        <Route path="/avaliacao/:processoId" element={<ProtectedRoute><AvaliacaoForm /></ProtectedRoute>} />
                        <Route path="/testes" element={<ProtectedRoute><TestsPage /></ProtectedRoute>} />
                        <Route path="/testes/nova" element={<ProtectedRoute><ProvaEditor /></ProtectedRoute>} />
                        <Route path="/testes/:id/editar" element={<ProtectedRoute><ProvaEditor /></ProtectedRoute>} />
                        <Route path="/testes/:provaId/aplicar" element={<ProtectedRoute><ProvaAplicacao /></ProtectedRoute>} />
                        <Route path="/parser-curriculo" element={<ProtectedRoute><ResumeParserPage /></ProtectedRoute>} />
                        <Route path="/talentos" element={<ProtectedRoute><CandidatosPage /></ProtectedRoute>} />
                        <Route path="/candidato/:id" element={<ProtectedRoute><CandidatoPerfilPage /></ProtectedRoute>} />
                        <Route path="/relatorios" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                        <Route path="/comunicacao" element={<ProtectedRoute><ComunicacaoPage /></ProtectedRoute>} />
                        <Route path="/agenda" element={<ProtectedRoute><AgendaPage /></ProtectedRoute>} />
                        <Route path="/indicacoes" element={<ProtectedRoute><IndicacoesPage /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                  <Toaster />
                  <Sonner />
                </NotificationProvider>
              </CandidatoAuthProvider>
            </AuthProvider>
          </AnalyticsProvider>
        </BrowserRouter>
      <SpeedInsights />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
