/**
 * @fileoverview Layout component
 * @module Layout
 */

import { memo , memo} from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { useNotifications } from "@/contexts/NotificationContext";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  return (
    <SkipLinks /><SidebarProvider defaultOpen={true}>
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
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar candidatos, vagas..."
                  className="w-64 pl-9 bg-background"
                />
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