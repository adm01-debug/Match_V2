import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vagas" element={<VagasList />} />
          <Route path="/vagas/nova" element={<VagaForm />} />
          <Route path="/vagas/:id" element={<VagaDetalhes />} />
          <Route path="/vagas/:id/editar" element={<VagaForm />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/avaliacao/:processoId" element={<AvaliacaoForm />} />
          <Route path="/testes" element={<TestsPage />} />
          <Route path="/testes/nova" element={<ProvaEditor />} />
          <Route path="/testes/:id/editar" element={<ProvaEditor />} />
          <Route path="/testes/:provaId/aplicar" element={<ProvaAplicacao />} />
          <Route path="/parser-curriculo" element={<ResumeParserPage />} />
          <Route path="/talentos" element={<CandidatosPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
