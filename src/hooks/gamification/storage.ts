import { logger } from '@/services/logger';
import { LOCAL_STORAGE_KEY, defaultState, type GamificationState } from './types';

export const loadFromLocalStorage = (): GamificationState => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<GamificationState>;
      return { ...defaultState, ...parsed };
    }
  } catch (error) {
    logger.error('Error loading gamification from localStorage:', error);
  }
  return defaultState;
};

export const saveToLocalStorage = (state: GamificationState): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    logger.error('Error saving gamification to localStorage:', error);
  }
};

export const clearLocalStorage = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};
