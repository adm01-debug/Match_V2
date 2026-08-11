/**
 * @fileoverview Sound Effects Hook for UI interactions
 * @module hooks/useSoundEffects
 */

import { useCallback, useEffect, useState, useRef } from 'react';

type SoundType = 
  | 'click'
  | 'success'
  | 'error'
  | 'warning'
  | 'notification'
  | 'levelUp'
  | 'achievement'
  | 'pop'
  | 'swoosh'
  | 'ding'
  | 'toggle';

interface SoundOptions {
  enabled?: boolean;
  volume?: number;
}

// Audio context for generating sounds programmatically
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

// Generate simple tones programmatically
function generateTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.1
): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio errors silently
  }
}

// Generate chord (multiple frequencies)
function generateChord(
  frequencies: number[],
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.05
): void {
  frequencies.forEach((freq, index) => {
    setTimeout(() => {
      generateTone(freq, duration, type, volume);
    }, index * 50);
  });
}

// Sound definitions
const soundDefinitions: Record<SoundType, () => void> = {
  click: () => generateTone(800, 0.05, 'square', 0.05),
  success: () => generateChord([523.25, 659.25, 783.99], 0.2, 'sine', 0.08), // C5, E5, G5
  error: () => generateChord([311.13, 277.18], 0.3, 'sawtooth', 0.05), // Eb4, C#4
  warning: () => generateChord([440, 554.37], 0.15, 'triangle', 0.08), // A4, C#5
  notification: () => generateChord([659.25, 783.99], 0.15, 'sine', 0.1), // E5, G5
  levelUp: () => {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => generateTone(freq, 0.15, 'sine', 0.1), i * 100);
    });
  },
  achievement: () => {
    const notes = [783.99, 987.77, 1174.66, 1318.51]; // G5, B5, D6, E6
    notes.forEach((freq, i) => {
      setTimeout(() => generateTone(freq, 0.2, 'sine', 0.08), i * 80);
    });
  },
  pop: () => generateTone(1200, 0.03, 'sine', 0.1),
  swoosh: () => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  },
  ding: () => generateTone(1396.91, 0.3, 'sine', 0.15), // F6
  toggle: () => generateTone(600, 0.02, 'square', 0.03),
};

export function useSoundEffects(options: SoundOptions = {}) {
  const { enabled: defaultEnabled = true, volume: defaultVolume = 0.5 } = options;

  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return defaultEnabled;
    const stored = localStorage.getItem('sound-effects-enabled');
    return stored !== null ? stored === 'true' : defaultEnabled;
  });

  const [volume, setVolume] = useState(() => {
    if (typeof window === 'undefined') return defaultVolume;
    const stored = localStorage.getItem('sound-effects-volume');
    return stored !== null ? parseFloat(stored) : defaultVolume;
  });

  const lastPlayedRef = useRef<Record<SoundType, number>>({} as Record<SoundType, number>);

  // Persist settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound-effects-enabled', String(enabled));
      localStorage.setItem('sound-effects-volume', String(volume));
    }
  }, [enabled, volume]);

  // Play sound with debounce to prevent spam
  const play = useCallback(
    (type: SoundType, debounceMs: number = 50) => {
      if (!enabled) return;

      const now = Date.now();
      const lastPlayed = lastPlayedRef.current[type] || 0;

      if (now - lastPlayed < debounceMs) return;

      lastPlayedRef.current[type] = now;

      try {
        soundDefinitions[type]?.();
      } catch {
        // Ignore audio errors
      }
    },
    [enabled]
  );

  // Convenience methods
  const playClick = useCallback(() => play('click'), [play]);
  const playSuccess = useCallback(() => play('success'), [play]);
  const playError = useCallback(() => play('error'), [play]);
  const playWarning = useCallback(() => play('warning'), [play]);
  const playNotification = useCallback(() => play('notification'), [play]);
  const playLevelUp = useCallback(() => play('levelUp', 500), [play]);
  const playAchievement = useCallback(() => play('achievement', 500), [play]);
  const playPop = useCallback(() => play('pop'), [play]);
  const playSwoosh = useCallback(() => play('swoosh'), [play]);
  const playDing = useCallback(() => play('ding'), [play]);
  const playToggle = useCallback(() => play('toggle'), [play]);

  return {
    play,
    playClick,
    playSuccess,
    playError,
    playWarning,
    playNotification,
    playLevelUp,
    playAchievement,
    playPop,
    playSwoosh,
    playDing,
    playToggle,
    enabled,
    setEnabled,
    volume,
    setVolume,
  };
}

// Global sound player for use outside of hooks
export const SoundEffects = {
  play: (type: SoundType) => {
    const enabled = typeof window !== 'undefined' 
      ? localStorage.getItem('sound-effects-enabled') !== 'false'
      : true;
    
    if (enabled) {
      try {
        soundDefinitions[type]?.();
      } catch {
        // Ignore audio errors
      }
    }
  },
  click: () => SoundEffects.play('click'),
  success: () => SoundEffects.play('success'),
  error: () => SoundEffects.play('error'),
  warning: () => SoundEffects.play('warning'),
  notification: () => SoundEffects.play('notification'),
  levelUp: () => SoundEffects.play('levelUp'),
  achievement: () => SoundEffects.play('achievement'),
  pop: () => SoundEffects.play('pop'),
  swoosh: () => SoundEffects.play('swoosh'),
  ding: () => SoundEffects.play('ding'),
  toggle: () => SoundEffects.play('toggle'),
};
