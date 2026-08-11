import { Route } from "react-router-dom";
import PortalProtectedRoute from "@/components/portal/PortalProtectedRoute";
import { PortalAuthPage, PortalDashboard, PortalVagas, PortalPerfil } from "./lazyPages";

export const portalRoutes = (
  <>
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
  </>
);
