import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, X, Users, Calendar, MessageSquare, TrendingUp } from 'lucide-react';

interface PushNotificationPromptProps {
  onAllow?: () => Promise<void>;
  onDeny?: () => void;
  onDismiss?: () => void;
}

export function PushNotificationPrompt({ onAllow, onDeny, onDismiss }: PushNotificationPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    if (!('Notification' in window)) {
      setPermission('unsupported');
      return;
    }

    setPermission(Notification.permission);

    // Mostrar prompt apenas se ainda não decidiu
    if (Notification.permission === 'default') {
      const dismissed = localStorage.getItem('push-notification-dismissed');
      if (!dismissed) {
        // Delay para não mostrar imediatamente
        const timer = setTimeout(() => setIsVisible(true), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleAllow = async () => {
    setIsRequesting(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted' && onAllow) {
        await onAllow();
      }
      setIsVisible(false);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDeny = () => {
    localStorage.setItem('push-notification-dismissed', 'true');
    setIsVisible(false);
    onDeny?.();
  };

  const handleDismiss = () => {
    localStorage.setItem('push-notification-dismissed', 'true');
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible || permission === 'granted' || permission === 'unsupported') return null;

  const benefits = [
    { icon: Users, text: 'Novos candidatos em suas vagas' },
    { icon: Calendar, text: 'Lembretes de entrevistas' },
    { icon: MessageSquare, text: 'Mensagens de candidatos' },
    { icon: TrendingUp, text: 'Atualizações do pipeline' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-4">
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="pb-2 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Ativar notificações?</CardTitle>
              <CardDescription className="text-xs">
                Fique por dentro das novidades
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <benefit.icon className="h-3 w-3 flex-shrink-0" />
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleDeny}
            >
              <BellOff className="h-4 w-4 mr-1" />
              Agora não
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={handleAllow}
              disabled={isRequesting}
            >
              <Bell className="h-4 w-4 mr-1" />
              {isRequesting ? 'Ativando...' : 'Ativar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
