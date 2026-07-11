/**
 * @fileoverview Hook para integrar gamificação com assessments comportamentais
 * @module useBehavioralGamification
 * 
 * Este hook integra os 10 Pilares Comportamentais com o sistema de XP, conquistas e níveis.
 * Persiste dados localmente e sincroniza com Supabase quando autenticado.
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useGamification } from './useGamification';
import { useGamificationTriggers } from './useGamificationTriggers';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
import { logger } from '@/services/logger';
  BEHAVIORAL_XP_REWARDS, 
  BEHAVIORAL_ACHIEVEMENTS,
  BEHAVIORAL_LEVELS,
  calculateBehavioralXP,
  checkBehavioralAchievements,
  getBehavioralLevel,
  type BehavioralAchievement 
} from '@/config/behavioralGamification';
import { BEHAVIORAL_TOOLS } from '@/types/behavioral';

const STORAGE_KEY = 'behavioral-gamification-state';

interface BehavioralGamificationState {
  completedToolIds: string[];
  assessmentResults: { toolId: string; timeSpent: number; score: number; completedAt: string }[];
  unlockedAchievements: string[];
  dailyAssessments: { date: string; count: number };
  totalBehavioralXP: number;
}

const defaultState: BehavioralGamificationState = {
  completedToolIds: [],
  assessmentResults: [],
  unlockedAchievements: [],
  dailyAssessments: { date: '', count: 0 },
  totalBehavioralXP: 0,
};

export function useBehavioralGamification() {
  const { addXP, unlockAchievement } = useGamification();
  const { onAssessmentCompleto, isAuthenticated } = useGamificationTriggers();
  const { user } = useAuth();
  
  const [state, setState] = useState<BehavioralGamificationState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [newAchievements, setNewAchievements] = useState<BehavioralAchievement[]>([]);

  // Load state from localStorage and sync with DB if authenticated
  useEffect(() => {
    const loadState = async () => {
      try {
        // First load from localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setState({ ...defaultState, ...parsed });
        }

        // If authenticated, sync from database
        if (user?.id) {
          const { data: dbResults } = await supabase
            .from('behavioral_assessment_results')
            .select('tool_id, time_spent, score, created_at')
            .not('completed_at', 'is', null);

          if (dbResults && dbResults.length > 0) {
            const dbToolIds = dbResults.map(r => r.tool_id);
            const dbAssessmentResults = dbResults.map(r => ({
              toolId: r.tool_id,
              timeSpent: r.time_spent || 0,
              score: r.score || 0,
              completedAt: r.created_at,
            }));

            // Merge DB data with localStorage (DB takes precedence for completion status)
            setState(prev => {
              const mergedToolIds = [...new Set([...prev.completedToolIds, ...dbToolIds])];
              const existingResultIds = new Set(prev.assessmentResults.map(r => r.toolId));
              const newResults = dbAssessmentResults.filter(r => !existingResultIds.has(r.toolId));
              
              return {
                ...prev,
                completedToolIds: mergedToolIds,
                assessmentResults: [...prev.assessmentResults, ...newResults],
              };
            });
          }
        }
      } catch (error) {
        logger.error('Error loading behavioral gamification state:', error);
      }
      setIsLoaded(true);
    };

    loadState();
  }, [user?.id]);

  // Save state to localStorage
  const saveState = useCallback((newState: Partial<BehavioralGamificationState>) => {
    setState(prev => {
      const updated = { ...prev, ...newState };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        logger.error('Error saving behavioral gamification state:', error);
      }
      return updated;
    });
  }, []);

  // Get daily combo count
  const getDailyCombo = useCallback(() => {
    const today = new Date().toDateString();
    if (state.dailyAssessments.date === today) {
      return state.dailyAssessments.count;
    }
    return 0;
  }, [state.dailyAssessments]);

  // Complete assessment with gamification
  const completeAssessment = useCallback(async (
    toolId: string,
    timeSpent: number,
    scores: Record<string, number>
  ) => {
    const today = new Date().toDateString();
    const dailyCombo = getDailyCombo();
    const isFirstToday = dailyCombo === 0;
    
    // Calculate XP
    const avgScore = Object.values(scores).length > 0
      ? Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
      : 0;
    
    const { baseXP, bonusXP, totalXP, bonuses } = calculateBehavioralXP(
      toolId,
      timeSpent,
      dailyCombo + 1,
      isFirstToday
    );

    // Award XP (localStorage + Supabase if authenticated)
    addXP(totalXP, `behavioral_${toolId}`);
    
    if (isAuthenticated) {
      const tool = BEHAVIORAL_TOOLS.find(t => t.id === toolId);
      await onAssessmentCompleto(tool?.name || toolId, totalXP);
    }

    // Update state
    const newCompletedIds = [...new Set([...state.completedToolIds, toolId])];
    const newResult = { 
      toolId, 
      timeSpent, 
      score: avgScore, 
      completedAt: new Date().toISOString() 
    };
    const newResults = [...state.assessmentResults, newResult];

    // Check for new achievements
    const allAchievements = checkBehavioralAchievements(newCompletedIds, newResults);
    const brandNewAchievements = allAchievements.filter(
      a => !state.unlockedAchievements.includes(a.id)
    );

    // Award achievement XP and unlock
    let achievementXP = 0;
    for (const achievement of brandNewAchievements) {
      achievementXP += achievement.xpReward;
      unlockAchievement(achievement.id);
    }

    if (achievementXP > 0) {
      addXP(achievementXP, 'behavioral_achievements');
    }

    // Update daily combo
    const newDailyAssessments = {
      date: today,
      count: state.dailyAssessments.date === today 
        ? state.dailyAssessments.count + 1 
        : 1
    };

    // Save updated state
    saveState({
      completedToolIds: newCompletedIds,
      assessmentResults: newResults,
      unlockedAchievements: [...state.unlockedAchievements, ...brandNewAchievements.map(a => a.id)],
      dailyAssessments: newDailyAssessments,
      totalBehavioralXP: state.totalBehavioralXP + totalXP + achievementXP,
    });

    // Set new achievements for notification
    if (brandNewAchievements.length > 0) {
      setNewAchievements(brandNewAchievements);
    }

    // Show toast with XP breakdown
    const tool = BEHAVIORAL_TOOLS.find(t => t.id === toolId);
    const xpMessage = bonuses.length > 0 
      ? `${baseXP} base + ${bonusXP} bônus = ${totalXP} XP`
      : `+${totalXP} XP`;
    
    const bonusText = bonuses.length > 0 
      ? `\n${bonuses.map(b => `✨ ${b}`).join('\n')}`
      : '';
    
    const achievementText = brandNewAchievements.length > 0
      ? `\n🏆 ${brandNewAchievements.length} conquista(s) desbloqueada(s)!`
      : '';
    
    toast.success(`${tool?.name || 'Assessment'} completo!`, {
      description: `${xpMessage}${bonusText}${achievementText}`,
    });

    return { 
      xpEarned: totalXP + achievementXP, 
      bonuses, 
      newAchievements: brandNewAchievements 
    };
  }, [
    state, 
    getDailyCombo, 
    addXP, 
    unlockAchievement, 
    saveState, 
    isAuthenticated, 
    onAssessmentCompleto
  ]);

  // Get current behavioral level
  const behavioralLevel = useMemo(() => {
    return getBehavioralLevel(state.completedToolIds.length);
  }, [state.completedToolIds.length]);

  // Get next level info
  const nextBehavioralLevel = useMemo(() => {
    if (!behavioralLevel) return null;
    const currentIndex = BEHAVIORAL_LEVELS.findIndex(l => l.level === behavioralLevel.level);
    return currentIndex < BEHAVIORAL_LEVELS.length - 1 
      ? BEHAVIORAL_LEVELS[currentIndex + 1] 
      : null;
  }, [behavioralLevel]);

  // Progress to next level
  const levelProgress = useMemo(() => {
    if (!nextBehavioralLevel || !behavioralLevel) return 100;
    const current = state.completedToolIds.length;
    const min = behavioralLevel.minAssessments;
    const max = nextBehavioralLevel.minAssessments;
    return Math.min(100, ((current - min) / (max - min)) * 100);
  }, [state.completedToolIds.length, behavioralLevel, nextBehavioralLevel]);

  // Get tool completion status with XP info
  const toolsWithGamification = useMemo(() => {
    return BEHAVIORAL_TOOLS.map(tool => ({
      ...tool,
      isCompleted: state.completedToolIds.includes(tool.id),
      xpReward: BEHAVIORAL_XP_REWARDS[tool.id] || 50,
      result: state.assessmentResults.find(r => r.toolId === tool.id),
    }));
  }, [state.completedToolIds, state.assessmentResults]);

  // Get achievements with unlock status
  const achievementsWithStatus = useMemo(() => {
    return BEHAVIORAL_ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      isUnlocked: state.unlockedAchievements.includes(achievement.id),
    }));
  }, [state.unlockedAchievements]);

  // Clear new achievements notification
  const clearNewAchievements = useCallback(() => {
    setNewAchievements([]);
  }, []);

  // Reset (for testing)
  const resetBehavioralProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  }, []);

  return {
    // State
    completedToolIds: state.completedToolIds,
    completedCount: state.completedToolIds.length,
    totalTools: BEHAVIORAL_TOOLS.length,
    totalBehavioralXP: state.totalBehavioralXP,
    dailyCombo: getDailyCombo(),
    isLoaded,

    // Level info
    behavioralLevel,
    nextBehavioralLevel,
    levelProgress,

    // Tools
    toolsWithGamification,

    // Achievements
    achievementsWithStatus,
    unlockedCount: state.unlockedAchievements.length,
    totalAchievements: BEHAVIORAL_ACHIEVEMENTS.length,
    newAchievements,
    clearNewAchievements,

    // Actions
    completeAssessment,
    resetBehavioralProgress,
  };
}
