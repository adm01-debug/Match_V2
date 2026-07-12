import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  AuthPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  TwoFactorAuthPage,
} from "./lazyPages";

export const authRoutes = (
  <>
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
  </>
);
