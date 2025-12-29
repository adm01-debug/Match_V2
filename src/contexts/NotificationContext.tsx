/**
 * @fileoverview Contexto de notificações em tempo real com persistência
 * @module NotificationContext
 */

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useRealtimeNotifications, Notification, NotificationType } from '@/hooks/useRealtimeNotifications';

export type { Notification, NotificationType };

export interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  isLoading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>, persist?: boolean) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  reconnect: () => void;
  notifyStageChange: (candidatoNome: string, fromEtapa: string, toEtapa: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    reconnect,
  } = useRealtimeNotifications();

  const notifyStageChange = (candidatoNome: string, fromEtapa: string, toEtapa: string) => {
    addNotification({
      type: 'stage_change',
      title: 'Pipeline atualizado',
      message: `${candidatoNome}: ${fromEtapa} → ${toEtapa}`,
      link: '/pipeline',
    }, true);
  };

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount,
      isConnected,
      isLoading,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      reconnect,
      notifyStageChange,
    }),
    [notifications, unreadCount, isConnected, isLoading, addNotification, markAsRead, markAllAsRead, clearAll, reconnect]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

NotificationContext.displayName = 'NotificationContext';
