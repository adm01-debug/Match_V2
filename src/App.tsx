import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CandidatoAuthProvider } from "./contexts/CandidatoAuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PortalProtectedRoute from "./components/portal/PortalProtectedRoute";
import Dashboard from "./pages/Dashboard";
import VagasList from "./pages/VagasList";
import VagaForm from "./pages/VagaForm";
import VagaDetalhes from "./pages/VagaDetalhes";
import Pipeline from "./pages/Pipeline";
import AvaliacaoForm from "./pages/AvaliacaoForm";
import TestsPage from "./pages/TestsPage";
import ProvaEditor from "./pages/ProvaEditor";
import ProvaAplicacao from "./pages/ProvaAplicacao";
import ResumeParserPage from "./pages/ResumeParserPage";
import CandidatosPage from "./pages/CandidatosPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ComunicacaoPage from "./pages/ComunicacaoPage";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import CandidatoPerfilPage from "./pages/CandidatoPerfilPage";
import AgendaPage from "./pages/AgendaPage";
import IndicacoesPage from "./pages/IndicacoesPage";
import PortalAuthPage from "./pages/portal/PortalAuthPage";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalVagas from "./pages/portal/PortalVagas";
import PortalPerfil from "./pages/portal/PortalPerfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CandidatoAuthProvider>
            <NotificationProvider>
              <Routes>
                {/* Portal do Candidato */}
                <Route path="/portal" element={<PortalAuthPage />} />
                <Route path="/portal/dashboard" element={<PortalProtectedRoute><PortalDashboard /></PortalProtectedRoute>} />
                <Route path="/portal/vagas" element={<PortalProtectedRoute><PortalVagas /></PortalProtectedRoute>} />
                <Route path="/portal/perfil" element={<PortalProtectedRoute><PortalPerfil /></PortalProtectedRoute>} />
                
                {/* Sistema RH */}
                <Route path="/auth" element={<AuthPage />} />
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
                <Route path="/relatorios" element={<ProtectedRoute requiredRoles={['admin', 'rh']}><AnalyticsPage /></ProtectedRoute>} />
                <Route path="/comunicacao" element={<ProtectedRoute><ComunicacaoPage /></ProtectedRoute>} />
                <Route path="/agenda" element={<ProtectedRoute><AgendaPage /></ProtectedRoute>} />
                <Route path="/indicacoes" element={<ProtectedRoute><IndicacoesPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requiredRoles={['admin']}><AdminPage /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </NotificationProvider>
          </CandidatoAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
