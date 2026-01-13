/**
 * Quick Actions Floating Panel
 * Fast access to common actions from anywhere
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  UserPlus,
  Briefcase,
  Calendar,
  Search,
  Zap,
  X,
  Sparkles,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface QuickActionsFloatingProps {
  className?: string;
}

const quickActions = [
  { 
    id: 'nova-vaga', 
    label: 'Nova Vaga', 
    icon: Briefcase, 
    path: '/vagas/nova',
    color: 'bg-blue-500 hover:bg-blue-600',
    shortcut: 'Ctrl+N'
  },
  { 
    id: 'novo-candidato', 
    label: 'Novo Candidato', 
    icon: UserPlus, 
    path: '/parser-curriculo',
    color: 'bg-green-500 hover:bg-green-600',
    shortcut: 'Ctrl+Shift+C'
  },
  { 
    id: 'agendar', 
    label: 'Agendar Entrevista', 
    icon: Calendar, 
    path: '/agenda?action=nova',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  { 
    id: 'buscar', 
    label: 'Buscar', 
    icon: Search, 
    action: 'focus-search',
    color: 'bg-amber-500 hover:bg-amber-600',
    shortcut: '/'
  },
  { 
    id: 'match', 
    label: 'Match Rápido', 
    icon: Target, 
    path: '/deu-match',
    color: 'bg-pink-500 hover:bg-pink-600',
  },
];

export function QuickActionsFloating({ className }: QuickActionsFloatingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAction = (action: typeof quickActions[0]) => {
    if (action.path) {
      navigate(action.path);
    } else if (action.action === 'focus-search') {
      const searchInput = document.querySelector('input[type="text"][placeholder*="Buscar"], input[type="search"]');
      if (searchInput instanceof HTMLInputElement) {
        searchInput.focus();
        searchInput.select();
      }
    }
    setIsOpen(false);
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-40", className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-20 right-0 flex flex-col-reverse gap-3"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      onClick={() => handleAction(action)}
                      className={cn(
                        "h-12 gap-3 pl-4 pr-5 shadow-lg shadow-black/10 text-white",
                        "rounded-full transition-all duration-200",
                        "hover:shadow-xl hover:scale-105",
                        action.color
                      )}
                    >
                      <action.icon className="h-5 w-5" />
                      <span className="font-medium">{action.label}</span>
                      {action.shortcut && (
                        <Badge 
                          variant="secondary" 
                          className="ml-1 bg-white/20 text-white/90 text-[10px] px-1.5"
                        >
                          {action.shortcut}
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {action.label}
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "h-14 w-14 rounded-full flex items-center justify-center",
              "bg-gradient-to-br from-primary via-primary to-accent",
              "text-primary-foreground shadow-2xl shadow-primary/30",
              "transition-all duration-300",
              "hover:shadow-primary/40",
              isOpen && "rotate-45"
            )}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  className="relative"
                >
                  <Zap className="h-6 w-6" />
                  {/* Pulse animation */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Ações Rápidas
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default QuickActionsFloating;
