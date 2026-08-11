/**
 * Command Center - Central de Ações Rápidas com IA
 */
import { useState, useMemo } from 'react';
import { useFuzzySearch, FUZZY_PRESETS } from '@/hooks/useFuzzySearch';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Sparkles,
  Zap,
  Plus,
  Search,
  FileText,
  Users,
  Calendar,
  Mail,
  Target,
  Brain,
  TrendingUp,
  Clock,
  Keyboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  shortcut?: string;
  category: 'create' | 'navigate' | 'action' | 'ai';
  priority: number;
  onClick: () => void;
}

interface CommandCenterProps {
  onAction?: (actionId: string) => void;
}

export function CommandCenter({ onAction }: CommandCenterProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    // Create actions
    {
      id: 'create-vaga',
      label: 'Nova Vaga',
      description: 'Criar uma nova oportunidade',
      icon: <Plus className="h-4 w-4" />,
      shortcut: 'N',
      category: 'create',
      priority: 1,
      onClick: () => navigate('/vagas/nova'),
    },
    {
      id: 'create-candidato',
      label: 'Novo Candidato',
      description: 'Cadastrar candidato via currículo',
      icon: <Users className="h-4 w-4" />,
      shortcut: 'C',
      category: 'create',
      priority: 2,
      onClick: () => navigate('/parser-curriculo'),
    },
    {
      id: 'create-entrevista',
      label: 'Agendar Entrevista',
      description: 'Marcar nova entrevista',
      icon: <Calendar className="h-4 w-4" />,
      shortcut: 'E',
      category: 'create',
      priority: 3,
      onClick: () => navigate('/agenda'),
    },
    {
      id: 'create-prova',
      label: 'Nova Prova',
      description: 'Criar avaliação técnica',
      icon: <FileText className="h-4 w-4" />,
      category: 'create',
      priority: 4,
      onClick: () => navigate('/testes/nova'),
    },

    // Navigate actions
    {
      id: 'nav-pipeline',
      label: 'Pipeline',
      description: 'Ver candidatos em processo',
      icon: <Target className="h-4 w-4" />,
      shortcut: 'P',
      category: 'navigate',
      priority: 1,
      onClick: () => navigate('/pipeline'),
    },
    {
      id: 'nav-talentos',
      label: 'Banco de Talentos',
      description: 'Explorar candidatos',
      icon: <Users className="h-4 w-4" />,
      shortcut: 'T',
      category: 'navigate',
      priority: 2,
      onClick: () => navigate('/talentos'),
    },
    {
      id: 'nav-analytics',
      label: 'Analytics',
      description: 'Métricas e relatórios',
      icon: <TrendingUp className="h-4 w-4" />,
      shortcut: 'A',
      category: 'navigate',
      priority: 3,
      onClick: () => navigate('/analytics'),
    },
    {
      id: 'nav-comunicacao',
      label: 'Comunicação',
      description: 'Central de mensagens',
      icon: <Mail className="h-4 w-4" />,
      category: 'navigate',
      priority: 4,
      onClick: () => navigate('/comunicacao'),
    },

    // AI Actions
    {
      id: 'ai-match',
      label: 'Match Inteligente',
      description: 'IA analisa compatibilidade',
      icon: <Brain className="h-4 w-4" />,
      category: 'ai',
      priority: 1,
      onClick: () => navigate('/deu-match'),
    },
    {
      id: 'ai-insights',
      label: 'Insights de IA',
      description: 'Recomendações automáticas',
      icon: <Sparkles className="h-4 w-4" />,
      category: 'ai',
      priority: 2,
      onClick: () => navigate('/analytics'),
    },
    {
      id: 'ai-scheduler',
      label: 'Agendamento Inteligente',
      description: 'IA sugere melhores horários',
      icon: <Clock className="h-4 w-4" />,
      category: 'ai',
      priority: 3,
      onClick: () => navigate('/agenda'),
    },
  ];

  // Busca fuzzy com Fuse.js
  const { results: fuzzyResults } = useFuzzySearch(
    quickActions,
    [
      { name: 'label', weight: 2 },
      { name: 'description', weight: 1 },
    ],
    searchQuery,
    { ...FUZZY_PRESETS.loose }
  );

  const filteredActions = useMemo(() => 
    searchQuery ? fuzzyResults : quickActions,
    [quickActions, fuzzyResults, searchQuery]
  );

  const groupedActions = {
    create: filteredActions.filter(a => a.category === 'create'),
    navigate: filteredActions.filter(a => a.category === 'navigate'),
    ai: filteredActions.filter(a => a.category === 'ai'),
  };

  const handleAction = (action: QuickAction) => {
    action.onClick();
    setOpen(false);
    onAction?.(action.id);
  };

  // Keyboard shortcut to open
  // useEffect(() => {
  //   const down = (e: KeyboardEvent) => {
  //     if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
  //       e.preventDefault();
  //       setOpen((open) => !open);
  //     }
  //   };
  //   document.addEventListener('keydown', down);
  //   return () => document.removeEventListener('keydown', down);
  // }, []);

  return (
    <>
      {/* Compact Command Center Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
        
        <CardHeader className="relative pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            Central de Comando
            <Badge variant="secondary" className="ml-auto gap-1">
              <Keyboard className="h-3 w-3" />
              ⌘K
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Search trigger */}
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground gap-2"
            onClick={() => setOpen(true)}
          >
            <Search className="h-4 w-4" />
            Buscar ações rápidas...
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* Quick action buttons */}
          <div className="grid grid-cols-2 gap-2">
            {quickActions.slice(0, 4).map((action) => (
              <motion.div
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 h-auto py-3 px-3"
                  onClick={() => handleAction(action)}
                >
                  <div className={cn(
                    'p-2 rounded-lg',
                    action.category === 'create' && 'bg-success/10 text-success',
                    action.category === 'navigate' && 'bg-primary/10 text-primary',
                    action.category === 'ai' && 'bg-accent/10 text-accent',
                  )}>
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                      {action.description}
                    </p>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* AI Suggestions */}
          <div className="p-3 rounded-lg bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">Sugestão da IA</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Você tem 3 candidatos aguardando triagem há mais de 5 dias. 
              <Button variant="link" className="h-auto p-0 text-xs ml-1" onClick={() => navigate('/pipeline')}>
                Ver agora →
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Command Palette Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Digite um comando ou busque..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          
          {groupedActions.create.length > 0 && (
            <CommandGroup heading="Criar">
              {groupedActions.create.map((action) => (
                <CommandItem
                  key={action.id}
                  onSelect={() => handleAction(action)}
                  className="gap-3"
                >
                  <div className="p-2 rounded-lg bg-success/10 text-success">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  {action.shortcut && (
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                      ⌘{action.shortcut}
                    </kbd>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          {groupedActions.navigate.length > 0 && (
            <CommandGroup heading="Navegar">
              {groupedActions.navigate.map((action) => (
                <CommandItem
                  key={action.id}
                  onSelect={() => handleAction(action)}
                  className="gap-3"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  {action.shortcut && (
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                      ⌘{action.shortcut}
                    </kbd>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          {groupedActions.ai.length > 0 && (
            <CommandGroup heading="Inteligência Artificial">
              {groupedActions.ai.map((action) => (
                <CommandItem
                  key={action.id}
                  onSelect={() => handleAction(action)}
                  className="gap-3"
                >
                  <div className="p-2 rounded-lg bg-accent/10 text-accent">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    <Sparkles className="h-3 w-3 mr-1" />
                    IA
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
