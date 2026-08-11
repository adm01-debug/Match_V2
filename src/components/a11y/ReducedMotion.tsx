/**
 * @fileoverview Reduced Motion Provider
 * Respects user's motion preferences for accessibility
 */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ReducedMotionContextType {
  prefersReducedMotion: boolean;
  setOverrideReducedMotion: (value: boolean | null) => void;
  overrideReducedMotion: boolean | null;
  effectiveReducedMotion: boolean;
}

const ReducedMotionContext = createContext<ReducedMotionContextType | undefined>(undefined);

interface ReducedMotionProviderProps {
  children: ReactNode;
}

export function ReducedMotionProvider({ children }: ReducedMotionProviderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [overrideReducedMotion, setOverrideReducedMotion] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for system preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Load saved preference from localStorage
    const saved = localStorage.getItem("reduced-motion-override");
    if (saved !== null) {
      setOverrideReducedMotion(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Save preference to localStorage
    if (overrideReducedMotion !== null) {
      localStorage.setItem("reduced-motion-override", JSON.stringify(overrideReducedMotion));
    }
  }, [overrideReducedMotion]);

  // Effective value: override takes precedence over system preference
  const effectiveReducedMotion = overrideReducedMotion ?? prefersReducedMotion;

  // Apply class to document
  useEffect(() => {
    if (effectiveReducedMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  }, [effectiveReducedMotion]);

  return (
    <ReducedMotionContext.Provider
      value={{
        prefersReducedMotion,
        setOverrideReducedMotion,
        overrideReducedMotion,
        effectiveReducedMotion
      }}
    >
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotion() {
  const context = useContext(ReducedMotionContext);
  if (context === undefined) {
    throw new Error("useReducedMotion must be used within a ReducedMotionProvider");
  }
  return context;
}

/**
 * Hook to check if reduced motion is preferred
 * Can be used without the provider for simple cases
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

export default ReducedMotionProvider;
