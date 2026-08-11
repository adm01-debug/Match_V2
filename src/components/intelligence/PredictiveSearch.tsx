/**
 * @fileoverview Predictive Search Component with AI-powered suggestions
 * @module PredictiveSearch
 */

import { logger } from '@/services/logger';
import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  X, 
  ArrowRight,
  User,
  Briefcase,
  Calendar,
  FileText,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebounce } from '@/hooks/useDebounce';

export type SearchResultType = 'candidato' | 'vaga' | 'entrevista' | 'documento' | 'acao';

interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  path?: string;
  metadata?: Record<string, unknown>;
  relevance?: number;
}

interface PredictiveSearchProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onSelect: (result: SearchResult) => void;
  placeholder?: string;
  recentSearches?: string[];
  trendingSearches?: string[];
  onClearRecent?: () => void;
  className?: string;
}

const typeIcons: Record<SearchResultType, React.ReactNode> = {
  candidato: <User className="h-4 w-4" />,
  vaga: <Briefcase className="h-4 w-4" />,
  entrevista: <Calendar className="h-4 w-4" />,
  documento: <FileText className="h-4 w-4" />,
  acao: <ArrowRight className="h-4 w-4" />,
};

const typeLabels: Record<SearchResultType, string> = {
  candidato: 'Candidato',
  vaga: 'Vaga',
  entrevista: 'Entrevista',
  documento: 'Documento',
  acao: 'Ação',
};

const typeColors: Record<SearchResultType, string> = {
  candidato: 'bg-info/10 text-info',
  vaga: 'bg-success/10 text-success',
  entrevista: 'bg-accent/10 text-accent',
  documento: 'bg-warning/10 text-warning',
  acao: 'bg-primary/10 text-primary',
};

export const PredictiveSearch = memo(function PredictiveSearch({
  onSearch,
  onSelect,
  placeholder = 'Buscar candidatos, vagas, entrevistas...',
  recentSearches = [],
  trendingSearches = [],
  onClearRecent,
  className,
}: PredictiveSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsLoading(true);
      onSearch(debouncedQuery)
        .then((results) => {
          setResults(results);
          setSelectedIndex(-1);
        })
        .catch(logger.error)
        .finally(() => setIsLoading(false));
    } else {
      setResults([]);
    }
  }, [debouncedQuery, onSearch]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, results, selectedIndex]);

  const handleSelect = (result: SearchResult) => {
    onSelect(result);
    setQuery('');
    setIsOpen(false);
    setResults([]);
  };

  const handleRecentClick = (search: string) => {
    setQuery(search);
    inputRef.current?.focus();
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showSuggestions = isOpen && (
    query.length < 2 && (recentSearches.length > 0 || trendingSearches.length > 0)
  );
  
  const showResults = isOpen && query.length >= 2;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {(showSuggestions || showResults) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 overflow-hidden"
          >
            {showSuggestions && (
              <div className="p-3">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Pesquisas recentes</span>
                      </div>
                      {onClearRecent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={onClearRecent}
                        >
                          Limpar
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.slice(0, 5).map((search, i) => (
                        <button
                          key={i}
                          onClick={() => handleRecentClick(search)}
                          className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                {trendingSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>Em alta</span>
                    </div>
                    <div className="space-y-1">
                      {trendingSearches.slice(0, 4).map((search, i) => (
                        <button
                          key={i}
                          onClick={() => handleRecentClick(search)}
                          className="w-full flex items-center gap-2 p-2 hover:bg-muted rounded-lg text-left transition-colors"
                        >
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="text-sm">{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {showResults && (
              <ScrollArea className="max-h-80">
                {results.length === 0 && !isLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum resultado para "{query}"</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {results.map((result, index) => (
                      <motion.button
                        key={result.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => handleSelect(result)}
                        className={cn(
                          'w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors',
                          index === selectedIndex 
                            ? 'bg-primary/10' 
                            : 'hover:bg-muted'
                        )}
                      >
                        <div className={cn(
                          'p-2 rounded-lg',
                          typeColors[result.type]
                        )}>
                          {typeIcons[result.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">
                              {result.title}
                            </span>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {typeLabels[result.type]}
                            </Badge>
                          </div>
                          {result.subtitle && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {result.subtitle}
                            </p>
                          )}
                        </div>
                        {result.relevance && result.relevance > 0.8 && (
                          <Sparkles className="h-4 w-4 text-warning shrink-0" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            )}

            {/* AI Suggestion */}
            {showResults && results.length > 0 && (
              <div className="p-3 border-t bg-muted/30">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>
                    Pressione <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↵</kbd> para selecionar, 
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs ml-1">↑↓</kbd> para navegar
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

PredictiveSearch.displayName = 'PredictiveSearch';

// Hook for managing search history
export function useSearchHistory(key: string = 'search-history', maxItems: number = 10) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      logger.error('Failed to load search history:', e);
    }
  }, [key]);

  const addSearch = useCallback((query: string) => {
    setHistory(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, maxItems);
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  }, [key, maxItems]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(key);
  }, [key]);

  return { history, addSearch, clearHistory };
}
