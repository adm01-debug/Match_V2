/**
 * @module useHunterLeads
 * @description Hook para consumir leads capturados pela extensão de hunting.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HunterLead {
  id: string;
  recrutador_id: string;
  source: string;
  profile_url: string;
  profile_hash: string;
  full_name: string;
  headline: string | null;
  current_company: string | null;
  current_title: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  status: string;
  notes: string | null;
  vaga_id: string | null;
  candidato_id: string | null;
  captured_at: string;
  created_at: string;
  updated_at: string;
}

export interface HunterSyncResult {
  created: number;
  updated: number;
  rejected: Array<{ index: number; reason: string }>;
  total_received: number;
}

export function useHunterLeads(filters?: { status?: string; vagaId?: string }) {
  return useQuery({
    queryKey: ["hunter-leads", filters],
    queryFn: async () => {
      let q = supabase
        .from("hunter_leads")
        .select("*")
        .order("captured_at", { ascending: false })
        .limit(500);
      if (filters?.status) q = q.eq("status", filters.status);
      if (filters?.vagaId) q = q.eq("vaga_id", filters.vagaId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as HunterLead[];
    },
    staleTime: 60_000,
  });
}

export function useSyncHunterLeads() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (leads: Array<Partial<HunterLead> & { profile_url: string; full_name: string }>) => {
      const { data, error } = await supabase.functions.invoke<HunterSyncResult>(
        "hunter-sync",
        { body: { leads } },
      );
      if (error) throw error;
      if (!data) throw new Error("Empty response from hunter-sync");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hunter-leads"] });
    },
  });
}
