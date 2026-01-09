/**
 * @fileoverview Smart Suggestions Component
 * @module SmartSuggestions
 */

import { memo, ReactNode, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Lightbulb, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Zap,
  ArrowRight,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  type: 'action' | 'insight' | 'optimization' | 'reminder';
  priority: 'low' | 'medium' | 'high';
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  dismissable?: boolean;
  metadata?: Record<string, any>;
}

interface SmartSuggestionsProps {
  suggestions: Suggestion[];
  onDismiss?: (id: string) => void;
  onAction?: (suggestion: Suggestion) => void;
  className?: string;
  maxVisible?: number;
  variant?: 'inline' | 'floating' | 'sidebar';
}

const typeConfig = {
  action: {
    icon: <Zap className="h-4 w-4" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  insight: {
    icon: <Lightbulb className="h-4 w-4" />,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  optimization: {
    icon: <TrendingUp className="h-4 w-4" />,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
  reminder: {
    icon: <Clock className="h-4 w-4" />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
};

const priorityConfig = {
  low: { label: 'Baixa', color: 'bg-muted text-muted-foreground' },
  medium: { label: 'Média', color: 'bg-yellow-500/20 text-yellow-600' },
  high: { label: 'Alta', color: 'bg-destructive/20 text-destructive' },
};

export const SmartSuggestions = memo(function SmartSuggestions({
  suggestions,
  onDismiss,
  onAction,
  className,
  maxVisible = 3,
  variant = 'inline',
}: SmartSuggestionsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(false);

  const visibleSuggestions = useMemo(() => {
    return suggestions
      .filter(s => !dismissed.has(s.id))
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }, [suggestions, dismissed]);

  const displayedSuggestions = expanded 
    ? visibleSuggestions 
    : visibleSuggestions.slice(0, maxVisible);

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
    onDismiss?.(id);
  };

  if (visibleSuggestions.length === 0) return null;

  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={cn(
          'fixed bottom-20 right-4 z-40 w-80',
          className
        )}
      >
        <Card className="shadow-xl border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">Sugestões Inteligentes</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                {visibleSuggestions.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {displayedSuggestions.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onDismiss={handleDismiss}
                  onAction={onAction}
                  compact
                />
              ))}
            </div>
            {visibleSuggestions.length > maxVisible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="w-full mt-2"
              >
                {expanded ? 'Ver menos' : `Ver mais ${visibleSuggestions.length - maxVisible}`}
                <ChevronRight className={cn('h-4 w-4 ml-1 transition-transform', expanded && 'rotate-90')} />
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="font-semibold">Sugestões para você</span>
        <Badge variant="outline" className="ml-auto">
          {visibleSuggestions.length} {visibleSuggestions.length === 1 ? 'sugestão' : 'sugestões'}
        </Badge>
      </div>
      
      <AnimatePresence mode="popLayout">
        {displayedSuggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <SuggestionCard
              suggestion={suggestion}
              onDismiss={handleDismiss}
              onAction={onAction}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {visibleSuggestions.length > maxVisible && !expanded && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(true)}
          className="w-full"
        >
          Ver todas as {visibleSuggestions.length} sugestões
        </Button>
      )}
    </div>
  );
});

interface SuggestionCardProps {
  suggestion: Suggestion;
  onDismiss?: (id: string) => void;
  onAction?: (suggestion: Suggestion) => void;
  compact?: boolean;
}

const SuggestionCard = memo(function SuggestionCard({
  suggestion,
  onDismiss,
  onAction,
  compact = false,
}: SuggestionCardProps) {
  const config = typeConfig[suggestion.type];
  const priority = priorityConfig[suggestion.priority];

  return (
    <div
      className={cn(
        'group relative rounded-lg border p-3 transition-all',
        'hover:shadow-md hover:border-primary/30',
        config.borderColor,
        config.bgColor
      )}
    >
      <div className="flex gap-3">
        <div className={cn('mt-0.5', config.color)}>
          {suggestion.icon || config.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn('font-medium', compact ? 'text-sm' : 'text-base')}>
              {suggestion.title}
            </h4>
            {suggestion.dismissable !== false && (
              <button
                onClick={() => onDismiss?.(suggestion.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-background/50 rounded"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
          
          {!compact && (
            <p className="text-sm text-muted-foreground mt-1">
              {suggestion.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={cn('text-xs', priority.color)}>
              {priority.label}
            </Badge>
            
            {suggestion.actionLabel && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs ml-auto"
                onClick={() => {
                  suggestion.onAction?.();
                  onAction?.(suggestion);
                }}
              >
                {suggestion.actionLabel}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

interface QuickSuggestionProps {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'success';
}

export const QuickSuggestion = memo(function QuickSuggestion({
  label,
  icon,
  onClick,
  variant = 'default',
}: QuickSuggestionProps) {
  const variants = {
    default: 'bg-muted hover:bg-muted/80',
    primary: 'bg-primary/10 hover:bg-primary/20 text-primary',
    success: 'bg-green-500/10 hover:bg-green-500/20 text-green-600',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
        variants[variant]
      )}
    >
      {icon}
      {label}
    </motion.button>
  );
});

interface SuggestionChipsProps {
  suggestions: { id: string; label: string; icon?: ReactNode }[];
  onSelect: (id: string) => void;
  className?: string;
}

export const SuggestionChips = memo(function SuggestionChips({
  suggestions,
  onSelect,
  className,
}: SuggestionChipsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {suggestions.map((suggestion) => (
        <motion.button
          key={suggestion.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(suggestion.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
        >
          {suggestion.icon}
          {suggestion.label}
        </motion.button>
      ))}
    </div>
  );
});

SmartSuggestions.displayName = 'SmartSuggestions';
SuggestionCard.displayName = 'SuggestionCard';
QuickSuggestion.displayName = 'QuickSuggestion';
SuggestionChips.displayName = 'SuggestionChips';

export type { Suggestion };
