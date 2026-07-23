import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import type { AppRole } from "@/contexts/AuthContext";
import {
  Dashboard,
  VagasList,
  VagaForm,
  VagaDetalhes,
  Pipeline,
  AvaliacaoForm,
  AvaliacoesPage,
  TestsPage,
  ProvaEditor,
  ProvaAplicacao,
  ResumeParserPage,
  CandidatosPage,
  AnalyticsPage,
  ReportsPage,
  ComunicacaoPage,
  CandidatoPerfilPage,
  AgendaPage,
  IndicacoesPage,
  BehavioralAssessmentsPage,
  BehavioralAssessmentPage,
  GamificationPage,
  OfferManagementPage,
  HiringManagerPortalPage,
  AdvancedAnalyticsPage,
  WorkflowEditorPage,
  DeuMatchPage,
  TalentPoolPage,
  RankingVagaPage,
} from "./lazyPages";

const guard = (el: React.ReactNode, roles?: AppRole[]) => (
  <ProtectedRoute requiredRoles={roles}>{el}</ProtectedRoute>
);

export const mainRoutes = (
  <>
    <Route path="/" element={guard(<Dashboard />)} />
    <Route path="/vagas" element={guard(<VagasList />)} />
    <Route path="/vagas/nova" element={guard(<VagaForm />)} />
    <Route path="/vagas/:id" element={guard(<VagaDetalhes />)} />
    <Route path="/vagas/:id/editar" element={guard(<VagaForm />)} />
    <Route path="/vagas/:vagaId/ranking" element={guard(<RankingVagaPage />, ["admin", "rh", "gestor"])} />
    <Route path="/pipeline" element={guard(<Pipeline />)} />
    <Route path="/avaliacao/:processoId" element={guard(<AvaliacaoForm />)} />
    <Route path="/testes" element={guard(<TestsPage />)} />
    <Route path="/testes/nova" element={guard(<ProvaEditor />)} />
    <Route path="/testes/:id/editar" element={guard(<ProvaEditor />)} />
    <Route path="/testes/:provaId/aplicar" element={guard(<ProvaAplicacao />)} />
    <Route path="/parser-curriculo" element={guard(<ResumeParserPage />)} />
    <Route path="/talentos" element={guard(<CandidatosPage />)} />
    <Route path="/candidato/:id" element={guard(<CandidatoPerfilPage />)} />
    <Route path="/relatorios" element={guard(<ReportsPage />)} />
    <Route path="/analytics-basico" element={guard(<AnalyticsPage />)} />
    <Route path="/comunicacao" element={guard(<ComunicacaoPage />)} />
    <Route path="/agenda" element={guard(<AgendaPage />)} />
    <Route path="/indicacoes" element={guard(<IndicacoesPage />)} />
    <Route path="/avaliacoes-comportamentais" element={guard(<BehavioralAssessmentsPage />)} />
    <Route path="/avaliacao-comportamental" element={guard(<BehavioralAssessmentPage />)} />
    <Route path="/gamification" element={guard(<GamificationPage />)} />
    <Route path="/ofertas" element={guard(<OfferManagementPage />)} />
    <Route path="/gestor" element={guard(<HiringManagerPortalPage />, ["gestor", "admin"])} />
    <Route path="/analytics" element={guard(<AdvancedAnalyticsPage />, ["admin", "rh"])} />
    <Route path="/avaliacoes" element={guard(<AvaliacoesPage />)} />
    <Route path="/deu-match" element={guard(<DeuMatchPage />)} />
    <Route path="/workflows" element={guard(<WorkflowEditorPage />)} />
    <Route path="/banco-talentos" element={guard(<TalentPoolPage />)} />
  </>
);
