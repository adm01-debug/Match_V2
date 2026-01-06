/**
 * @module useVersions
 * @description Hook para gerenciar versões de entidades (localStorage-based para compatibilidade)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface Version {
  id: string;
  entity_type: string;
  entity_id: string;
  version_number: number;
  data: Record<string, unknown>;
  changed_by: string | null;
  changed_at: string;
  change_summary: string | null;
}

const STORAGE_KEY = 'entity_versions';

function getStoredVersions(): Version[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredVersions(versions: Version[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
}

export function useVersions(entityType: string, entityId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['versions', entityType, entityId];

  const { data: versions = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const allVersions = getStoredVersions();
      return allVersions
        .filter(v => v.entity_type === entityType && v.entity_id === entityId)
        .sort((a, b) => b.version_number - a.version_number);
    },
    enabled: !!entityId,
  });

  const createVersionMutation = useMutation({
    mutationFn: async (input: { data: Record<string, unknown>; change_summary?: string }) => {
      const allVersions = getStoredVersions();
      const existingVersions = allVersions.filter(
        v => v.entity_type === entityType && v.entity_id === entityId
      );
      const maxVersion = existingVersions.reduce((max, v) => Math.max(max, v.version_number), 0);
      
      const newVersion: Version = {
        id: crypto.randomUUID(),
        entity_type: entityType,
        entity_id: entityId,
        version_number: maxVersion + 1,
        data: input.data,
        changed_by: null,
        changed_at: new Date().toISOString(),
        change_summary: input.change_summary || null,
      };

      setStoredVersions([...allVersions, newVersion]);
      return newVersion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Versão salva!');
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (versionId: string) => {
      const version = versions.find(v => v.id === versionId);
      if (!version) throw new Error('Versão não encontrada');
      return version.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Versão restaurada!');
    },
  });

  return {
    versions,
    isLoading,
    restoreVersion: restoreMutation.mutate,
    createVersion: createVersionMutation.mutate,
    currentVersion: versions[0] || null,
  };
}
