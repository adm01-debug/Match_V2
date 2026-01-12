/**
 * @fileoverview Global Keyboard Shortcuts Provider
 * Provides application-wide keyboard shortcuts with visual overlay
 */

import { memo, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { KeyboardShortcutsOverlay, useKeyboardShortcuts, KeyboardShortcut } from "@/components/intelligence/KeyboardShortcuts";
import { toast } from "sonner";

interface ShortcutsContextValue {
  openShortcutsOverlay: () => void;
  closeShortcutsOverlay: () => void;
  isOverlayOpen: boolean;
  shortcuts: KeyboardShortcut[];
}

const ShortcutsContext = createContext<ShortcutsContextValue | null>(null);

export function useGlobalShortcuts() {
  const context = useContext(ShortcutsContext);
  if (!context) {
    throw new Error('useGlobalShortcuts must be used within GlobalShortcutsProvider');
  }
  return context;
}

interface GlobalShortcutsProviderProps {
  children: ReactNode;
}

export const GlobalShortcutsProvider = memo(function GlobalShortcutsProvider({
  children,
}: GlobalShortcutsProviderProps) {
  const navigate = useNavigate();

  // Define all global shortcuts
  const shortcuts: KeyboardShortcut[] = [
    // Navigation
    {
      id: 'go-dashboard',
      keys: ['g', 'd'],
      description: 'Ir para Dashboard',
      category: 'Navegação',
      action: () => navigate('/'),
    },
    {
      id: 'go-vagas',
      keys: ['g', 'v'],
      description: 'Ir para Vagas',
      category: 'Navegação',
      action: () => navigate('/vagas'),
    },
    {
      id: 'go-talentos',
      keys: ['g', 't'],
      description: 'Ir para Banco de Talentos',
      category: 'Navegação',
      action: () => navigate('/talentos'),
    },
    {
      id: 'go-pipeline',
      keys: ['g', 'p'],
      description: 'Ir para Pipeline',
      category: 'Navegação',
      action: () => navigate('/pipeline'),
    },
    {
      id: 'go-agenda',
      keys: ['g', 'a'],
      description: 'Ir para Agenda',
      category: 'Navegação',
      action: () => navigate('/agenda'),
    },
    {
      id: 'go-testes',
      keys: ['g', 'e'],
      description: 'Ir para Testes',
      category: 'Navegação',
      action: () => navigate('/testes'),
    },
    {
      id: 'go-relatorios',
      keys: ['g', 'r'],
      description: 'Ir para Relatórios',
      category: 'Navegação',
      action: () => navigate('/relatorios'),
    },
    
    // Quick Actions
    {
      id: 'new-vaga',
      keys: ['n', 'v'],
      description: 'Nova Vaga',
      category: 'Ações Rápidas',
      action: () => navigate('/vagas/nova'),
    },
    {
      id: 'new-candidato',
      keys: ['n', 'c'],
      description: 'Novo Candidato',
      category: 'Ações Rápidas',
      action: () => {
        toast.info('Função em desenvolvimento');
      },
    },
    {
      id: 'new-entrevista',
      keys: ['n', 'e'],
      description: 'Nova Entrevista',
      category: 'Ações Rápidas',
      action: () => navigate('/agenda?action=new'),
    },
    
    // Search
    {
      id: 'global-search',
      keys: ['cmd', 'k'],
      description: 'Busca Global',
      category: 'Busca',
    },
    {
      id: 'search-candidates',
      keys: ['/', 'c'],
      description: 'Buscar Candidatos',
      category: 'Busca',
      action: () => navigate('/talentos'),
    },
    {
      id: 'search-vagas',
      keys: ['/', 'v'],
      description: 'Buscar Vagas',
      category: 'Busca',
      action: () => navigate('/vagas'),
    },
    
    // Actions
    {
      id: 'refresh',
      keys: ['r'],
      description: 'Atualizar página',
      category: 'Ações',
      action: () => window.location.reload(),
    },
    {
      id: 'toggle-theme',
      keys: ['t'],
      description: 'Alternar tema',
      category: 'Ações',
      action: () => {
        document.documentElement.classList.toggle('dark');
      },
    },
    {
      id: 'show-shortcuts',
      keys: ['?'],
      description: 'Mostrar atalhos',
      category: 'Ações',
    },
    
    // UI
    {
      id: 'close-modal',
      keys: ['esc'],
      description: 'Fechar modal/menu',
      category: 'Interface',
    },
    {
      id: 'go-back',
      keys: ['backspace'],
      description: 'Voltar',
      category: 'Interface',
      action: () => navigate(-1),
    },
    {
      id: 'focus-main',
      keys: ['m'],
      description: 'Focar conteúdo principal',
      category: 'Interface',
      action: () => {
        const main = document.querySelector('main');
        if (main) {
          main.focus();
          main.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
    },
  ];

  const { overlayOpen, closeOverlay, openOverlay } = useKeyboardShortcuts({
    shortcuts,
    enabled: true,
  });

  const value: ShortcutsContextValue = {
    openShortcutsOverlay: openOverlay,
    closeShortcutsOverlay: closeOverlay,
    isOverlayOpen: overlayOpen,
    shortcuts,
  };

  return (
    <ShortcutsContext.Provider value={value}>
      {children}
      <KeyboardShortcutsOverlay
        shortcuts={shortcuts}
        isOpen={overlayOpen}
        onClose={closeOverlay}
        triggerKey="?"
      />
    </ShortcutsContext.Provider>
  );
});

// Keyboard shortcut hint badge
interface ShortcutHintProps {
  keys: string[];
  className?: string;
}

export const ShortcutHint = memo(function ShortcutHint({
  keys,
  className,
}: ShortcutHintProps) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {keys.map((key, index) => (
        <kbd
          key={index}
          className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 bg-muted border rounded text-[10px] font-mono text-muted-foreground"
        >
          {key === 'cmd' ? '⌘' : key === 'ctrl' ? 'Ctrl' : key.toUpperCase()}
        </kbd>
      ))}
    </span>
  );
});

GlobalShortcutsProvider.displayName = 'GlobalShortcutsProvider';
ShortcutHint.displayName = 'ShortcutHint';
