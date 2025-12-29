/**
 * @fileoverview Layout component with Command Menu
 * @module Layout
 */

import { memo } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { useNotifications } from "@/contexts/NotificationContext";
import { CommandMenu } from "@/components/common/CommandMenu";
import { CommandMenuTrigger } from "@/components/common/CommandMenuTrigger";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  return (
    <SidebarProvider defaultOpen={true}>
      {/* Global Command Menu */}
      <CommandMenu />
      
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
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onClearAll={clearAll}
              />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

Layout.displayName = "Layout";

export default memo(Layout);
