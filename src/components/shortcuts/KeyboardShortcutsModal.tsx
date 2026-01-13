/**
 * Keyboard Shortcuts Modal
 * Shows available keyboard shortcuts
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Keyboard, 
  Navigation, 
  Zap, 
  Eye, 
  HelpCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryConfig = {
  navigation: {
    icon: Navigation,
    label: 'Navegação',
    color: 'text-blue-500 bg-blue-500/10',
  },
  action: {
    icon: Zap,
    label: 'Ações',
    color: 'text-amber-500 bg-amber-500/10',
  },
  view: {
    icon: Eye,
    label: 'Visualização',
    color: 'text-purple-500 bg-purple-500/10',
  },
  help: {
    icon: HelpCircle,
    label: 'Ajuda',
    color: 'text-green-500 bg-green-500/10',
  },
};

export function KeyboardShortcutsModal() {
  const { 
    isShortcutsModalOpen, 
    setIsShortcutsModalOpen, 
    getShortcutsByCategory,
    formatShortcut 
  } = useKeyboardShortcuts();

  const categories = ['navigation', 'action', 'view', 'help'] as const;

  return (
    <Dialog open={isShortcutsModalOpen} onOpenChange={setIsShortcutsModalOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-xl bg-primary/10">
              <Keyboard className="h-5 w-5 text-primary" />
            </div>
            Atalhos de Teclado
          </DialogTitle>
          <DialogDescription>
            Use estes atalhos para navegar mais rapidamente no sistema
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] pr-2 space-y-6">
          <AnimatePresence mode="wait">
            {categories.map((category, catIndex) => {
              const config = categoryConfig[category];
              const shortcuts = getShortcutsByCategory(category);
              
              if (shortcuts.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn('p-1.5 rounded-lg', config.color)}>
                      <config.icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold text-sm">{config.label}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {shortcuts.map((shortcut, index) => (
                      <motion.div
                        key={shortcut.key + shortcut.description}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: catIndex * 0.1 + index * 0.03 }}
                        className={cn(
                          'flex items-center justify-between gap-3 p-3',
                          'rounded-xl bg-muted/30 border border-border/30',
                          'hover:bg-muted/50 hover:border-border/50 transition-colors'
                        )}
                      >
                        <span className="text-sm text-muted-foreground">
                          {shortcut.description}
                        </span>
                        <Badge 
                          variant="outline" 
                          className="font-mono text-xs px-2 py-1 bg-background/50 shrink-0"
                        >
                          {formatShortcut(shortcut)}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>

                  {catIndex < categories.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center">
            Pressione <Badge variant="outline" className="font-mono text-xs mx-1">Shift + ?</Badge> 
            para abrir este painel a qualquer momento
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default KeyboardShortcutsModal;
