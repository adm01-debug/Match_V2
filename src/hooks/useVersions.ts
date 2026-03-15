import { useState, useCallback } from 'react';

interface Version<T> {
  id: string;
  data: T;
  timestamp: string;
  author?: string;
  description?: string;
}

export function useVersions<T>(entityKey: string) {
  const storageKey = `versions_${entityKey}`;

  const [versions, setVersions] = useState<Version<T>[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveVersion = useCallback((data: T, description?: string, author?: string) => {
    const newVersion: Version<T> = {
      id: crypto.randomUUID(),
      data: structuredClone(data),
      timestamp: new Date().toISOString(),
      author,
      description,
    };
    setVersions((prev) => {
      const updated = [newVersion, ...prev].slice(0, 50);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
    return newVersion;
  }, [storageKey]);

  const getVersion = useCallback((id: string) => versions.find((v) => v.id === id), [versions]);

  const restoreVersion = useCallback((id: string): T | null => {
    const version = versions.find((v) => v.id === id);
    return version ? version.data : null;
  }, [versions]);

  const compareVersions = useCallback((idA: string, idB: string) => {
    const a = versions.find((v) => v.id === idA);
    const b = versions.find((v) => v.id === idB);
    if (!a || !b) return null;
    return { versionA: a, versionB: b };
  }, [versions]);

  const clearVersions = useCallback(() => {
    setVersions([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return { versions, saveVersion, getVersion, restoreVersion, compareVersions, clearVersions };
}
