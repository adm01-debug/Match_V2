import React, { createContext, useContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { useRealtimeNotifications, Notification } from '@/hooks/useRealtimeNotifications';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  notifyStageChange: (candidatoNome: string, fromEtapa: string, toEtapa: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      setNotifications((prev) => [
        {
          ...notification,
          id: crypto.randomUUID(),
          timestamp: new Date(),
          read: false,
        },
        ...prev,
      ].slice(0, 50));
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const notifyStageChange = useCallback(
    (candidatoNome: string, fromEtapa: string, toEtapa: string) => {
      addNotification({
        type: 'stage_change',
        title: 'Pipeline atualizado',
        message: `${candidatoNome}: ${fromEtapa} → ${toEtapa}`,
        link: '/pipeline',
      });
    },
    [addNotification]
  );

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  // Assina realtime e injeta notificações no store local (sem dependência circular)
  useRealtimeNotifications({
    onNotification: addNotification,
  });

  const value = useMemo<NotificationContextType>(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      notifyStageChange,
    }),
    [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll, notifyStageChange]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

