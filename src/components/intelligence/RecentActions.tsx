/**
 * @fileoverview Recent Actions Component
 * @module RecentActions
 */

import { logger } from '@/services/logger';
import { memo, useState, useEffect, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  RotateCcw, 
  Trash2, 
  ChevronRight,
  ArrowRight,
  History,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecentAction {
  id: string;
  type: string;
  title: string;
  description?: string;
  timestamp: Date;
  icon?: ReactNode;
  path?: string;
  undoable?: boolean;
  metadata?: Record<string, any>;
}

interface RecentActionsProps {
  actions: RecentAction[];
  onActionClick?: (action: RecentAction) => void;
  onUndo?: (action: RecentAction) => void;
  onClear?: () => void;
  maxItems?: number;
  className?: string;
}

export const RecentActions = memo(function RecentActions({
  actions,
  onActionClick,
  onUndo,
  onClear,
  maxItems = 10,
  className,
}: RecentActionsProps) {
  const [filter, setFilter] = useState<string | null>(null);

  const actionTypes = [...new Set(actions.map(a => a.type))];

  const filteredActions = filter
    ? actions.filter(a => a.type === filter)
    : actions;

  const displayedActions = filteredActions.slice(0, maxItems);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Ações Recentes</h3>
          <Badge variant="outline">{actions.length}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filtrar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <div className="space-y-1">
                <button
                  onClick={() => setFilter(null)}
                  className={cn(
                    'w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted',
                    !filter && 'bg-muted'
                  )}
                >
                  Todas as ações
                </button>
                {actionTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={cn(
                      'w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted capitalize',
                      filter === type && 'bg-muted'
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          {onClear && actions.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              <Trash2 className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="max-h-80">
        <AnimatePresence mode="popLayout">
          {displayedActions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma ação recente</p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {displayedActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <RecentActionCard
                    action={action}
                    onClick={() => onActionClick?.(action)}
                    onUndo={onUndo ? () => onUndo(action) : undefined}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
});

interface RecentActionCardProps {
  action: RecentAction;
  onClick?: () => void;
  onUndo?: () => void;
}

const RecentActionCard = memo(function RecentActionCard({
  action,
  onClick,
  onUndo,
}: RecentActionCardProps) {
  const timeAgo = formatDistanceToNow(action.timestamp, {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div
      className={cn(
        'group flex items-start gap-3 p-3 rounded-lg border transition-colors',
        onClick && 'cursor-pointer hover:bg-muted/50'
      )}
      onClick={onClick}
    >
      <div className="p-2 rounded-lg bg-muted">
        {action.icon || <Clock className="h-4 w-4 text-muted-foreground" />}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate">{action.title}</p>
          <Badge variant="outline" className="text-xs capitalize">
            {action.type}
          </Badge>
        </div>
        
        {action.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {action.description}
          </p>
        )}
        
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {timeAgo}
        </p>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {action.undoable && onUndo && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onUndo();
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
        
        {onClick && (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );
});

interface QuickActionsFloatingProps {
  actions: RecentAction[];
  onActionClick?: (action: RecentAction) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickActionsFloating = memo(function QuickActionsFloating({
  actions,
  onActionClick,
  isOpen,
  onClose,
}: QuickActionsFloatingProps) {
  const recentActions = actions.slice(0, 5);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-20 right-4 z-50 w-72 bg-background rounded-lg shadow-xl border p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Ações Rápidas</span>
              <Badge variant="secondary" className="text-xs">
                Recentes
              </Badge>
            </div>
            
            <div className="space-y-1">
              {recentActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => {
                    onActionClick?.(action);
                    onClose();
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="p-1.5 rounded bg-muted">
                    {action.icon || <ArrowRight className="h-3 w-3" />}
                  </div>
                  <span className="text-sm truncate flex-1">{action.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

// Hook to manage recent actions
interface UseRecentActionsOptions {
  maxActions?: number;
  persistKey?: string;
}

export function useRecentActions({ maxActions = 50, persistKey }: UseRecentActionsOptions = {}) {
  const [actions, setActions] = useState<RecentAction[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (persistKey) {
      try {
        const stored = localStorage.getItem(persistKey);
        if (stored) {
          const parsed = JSON.parse(stored) as Array<{ timestamp: string; [key: string]: unknown }>;
          setActions(parsed.map((a) => ({
            ...a,
            timestamp: new Date(a.timestamp),
          })) as RecentAction[]);
        }
      } catch (e) {
        logger.error('Failed to load recent actions:', e);
      }
    }
  }, [persistKey]);

  // Save to localStorage on change
  useEffect(() => {
    if (persistKey && actions.length > 0) {
      try {
        localStorage.setItem(persistKey, JSON.stringify(actions));
      } catch (e) {
        logger.error('Failed to save recent actions:', e);
      }
    }
  }, [actions, persistKey]);

  const addAction = useCallback((action: Omit<RecentAction, 'id' | 'timestamp'>) => {
    const newAction: RecentAction = {
      ...action,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    setActions(prev => [newAction, ...prev].slice(0, maxActions));
  }, [maxActions]);

  const removeAction = useCallback((id: string) => {
    setActions(prev => prev.filter(a => a.id !== id));
  }, []);

  const clearActions = useCallback(() => {
    setActions([]);
    if (persistKey) {
      localStorage.removeItem(persistKey);
    }
  }, [persistKey]);

  const undoAction = useCallback((id: string) => {
    const action = actions.find(a => a.id === id);
    if (action?.undoable) {
      removeAction(id);
      // Here you could trigger the actual undo logic
      return action;
    }
    return null;
  }, [actions, removeAction]);

  return {
    actions,
    addAction,
    removeAction,
    clearActions,
    undoAction,
  };
}

RecentActions.displayName = 'RecentActions';
RecentActionCard.displayName = 'RecentActionCard';
QuickActionsFloating.displayName = 'QuickActionsFloating';

export type { RecentAction };
