import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { DialogTitle } from '@/components/ui/dialog';
import { Users, Briefcase, Calendar, BarChart3, Settings, Search, FileText, Home, Plus } from 'lucide-react';

interface CommandItemType {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
  group: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const commands: CommandItemType[] = useMemo(() => [
    // Navigation
    { id: 'home', label: 'Dashboard', icon: <Home className="mr-2 h-4 w-4" />, action: () => navigate('/'), keywords: ['inicio', 'home'], group: 'Navegação' },
    { id: 'candidatos', label: 'Candidatos', icon: <Users className="mr-2 h-4 w-4" />, action: () => navigate('/candidatos'), keywords: ['pessoas', 'candidates'], group: 'Navegação' },
    { id: 'vagas', label: 'Vagas', icon: <Briefcase className="mr-2 h-4 w-4" />, action: () => navigate('/vagas'), keywords: ['jobs', 'posicoes'], group: 'Navegação' },
    { id: 'agenda', label: 'Agenda', icon: <Calendar className="mr-2 h-4 w-4" />, action: () => navigate('/agenda'), keywords: ['calendario', 'entrevistas'], group: 'Navegação' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="mr-2 h-4 w-4" />, action: () => navigate('/analytics'), keywords: ['relatorios', 'metricas'], group: 'Navegação' },
    { id: 'pipeline', label: 'Pipeline', icon: <FileText className="mr-2 h-4 w-4" />, action: () => navigate('/pipeline'), keywords: ['kanban', 'fluxo'], group: 'Navegação' },
    
    // Quick Actions
    { id: 'nova-vaga', label: 'Nova Vaga', icon: <Plus className="mr-2 h-4 w-4" />, action: () => navigate('/vagas/nova'), keywords: ['criar', 'add'], group: 'Ações Rápidas' },
    { id: 'novo-candidato', label: 'Novo Candidato', icon: <Plus className="mr-2 h-4 w-4" />, action: () => navigate('/candidatos/novo'), keywords: ['criar', 'add'], group: 'Ações Rápidas' },
    
    // Settings
    { id: 'configuracoes', label: 'Configurações', icon: <Settings className="mr-2 h-4 w-4" />, action: () => navigate('/admin'), keywords: ['settings', 'admin'], group: 'Sistema' },
  ], [navigate]);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    const searchLower = search.toLowerCase();
    return commands.filter(cmd => 
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.keywords?.some(k => k.includes(searchLower))
    );
  }, [commands, search]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItemType[]> = {};
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.group]) groups[cmd.group] = [];
      groups[cmd.group]!.push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground border rounded-md hover:bg-accent"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Buscar...</span>
        <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Busca Rápida</DialogTitle>
        <CommandInput placeholder="Digite para buscar..." value={search} onValueChange={setSearch} />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          
          {Object.entries(groupedCommands).map(([group, items], index) => (
            <div key={group}>
              {index > 0 && <CommandSeparator />}
              <CommandGroup heading={group}>
                {items.map((item) => (
                  <CommandItem key={item.id} onSelect={() => runCommand(item.action)}>
                    {item.icon}
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default CommandPalette;
