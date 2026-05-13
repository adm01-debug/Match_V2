import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook para verificar o status de uma feature flag.
 * @param flagName Nome da flag cadastrada no banco.
 * @returns { enabled: boolean, isLoading: boolean }
 */
export function useFeatureFlag(flagName: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["feature-flag", flagName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_flags")
        .select("enabled")
        .eq("name", flagName)
        .single();

      if (error) {
        console.error(`Erro ao buscar feature flag ${flagName}:`, error);
        return { enabled: false };
      }

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  return {
    enabled: data?.enabled ?? false,
    isLoading,
  };
}

/**
 * Hook para buscar todas as feature flags de uma vez (útil para inicialização).
 */
export function useFeatureFlags() {
  const { data, isLoading } = useQuery({
    queryKey: ["feature-flags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_flags")
        .select("name, enabled");

      if (error) {
        console.error("Erro ao buscar feature flags:", error);
        return {};
      }

      return data.reduce((acc, flag) => {
        acc[flag.name] = flag.enabled;
        return acc;
      }, {} as Record<string, boolean>);
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    flags: data || {},
    isLoading,
  };
}
