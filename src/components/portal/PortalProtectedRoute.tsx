import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCandidatoAuth } from '@/contexts/CandidatoAuthContext';

interface PortalProtectedRouteProps {
  children: React.ReactNode;
}

const PortalProtectedRoute: React.FC<PortalProtectedRouteProps> = ({ children }) => {
  const { user, isCandidato, loading } = useCandidatoAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isCandidato) {
    return <Navigate to="/portal" replace />;
  }

  return <>{children}</>;
};

export default PortalProtectedRoute;
