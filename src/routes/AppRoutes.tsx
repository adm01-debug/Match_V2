import { Route, Routes } from "react-router-dom";
import { portalRoutes } from "./PortalRoutes";
import { authRoutes } from "./AuthRoutes";
import { adminRoutes } from "./AdminRoutes";
import { mainRoutes } from "./MainRoutes";
import { NotFound, StatusPage, TermosPage, PrivacidadePage, CarreirasPage, AplicarVagaPage } from "./lazyPages";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/status" element={<StatusPage />} />
      <Route path="/termos" element={<TermosPage />} />
      <Route path="/privacidade" element={<PrivacidadePage />} />
      <Route path="/carreiras" element={<CarreirasPage />} />
      <Route path="/carreiras/:slug" element={<CarreirasPage />} />
      <Route path="/carreiras/vaga/:vagaId" element={<AplicarVagaPage />} />
      <Route path="/vagas/:vagaId/aplicar" element={<AplicarVagaPage />} />
      {portalRoutes}
      {authRoutes}
      {adminRoutes}
      {mainRoutes}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
