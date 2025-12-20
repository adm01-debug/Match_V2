import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface CandidatoProfile {
  id: string;
  user_id: string;
  candidato_id: string | null;
  nome: string;
  email: string;
  telefone: string | null;
}

interface CandidatoAuthContextType {
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

export const CandidatoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CandidatoProfile | null>(null);

  const fetchCandidatoProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('candidatos_auth')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!error && data) {
      setProfile(data as CandidatoProfile);
    } else {
      setProfile(null);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchCandidatoProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchCandidatoProfile(session.user.id);
      }
      
      setLoading(false);
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
          user_type: 'candidato'
        }
      }
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
