import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface AdvancedSearchOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  minChars?: number;
  debounceMs?: number;
}

interface SearchFilter {
  field: string;
  value: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt';
}

export function useAdvancedSearch<T extends Record<string, unknown>>({
  data,
  searchFields,
  minChars = 2,
  debounceMs = 300,
}: AdvancedSearchOptions<T>) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const debouncedQuery = useDebounce(query, debounceMs);

  const results = useMemo(() => {
    let filtered = [...data];

    if (debouncedQuery.length >= minChars) {
      const lower = debouncedQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        searchFields.some((field) => {
          const val = item[field];
          return val && String(val).toLowerCase().includes(lower);
        })
      );
    }

    for (const filter of filters) {
      filtered = filtered.filter((item) => {
        const val = String(item[filter.field as keyof T] ?? '').toLowerCase();
        const fv = filter.value.toLowerCase();
        switch (filter.operator) {
          case 'equals': return val === fv;
          case 'contains': return val.includes(fv);
          case 'startsWith': return val.startsWith(fv);
          case 'endsWith': return val.endsWith(fv);
          case 'gt': return Number(val) > Number(fv);
          case 'lt': return Number(val) < Number(fv);
          default: return true;
        }
      });
    }

    return filtered;
  }, [data, debouncedQuery, filters, searchFields, minChars]);

  const addFilter = useCallback((filter: SearchFilter) => {
    setFilters((prev) => [...prev, filter]);
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearAll = useCallback(() => {
    setQuery('');
    setFilters([]);
  }, []);

  const highlightMatch = useCallback((text: string) => {
    if (!debouncedQuery || debouncedQuery.length < minChars) return text;
    const regex = new RegExp(`(${debouncedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }, [debouncedQuery, minChars]);

  return { query, setQuery, filters, addFilter, removeFilter, clearAll, results, highlightMatch, isSearching: debouncedQuery.length >= minChars };
}
