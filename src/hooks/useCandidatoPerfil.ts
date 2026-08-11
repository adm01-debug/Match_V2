/**
 * @fileoverview Hook for fetching candidate profile data from Supabase
 * @module hooks/useCandidatoPerfil
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Data structure returned by useCandidatoPerfil hook.
 * This represents the actual database data structure.
 * 
 * Note: For UI components that need more fields (like PerfilHeader),
 * use the CandidatoPerfil interface from @/data/candidatoPerfilData
 */
export interface CandidatoPerfilData {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  experiencias: unknown[];
  formacoes: unknown[];
  habilidades: string[];
  idiomas: unknown[];
  candidaturas: { id: string; vaga_id: string; vaga_titulo: string; etapa: string; status: string; created_at: string }[];
  avaliacoes: { id: string; nota_media: number; recomendacao: string; avaliador: string; created_at: string }[];
  entrevistas: { id: string; data: string; tipo: string; status: string; entrevistador: string }[];
  created_at: string;
  updated_at: string;
}

// Re-export for backward compatibility
export type { CandidatoPerfilData as CandidatoPerfil };

interface CandidaturaWithVaga {
  id: string;
  etapa_atual: string;
  status: string;
  created_at: string;
  vagas: { id: string; titulo: string } | null;
}

export const useCandidatoPerfil = (candidatoId: string) => {
  return useQuery({
    queryKey: ['candidato-perfil', candidatoId],
    queryFn: async () => {
      const { data: candidato, error } = await supabase
        .from('candidatos')
        .select('*')
        .eq('id', candidatoId)
        .single();

      if (error) throw error;

      const { data: candidaturas } = await supabase
        .from('candidaturas')
        .select(`id, etapa_atual, status, created_at, vagas (id, titulo)`)
        .eq('candidato_auth_id', candidatoId);

      const { data: entrevistas } = await supabase
        .from('entrevistas')
        .select('*')
        .eq('candidato_id', candidatoId)
        .order('data', { ascending: false });

      const { data: processos } = await supabase
        .from('processos_seletivos')
        .select('id, match_score, etapa_atual, created_at')
        .eq('candidato_id', candidatoId);

      const candidatoRecord = candidato as Record<string, unknown>;
      const experienciasRaw = candidatoRecord['experiencias'];
      const formacaoRaw = candidatoRecord['formacao'];

      return {
        id: candidato.id,
        nome: candidato.nome,
        email: candidato.email,
        telefone: candidato.telefone ?? undefined,
        created_at: candidato.created_at ?? '',
        updated_at: candidato.updated_at ?? '',
        experiencias: Array.isArray(experienciasRaw) ? experienciasRaw : [],
        formacoes: Array.isArray(formacaoRaw) ? formacaoRaw : [],
        habilidades: Array.isArray(candidato.habilidades) ? candidato.habilidades : [],
        idiomas: [],
        candidaturas: (candidaturas as CandidaturaWithVaga[] | null)?.map((c) => ({
          id: c.id,
          vaga_id: c.vagas?.id ?? '',
          vaga_titulo: c.vagas?.titulo ?? '',
          etapa: c.etapa_atual,
          status: c.status,
          created_at: c.created_at,
        })) || [],
        avaliacoes: (processos || []).map((p) => ({
          id: p.id,
          nota_media: p.match_score || 0,
          recomendacao: p.etapa_atual,
          avaliador: 'Sistema',
          created_at: p.created_at,
        })),
        entrevistas: (entrevistas || []).map((e) => ({
          id: e.id,
          data: e.data,
          tipo: e.tipo,
          status: e.status,
          entrevistador: e.entrevistadores?.[0] || 'N/A',
        })),
      } as CandidatoPerfilData;
    },
    enabled: !!candidatoId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

export default useCandidatoPerfil;
