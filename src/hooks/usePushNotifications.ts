import { logger } from '@/services/logger';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface PushSubscriptionData { 
  endpoint: string; 
  keys: { p256dh: string; auth: string }; 
  expirationTime?: number | null;
}

interface UsePushNotificationsReturn {
  isSupported: boolean;
  isSubscribed: boolean;
  subscription: PushSubscriptionData | null;
  permission: NotificationPermission;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  subscribe: () => Promise<PushSubscriptionData | null>;
  unsubscribe: () => Promise<void>;
  showNotification: (title: string, options?: NotificationOptions) => void;
  checkSubscription: () => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscriptionData | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    const checkSupport = async () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
      setIsSupported(supported);
      
      if ('Notification' in window) {
        setPermission(Notification.permission);
      }
      
      if (supported && Notification.permission === 'granted') {
        try {
          const registration = await navigator.serviceWorker.ready;
          const existingSub = await registration.pushManager.getSubscription();
          
          if (existingSub && isMountedRef.current) {
            const subJson = existingSub.toJSON();
            const keys = subJson.keys as Record<string, string> | undefined;
            if (subJson.endpoint && keys?.['p256dh'] && keys?.['auth']) {
              setSubscription({
                endpoint: subJson.endpoint,
                keys: { 
                  p256dh: keys['p256dh'], 
                  auth: keys['auth'] 
                },
                expirationTime: existingSub.expirationTime,
              });
              setIsSubscribed(true);
            }
          }
        } catch (e) {
          logger.warn('[usePushNotifications] Error checking existing subscription:', e);
        }
      }
    };
    
    checkSupport();
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const checkSubscription = useCallback(async () => {
    if (!isSupported) return;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSub = await registration.pushManager.getSubscription();
      
      if (!isMountedRef.current) return;
      
      if (existingSub) {
        const subJson = existingSub.toJSON();
        const keys = subJson.keys as Record<string, string> | undefined;
        if (subJson.endpoint && keys?.['p256dh'] && keys?.['auth']) {
          setSubscription({
            endpoint: subJson.endpoint,
            keys: { p256dh: keys['p256dh'], auth: keys['auth'] },
            expirationTime: existingSub.expirationTime,
          });
          setIsSubscribed(true);
        }
      } else {
        setSubscription(null);
        setIsSubscribed(false);
      }
    } catch (e) {
      logger.warn('[usePushNotifications] Error checking subscription:', e);
    }
  }, [isSupported]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Notificações push não são suportadas neste navegador');
      return false;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const result = await Notification.requestPermission();
      
      if (isMountedRef.current) {
        setPermission(result);
      }
      
      if (result === 'denied') {
        toast({ 
          title: 'Permissão negada', 
          description: 'Você negou as notificações. Altere nas configurações do navegador.', 
          variant: 'destructive' 
        });
      }
      
      return result === 'granted';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      toast({ 
        title: 'Erro', 
        description: 'Não foi possível solicitar permissão.', 
        variant: 'destructive' 
      });
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [isSupported, toast]);

  const subscribe = useCallback(async (): Promise<PushSubscriptionData | null> => {
    if (!isSupported) {
      setError('Push notifications não suportadas');
      return null;
    }
    
    if (permission !== 'granted') {
      setError('Permissão não concedida');
      return null;
    }
    
    const vapidKey = import.meta.env['VITE_VAPID_PUBLIC_KEY'] as string | undefined;
    if (!vapidKey) {
      setError('VAPID key não configurada');
      logger.error('[usePushNotifications] VITE_VAPID_PUBLIC_KEY not set');
      toast({ 
        title: 'Erro de configuração', 
        description: 'Chave VAPID não configurada.', 
        variant: 'destructive' 
      });
      return null;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const existingSub = await registration.pushManager.getSubscription();
      if (existingSub) {
        await existingSub.unsubscribe();
      }
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });
      
      const subJson = sub.toJSON();
      const keys = subJson.keys as Record<string, string> | undefined;
      
      if (!subJson.endpoint || !keys?.['p256dh'] || !keys?.['auth']) {
        throw new Error('Subscription inválida');
      }
      
      const pushSub: PushSubscriptionData = {
        endpoint: subJson.endpoint,
        keys: { p256dh: keys['p256dh'], auth: keys['auth'] },
        expirationTime: sub.expirationTime,
      };
      
      if (isMountedRef.current) {
        setSubscription(pushSub);
        setIsSubscribed(true);
      }
      
      toast({ title: 'Inscrito!', description: 'Você receberá notificações push.' });
      return pushSub;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      logger.error('[usePushNotifications] Subscribe error:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao inscrever para notificações.', 
        variant: 'destructive' 
      });
      return null;
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [isSupported, permission, toast]);

  const unsubscribe = useCallback(async (): Promise<void> => {
    setError(null);
    setIsLoading(true);
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      
      if (sub) {
        await sub.unsubscribe();
      }
      
      if (isMountedRef.current) {
        setSubscription(null);
        setIsSubscribed(false);
      }
      
      toast({ title: 'Cancelado', description: 'Notificações push desativadas.' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao cancelar inscrição.', 
        variant: 'destructive' 
      });
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [toast]);

  const showNotification = useCallback((title: string, options?: NotificationOptions): void => {
    if (permission !== 'granted') {
      logger.warn('[usePushNotifications] Permission not granted');
      return;
    }
    
    try {
      const defaultOptions: NotificationOptions = {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `match-${Date.now()}`,
        ...options,
      };
      
      new Notification(title, defaultOptions);
    } catch (err) {
      logger.error('[usePushNotifications] Error showing notification:', err);
    }
  }, [permission]);

  return { 
    isSupported, 
    isSubscribed, 
    subscription, 
    permission, 
    isLoading,
    error,
    requestPermission, 
    subscribe, 
    unsubscribe, 
    showNotification,
    checkSubscription,
  };
}

export default usePushNotifications;
