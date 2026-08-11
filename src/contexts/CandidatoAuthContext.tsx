/**
 * @fileoverview Contexto de autenticação do candidato
 * @module CandidatoAuthContext
 */

import { createContext, useContext, useEffect, useState, type ReactNode, type FC } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface CandidatoProfile {
  id: string;
  user_id: string;
  candidato_id: string | null;
  nome: string;
  email: string;
  telefone: string | null;
  curriculo_url: string | null;
  curriculo_nome: string | null;
}

export interface CandidatoAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: CandidatoProfile | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, nome: string, telefone?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isCandidato: boolean;
}

const CandidatoAuthContext = createContext<CandidatoAuthContextType | undefined>(undefined);

export const CandidatoAuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CandidatoProfile | null>(null);

  const ensureCandidatoProfile = async (authUser: User): Promise<CandidatoProfile | null> => {
    // Only treat users created via the candidate portal as candidates.
    const isCandidateUser = authUser.user_metadata?.['user_type'] === 'candidato';
    if (!isCandidateUser) return null;

    // Prefer maybeSingle to avoid hard errors when row doesn't exist.
    const { data: existing, error: existingError } = await supabase
      .from('candidatos_auth')
      .select('*')
      .eq('user_id', authUser.id)
      .maybeSingle();

    if (existingError) {
      // If RLS or other errors occur, fail closed and treat as non-candidate.
      return null;
    }

    if (existing) return existing as CandidatoProfile;

    // Create profile on first login/signup (idempotent for new accounts).
    const nome = (authUser.user_metadata?.['nome'] as string | undefined) || 'Candidato';
    const telefone = (authUser.user_metadata?.['telefone'] as string | undefined) || null;
    const email = authUser.email || '';

    const { data: inserted, error: insertError } = await supabase
      .from('candidatos_auth')
      .insert({
        user_id: authUser.id,
        nome,
        email,
        telefone,
        candidato_id: null,
        curriculo_url: null,
        curriculo_nome: null,
      })
      .select('*')
      .single();

    if (insertError) return null;
    return inserted as CandidatoProfile;
  };

  useEffect(() => {
    const processSession = async (nextSession: Session | null) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!nextSession?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // While we fetch/create the candidate profile, keep portal routes in a stable loading state.
      setLoading(true);
      const nextProfile = await ensureCandidatoProfile(nextSession.user);
      setProfile(nextProfile);
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void processSession(nextSession);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      void processSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, nome: string, telefone?: string) => {
    const redirectUrl = `${window.location.origin}/portal`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          nome,
          telefone,
          user_type: 'candidato',
        },
      },
    });

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const isCandidato = !!profile;

  return (
    <CandidatoAuthContext.Provider value={{
      user,
      session,
      loading,
      profile,
      signIn,
      signUp,
      signOut,
      isCandidato
    }}>
      {children}
    </CandidatoAuthContext.Provider>
  );
};

export const useCandidatoAuth = () => {
  const context = useContext(CandidatoAuthContext);
  if (context === undefined) {
    throw new Error('useCandidatoAuth must be used within a CandidatoAuthProvider');
  }
  return context;
};

CandidatoAuthContext.displayName = 'CandidatoAuthContext';
