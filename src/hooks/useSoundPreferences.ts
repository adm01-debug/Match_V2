/**
 * @fileoverview Hook for managing sound preferences
 * @module useSoundPreferences
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'sound-preferences';

interface SoundPreferences {
  celebrationSound: boolean;
}

const defaultPreferences: SoundPreferences = {
  celebrationSound: true,
};

export function useSoundPreferences() {
  const [preferences, setPreferences] = useState<SoundPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsed });
      }
    } catch (error) {
      console.error('Error loading sound preferences:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((newPreferences: Partial<SoundPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPreferences };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving sound preferences:', error);
      }
      return updated;
    });
  }, []);

  const toggleCelebrationSound = useCallback(() => {
    savePreferences({ celebrationSound: !preferences.celebrationSound });
  }, [preferences.celebrationSound, savePreferences]);

  const setCelebrationSound = useCallback((enabled: boolean) => {
    savePreferences({ celebrationSound: enabled });
  }, [savePreferences]);

  return {
    preferences,
    isLoaded,
    celebrationSoundEnabled: preferences.celebrationSound,
    toggleCelebrationSound,
    setCelebrationSound,
  };
}

// Utility function to check if celebration sound is enabled (for use outside React)
export function isCelebrationSoundEnabled(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.celebrationSound ?? true;
    }
  } catch {
    // Ignore errors
  }
  return true; // Default to enabled
}
