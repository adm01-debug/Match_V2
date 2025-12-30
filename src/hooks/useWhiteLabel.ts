import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WhiteLabelConfig, DEFAULT_WHITE_LABEL } from "@/types/whiteLabel";

export function useWhiteLabel() {
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ["whitelabel"],
    queryFn: async () => {
      const { data: tenant } = await supabase.auth.getSession();
      if (!tenant.session?.user) return DEFAULT_WHITE_LABEL;

      const { data } = await supabase
        .from("tenant_settings")
        .select("white_label_config")
        .single();

      return (data?.white_label_config as WhiteLabelConfig) || DEFAULT_WHITE_LABEL;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateMutation = useMutation({
    mutationFn: async (newConfig: Partial<WhiteLabelConfig>) => {
      const { data, error } = await supabase
        .from("tenant_settings")
        .upsert({ white_label_config: { ...config, ...newConfig } })
        .select()
        .single();

      if (error) throw error;
      return data;
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
