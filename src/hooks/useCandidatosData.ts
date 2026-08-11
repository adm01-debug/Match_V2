import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { enhancedToast } from '@/components/ui';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Candidato, MatchScore, getStatusConfig } from '@/types/candidate';

export function useCandidatosData() {
  const { playSuccess, playError, playPop } = useSoundEffects();
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [matchScores, setMatchScores] = useState<Record<string, MatchScore[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCandidatos();
  }, []);

  const fetchCandidatos = async () => {
    setIsLoading(true);
    try {
      const { data: candidatosData, error: candidatosError } = await supabase
        .from('candidatos')
        .select('*')
        .order('created_at', { ascending: false });

      if (candidatosError) throw candidatosError;

      setCandidatos((candidatosData || []) as Candidato[]);

      if (candidatosData && candidatosData.length > 0) {
        const { data: scoresData, error: scoresError } = await supabase
          .from('match_scores')
          .select('*')
          .in('candidato_id', candidatosData.map(c => c.id));

        if (scoresError) throw scoresError;

        const scoresMap: Record<string, MatchScore[]> = {};
        scoresData?.forEach(score => {
          if (!scoresMap[score.candidato_id]) {
            scoresMap[score.candidato_id] = [];
          }
          scoresMap[score.candidato_id]?.push(score as MatchScore);
        });
        setMatchScores(scoresMap);
      }
    } catch {
      playError();
      enhancedToast.error("Não foi possível carregar os candidatos.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCandidato = async (id: string) => {
    try {
      const { error } = await supabase.from('candidatos').delete().eq('id', id);
      if (error) throw error;

      setCandidatos(prev => prev.filter(c => c.id !== id));
      playSuccess();
      enhancedToast.success("Candidato removido do banco de dados.");
      return true;
    } catch {
      playError();
      enhancedToast.error("Não foi possível excluir o candidato.");
      return false;
    }
  };

  const updateCandidatoStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('candidatos')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;

      setCandidatos(prev => prev.map(c => 
        c.id === id ? { ...c, status: newStatus } : c
      ));
      
      playPop();
      enhancedToast.success(`Status alterado para "${getStatusConfig(newStatus).label}".`);
      return true;
    } catch {
      playError();
      enhancedToast.error("Não foi possível atualizar o status.");
      return false;
    }
  };

  return {
    candidatos,
    matchScores,
    isLoading,
    fetchCandidatos,
    deleteCandidato,
    updateCandidatoStatus
  };
}