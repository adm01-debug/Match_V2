import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { OnboardingTour } from './OnboardingTour';

interface OnboardingContextType {
  startTour: () => void;
  resetTour: () => void;
  hasCompletedTour: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [forceShow, setForceShow] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(() => {
    return localStorage.getItem('match-ats-tour-completed') === 'true';
  });

  const startTour = useCallback(() => {
    setForceShow(true);
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem('match-ats-tour-completed');
    setHasCompletedTour(false);
    setForceShow(true);
  }, []);

  const handleComplete = useCallback(() => {
    setHasCompletedTour(true);
    setForceShow(false);
  }, []);

  return (
    <OnboardingContext.Provider value={{ startTour, resetTour, hasCompletedTour }}>
      {children}
      <OnboardingTour forceShow={forceShow} onComplete={handleComplete} />
    </OnboardingContext.Provider>
  );
}
