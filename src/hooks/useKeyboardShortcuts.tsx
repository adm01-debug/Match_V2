/**
 * Global Keyboard Shortcuts Hook
 * Provides system-wide keyboard navigation
 */
import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
  category: 'navigation' | 'action' | 'view' | 'help';
}

const defaultShortcuts: Omit<ShortcutConfig, 'action'>[] = [
  // Navigation
  { key: 'd', ctrl: true, description: 'Ir para Dashboard', category: 'navigation' },
  { key: 'v', ctrl: true, description: 'Ir para Vagas', category: 'navigation' },
  { key: 'p', ctrl: true, description: 'Ir para Pipeline', category: 'navigation' },
  { key: 'c', ctrl: true, shift: true, description: 'Ir para Candidatos', category: 'navigation' },
  { key: 'a', ctrl: true, description: 'Ir para Agenda', category: 'navigation' },
  { key: 't', ctrl: true, description: 'Ir para Testes', category: 'navigation' },
  
  // Actions
  { key: 'n', ctrl: true, description: 'Nova Vaga', category: 'action' },
  { key: 's', ctrl: true, description: 'Buscar', category: 'action' },
  { key: 'r', ctrl: true, description: 'Atualizar página', category: 'action' },
  
  // View
  { key: '/', description: 'Focar na busca', category: 'view' },
  { key: 'Escape', description: 'Fechar modal/painel', category: 'view' },
  
  // Help
  { key: '?', shift: true, description: 'Mostrar atalhos', category: 'help' },
];

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  const shortcuts: ShortcutConfig[] = [
    // Navigation
    { ...defaultShortcuts[0], action: () => navigate('/') },
    { ...defaultShortcuts[1], action: () => navigate('/vagas') },
    { ...defaultShortcuts[2], action: () => navigate('/pipeline') },
    { ...defaultShortcuts[3], action: () => navigate('/candidatos') },
    { ...defaultShortcuts[4], action: () => navigate('/agenda') },
    { ...defaultShortcuts[5], action: () => navigate('/testes') },
    
    // Actions
    { ...defaultShortcuts[6], action: () => navigate('/vagas/nova') },
    { 
      ...defaultShortcuts[7], 
      action: () => {
        const searchInput = document.querySelector('input[type="text"][placeholder*="Buscar"], input[type="search"]');
        if (searchInput instanceof HTMLInputElement) {
          searchInput.focus();
          searchInput.select();
        }
      }
    },
    { 
      ...defaultShortcuts[8], 
      action: () => {
        window.location.reload();
        toast.info('Atualizando página...');
      }
    },
    
    // View
    { 
      ...defaultShortcuts[9], 
      action: () => {
        const searchInput = document.querySelector('input[type="text"][placeholder*="Buscar"], input[type="search"]');
        if (searchInput instanceof HTMLInputElement) {
          searchInput.focus();
        }
      }
    },
    { 
      ...defaultShortcuts[10], 
      action: () => {
        const closeButtons = document.querySelectorAll('[data-dismiss], [aria-label="Close"], button[type="button"]:has(.lucide-x)');
        if (closeButtons.length > 0) {
          (closeButtons[closeButtons.length - 1] as HTMLButtonElement).click();
        }
      }
    },
    
    // Help
    { 
      ...defaultShortcuts[11], 
      action: () => setIsShortcutsModalOpen(prev => !prev)
    },
  ] as ShortcutConfig[];

  const matchesShortcut = useCallback((e: KeyboardEvent, shortcut: ShortcutConfig): boolean => {
    const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
    const ctrlMatches = !!shortcut.ctrl === (e.ctrlKey || e.metaKey);
    const shiftMatches = !!shortcut.shift === e.shiftKey;
    const altMatches = !!shortcut.alt === e.altKey;
    
    return keyMatches && ctrlMatches && shiftMatches && altMatches;
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isEnabled) return;
    
    // Ignore if typing in input fields
    const target = e.target as HTMLElement;
    const isInputField = target.tagName === 'INPUT' || 
                         target.tagName === 'TEXTAREA' || 
                         target.isContentEditable;
    
    // Allow some shortcuts even in input fields
    const allowInInput = ['Escape'];
    
    if (isInputField && !allowInInput.includes(e.key)) {
      // Only allow ctrl+s for search in inputs
      if (!(e.ctrlKey && e.key.toLowerCase() === 's')) {
        return;
      }
    }

    for (const shortcut of shortcuts) {
      if (matchesShortcut(e, shortcut)) {
        e.preventDefault();
        e.stopPropagation();
        shortcut.action();
        break;
      }
    }
  }, [isEnabled, shortcuts, matchesShortcut]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const formatShortcut = (shortcut: ShortcutConfig): string => {
    const parts: string[] = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.meta) parts.push('⌘');
    parts.push(shortcut.key.toUpperCase());
    return parts.join(' + ');
  };

  const getShortcutsByCategory = (category: ShortcutConfig['category']) => {
    return shortcuts.filter(s => s.category === category);
  };

  return {
    shortcuts,
    isEnabled,
    setIsEnabled,
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    formatShortcut,
    getShortcutsByCategory,
  };
}

export default useKeyboardShortcuts;
