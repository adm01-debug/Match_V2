/**
 * @fileoverview High Contrast Mode Provider
 * Provides enhanced visibility for users with visual impairments
 */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface HighContrastContextType {
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  setHighContrast: (value: boolean) => void;
}

const HighContrastContext = createContext<HighContrastContextType | undefined>(undefined);

interface HighContrastProviderProps {
  children: ReactNode;
}

export function HighContrastProvider({ children }: HighContrastProviderProps) {
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("high-contrast-mode");
    if (saved !== null) {
      setIsHighContrast(JSON.parse(saved));
    }

    // Also check system preference
    const mediaQuery = window.matchMedia("(forced-colors: active)");
    if (mediaQuery.matches) {
      setIsHighContrast(true);
    }
  }, []);

  // Apply class and save preference
  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    localStorage.setItem("high-contrast-mode", JSON.stringify(isHighContrast));
  }, [isHighContrast]);

  const toggleHighContrast = () => setIsHighContrast(prev => !prev);
  const setHighContrast = (value: boolean) => setIsHighContrast(value);

  return (
    <HighContrastContext.Provider
      value={{
        isHighContrast,
        toggleHighContrast,
        setHighContrast
      }}
    >
      {children}
    </HighContrastContext.Provider>
  );
}

export function useHighContrast() {
  const context = useContext(HighContrastContext);
  if (context === undefined) {
    throw new Error("useHighContrast must be used within a HighContrastProvider");
  }
  return context;
}

export default HighContrastProvider;
