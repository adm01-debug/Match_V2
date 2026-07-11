/**
 * @fileoverview Recent Actions Widget Component
 * Shows user's recent actions with quick repeat functionality
 */

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logger } from '@/services/logger';

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  History,
  Clock,
  Play,
  Star,
  Trash2,
  ChevronRight,
  UserPlus,
  FileEdit,
  Send,
  Calendar,
  Eye,
  
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface RecentAction {
  id: string;
  type: 'navigation' | 'action' | 'create' | 'edit' | 'send' | 'schedule' | 'view';
  title: string;
  description?: string;
  path?: string;
  timestamp: Date;
  icon?: React.ReactNode;
  repeatAction?: () => void;
  metadata?: Record<string, unknown>;
}

interface RecentActionsWidgetProps {
  actions?: RecentAction[];
  maxActions?: number;
  showFavorites?: boolean;
  className?: string;
  compact?: boolean;
}

const actionIcons: Record<RecentAction['type'], React.ReactNode> = {
  navigation: <Eye className="h-4 w-4" />,
  action: <Play className="h-4 w-4" />,
  create: <UserPlus className="h-4 w-4" />,
  edit: <FileEdit className="h-4 w-4" />,
  send: <Send className="h-4 w-4" />,
  schedule: <Calendar className="h-4 w-4" />,
  view: <Eye className="h-4 w-4" />,
};

const actionColors: Record<RecentAction['type'], string> = {
  navigation: "bg-muted text-muted-foreground",
  action: "bg-primary/10 text-primary",
  create: "bg-success/10 text-success",
  edit: "bg-warning/10 text-warning",
  send: "bg-info/10 text-info",
  schedule: "bg-accent/10 text-accent",
  view: "bg-muted text-muted-foreground",
};

// Storage key for persisting recent actions
const STORAGE_KEY = 'recent_actions';
const FAVORITES_KEY = 'favorite_actions';

export const RecentActionsWidget = memo(function RecentActionsWidget({
  actions: externalActions,
  maxActions = 10,
  showFavorites = true,
  className,
  compact = false,
}: RecentActionsWidgetProps) {
  const navigate = useNavigate();
  const [actions, setActions] = useState<RecentAction[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites'>('recent');

  // Load from localStorage on mount
  useEffect(() => {
    if (externalActions) {
      setActions(externalActions);
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as RecentAction[];
          setActions(parsed.map(a => ({ ...a, timestamp: new Date(a.timestamp) })));
        }
      } catch (e) {
        logger.error('Failed to load recent actions:', e);
      }
    }

    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (e) {
      logger.error('Failed to load favorites:', e);
    }
  }, [externalActions]);

  const toggleFavorite = (actionId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(actionId)
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId];
      
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeAction = (actionId: string) => {
    setActions(prev => {
      const newActions = prev.filter(a => a.id !== actionId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newActions));
      return newActions;
    });
  };

  const handleRepeat = (action: RecentAction) => {
    if (action.repeatAction) {
      action.repeatAction();
    } else if (action.path) {
      navigate(action.path);
    }
  };

  const displayedActions = activeTab === 'favorites'
    ? actions.filter(a => favorites.includes(a.id))
    : actions.slice(0, maxActions);

  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2 px-1">
          <History className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Recentes</span>
        </div>
        <div className="space-y-1">
          {displayedActions.slice(0, 5).map((action) => (
            <motion.button
              key={action.id}
              onClick={() => handleRepeat(action)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors text-left"
              whileHover={{ x: 2 }}
            >
              <div className={cn("p-1 rounded", actionColors[action.type])}>
                {action.icon || actionIcons[action.type]}
              </div>
              <span className="text-sm truncate flex-1">{action.title}</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2.5 rounded-xl bg-gradient-to-br from-muted to-muted/50"
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <History className="h-5 w-5 text-muted-foreground" />
            </motion.div>
            <CardTitle className="text-lg">Ações Recentes</CardTitle>
          </div>
          
          {showFavorites && (
            <div className="flex p-1 bg-muted rounded-lg">
              <button
                onClick={() => setActiveTab('recent')}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                  activeTab === 'recent' 
                    ? "bg-background shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Recentes
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1",
                  activeTab === 'favorites' 
                    ? "bg-background shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Star className="h-3 w-3" />
                Favoritos
              </button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea className="h-64">
          <AnimatePresence mode="popLayout">
            {displayedActions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <History className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {activeTab === 'favorites' 
                    ? "Nenhuma ação favorita ainda"
                    : "Nenhuma ação recente"
                  }
                </p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {displayedActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all"
                  >
                    <div className={cn("p-2 rounded-lg", actionColors[action.type])}>
                      {action.icon || actionIcons[action.type]}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{action.title}</p>
                      {action.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {action.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(action.timestamp, {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRepeat(action)}
                      >
                        <Play className="h-3.5 w-3.5" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-8 w-8",
                          favorites.includes(action.id) && "text-yellow-500"
                        )}
                        onClick={() => toggleFavorite(action.id)}
                      >
                        <Star className={cn(
                          "h-3.5 w-3.5",
                          favorites.includes(action.id) && "fill-current"
                        )} />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRepeat(action)}>
                            <Play className="h-4 w-4 mr-2" />
                            Repetir ação
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => removeAction(action.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

// Hook for simple tracking of recent actions (localStorage-based)
export function useRecentActionsTracker() {
  const addAction = (action: Omit<RecentAction, 'id' | 'timestamp'>) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const existing: RecentAction[] = stored ? JSON.parse(stored) : [];
      
      const newAction: RecentAction = {
        ...action,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };

      // Remove duplicates and keep max 50
      const filtered = existing.filter(a => a.title !== action.title);
      const updated = [newAction, ...filtered].slice(0, 50);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      logger.error('Failed to save recent action:', e);
    }
  };

  const clearActions = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return { addAction, clearActions };
}

RecentActionsWidget.displayName = 'RecentActionsWidget';
