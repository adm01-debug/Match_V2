import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WhiteLabelConfig, DEFAULT_WHITE_LABEL } from "@/types/whiteLabel";

const STORAGE_KEY = 'white_label_config';

function getStoredConfig(): WhiteLabelConfig | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setStoredConfig(config: WhiteLabelConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function useWhiteLabel() {
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ["whitelabel"],
    queryFn: async () => {
      const stored = getStoredConfig();
      return stored || DEFAULT_WHITE_LABEL;
    },
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation({
    mutationFn: async (newConfig: Partial<WhiteLabelConfig>) => {
      const currentConfig = config || DEFAULT_WHITE_LABEL;
      const updatedConfig = { ...currentConfig, ...newConfig };
      setStoredConfig(updatedConfig);
      return updatedConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whitelabel"] });
    },
  });

  // Apply CSS variables when config changes
  useEffect(() => {
    if (!config) return;

    const root = document.documentElement;
    root.style.setProperty("--primary", config.primaryColor);
    root.style.setProperty("--secondary", config.secondaryColor);
    root.style.setProperty("--accent", config.accentColor);
    root.style.setProperty("--background", config.backgroundColor);
    root.style.setProperty("--foreground", config.textColor);
    root.style.setProperty("--font-family", config.fontFamily);

    // Update meta tags
    document.title = config.metaTitle || config.companyName;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && config.metaDescription) {
      metaDesc.setAttribute("content", config.metaDescription);
    }

    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon && config.favicon) {
      favicon.href = config.favicon;
    }
  }, [config]);

  const updateConfig = useCallback(
    (newConfig: Partial<WhiteLabelConfig>) => {
      return updateMutation.mutateAsync(newConfig);
    },
    [updateMutation]
  );

  return {
    config: config || DEFAULT_WHITE_LABEL,
    isLoading,
    updateConfig,
    isUpdating: updateMutation.isPending,
  };
}
