/**
 * @fileoverview Hook para busca fuzzy usando Fuse.js
 * Fornece busca tolerante a erros de digitação
 */

import { useMemo } from 'react';
import Fuse, { IFuseOptions } from 'fuse.js';

export interface FuzzySearchOptions {
  /** Limiar de correspondência (0.0 = correspondência perfeita, 1.0 = corresponde qualquer coisa) */
  threshold?: number;
  /** Localização aproximada onde o padrão deve ser encontrado */
  location?: number;
  /** Distância máxima para considerar correspondência */
  distance?: number;
  /** Número máximo de resultados */
  limit?: number;
  /** Se deve incluir pontuação no resultado */
  includeScore?: boolean;
  /** Se deve incluir correspondências no resultado */
  includeMatches?: boolean;
  /** Peso mínimo de caracteres para corresponder */
  minMatchCharLength?: number;
  /** Se a busca deve ser sensível a maiúsculas */
  isCaseSensitive?: boolean;
  /** Se deve buscar no início da string */
  shouldSort?: boolean;
  /** Encontra padrões individuais separados por espaço */
  findAllMatches?: boolean;
  /** Se deve ignorar a localização */
  ignoreLocation?: boolean;
  /** Se deve usar busca estendida */
  useExtendedSearch?: boolean;
}

interface FuseMatch {
  indices: readonly [number, number][];
  key?: string;
  value?: string;
  refIndex?: number;
}

interface FuzzyResultItem<T> {
  item: T;
  score: number;
  matches?: readonly FuseMatch[];
}

export interface UseFuzzySearchReturn<T> {
  /** Resultados da busca */
  results: T[];
  /** Resultados com pontuação */
  resultsWithScore: Array<FuzzyResultItem<T>>;
  /** Instância do Fuse para buscas customizadas */
  fuse: Fuse<T> | null;
  /** Se há resultados */
  hasResults: boolean;
  /** Total de resultados */
  totalResults: number;
}

/**
 * Hook para busca fuzzy em arrays de objetos
 * @param items - Array de itens para buscar
 * @param keys - Chaves dos objetos para buscar (pode ser string ou objeto com peso)
 * @param searchTerm - Termo de busca
 * @param options - Opções do Fuse.js
 * @returns Resultados da busca fuzzy
 * 
 * @example
 * ```tsx
 * const { results } = useFuzzySearch(
 *   candidatos,
 *   ['nome', 'email', 'habilidades'],
 *   searchTerm,
 *   { threshold: 0.3 }
 * );
 * ```
 */
export function useFuzzySearch<T>(
  items: T[],
  keys: (keyof T | string | { name: keyof T | string; weight: number })[],
  searchTerm: string,
  options: FuzzySearchOptions = {}
): UseFuzzySearchReturn<T> {
  const {
    threshold = 0.4,
    location = 0,
    distance = 100,
    limit,
    includeScore = true,
    includeMatches = false,
    minMatchCharLength = 2,
    isCaseSensitive = false,
    shouldSort = true,
    findAllMatches = false,
    ignoreLocation = false,
    useExtendedSearch = false,
  } = options;

  // Criar instância do Fuse
  const fuse = useMemo(() => {
    if (!items || items.length === 0) return null;

    const fuseOptions: IFuseOptions<T> = {
      keys: keys as string[],
      threshold,
      location,
      distance,
      includeScore,
      includeMatches,
      minMatchCharLength,
      isCaseSensitive,
      shouldSort,
      findAllMatches,
      ignoreLocation,
      useExtendedSearch,
    };

    return new Fuse(items, fuseOptions);
  }, [items, keys, threshold, location, distance, includeScore, includeMatches, 
      minMatchCharLength, isCaseSensitive, shouldSort, findAllMatches, 
      ignoreLocation, useExtendedSearch]);

  // Executar busca
  const searchResults = useMemo(() => {
    if (!fuse || !searchTerm.trim()) {
      return items.map(item => ({ item, score: 0, matches: [] as FuseMatch[] }));
    }

    let results = fuse.search(searchTerm);

    if (limit && limit > 0) {
      results = results.slice(0, limit);
    }

    return results.map(result => ({
      item: result.item,
      score: result.score ?? 0,
      matches: (result.matches ?? []) as unknown as FuseMatch[],
    }));
  }, [fuse, searchTerm, items, limit]);

  // Extrair apenas os itens
  const results = useMemo(() => {
    return searchResults.map(r => r.item);
  }, [searchResults]);

  return {
    results,
    resultsWithScore: searchResults,
    fuse,
    hasResults: results.length > 0,
    totalResults: results.length,
  };
}

/**
 * Configurações predefinidas para diferentes tipos de busca
 */
export const FUZZY_PRESETS = {
  /** Busca rígida - apenas correspondências muito próximas */
  strict: {
    threshold: 0.2,
    distance: 50,
    minMatchCharLength: 3,
  },
  /** Busca padrão - bom equilíbrio */
  default: {
    threshold: 0.4,
    distance: 100,
    minMatchCharLength: 2,
  },
  /** Busca flexível - aceita mais variações */
  loose: {
    threshold: 0.6,
    distance: 200,
    minMatchCharLength: 1,
  },
  /** Busca muito flexível - para autocomplete */
  autocomplete: {
    threshold: 0.5,
    distance: 300,
    minMatchCharLength: 1,
    ignoreLocation: true,
  },
} as const;

export default useFuzzySearch;
