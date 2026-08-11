/**
 * @fileoverview Utilitários para storage local e de sessão
 * @module storageUtils
 */

const PREFIX = 'match_ats_';

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch { return null; }
  },

  set<T>(key: string, value: T): void {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); }
    catch { /* Storage error - handled silently */ }
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },

  clear(): void {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  },
};

// Export individual functions for backwards compatibility
export function getItem<T>(key: string, defaultValue?: T): T | null {
  try {
    const prefixedKey = PREFIX + key;
    const item = localStorage.getItem(prefixedKey);
    if (item === null) return defaultValue ?? null;
    return JSON.parse(item);
  } catch { 
    return defaultValue ?? null; 
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    const prefixedKey = PREFIX + key;
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  } catch { 
    /* Storage error - handled silently */ 
  }
}

export function removeItem(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

export function clearStorage(): void {
  Object.keys(localStorage)
    .filter(k => k.startsWith(PREFIX))
    .forEach(k => localStorage.removeItem(k));
}

export default storage;
