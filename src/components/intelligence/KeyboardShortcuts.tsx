/**
 * @fileoverview Keyboard Shortcuts Overlay Component
 * @module KeyboardShortcuts
 */

import { memo, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { useFuzzySearch, FUZZY_PRESETS } from '@/hooks/useFuzzySearch';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Keyboard, 
  Search,
  X,
  Command,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CornerDownLeft
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KeyboardShortcut {
  id: string;
  keys: string[];
  description: string;
  category: string;
  action?: () => void;
}

interface KeyboardShortcutsOverlayProps {
  shortcuts: KeyboardShortcut[];
  isOpen: boolean;
  onClose: () => void;
  triggerKey?: string;
}

const keyIconMap: Record<string, ReactNode> = {
  'cmd': <Command className="h-3 w-3" />,
  'ctrl': <span className="text-xs">Ctrl</span>,
  'shift': <span className="text-xs">⇧</span>,
  'alt': <span className="text-xs">Alt</span>,
  'enter': <CornerDownLeft className="h-3 w-3" />,
  'up': <ArrowUp className="h-3 w-3" />,
  'down': <ArrowDown className="h-3 w-3" />,
  'left': <ArrowLeft className="h-3 w-3" />,
  'right': <ArrowRight className="h-3 w-3" />,
  'esc': <span className="text-xs">Esc</span>,
  'tab': <span className="text-xs">Tab</span>,
  'space': <span className="text-xs">Space</span>,
  'backspace': <span className="text-xs">⌫</span>,
  'delete': <span className="text-xs">Del</span>,
};

export const KeyboardShortcutsOverlay = memo(function KeyboardShortcutsOverlay({
  shortcuts,
  isOpen,
  onClose,
  triggerKey = '?',
}: KeyboardShortcutsOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Group shortcuts by category
  const categories = [...new Set(shortcuts.map(s => s.category))];

  // Busca fuzzy com Fuse.js
  const { results: fuzzyResults } = useFuzzySearch(
    shortcuts,
    [
      { name: 'description', weight: 2 },
      { name: 'keys', weight: 1 },
      { name: 'category', weight: 0.5 },
    ],
    searchQuery,
    { ...FUZZY_PRESETS.loose }
  );

  const filteredShortcuts = useMemo(() => {
    const baseShortcuts = searchQuery ? fuzzyResults : shortcuts;
    return baseShortcuts.filter(shortcut => {
      const matchesCategory = !activeCategory || shortcut.category === activeCategory;
      return matchesCategory;
    });
  }, [shortcuts, fuzzyResults, searchQuery, activeCategory]);

  const groupedShortcuts = categories.reduce((acc, category) => {
    const categoryShortcuts = filteredShortcuts.filter(s => s.category === category);
    if (categoryShortcuts.length > 0) {
      acc[category] = categoryShortcuts;
    }
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset search when closing
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setActiveCategory(null);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
          >
            <div className="bg-background rounded-xl shadow-2xl border overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Keyboard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Atalhos de Teclado</h2>
                    <p className="text-sm text-muted-foreground">
                      Pressione <KeyBadge keys={[triggerKey]} /> para abrir/fechar
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar atalhos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    autoFocus
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={cn(
                      'px-3 py-1 text-sm rounded-full transition-colors',
                      !activeCategory
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    )}
                  >
                    Todos
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        'px-3 py-1 text-sm rounded-full transition-colors',
                        activeCategory === category
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shortcuts List */}
              <ScrollArea className="max-h-96">
                <div className="p-4 space-y-6">
                  {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                    <div key={category}>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {categoryShortcuts.map((shortcut) => (
                          <div
                            key={shortcut.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <span className="text-sm">{shortcut.description}</span>
                            <KeyBadge keys={shortcut.keys} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {filteredShortcuts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Keyboard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhum atalho encontrado</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

interface KeyBadgeProps {
  keys: string[];
  className?: string;
}

export const KeyBadge = memo(function KeyBadge({ keys, className }: KeyBadgeProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {keys.map((key, index) => (
        <span key={index} className="flex items-center gap-1">
          <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-muted border rounded text-xs font-mono">
            {keyIconMap[key.toLowerCase()] || key.toUpperCase()}
          </kbd>
          {index < keys.length - 1 && (
            <span className="text-muted-foreground text-xs">+</span>
          )}
        </span>
      ))}
    </div>
  );
});

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions) {
  const [overlayOpen, setOverlayOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    // Toggle overlay with ?
    if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      setOverlayOpen(prev => !prev);
      return;
    }

    // Check for matching shortcuts
    shortcuts.forEach((shortcut) => {
      const keys = shortcut.keys.map(k => k.toLowerCase());
      const pressedKeys: string[] = [];

      if (e.ctrlKey) pressedKeys.push('ctrl');
      if (e.metaKey) pressedKeys.push('cmd');
      if (e.shiftKey) pressedKeys.push('shift');
      if (e.altKey) pressedKeys.push('alt');
      pressedKeys.push(e.key.toLowerCase());

      const matches = keys.every(k => pressedKeys.includes(k)) &&
                     pressedKeys.every(k => keys.includes(k));

      if (matches && shortcut.action) {
        e.preventDefault();
        shortcut.action();
      }
    });
  }, [enabled, shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    overlayOpen,
    setOverlayOpen,
    closeOverlay: () => setOverlayOpen(false),
    openOverlay: () => setOverlayOpen(true),
  };
}

KeyboardShortcutsOverlay.displayName = 'KeyboardShortcutsOverlay';
KeyBadge.displayName = 'KeyBadge';

export type { KeyboardShortcut };
