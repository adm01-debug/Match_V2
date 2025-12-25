import { toast } from 'sonner';
import { useCallback } from 'react';
/**
 * @module useProfiles
 * @description Hook para gerenciar perfis
 * @returns {Object} Hook result with data, isLoading, error, and mutations
 * @example
 * const { data, isLoading } = useProfiles();
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

interface Profile extends ProfileRow {
  // Campos adicionais que podemos precisar
  role?: string | null;
  departamento?: string | null;
}

export function useProfiles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profiles = [], isLoading, error } = useQuery({
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 3,
    queryKey: ['profiles'],
    queryFn: async () => {
      try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('nome');
      if (error) throw error;
      return (data || []) as Profile[];
    },
  });

  const useProfile = (userId?: string) => useQuery({
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 3,
    queryKey: ['profile', userId],
    queryFn: async () => {
      try {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!userId,
    placeholderData: (previousData) => previousData,
    select: (data) => data,
  });

  const useCurrentProfile = () => useQuery({
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 3,
    queryKey: ['current-profile'],
    queryFn: async () => {
      try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async ({ id, ...dados }: ProfileUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(dados)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onError: (error) => { // Error logged: Mutation error: toast.error('Ocorreu um erro'); }, onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] },
    // Optimistic update ready - implement setQueryData for instant feedback
);
      queryClient.invalidateQueries({ queryKey: ['current-profile'] });
      toast({ title: 'Perfil atualizado!' });
    },
  });

  // Filtrar por role (usando campo adicional ou lógica)
  const recrutadores = profiles.filter(p => p.role === 'recrutador' || p.role === 'admin' || p.role === 'rh');
  const gestores = profiles.filter(p => p.role === 'gestor' || p.role === 'admin');

  return {
    profiles,
    recrutadores,
    gestores,
    isLoading,
    error,
    useProfile,
    useCurrentProfile,
    updateProfile: updateProfile.mutateAsync,
  };
}

export default useProfiles;
