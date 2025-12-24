import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CandidatoPerfil {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  curriculo_url?: string;
  foto_url?: string;
  cidade?: string;
  estado?: string;
  pretensao_salarial?: number;
  disponibilidade?: string;
  experiencias: Experiencia[];
  formacoes: Formacao[];
  habilidades: string[];
  idiomas: Idioma[];
  candidaturas: CandidaturaResumo[];
  avaliacoes: AvaliacaoResumo[];
  entrevistas: EntrevistaResumo[];
  created_at: string;
  updated_at: string;
}

interface Experiencia {
  id: string;
  empresa: string;
  cargo: string;
  inicio: string;
  fim?: string;
  atual: boolean;
  descricao?: string;
}

interface Formacao {
  id: string;
  instituicao: string;
  curso: string;
  nivel: string;
  inicio: string;
  fim?: string;
}

interface Idioma {
  idioma: string;
  nivel: 'basico' | 'intermediario' | 'avancado' | 'fluente' | 'nativo';
}

interface CandidaturaResumo {
  id: string;
  vaga_id: string;
  vaga_titulo: string;
  etapa: string;
  status: string;
  created_at: string;
}

interface AvaliacaoResumo {
  id: string;
  nota_media: number;
  recomendacao: string;
  avaliador: string;
  created_at: string;
}

interface EntrevistaResumo {
  id: string;
  data: string;
  tipo: string;
  status: string;
  entrevistador: string;
}

/**
 * Hook para gerenciar perfil do candidato
 * @description Hook para gerenciar perfil do candidato
 * @returns {Object} Query result with data, isLoading, error, and mutations
 * @example
 * const { data, isLoading } = useCandidatoPerfil();
 */
export const useCandidatoPerfil = (candidatoId: string) => {
  return useQuery({
    queryKey: ['candidato-perfil', candidatoId],
    queryFn: async () => {
      // Buscar candidato principal
      const { data: candidato, error } = await supabase
        .from('candidatos')
        .select('*')
        .eq('id', candidatoId)
        .single();

      if (error) throw error;

      // Buscar candidaturas com vaga
      const { data: candidaturas } = await supabase
        .from('candidaturas')
        .select(`
          id,
          etapa_atual,
          status,
          created_at,
          vagas (id, titulo)
        `)
        .eq('candidato_id', candidatoId);

      // Buscar entrevistas
      const { data: entrevistas } = await supabase
        .from('entrevistas')
        .select('*')
        .eq('candidato_id', candidatoId)
        .order('data_hora', { ascending: false });

      // Buscar avaliações
      const { data: avaliacoes } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('candidato_id', candidatoId);

      return {
        ...candidato,
        experiencias: candidato.experiencias || [],
        formacoes: candidato.formacoes || [],
        habilidades: candidato.habilidades || [],
        idiomas: candidato.idiomas || [],
        candidaturas: candidaturas?.map(c => ({
          id: c.id,
          vaga_id: c.vagas?.id,
          vaga_titulo: c.vagas?.titulo,
          etapa: c.etapa_atual,
          status: c.status,
          created_at: c.created_at,
        })) || [],
        avaliacoes: avaliacoes || [],
        entrevistas: entrevistas || [],
      } as CandidatoPerfil;
    },
    enabled: !!candidatoId,
    placeholderData: (previousData) => previousData,
    select: (data) => data,
    onError: () => toast.error('Erro ao carregar dados'),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

export default useCandidatoPerfil;
