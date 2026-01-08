/**
 * @fileoverview PortalProtectedRoute component
 * @module PortalProtectedRoute
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCandidatoAuth } from '@/contexts/CandidatoAuthContext';

interface PortalProtectedRouteProps {
  children: React.ReactNode;
}

const PortalProtectedRoute: React.FC<PortalProtectedRouteProps> = ({ children }) => {
  const { user, isCandidato, loading } = useCandidatoAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div role="region" aria-label="Rota protegida" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div data-testid="portal-protected-route" className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isCandidato) {
    // Pass redirect info to show feedback message
    return <Navigate to="/portal" state={{ from: location.pathname, requiresAuth: true }} replace />;
  }

  return <>{children}</>;
};

PortalProtectedRoute.displayName = "PortalProtectedRoute";

export default PortalProtectedRoute;
