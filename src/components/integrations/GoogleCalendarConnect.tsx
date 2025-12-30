import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';

interface CalendarOption {
  id: string;
  name: string;
  color: string;
  selected: boolean;
}

interface GoogleCalendarConnectProps {
  isConnected: boolean;
  userEmail?: string;
  calendars?: CalendarOption[];
  syncEnabled?: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onSyncToggle: (enabled: boolean) => void;
  onCalendarToggle: (calendarId: string, selected: boolean) => void;
}

export function GoogleCalendarConnect({
  isConnected, userEmail, calendars = [], syncEnabled = false,
  onConnect, onDisconnect, onSyncToggle, onCalendarToggle,
}: GoogleCalendarConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect();
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Google Calendar</CardTitle>
              <CardDescription>Sincronize entrevistas e eventos</CardDescription>
            </div>
          </div>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? <><CheckCircle2 className="h-3 w-3 mr-1" />Conectado</> : 'Desconectado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            <p className="text-sm text-muted-foreground">
              Conecte sua conta Google para sincronizar entrevistas automaticamente com seu calendário.
            </p>
            <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Calendar className="h-4 w-4 mr-2" />}
              {isConnecting ? 'Conectando...' : 'Conectar com Google'}
            </Button>
          </>
        ) : (
          <>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Conta conectada:</span>
                <span className="font-medium">{userEmail}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>Sincronização Bidirecional</Label>
                <p className="text-xs text-muted-foreground">Sincronizar eventos nos dois sentidos</p>
              </div>
              <Switch checked={syncEnabled} onCheckedChange={onSyncToggle} />
            </div>

            {calendars.length > 0 && (
              <div className="space-y-2">
                <Label>Calendários para sincronizar:</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {calendars.map((cal) => (
                    <div key={cal.id} className="flex items-center gap-2 p-2 border rounded">
                      <Checkbox checked={cal.selected} onCheckedChange={(checked) => onCalendarToggle(cal.id, !!checked)} />
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cal.color }} />
                      <span className="text-sm">{cal.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button variant="destructive" className="w-full" onClick={onDisconnect}>
              <XCircle className="h-4 w-4 mr-2" />
              Desconectar
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
