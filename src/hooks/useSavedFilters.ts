/**
 * FINANCE HUB - Hook para Filtros Salvos
 * 
 * @module hooks/useSavedFilters
 * @description Gerencia filtros salvos por usuário e entidade (localStorage-based)
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '@/services/logger';

// ============================================
// TIPOS
// ============================================

export interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  is_default: boolean;
  created_at: string;
}

interface SaveFilterInput {
  name: string;
  filters: Record<string, unknown>;
  is_default?: boolean;
}

// ============================================
// HELPER
// ============================================

function getStorageKey(entityType: string): string {
  return `saved_filters_${entityType}`;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// HOOK
// ============================================

export function useSavedFilters(entityType: string) {
  const [filters, setFilters] = useState<SavedFilter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load filters from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(getStorageKey(entityType));
      if (stored) {
        setFilters(JSON.parse(stored));
      }
    } catch (e) {
      logger.error('Error loading saved filters:', e);
    } finally {
      setIsLoading(false);
    }
  }, [entityType]);

  // Persist to localStorage
  const persistFilters = useCallback((newFilters: SavedFilter[]) => {
    localStorage.setItem(getStorageKey(entityType), JSON.stringify(newFilters));
    setFilters(newFilters);
  }, [entityType]);

  // Get default filter
  const defaultFilter = filters.find(f => f.is_default);

  // Save new filter
  const saveFilter = useCallback((input: SaveFilterInput) => {
    const newFilters = input.is_default 
      ? filters.map(f => ({ ...f, is_default: false }))
      : [...filters];

    const newFilter: SavedFilter = {
      id: generateId(),
      name: input.name,
      filters: input.filters,
      is_default: input.is_default ?? false,
      created_at: new Date().toISOString(),
    };

    persistFilters([newFilter, ...newFilters]);
    toast.success('Filtro salvo com sucesso!');
  }, [filters, persistFilters]);

  // Update filter
  const updateFilter = useCallback((data: SaveFilterInput & { id: string }) => {
    const { id, ...input } = data;
    const newFilters = filters.map(f => 
      f.id === id ? { ...f, ...input } : f
    );
    persistFilters(newFilters);
    toast.success('Filtro atualizado!');
  }, [filters, persistFilters]);

  // Delete filter
  const deleteFilter = useCallback((id: string) => {
    const newFilters = filters.filter(f => f.id !== id);
    persistFilters(newFilters);
    toast.success('Filtro removido');
  }, [filters, persistFilters]);

  // Set as default
  const setDefault = useCallback((id: string) => {
    const newFilters = filters.map(f => ({
      ...f,
      is_default: f.id === id,
    }));
    persistFilters(newFilters);
    toast.success('Filtro padrão definido');
  }, [filters, persistFilters]);

  return {
    filters,
    isLoading,
    defaultFilter,
    saveFilter,
    updateFilter,
    deleteFilter,
    setDefault,
    isSaving: false,
  };
}

export default useSavedFilters;
