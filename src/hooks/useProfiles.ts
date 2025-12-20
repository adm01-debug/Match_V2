import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  departamento: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileUpdate {
  full_name?: string;
  avatar_url?: string;
  role?: string;
  departamento?: string;
}

export function useProfiles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profiles = [], isLoading, error } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('full_name');
      if (error) throw error;
      return data as Profile[];
    },
  });

  const useProfile = (userId?: string) => useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as Profile | null;
    },
    enabled: !!userId,
  });

  const useCurrentProfile = () => useQuery({
    queryKey: ['current-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as Profile | null;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async ({ id, ...dados }: ProfileUpdate & { id: string }) => {
      const { data, error } = await supabase.from('profiles').update(dados).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['current-profile'] });
      toast({ title: 'Perfil atualizado!' });
    },
  });

  const recrutadores = profiles.filter(p => p.role === 'recrutador' || p.role === 'admin');
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
