/**
 * @module useScorecard
 * @description Hook para gerenciar scorecards de avaliação (localStorage-based)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ScorecardScore { 
  competency_id: string; 
  score: number; 
}

interface Scorecard { 
  id: string; 
  candidato_id: string; 
  entrevista_id: string; 
  avaliador_id: string; 
  scores: ScorecardScore[]; 
  notes: string; 
  recommendation: string; 
  created_at: string;
  avaliador_nome?: string;
}

type CreateScorecardInput = Omit<Scorecard, 'id' | 'created_at'>;
type UpdateScorecardInput = Partial<Scorecard> & { id: string };

function getStorageKey(entrevistaId: string): string {
  return `scorecards_${entrevistaId}`;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useScorecard(entrevistaId?: string) {
  const { toast } = useToast();
  const [scorecards, setScorecards] = useState<Scorecard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load scorecards from localStorage
  useEffect(() => {
    if (!entrevistaId) {
      setIsLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(getStorageKey(entrevistaId));
      if (stored) {
        setScorecards(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading scorecards:', e);
    } finally {
      setIsLoading(false);
    }
  }, [entrevistaId]);

  // Persist to localStorage
  const persistScorecards = useCallback((newScorecards: Scorecard[]) => {
    if (!entrevistaId) return;
    localStorage.setItem(getStorageKey(entrevistaId), JSON.stringify(newScorecards));
    setScorecards(newScorecards);
  }, [entrevistaId]);

  // Create scorecard
  const createScorecard = useCallback((input: CreateScorecardInput) => {
    const newScorecard: Scorecard = {
      ...input,
      id: generateId(),
      created_at: new Date().toISOString(),
    };

    const newScorecards = [newScorecard, ...scorecards];
    persistScorecards(newScorecards);
    toast({ title: 'Avaliação salva', description: 'Scorecard registrado com sucesso.' });
  }, [scorecards, persistScorecards, toast]);

  // Update scorecard
  const updateScorecard = useCallback((input: UpdateScorecardInput) => {
    const { id, ...updates } = input;
    const newScorecards = scorecards.map(sc => 
      sc.id === id ? { ...sc, ...updates } : sc
    );
    persistScorecards(newScorecards);
    toast({ title: 'Atualizado', description: 'Scorecard atualizado.' });
  }, [scorecards, persistScorecards, toast]);

  // Calculate average score
  const averageScore = useMemo(() => {
    if (scorecards.length === 0) return 0;
    return scorecards.reduce((acc, sc) => {
      const scAvg = sc.scores.length > 0 
        ? sc.scores.reduce((a, s) => a + s.score, 0) / sc.scores.length 
        : 0;
      return acc + scAvg;
    }, 0) / scorecards.length;
  }, [scorecards]);

  // Calculate consolidated scores
  const consolidatedScores = useMemo(() => {
    if (scorecards.length === 0) return [];
    const firstScorecard = scorecards[0];
    if (!firstScorecard?.scores) return [];
    
    return firstScorecard.scores.map((_, i) => ({
      competency_id: firstScorecard.scores[i]?.competency_id ?? '',
      avgScore: scorecards.reduce((acc, sc) => acc + (sc.scores[i]?.score || 0), 0) / scorecards.length,
      scores: scorecards.map(sc => sc.scores[i]?.score || 0),
    }));
  }, [scorecards]);

  return { 
    scorecards, 
    isLoading, 
    createScorecard, 
    updateScorecard, 
    averageScore, 
    consolidatedScores 
  };
}

export default useScorecard;
