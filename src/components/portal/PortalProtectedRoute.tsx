/**
 * @fileoverview PortalProtectedRoute component
 * @module PortalProtectedRoute
 */

import React, { useMemo, useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCandidatoAuth } from '@/contexts/CandidatoAuthContext';
import { Loader2, UserPlus, Briefcase, CheckCircle2, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface PortalProtectedRouteProps {
  children: React.ReactNode;
}

type LoadingStep = 'verificando' | 'criando' | 'carregando';

interface StepInfo {
  id: LoadingStep;
  label: string;
  icon: React.ReactNode;
}

const steps: StepInfo[] = [
  { id: 'verificando', label: 'Verificando', icon: <ShieldCheck className="h-4 w-4" /> },
  { id: 'criando', label: 'Criando perfil', icon: <UserPlus className="h-4 w-4" /> },
  { id: 'carregando', label: 'Carregando', icon: <LayoutDashboard className="h-4 w-4" /> },
];

const PortalProtectedRoute: React.FC<PortalProtectedRouteProps> = ({ children }) => {
  const { user, isCandidato, loading } = useCandidatoAuth();
  const location = useLocation();
  const previousStepRef = useRef<LoadingStep | null>(null);
  const confettiTriggeredRef = useRef(false);

  // Determine current step based on auth state
  const currentStep = useMemo((): LoadingStep => {
    if (!user) return 'verificando';
    if (!isCandidato) return 'criando';
    return 'carregando';
  }, [user, isCandidato]);

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  // Trigger confetti celebration when transitioning from 'criando' to 'carregando'
  useEffect(() => {
    if (
      previousStepRef.current === 'criando' && 
      currentStep === 'carregando' && 
      !confettiTriggeredRef.current
    ) {
      confettiTriggeredRef.current = true;
      
      // Fire confetti celebration
      const duration = 2000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }

    previousStepRef.current = currentStep;
  }, [currentStep]);

  // Loading state with stepped progress indicator
  if (loading) {
    return (
      <div 
        role="region" 
        aria-label="Carregando" 
        aria-live="polite"
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-8 p-8"
        >
          {/* Logo */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative p-4 rounded-full bg-primary">
              <Briefcase className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          {/* Step Progress Indicator */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <React.Fragment key={step.id}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.15 }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300",
                      isCompleted && "bg-primary/10 text-primary",
                      isCurrent && "bg-primary text-primary-foreground shadow-lg",
                      !isCompleted && !isCurrent && "bg-muted/50 text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      step.icon
                    )}
                    <span className="hidden sm:inline">{step.label}</span>
                  </motion.div>
                  
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.15 + 0.1 }}
                      className={cn(
                        "h-0.5 w-6 origin-left",
                        index < currentStepIndex ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Current step message */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2 text-center"
          >
            <p className="text-sm font-medium text-foreground">
              {currentStep === 'verificando' && 'Verificando sua autenticação...'}
              {currentStep === 'criando' && 'Preparando seu perfil...'}
              {currentStep === 'carregando' && 'Carregando seu dashboard...'}
            </p>
            <p className="text-xs text-muted-foreground max-w-xs">
              {currentStep === 'verificando' && 'Aguarde enquanto verificamos suas credenciais.'}
              {currentStep === 'criando' && 'Estamos configurando sua conta. Isso pode levar alguns segundos.'}
              {currentStep === 'carregando' && 'Quase lá! Preparando tudo para você.'}
            </p>
          </motion.div>
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
