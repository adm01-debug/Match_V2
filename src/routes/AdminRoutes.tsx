import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Admin2FAGuard } from "@/components/auth/Admin2FAGuard";
import {
  RolesPage,
  RateLimitDashboard,
  SecuritySettingsPage,
  DiagnosticoPage,
  EdgeFunctionTestPage,
  AdminPage,
} from "./lazyPages";

export const adminRoutes = (
  <>
    <Route
      path="/security/roles"
      element={
        <ProtectedRoute requiredRoles={["admin"]}>
          <Admin2FAGuard>
            <RolesPage />
          </Admin2FAGuard>
        </ProtectedRoute>
      }
    />
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
          <Admin2FAGuard>
            <RateLimitDashboard />
          </Admin2FAGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/diagnostico"
      element={
        <ProtectedRoute requiredRoles={["admin"]}>
          <Admin2FAGuard>
            <DiagnosticoPage />
          </Admin2FAGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/edge-functions-test"
      element={
        <ProtectedRoute requiredRoles={["admin"]}>
          <Admin2FAGuard>
            <EdgeFunctionTestPage />
          </Admin2FAGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin"
      element={
        <ProtectedRoute requiredRoles={["admin"]}>
          <Admin2FAGuard>
            <AdminPage />
          </Admin2FAGuard>
        </ProtectedRoute>
      }
    />
  </>
);
