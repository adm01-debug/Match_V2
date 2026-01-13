/**
 * @fileoverview Contexto para compartilhar resultados de busca fuzzy entre componentes
 */

import { createContext, useContext, ReactNode } from 'react';
import { FuseMatch } from '@/hooks/useFuzzySearch';

interface FuzzySearchContextValue {
  matchesMap: Map<string, readonly FuseMatch[]>;
  searchTerm: string;
}

const FuzzySearchContext = createContext<FuzzySearchContextValue>({
  matchesMap: new Map(),
  searchTerm: '',
});

interface FuzzySearchProviderProps {
  children: ReactNode;
  matchesMap: Map<string, readonly FuseMatch[]>;
  searchTerm: string;
}

export function FuzzySearchProvider({ children, matchesMap, searchTerm }: FuzzySearchProviderProps) {
  return (
    <FuzzySearchContext.Provider value={{ matchesMap, searchTerm }}>
      {children}
    </FuzzySearchContext.Provider>
  );
}

export function useFuzzySearchContext() {
  return useContext(FuzzySearchContext);
}

/**
 * Hook para obter informações de match para um item específico
 */
export function useItemMatches(itemId: string) {
  const { matchesMap, searchTerm } = useFuzzySearchContext();
  const matches = matchesMap.get(itemId);
  
  return {
    matches,
    hasMatches: !!matches && matches.length > 0,
    searchTerm,
  };
}
