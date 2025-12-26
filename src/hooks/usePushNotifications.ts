import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PushSubscription { endpoint: string; keys: { p256dh: string; auth: string }; }

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window);
    if ('Notification' in window) setPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível solicitar permissão.', variant: 'destructive' });
      return false;
    }
  }, [isSupported, toast]);

  const subscribe = useCallback(async () => {
    if (!isSupported || permission !== 'granted') return null;
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      });
      const subJson = sub.toJSON();
      const pushSub: PushSubscription = {
        endpoint: subJson.endpoint!,
        keys: { p256dh: subJson.keys!.p256dh!, auth: subJson.keys!.auth! },
      };
      setSubscription(pushSub);
      setIsSubscribed(true);
      toast({ title: 'Inscrito!', description: 'Você receberá notificações push.' });
      return pushSub;
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao inscrever para notificações.', variant: 'destructive' });
      return null;
    }
  }, [isSupported, permission, toast]);

  const unsubscribe = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      setSubscription(null);
      setIsSubscribed(false);
      toast({ title: 'Cancelado', description: 'Notificações push desativadas.' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao cancelar inscrição.', variant: 'destructive' });
    }
  }, [toast]);

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, { icon: '/favicon.ico', badge: '/favicon.ico', ...options });
    }
  }, [permission]);

  return { isSupported, isSubscribed, subscription, permission, requestPermission, subscribe, unsubscribe, showNotification };
}

export default usePushNotifications;
