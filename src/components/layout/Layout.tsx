/**
 * @fileoverview Layout component with premium design
 * @module Layout
 */

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { useNotifications } from "@/contexts/NotificationContext";
import { CommandMenu } from "@/components/common/CommandMenu";
import { CommandMenuTrigger } from "@/components/common/CommandMenuTrigger";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { 
  KeyboardShortcutsOverlay, 
  useKeyboardShortcuts,
  type KeyboardShortcut 
} from "@/components/intelligence/KeyboardShortcuts";
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const navigate = useNavigate();
  const { notifications, unreadCount, isConnected, isLoading, markAsRead, markAllAsRead, clearAll, reconnect } = useNotifications();

  // Define global keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = useMemo(() => [
    // Navigation shortcuts
    {
      id: 'nav-dashboard',
      keys: ['g', 'd'],
      description: 'Ir para Dashboard',
      category: 'Navegação',
      action: () => navigate('/'),
    },
    {
      id: 'nav-vagas',
      keys: ['g', 'v'],
      description: 'Ir para Vagas',
      category: 'Navegação',
      action: () => navigate('/vagas'),
    },
    {
      id: 'nav-candidatos',
      keys: ['g', 'c'],
      description: 'Ir para Candidatos',
      category: 'Navegação',
      action: () => navigate('/candidatos'),
    },
    {
      id: 'nav-pipeline',
      keys: ['g', 'p'],
      description: 'Ir para Pipeline',
      category: 'Navegação',
      action: () => navigate('/pipeline'),
    },
    {
      id: 'nav-agenda',
      keys: ['g', 'a'],
      description: 'Ir para Agenda',
      category: 'Navegação',
      action: () => navigate('/agenda'),
    },
    {
      id: 'nav-testes',
      keys: ['g', 't'],
      description: 'Ir para Testes',
      category: 'Navegação',
      action: () => navigate('/testes'),
    },
    {
      id: 'nav-relatorios',
      keys: ['g', 'r'],
      description: 'Ir para Relatórios',
      category: 'Navegação',
      action: () => navigate('/relatorios'),
    },
    // Actions
    {
      id: 'action-search',
      keys: ['ctrl', 'k'],
      description: 'Abrir busca rápida',
      category: 'Ações',
    },
    {
      id: 'action-new-vaga',
      keys: ['ctrl', 'shift', 'v'],
      description: 'Nova vaga',
      category: 'Ações',
      action: () => navigate('/vagas/nova'),
    },
    {
      id: 'action-new-candidato',
      keys: ['ctrl', 'shift', 'c'],
      description: 'Novo candidato',
      category: 'Ações',
      action: () => navigate('/candidatos?new=true'),
    },
    // General
    {
      id: 'general-help',
      keys: ['?'],
      description: 'Mostrar atalhos de teclado',
      category: 'Geral',
    },
    {
      id: 'general-escape',
      keys: ['esc'],
      description: 'Fechar modal/dialog',
      category: 'Geral',
    },
    {
      id: 'general-home',
      keys: ['h'],
      description: 'Voltar ao início',
      category: 'Geral',
      action: () => navigate('/'),
    },
  ], [navigate]);

  const { overlayOpen, closeOverlay } = useKeyboardShortcuts({ shortcuts });

  return (
    <SidebarProvider defaultOpen={true}>
      {/* Global Command Menu */}
      <CommandMenu />
      
      {/* Keyboard Shortcuts Overlay */}
      <KeyboardShortcutsOverlay 
        shortcuts={shortcuts}
        isOpen={overlayOpen}
        onClose={closeOverlay}
      />
      
      {/* Onboarding Tour for new users */}
      <OnboardingTour />
      
      <div role="region" aria-label="Layout principal" className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          {/* Premium Header */}
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/50 bg-card/80 backdrop-blur-xl px-6">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-lg p-2">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            
            {title && (
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg font-semibold text-foreground"
              >
                {title}
              </motion.h1>
            )}

            <div data-testid="layout" className="flex-1" />

            <div className="flex items-center gap-3">
              {/* Command Menu Trigger */}
              <div className="hidden md:block">
                <CommandMenuTrigger />
              </div>
              
              {/* Mobile compact trigger */}
              <div className="md:hidden">
                <CommandMenuTrigger variant="compact" />
              </div>

              <div className="h-6 w-px bg-border hidden md:block" />

              {/* Theme Toggle */}
              <ThemeToggle />

              <NotificationPanel
                notifications={notifications}
                unreadCount={unreadCount}
                isConnected={isConnected}
                isLoading={isLoading}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onClearAll={clearAll}
                onReconnect={reconnect}
              />
            </div>
          </header>

          {/* Main Content with subtle background pattern */}
          <main className="flex-1 overflow-auto pb-20 md:pb-0 relative">
            {/* Subtle gradient mesh background */}
            <div className="absolute inset-0 gradient-mesh opacity-30 pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              {children}
            </motion.div>
          </main>
          
          {/* Bottom Navigation for Mobile */}
          <BottomNavigation />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

Layout.displayName = "Layout";

export default memo(Layout);
