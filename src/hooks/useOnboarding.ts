import { useState, useCallback } from 'react';

const TOUR_STORAGE_KEY = 'match-ats-tour-completed';

export function useOnboarding() {
  const [tourKey, setTourKey] = useState(0);

  const hasCompletedTour = useCallback(() => {
    return localStorage.getItem(TOUR_STORAGE_KEY) === 'true';
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setTourKey(prev => prev + 1);
    // Reload to show tour
    window.location.reload();
  }, []);

  const completeTour = useCallback(() => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  }, []);

  return {
    hasCompletedTour,
    resetTour,
    completeTour,
    tourKey,
  };
}
