/**
 * @fileoverview Layout component with Command Menu and Onboarding
 * @module Layout
 */

import { memo } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { useNotifications } from "@/contexts/NotificationContext";
import { CommandMenu } from "@/components/common/CommandMenu";
import { CommandMenuTrigger } from "@/components/common/CommandMenuTrigger";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { notifications, unreadCount, isConnected, isLoading, markAsRead, markAllAsRead, clearAll, reconnect } = useNotifications();

  return (
    <SidebarProvider defaultOpen={true}>
      {/* Global Command Menu */}
      <CommandMenu />
      
      {/* Onboarding Tour for new users */}
      <OnboardingTour />
      
      <div role="region" aria-label="Layout principal" className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-6">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            
            {title && (
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            )}

            <div data-testid="layout" className="flex-1" />

            <div className="flex items-center gap-4">
              {/* Command Menu Trigger - replaces old search input */}
              <div className="hidden md:block">
                <CommandMenuTrigger />
              </div>
              
              {/* Mobile compact trigger */}
              <div className="md:hidden">
                <CommandMenuTrigger variant="compact" />
              </div>

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

          <main className="flex-1 overflow-auto pb-20 md:pb-0">
            {children}
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
