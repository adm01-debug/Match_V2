/**
 * @fileoverview Layout component with premium design
 * @module Layout
 */

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { useNotifications } from "@/contexts/NotificationContext";
import { CommandMenu } from "@/components/common/CommandMenu";
import { CommandMenuTrigger } from "@/components/common/CommandMenuTrigger";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { SmartBreadcrumbs } from "@/components/navigation/SmartBreadcrumbs";
import { BackButton } from "@/components/navigation/BackButton";
import { 
  KeyboardShortcutsOverlay, 
  useKeyboardShortcuts,
  type KeyboardShortcut 
} from "@/components/intelligence/KeyboardShortcuts";
import { Menu, Keyboard } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, unreadCount, isConnected, isLoading, markAsRead, markAllAsRead, clearAll, reconnect } = useNotifications();
  
  // Show breadcrumbs on all pages except dashboard
  const showBreadcrumbs = location.pathname !== '/';

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
      description: 'Ir para Banco de Talentos',
      category: 'Navegação',
      action: () => navigate('/talentos'),
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
      action: () => navigate('/talentos?new=true'),
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

  const { overlayOpen, closeOverlay, openOverlay } = useKeyboardShortcuts({ shortcuts });

  return (
    <SidebarProvider defaultOpen={true}>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md shadow-lg"
      >
        Pular para o conteúdo principal
      </a>
      
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

              {/* Keyboard Shortcuts Hint */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={openOverlay}
                    className="hidden md:flex items-center gap-1.5 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                  >
                    <Keyboard className="h-3.5 w-3.5" />
                    <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-muted border border-border rounded text-[10px] font-mono">
                      ?
                    </kbd>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Ver atalhos de teclado</p>
                </TooltipContent>
              </Tooltip>

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
          <main id="main-content" className="flex-1 overflow-auto pb-20 md:pb-0 relative">
            {/* Subtle gradient mesh background */}
            <div className="absolute inset-0 gradient-mesh opacity-30 pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              {/* Smart Breadcrumbs - shown on internal pages */}
              {showBreadcrumbs && (
                <div className="px-6 py-3 border-b border-border/30 bg-card/50 backdrop-blur-sm">
                  <SmartBreadcrumbs maxItems={4} showActions />
                </div>
              )}
              
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
