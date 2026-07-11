/**
 * @fileoverview Enhanced hook for managing sound preferences with multiple sound types
 * @module useSoundPreferences
 */

import { logger } from '@/services/logger';
import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'sound-preferences';

export type SoundType = 
  | 'celebration' 
  | 'notification' 
  | 'success' 
  | 'error' 
  | 'warning'
  | 'click'
  | 'hover'
  | 'levelUp'
  | 'achievement';

interface SoundPreferences {
  enabled: boolean;
  volume: number; // 0-1
  celebrationSound: boolean;
  notificationSound: boolean;
  successSound: boolean;
  errorSound: boolean;
  uiSounds: boolean;
}

const defaultPreferences: SoundPreferences = {
  enabled: true,
  volume: 0.5,
  celebrationSound: true,
  notificationSound: true,
  successSound: true,
  errorSound: true,
  uiSounds: false,
};

// Sound URLs (using Web Audio API for programmatic sounds)
const createOscillator = (
  audioContext: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3
) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
};

// Sound definitions using Web Audio API
const soundEffects: Record<SoundType, (ctx: AudioContext, volume: number) => void> = {
  celebration: (ctx, vol) => {
    // Happy ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => createOscillator(ctx, freq, 0.3, 'sine', vol * 0.4), i * 100);
    });
  },
  notification: (ctx, vol) => {
    // Gentle double ping
    createOscillator(ctx, 880, 0.15, 'sine', vol * 0.3);
    setTimeout(() => createOscillator(ctx, 1108.73, 0.15, 'sine', vol * 0.3), 150);
  },
  success: (ctx, vol) => {
    // Ascending two-tone
    createOscillator(ctx, 523.25, 0.15, 'sine', vol * 0.3);
    setTimeout(() => createOscillator(ctx, 783.99, 0.2, 'sine', vol * 0.4), 100);
  },
  error: (ctx, vol) => {
    // Descending buzz
    createOscillator(ctx, 200, 0.15, 'sawtooth', vol * 0.2);
    setTimeout(() => createOscillator(ctx, 150, 0.2, 'sawtooth', vol * 0.15), 100);
  },
  warning: (ctx, vol) => {
    // Attention tone
    createOscillator(ctx, 440, 0.1, 'triangle', vol * 0.25);
    setTimeout(() => createOscillator(ctx, 440, 0.1, 'triangle', vol * 0.25), 200);
  },
  click: (ctx, vol) => {
    // Subtle click
    createOscillator(ctx, 1000, 0.03, 'sine', vol * 0.1);
  },
  hover: (ctx, vol) => {
    // Very subtle hover
    createOscillator(ctx, 2000, 0.02, 'sine', vol * 0.05);
  },
  levelUp: (ctx, vol) => {
    // Epic level up sound
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      setTimeout(() => createOscillator(ctx, freq, 0.25, 'sine', vol * 0.35), i * 80);
    });
    setTimeout(() => {
      createOscillator(ctx, 1046.50, 0.5, 'sine', vol * 0.4);
    }, notes.length * 80);
  },
  achievement: (ctx, vol) => {
    // Achievement unlocked fanfare
    const melody = [
      { freq: 523.25, delay: 0 },
      { freq: 659.25, delay: 100 },
      { freq: 783.99, delay: 200 },
      { freq: 1046.50, delay: 350 },
    ];
    melody.forEach(({ freq, delay }) => {
      setTimeout(() => createOscillator(ctx, freq, 0.3, 'sine', vol * 0.4), delay);
    });
    // Add sparkle
    setTimeout(() => {
      [1318.51, 1567.98, 2093.00].forEach((freq, i) => {
        setTimeout(() => createOscillator(ctx, freq, 0.15, 'sine', vol * 0.2), i * 50);
      });
    }, 500);
  },
};

export function useSoundPreferences() {
  const [preferences, setPreferences] = useState<SoundPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext on first user interaction
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsed });
      }
    } catch (error) {
      logger.error('Error loading sound preferences:', error);
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
        logger.error('Error saving sound preferences:', error);
      }
      return updated;
    });
  }, []);

  // Play sound effect
  const playSound = useCallback((type: SoundType) => {
    if (!preferences.enabled) return;
    
    // Check specific sound type preferences
    const shouldPlay = 
      (type === 'celebration' && preferences.celebrationSound) ||
      (type === 'notification' && preferences.notificationSound) ||
      (type === 'success' && preferences.successSound) ||
      (type === 'error' && preferences.errorSound) ||
      (type === 'warning' && preferences.errorSound) ||
      ((type === 'click' || type === 'hover') && preferences.uiSounds) ||
      (type === 'levelUp' && preferences.celebrationSound) ||
      (type === 'achievement' && preferences.celebrationSound);
    
    if (!shouldPlay) return;

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      soundEffects[type](ctx, preferences.volume);
    } catch (error) {
      logger.error('Error playing sound:', error);
    }
  }, [preferences, getAudioContext]);

  // Toggle functions
  const toggleCelebrationSound = useCallback(() => {
    savePreferences({ celebrationSound: !preferences.celebrationSound });
  }, [preferences.celebrationSound, savePreferences]);

  const setCelebrationSound = useCallback((enabled: boolean) => {
    savePreferences({ celebrationSound: enabled });
  }, [savePreferences]);

  const setVolume = useCallback((volume: number) => {
    savePreferences({ volume: Math.max(0, Math.min(1, volume)) });
  }, [savePreferences]);

  const toggleSounds = useCallback(() => {
    savePreferences({ enabled: !preferences.enabled });
  }, [preferences.enabled, savePreferences]);

  const setNotificationSound = useCallback((enabled: boolean) => {
    savePreferences({ notificationSound: enabled });
  }, [savePreferences]);

  const setSuccessSound = useCallback((enabled: boolean) => {
    savePreferences({ successSound: enabled });
  }, [savePreferences]);

  const setErrorSound = useCallback((enabled: boolean) => {
    savePreferences({ errorSound: enabled });
  }, [savePreferences]);

  const setUISounds = useCallback((enabled: boolean) => {
    savePreferences({ uiSounds: enabled });
  }, [savePreferences]);

  return {
    preferences,
    isLoaded,
    // Quick access
    celebrationSoundEnabled: preferences.celebrationSound,
    soundsEnabled: preferences.enabled,
    volume: preferences.volume,
    // Actions
    playSound,
    toggleCelebrationSound,
    setCelebrationSound,
    setVolume,
    toggleSounds,
    setNotificationSound,
    setSuccessSound,
    setErrorSound,
    setUISounds,
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

// Standalone play function for use outside components
let standaloneAudioContext: AudioContext | null = null;

export function playSoundEffect(type: SoundType, volume: number = 0.5): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefs = stored ? JSON.parse(stored) : defaultPreferences;
    
    if (!prefs.enabled) return;
    
    if (!standaloneAudioContext) {
      standaloneAudioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    
    if (standaloneAudioContext.state === 'suspended') {
      standaloneAudioContext.resume();
    }
    
    soundEffects[type](standaloneAudioContext, prefs.volume ?? volume);
  } catch (error) {
    logger.error('Error playing sound effect:', error);
  }
}
