/**
 * @module featureFlags
 * @description Sistema de feature flags para releases graduais
 * @example
 * if (FeatureFlags.NEW_DASHBOARD) {
 *   return <NewDashboard />;
 * }
 */

import React from 'react';

export const FeatureFlags = {
  /** Nova interface do dashboard */
  NEW_DASHBOARD: import.meta.env.VITE_FF_NEW_DASHBOARD === 'true',
  
  /** Funcionalidades beta */
  BETA_FEATURES: import.meta.env.VITE_FF_BETA === 'true',
  
  /** Novo sistema de match com IA */
  AI_MATCHING: import.meta.env.VITE_FF_AI_MATCHING === 'true',
  
  /** Portal do candidato V2 */
  PORTAL_V2: import.meta.env.VITE_FF_PORTAL_V2 === 'true',
  
  /** Analytics avançado */
  ADVANCED_ANALYTICS: import.meta.env.VITE_FF_ADVANCED_ANALYTICS === 'true',
  
  /** Debug mode */
  DEBUG_MODE: import.meta.env.DEV || import.meta.env.VITE_FF_DEBUG === 'true',
} as const;

export type FeatureFlagKey = keyof typeof FeatureFlags;

/**
 * Hook para verificar feature flags
 * @param flag - Nome da feature flag
 * @returns boolean indicando se a flag está ativa
 */
export const useFeatureFlag = (flag: FeatureFlagKey): boolean => {
  return FeatureFlags[flag];
};

interface FeatureGateProps {
  flag: FeatureFlagKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente wrapper para feature flags
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({ flag, children, fallback = null }) => {
  if (FeatureFlags[flag]) {
    return React.createElement(React.Fragment, null, children);
  }
  return React.createElement(React.Fragment, null, fallback);
};

export default FeatureFlags;
