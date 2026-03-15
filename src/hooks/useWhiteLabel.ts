import { useState, useCallback, useEffect } from 'react';

export interface WhiteLabelConfig {
  companyName: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily?: string;
  customDomain?: string;
}

const DEFAULT_CONFIG: WhiteLabelConfig = {
  companyName: 'Match ATS',
  primaryColor: '#6366f1',
  secondaryColor: '#8b5cf6',
  fontFamily: 'Inter',
};

const WL_KEY = 'match_ats_whitelabel';

export function useWhiteLabel() {
  const [config, setConfigState] = useState<WhiteLabelConfig>(() => {
    try {
      const stored = localStorage.getItem(WL_KEY);
      return stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const updateConfig = useCallback((updates: Partial<WhiteLabelConfig>) => {
    setConfigState((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(WL_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const resetConfig = useCallback(() => {
    localStorage.removeItem(WL_KEY);
    setConfigState(DEFAULT_CONFIG);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (config.primaryColor) root.style.setProperty('--wl-primary', config.primaryColor);
    if (config.secondaryColor) root.style.setProperty('--wl-secondary', config.secondaryColor);
    if (config.fontFamily) root.style.setProperty('--wl-font', config.fontFamily);
    if (config.companyName) document.title = config.companyName;
  }, [config]);

  return { config, updateConfig, resetConfig, isCustomized: config.companyName !== DEFAULT_CONFIG.companyName };
}
