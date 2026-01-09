/**
 * @fileoverview PortalProtectedRoute component
 * @module PortalProtectedRoute
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCandidatoAuth } from '@/contexts/CandidatoAuthContext';
import { Loader2, UserPlus, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

interface PortalProtectedRouteProps {
  children: React.ReactNode;
}

const PortalProtectedRoute: React.FC<PortalProtectedRouteProps> = ({ children }) => {
  const { user, isCandidato, loading } = useCandidatoAuth();
  const location = useLocation();

  // Loading state with enhanced UI
  if (loading) {
    return (
      <div 
        role="region" 
        aria-label="Carregando" 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 p-8"
        >
          {/* Logo */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative p-4 rounded-full bg-primary">
              <Briefcase className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          {/* Loading indicator */}
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            
            {/* Show contextual message based on auth state */}
            {user ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex items-center gap-2 text-primary">
                  <UserPlus className="h-4 w-4" />
                  <span className="text-sm font-medium">Preparando seu perfil...</span>
                </div>
                <p className="text-xs text-muted-foreground text-center max-w-xs">
                  Estamos configurando sua conta. Isso pode levar alguns segundos.
                </p>
              </motion.div>
            ) : (
              <span className="text-sm text-muted-foreground">Verificando autenticação...</span>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Not authenticated - redirect to portal auth
  if (!user) {
    return <Navigate to="/portal" state={{ from: location.pathname, requiresAuth: true }} replace />;
  }

  // Authenticated but not a candidate (e.g., HR user trying to access portal)
  if (!isCandidato) {
    return (
      <div 
        role="region" 
        aria-label="Acesso restrito" 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 p-8 max-w-md text-center"
        >
          <div className="p-4 rounded-full bg-amber-100 dark:bg-amber-900/30">
            <UserPlus className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold">Conta não configurada</h2>
          <p className="text-muted-foreground">
            Esta conta não está vinculada ao Portal do Candidato. 
            Por favor, crie uma conta específica para candidatos ou entre com credenciais corretas.
          </p>
          <a 
            href="/portal" 
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Voltar ao Portal
          </a>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

PortalProtectedRoute.displayName = "PortalProtectedRoute";

export default PortalProtectedRoute;
