import { lazy } from "react";

// Main pages
export const Dashboard = lazy(() => import("@/pages/Dashboard"));
export const VagasList = lazy(() => import("@/pages/VagasList"));
export const VagaForm = lazy(() => import("@/pages/VagaForm"));
export const VagaDetalhes = lazy(() => import("@/pages/VagaDetalhes"));
export const Pipeline = lazy(() => import("@/pages/Pipeline"));
export const AvaliacaoForm = lazy(() => import("@/pages/AvaliacaoForm"));
export const AvaliacoesPage = lazy(() => import("@/pages/AvaliacoesPage"));
export const TestsPage = lazy(() => import("@/pages/TestsPage"));
export const ProvaEditor = lazy(() => import("@/pages/ProvaEditor"));
export const ProvaAplicacao = lazy(() => import("@/pages/ProvaAplicacao"));
export const ResumeParserPage = lazy(() => import("@/pages/ResumeParserPage"));
export const CandidatosPage = lazy(() => import("@/pages/CandidatosPage"));
export const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));
export const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
export const ComunicacaoPage = lazy(() => import("@/pages/ComunicacaoPage"));
export const AuthPage = lazy(() => import("@/pages/AuthPage"));
export const AdminPage = lazy(() => import("@/pages/AdminPage"));
export const CandidatoPerfilPage = lazy(() => import("@/pages/CandidatoPerfilPage"));
export const AgendaPage = lazy(() => import("@/pages/AgendaPage"));
export const IndicacoesPage = lazy(() => import("@/pages/IndicacoesPage"));
export const DiagnosticoPage = lazy(() => import("@/pages/DiagnosticoPage"));
export const EdgeFunctionTestPage = lazy(() => import("@/pages/EdgeFunctionTestPage"));
export const BehavioralAssessmentsPage = lazy(() => import("@/pages/BehavioralAssessmentsPage"));
export const BehavioralAssessmentPage = lazy(() => import("@/pages/BehavioralAssessmentPage"));
export const GamificationPage = lazy(() => import("@/pages/GamificationPage"));
export const OfferManagementPage = lazy(() => import("@/pages/OfferManagementPage"));
export const HiringManagerPortalPage = lazy(() => import("@/pages/HiringManagerPortalPage"));
export const AdvancedAnalyticsPage = lazy(() => import("@/pages/AdvancedAnalyticsPage"));
export const WorkflowEditorPage = lazy(() => import("@/pages/WorkflowEditorPage"));
export const DeuMatchPage = lazy(() => import("@/pages/DeuMatchPage"));
export const TalentPoolPage = lazy(() => import("@/pages/TalentPoolPage"));
export const NotFound = lazy(() => import("@/pages/NotFound"));
export const StatusPage = lazy(() => import("@/pages/StatusPage"));
export const TermosPage = lazy(() => import("@/pages/public/TermosPage"));
export const PrivacidadePage = lazy(() => import("@/pages/public/PrivacidadePage"));
export const CarreirasPage = lazy(() => import("@/pages/CarreirasPage"));

// Portal pages
export const PortalAuthPage = lazy(() => import("@/pages/portal/PortalAuthPage"));
export const PortalDashboard = lazy(() => import("@/pages/portal/PortalDashboard"));
export const PortalVagas = lazy(() => import("@/pages/portal/PortalVagas"));
export const PortalPerfil = lazy(() => import("@/pages/portal/PortalPerfil"));

// Auth pages
export const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
export const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
export const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
export const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
export const TwoFactorAuthPage = lazy(() => import("@/pages/auth/TwoFactorAuthPage"));

// Security pages
export const RolesPage = lazy(() => import("@/pages/security/RolesPage"));
export const RateLimitDashboard = lazy(() => import("@/pages/security/RateLimitDashboard"));
export const SecuritySettingsPage = lazy(() => import("@/pages/settings/SecuritySettingsPage"));

// Admin pages
export const DeadLetterQueuePage = lazy(() => import("@/pages/admin/DeadLetterQueuePage"));
export const AuditLogPage = lazy(() => import("@/pages/admin/AuditLogPage"));
