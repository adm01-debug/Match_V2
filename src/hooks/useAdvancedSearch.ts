import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SearchFilters { query?: string; skills?: string[]; experienceLevel?: string; location?: string; status?: string; source?: string; dateFrom?: string; dateTo?: string; }
interface SavedFilter { id: string; name: string; filters: SearchFilters; }

export function useAdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(() => {
    const saved = localStorage.getItem('match-ats-saved-filters');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const recent = localStorage.getItem('match-ats-recent-searches');
    return recent ? JSON.parse(recent) : [];
  });

  const { data: results = [], isLoading, refetch } = useQuery({
    queryKey: ['advanced-search', filters],
    queryFn: async () => {
      let query = supabase.from('candidatos').select('*, candidaturas(vaga_id, etapa_id)');
      
      if (filters.query) {
        query = query.or(`nome.ilike.%${filters.query}%,email.ilike.%${filters.query}%,cargo_atual.ilike.%${filters.query}%`);
      }
      if (filters.skills?.length) {
        query = query.contains('skills', filters.skills);
      }
      if (filters.experienceLevel) {
        query = query.eq('nivel_experiencia', filters.experienceLevel);
      }
      if (filters.location) {
        query = query.ilike('cidade', `%${filters.location}%`);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.source) {
        query = query.eq('fonte', filters.source);
      }
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: Object.keys(filters).length > 0,
  });

  const search = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (newFilters.query && !recentSearches.includes(newFilters.query)) {
      const updated = [newFilters.query, ...recentSearches.slice(0, 9)];
      setRecentSearches(updated);
      localStorage.setItem('match-ats-recent-searches', JSON.stringify(updated));
    }
  }, [recentSearches]);

  const saveFilter = useCallback((name: string) => {
    const newFilter: SavedFilter = { id: Date.now().toString(), name, filters };
    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem('match-ats-saved-filters', JSON.stringify(updated));
  }, [filters, savedFilters]);

  const deleteFilter = useCallback((id: string) => {
    const updated = savedFilters.filter(f => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem('match-ats-saved-filters', JSON.stringify(updated));
  }, [savedFilters]);

  const loadFilter = useCallback((id: string) => {
    const filter = savedFilters.find(f => f.id === id);
    if (filter) setFilters(filter.filters);
  }, [savedFilters]);

  const clearFilters = useCallback(() => setFilters({}), []);

  const hasActiveFilters = useMemo(() => Object.values(filters).some(v => v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)), [filters]);

  return {
    filters,
    results,
    isLoading,
    search,
    setFilters,
    clearFilters,
    hasActiveFilters,
    savedFilters,
    saveFilter,
    deleteFilter,
    loadFilter,
    recentSearches,
    refetch,
  };
}

export default useAdvancedSearch;
